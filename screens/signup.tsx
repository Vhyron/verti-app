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

const SignupScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSignup = async () => {
    // Check if the passwords match
    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'The passwords you entered do not match.');
      return;
    }

    console.log('Signup Attempt:', { username, email, password, confirmPassword });

    try {
      // Send a POST request to the backend API for signup (updated URL)
      const response = await axios.post('http://172.22.37.51:8080/register', {
        username,   // Added username to the request payload
        email,
        password,
      });

      // Handle successful signup
      if (response.status === 200) {
        Alert.alert('Signup successful!', 'You can now log in.');
        navigation.navigate('Login');
      }
    } catch (error: any) {
      console.error('Signup error:', error.response?.data || error.message);
      Alert.alert('Signup Failed', error.response?.data || 'An error occurred.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Image */}
      <Image
        source={require('../assets/signup.jpg')}
        style={styles.headerImage}
      />

      {/* App Title */}
      <Text style={styles.appTitle}>VertiApp</Text>

      {/* Username Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Username"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername} // Handle username input
      />

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter E-Mail"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Confirm Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Login Link */}
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Login</Text>
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
    paddingTop: 50,
  },
  headerImage: {
    width: '100%',
    height: 200,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  appTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0FB56D',
    marginVertical: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
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
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    color: '#0FB56D',
    fontWeight: 'bold',
  },
});

export default SignupScreen;