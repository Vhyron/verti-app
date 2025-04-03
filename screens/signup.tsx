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
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.5.80:8080';

const SignupScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [productKey, setProductKey] = useState('');
  const [isProductKeyValid, setIsProductKeyValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validatingKey, setValidatingKey] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Validate the product key against the database
  const validateProductKey = async () => {
    if (!productKey.trim()) {
      Alert.alert('Required', 'Please enter a product key');
      return;
    }

    setValidatingKey(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/validate-key`, {
        productKey: productKey.trim(),
      });

      if (response.data.valid) {
        setIsProductKeyValid(true);
        Alert.alert('Success', 'Product key is valid');
      } else {
        setIsProductKeyValid(false);
        Alert.alert('Invalid Key', 'This product key is not recognized');
      }
    } catch (error: any) {
      console.error('Validation error:', error.response?.data || error.message);
      setIsProductKeyValid(false);
      Alert.alert('Validation Error', 'Could not validate product key. Please try again.');
    } finally {
      setValidatingKey(false);
    }
  };

  const handleSignup = async () => {
    // Basic validation
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Missing Fields', 'Please fill in all required fields');
      return;
    }

    // Check if the passwords match
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'The passwords you entered do not match.');
      return;
    }

    // Verify product key is valid
    if (!isProductKeyValid) {
      Alert.alert('Invalid Product Key', 'Please enter and validate a product key before signing up');
      return;
    }

    // Format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    console.log('Signup Attempt:', { username, email, password, productKey });
    setIsLoading(true);

    try {
      // Send a POST request to the backend API for signup
      const response = await axios.post(`${API_BASE_URL}/register`, {
        username,
        email,
        password,
        productKey, // Include the product key with the registration
      });

      // Handle successful signup
      if (response.status === 200) {
        Alert.alert('Signup Successful!', 'You can now log in.', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]);
      }
    } catch (error: any) {
      console.error('Signup error:', error.response?.data || error.message);
      Alert.alert(
        'Signup Failed',
        error.response?.data?.message || error.response?.data || 'An error occurred.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          {/* Email Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter E-Mail"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
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

          {/* Product Key Input with Validation Button */}
          <View style={styles.keyInputContainer}>
            <TextInput
              style={[
                styles.keyInput,
                isProductKeyValid && styles.validKeyInput,
              ]}
              placeholder="Enter Product Key"
              placeholderTextColor="#aaa"
              value={productKey}
              onChangeText={(text) => {
                setProductKey(text);
                if (isProductKeyValid) {
                  setIsProductKeyValid(false); // Reset validation if key changes after being validated
                }
              }}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={[
                styles.validateButton,
                validatingKey && styles.validatingButton,
              ]}
              onPress={validateProductKey}
              disabled={validatingKey || !productKey.trim()}
            >
              {validatingKey ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.validateButtonText}>Validate</Text>
              )}
            </TouchableOpacity>
          </View>

          {isProductKeyValid && (
            <Text style={styles.validKeyMessage}>✓ Product key verified</Text>
          )}

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[
              styles.button,
              isLoading && styles.buttonDisabled,
              !isProductKeyValid && styles.buttonDisabled,
            ]}
            onPress={handleSignup}
            disabled={isLoading || !isProductKeyValid}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          {/* Product Key Info */}
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => Alert.alert(
              'Product Key Required',
              'A valid product key is required to create an account. If you purchased VertiApp, you should have received a product key with your purchase.'
            )}
          >
            <Text style={styles.infoButtonText}>What is a product key?</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
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
  keyInputContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  keyInput: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
  },
  validKeyInput: {
    borderColor: '#0FB56D',
    borderWidth: 1.5,
  },
  validateButton: {
    backgroundColor: '#0FB56D',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    minWidth: 90,
  },
  validatingButton: {
    opacity: 0.7,
  },
  validateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  validKeyMessage: {
    color: '#0FB56D',
    marginTop: 5,
    marginBottom: 15,
    alignSelf: 'flex-start',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#0FB56D',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 5,
    height: 50,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#0FB56D80',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoButton: {
    marginBottom: 15,
  },
  infoButtonText: {
    color: '#0FB56D',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
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