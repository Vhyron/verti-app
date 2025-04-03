/* eslint-disable eol-last */
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const mariadb = require('mariadb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;
const serverIP = '0.0.0.0';

app.use(cors());
app.use(bodyParser.json());

const db = mariadb.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'crazystitches',
    database: process.env.DB_NAME || 'verti_app_db',
    port: process.env.DB_PORT || 3307,
});

app.use((req, res, next) => {
    req.clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    next();
});

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Rate limiter for forgot password
const forgotPasswordLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 1,
    message: 'Too many password reset attempts. Please try again later.',
});

// Define an endpoint that logs the user-agent
app.get('/user-agent', (req, res) => {
    // Get the user-agent from the request headers
    const userAgent = req.headers['user-agent'];

    // Log the user-agent to the console
    console.log('User-Agent:', userAgent);

    // Send a response to the client
    res.send('OK');
});

// Validate Product Key
app.post('/validate-key', async (req, res) => {
    const { productKey } = req.body;

    if (!productKey) {
        return res.status(400).json({ valid: false, message: 'Product key is required' });
    }

    try {
        const sql = 'SELECT * FROM product_keys WHERE key_value = ? AND is_used = FALSE';
        const conn = await db.getConnection();
        const result = await conn.query(sql, [productKey]);
        conn.release();

        if (result.length === 0) {
            return res.status(200).json({ valid: false, message: 'Invalid or already used product key' });
        }

        return res.status(200).json({ valid: true, message: 'Valid product key' });
    } catch (err) {
        console.error('Error validating product key:', err);
        return res.status(500).json({ valid: false, message: 'Server error' });
    }
});

// Register new account with product key verification
app.post('/register', async (req, res) => {
    const { username, email, password, productKey } = req.body;

    if (!username || !email || !password || !productKey) {
        return res.status(400).send('All fields are required');
    }

    let conn;
    try {
        conn = await db.getConnection();
        await conn.beginTransaction();

        // Verify product key exists and is unused
        const keySql = 'SELECT * FROM product_keys WHERE key_value = ? AND is_used = FALSE';
        const keyResult = await conn.query(keySql, [productKey]);

        if (keyResult.length === 0) {
            await conn.rollback();
            conn.release();
            return res.status(400).send('Invalid or already used product key');
        }

        const keyId = keyResult[0].id;

        // Create user
        const hashedPassword = bcrypt.hashSync(password, 8);
        const userSql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        const userResult = await conn.query(userSql, [username, email, hashedPassword]);
        const userId = userResult.insertId;

        // Mark product key as used
        const updateKeySql = 'UPDATE product_keys SET is_used = TRUE, used_by_user_id = ? WHERE id = ?';
        await conn.query(updateKeySql, [userId, keyId]);

        await conn.commit();
        conn.release();

        res.status(201).send('User registered successfully');
    } catch (err) {
        if (conn) {
            await conn.rollback();
            conn.release();
        }
        console.error('Error registering user:', err);
        res.status(500).send('Server error');
    }
});

// Sign in existing account
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const clientIp = req.clientIp;

    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    try {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const conn = await db.getConnection();
        const result = await conn.query(sql, [email]);
        conn.release();

        if (result.length === 0) {return res.status(404).send('User not found');}

        const user = result[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) {return res.status(401).send('Invalid password');}

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: 86400 });

        console.log(`User ${user.username} logged in from IP: ${clientIp}`);

        res.status(200).send({ auth: true, token });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('Server error');
    }
});

// Fetch all users
app.get('/users', async (req, res) => {
    try {
        const sql = 'SELECT * FROM users';
        const conn = await db.getConnection();
        const result = await conn.query(sql);
        conn.release();
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('Server error');
    }
});

// Forgot Password Endpoint
app.post('/forgot-password', forgotPasswordLimiter, async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send('Email is required');
    }

    try {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const conn = await db.getConnection();
        const result = await conn.query(sql, [email]);
        conn.release();

        if (result.length === 0) {return res.status(404).send('User not found');}

        // const user = result[0];
        const token = crypto.randomBytes(32).toString('hex');
        const tokenExpiration = Date.now() + 3600000;

        const updateTokenSql = 'UPDATE users SET reset_token = ?, reset_token_expiration = ? WHERE email = ?';
        const conn2 = await db.getConnection();
        await conn2.query(updateTokenSql, [token, tokenExpiration, email]);
        conn2.release();

        const resetLink = `${req.protocol}://${req.get('host')}/reset-password/${token}`;
        const mailOptions = {
            to: email,
            subject: 'Password Reset Request',
            text: `Click the following link to reset your password: ${resetLink}`,
        };

        await transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Email sending error:', err);
                return res.status(500).send('Failed to send reset email');
            }
            res.status(200).send('Password reset email sent');
        });
    } catch (err) {
        console.error('Error during forgot password:', err.stack);
        res.status(500).send('Server error');
    }
});

// Reset Password Endpoint
app.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).send('New password is required');
    }

    try {
        const sql = 'SELECT * FROM users WHERE reset_token = ? AND reset_token_expiration > ?';
        const conn = await db.getConnection();
        const result = await conn.query(sql, [token, Date.now()]);
        conn.release();

        if (result.length === 0) {return res.status(400).send('Invalid or expired token');}

        const user = result[0];
        const hashedPassword = bcrypt.hashSync(newPassword, 8);

        const updatePasswordSql = 'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiration = NULL WHERE id = ?';
        const conn2 = await db.getConnection();
        await conn2.query(updatePasswordSql, [hashedPassword, user.id]);
        conn2.release();

        res.status(200).send('Password has been reset successfully');
    } catch (err) {
        console.error('Error during reset password:', err);
        res.status(500).send('Server error');
    }
});

// Prediction results endpoint
app.post('/predict-result', async (req, res) => {
    const { userId, prediction } = req.body;

    if (!userId || !prediction) {
        return res.status(400).send('Both userId and prediction are required.');
    }

    try {
        const sql = 'INSERT INTO predictions (user_id, prediction) VALUES (?, ?)';
        const conn = await db.getConnection();
        await conn.query(sql, [userId, prediction]);
        conn.release();

        res.status(201).send('Prediction saved successfully');
    } catch (err) {
        console.error('Error saving prediction:', err);
        res.status(500).send('Server error');
    }
});

// Sensor data endpoints - removed duplicate route definition
app.post('/sensor-data', async (req, res) => {
    const { sensorId, timestamp, measurement } = req.body;

    if (!sensorId || !timestamp || !measurement) {
        return res.status(400).send('All fields (sensorId, timestamp, measurement) are required.');
    }

    try {
        const sql = 'INSERT INTO sensor_data (sensor_id, timestamp, measurement) VALUES (?, ?, ?)';
        const conn = await db.getConnection();
        await conn.query(sql, [sensorId, timestamp, measurement]);
        conn.release();

        res.status(201).send('Sensor data stored successfully.');
    } catch (err) {
        console.error('Error saving sensor data:', err);
        res.status(500).send('Server error.');
    }
});

app.get('/sensor-data', async (req, res) => {
    try {
        const sql = 'SELECT * FROM sensor_data ORDER BY timestamp DESC';
        const conn = await db.getConnection();
        const result = await conn.query(sql);
        conn.release();

        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching sensor data:', err);
        res.status(500).send('Server error.');
    }
});

app.listen(port, serverIP, () => {
    console.log(`Server running on port ${port}`);
});