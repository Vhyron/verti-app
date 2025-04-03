/* eslint-disable eol-last */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import axios from 'axios';
import Svg, { Path } from 'react-native-svg';

const UserIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth={1.5}>
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  </Svg>
);

const EyeOpenIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth={1.5}>
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
    />
    <Path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </Svg>
);

const EyeClosedIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth={1.5}>
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
    />
  </Svg>
);

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogin = async () => {
    console.log('Login Attempt:', { email, password });

    try {
      // Send a POST request to the backend API for login
      const response = await axios.post('http://192.168.5.201:8080/login', { email, password });

      // Handle successful login
      if (response.data.auth) {
        // Save the token (optional, if you plan on using JWT)
        const token = response.data.token;
        console.log('Login successful, token:', token);

        // Navigate to the Dashboard screen
        navigation.navigate('Dashboard');
      }
    } catch (error:any ) {
      console.error('Login error:', error.response?.data || error.message);
      Alert.alert('Login Failed', error.response?.data || 'Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/header.png')} style={styles.headerImage} />
      <Text style={styles.appTitle}>VertiApp</Text>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Log in to your account</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email</Text>
        <View style={styles.inputWrapper}>
          <UserIcon />
          <TextInput
            style={styles.inputWithIcon}
            placeholder="Enter your email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Password</Text>
        <View style={styles.inputWrapper}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth={1.5}>
            <Path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </Svg>
          <TextInput
            style={styles.inputWithIcon}
            placeholder="Enter your password"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Forgot')}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupLink}>Signup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  headerImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
  },
  appTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#0FB56D',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 15,
  },
  inputWithIcon: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 5,
  },
  button: {
    backgroundColor: '#0FB56D',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    color: '#0FB56D',
    fontSize: 14,
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    color: '#666',
  },
  signupLink: {
    color: '#0FB56D',
    fontWeight: 'bold',
  },
});

export default LoginScreen;