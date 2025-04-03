/* eslint-disable eol-last */
/* eslint-disable no-trailing-spaces */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

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

  // User profile data (would typically come from state management or context)
  const [userProfile] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    username: 'johnd',
  });

  // Logout handler
  const handleLogout = () => {
    navigation.navigate('Login');
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
      <ScrollView style={styles.content}>
        {/* Profile Details */}
        <View style={styles.profileDetailsContainer}>
          <Text style={styles.profileName}>{userProfile.name}</Text>
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
        
        {/* Plus Button */}
        <TouchableOpacity 
          style={styles.addButton}
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
              d="M12 5v14M5 12h14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
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
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
  },
  logoCenteredContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: -1,
  },
  logo: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  notificationButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileDetailsContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
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
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});

export default ProfileScreen;