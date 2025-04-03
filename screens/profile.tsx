/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-catch-shadow */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eol-last */
/* eslint-disable no-trailing-spaces */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Dashboard: undefined;
  Profile: undefined;
  Notifications: undefined;
  Menu: undefined;
  Login: undefined;
  Signup: undefined;
  Forgot: undefined;
  Loading: undefined;
  Plants: undefined;
  EditPassword: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

interface UserProfile {
  id?: number;
  username: string;
  email: string;
  name?: string;
}

// API URL - make sure this matches your server configuration
const API_URL = 'http://192.168.5.80:8080'; // Update with your server's IP and port

// Burger Menu Icon
const BurgerMenuIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" stroke="#000" fill="none" strokeWidth="2">
        <Path d="M3 12h18M3 6h18M3 18h18" />
    </Svg>
);

// Notification bell icon
const NotificationIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" stroke="#2ecc71" fill="none" strokeWidth="2">
      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </Svg>
);

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // User profile data state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: 'Loading...',
    email: 'Loading...',
  });

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    // First try to get cached profile data
    try {
      const cachedProfile = await AsyncStorage.getItem('userProfile');
      if (cachedProfile) {
        setUserProfile(JSON.parse(cachedProfile));
      }
    } catch (err) {
      console.error('Error reading cached profile:', err);
    }

    // Then try to fetch fresh data from server
    try {
      setIsLoading(true);
      console.log('Fetching user data from:', `${API_URL}/users`);
      
      const response = await axios.get(`${API_URL}/users`, {
        timeout: 10000, // 10 second timeout
      });

      console.log('User data response:', response.data);
      
      // Check if response.data is an array or a single object
      let userData = response.data;
      if (Array.isArray(userData) && userData.length > 0) {
        // If it's an array, use the first user
        userData = userData[0];
      }
      
      if (userData && userData.username) {
        const profileData = {
          id: userData.id,
          username: userData.username,
          email: userData.email || 'No email provided',
          name: userData.name || userData.username,
        };
        
        setUserProfile(profileData);
        
        // Cache the profile data
        await AsyncStorage.setItem('userProfile', JSON.stringify(profileData));
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Could not load user data');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      // Clear user data from AsyncStorage
      await AsyncStorage.multiRemove(['userProfile', 'authToken']);
      
      // Optional: Call logout endpoint on server
      // await axios.post(`${API_URL}/logout`);
      
      // Navigate to login screen
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  // Handler for burger menu
  const handleBurgerMenuPress = () => {
    navigation.navigate('Menu');
  };

  const handleNavigation = (screenName: keyof RootStackParamList) => {
    // Don't navigate if we're already on this screen
    if (screenName === 'Profile') {
      return;
    }
    
    navigation.navigate(screenName);
  };

  // Pull to refresh functionality
  const onRefresh = () => {
    fetchUserProfile();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Burger Menu Button */}
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={handleBurgerMenuPress}
          activeOpacity={0.7}
        >
          <BurgerMenuIcon />
        </TouchableOpacity>

        {/* Centered Logo */}
        <View style={styles.logoCenteredContainer}>
          <Text style={styles.logo}>
            <Text style={styles.kulay}>Verti</Text>App
          </Text>
        </View>

        {/* Notification Button */}
        <TouchableOpacity 
          style={styles.notificationButton} 
          onPress={() => handleNavigation('Notifications')}
          activeOpacity={0.7}
        >
          <NotificationIcon />
        </TouchableOpacity>
      </View>

      {/* Profile Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2ecc71" />
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={onRefresh}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Profile Details */}
            <View style={styles.profileDetailsContainer}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {userProfile.username.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.profileName}>{userProfile.name || userProfile.username}</Text>
              <Text style={styles.profileUsername}>@{userProfile.username}</Text>
              <Text style={styles.profileEmail}>{userProfile.email}</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleNavigation('EditPassword')}
              >
                <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" strokeWidth="2">
                  <Path d="M10 13.5l2 2 4-4m4.28-5.28a9 9 0 0 0-12.06 0L4 10l4 4 2-2" />
                  <Path d="M2 12l4 4 4-4m6 6l4-4-4-4" />
                </Svg>
                <Text style={styles.actionButtonText}>Change Password</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.logoutButton]}
                onPress={handleLogout}
              >
                <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <Path d="M16 17l5-5-5-5" />
                  <Path d="M21 12H9" />
                </Svg>
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      {/* iOS-style Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        {/* Home Button */}
        <TouchableOpacity 
          style={styles.navButton} 
          activeOpacity={0.7}
          onPress={() => handleNavigation('Dashboard')}
        >
          <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            strokeWidth={activeTab === 'home' ? 2 : 1.5}
            stroke={activeTab === 'home' ? '#2ecc71' : '#8E8E93'}
            fill="none"
          >
            <Path
              d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M9 22V12h6v10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={[styles.navLabel, activeTab === 'home' && styles.activeNavLabel]}>Home</Text>
          {activeTab === 'home' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        
        {/* Plants Button */}
        <TouchableOpacity 
          style={styles.navButton}
          activeOpacity={0.7}
          onPress={() => {
            setActiveTab('plants');
            handleNavigation('Plants');
          }}
        >
          <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            strokeWidth={activeTab === 'plants' ? 2 : 1.5}
            stroke={activeTab === 'plants' ? '#2ecc71' : '#8E8E93'}
            fill="none"
          >
            <Path
              d="M18 20V10M12 20V4M6 20v-6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={[styles.navLabel, activeTab === 'plants' && styles.activeNavLabel]}>Plants</Text>
          {activeTab === 'plants' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        
        {/* Apps Button */}
        <TouchableOpacity 
          style={styles.navButton}
          activeOpacity={0.7}
          onPress={() => setActiveTab('apps')}
        >
          <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            strokeWidth={activeTab === 'apps' ? 2 : 1.5}
            stroke={activeTab === 'apps' ? '#2ecc71' : '#8E8E93'}
            fill="none"
          >
            <Path
              d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={[styles.navLabel, activeTab === 'apps' && styles.activeNavLabel]}>Apps</Text>
          {activeTab === 'apps' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        
        {/* Profile Button - Already active */}
        <TouchableOpacity 
          style={styles.navButton}
          activeOpacity={0.7}
        >
          <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="#2ecc71"
            fill="none"
          >
            <Path
              d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle cx="12" cy="7" r="4" />
          </Svg>
          <Text style={[styles.navLabel, styles.activeNavLabel]}>Profile</Text>
          <View style={styles.activeTabIndicator} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  kulay: {
    color: '#2ecc71',
  },
  header: {
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1,
  },
  menuButton: {
    marginTop: 45,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
  },
  logoCenteredContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    zIndex: 10,
  },
  logo: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'white', // Optional: add background to logo text for visibility
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  notificationButton: {
    marginTop: 45,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  profileDetailsContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2ecc71',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  profileUsername: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
  },
  actionButtonsContainer: {
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#2ecc71',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
  },
  logoutButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: 'white',
  },
  
  // iOS-style Bottom Navigation styles
  bottomNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    position: 'relative',
    flex: 1,
  },
  navLabel: {
    fontSize: 10,
    color: '#8E8E93',
    marginTop: 3,
  },
  activeNavLabel: {
    color: '#2ecc71',
    fontWeight: '600',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: -5,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#2ecc71',
  },
});

export default ProfileScreen;