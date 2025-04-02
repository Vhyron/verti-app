/* eslint-disable eol-last */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define navigation param list (same as in DashboardScreen)
type RootStackParamList = {
  Profile: undefined;
  Notifications: undefined;
  Menu: undefined;
  Dashboard: undefined; // Added for navigation back to Dashboard
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Notifications'>;

// Burger Menu Icon (reused from DashboardScreen)
// const BurgerMenuIcon = () => (
//   <Svg width="24" height="24" viewBox="0 0 24 24" stroke="#000" fill="none" strokeWidth="2">
//     <Path d="M3 12h18M3 6h18M3 18h18" />
//   </Svg>
// );

// Notification bell icon (reused from DashboardScreen)
const NotificationIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" stroke="#2ecc71" fill="none" strokeWidth="2">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);

// Cart Icon for Order Notifications
const CartIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" stroke="#000" fill="none" strokeWidth="2">
    <Path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 7h12M16 20a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-6 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
  </Svg>
);

// Truck Icon for Delivery Notifications
const TruckIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" stroke="#000" fill="none" strokeWidth="2">
    <Path d="M14 2H6v12h14V8h-6zM14 8h6M9 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
  </Svg>
);

// Package Icon for Received Notifications
const PackageIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" stroke="#000" fill="none" strokeWidth="2">
    <Path d="M20 6H4l2 6h12l2-6zM4 6l2 12h12l2-12H4zM10 10h4" />
  </Svg>
);

// Leaf Icon for Plant Notifications
const LeafIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" stroke="#000" fill="none" strokeWidth="2">
    <Path d="M17 8C8 10 5.9 16.17 3.82 21.34c1.66-1.28 3.56-2.74 5.18-4.66 3-3.5 5-8.5 8-9.68 0 2 1 5-2 7-3 2-7 2-9 5 5-1 9-5 11-10z" />
  </Svg>
);

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  // Sample notifications data (you can replace this with API data if needed)
  const notifications = [
    { id: 1, type: 'order', message: '', time: ' ', unread: true },
    { id: 2, type: 'delivery', message: '', time: ' ', unread: true },
    { id: 3, type: 'received', message: 'Order #5540 received', time: '10h ago', unread: true },
    { id: 4, type: 'plant', message: 'Cabbage looks healthy', time: 'Today', unread: false },
    { id: 5, type: 'plant', message: 'cabbages are thirsty', time: 'Today', unread: false },
  ];

  // Handler for burger menu
  // const handleBurgerMenuPress = () => {
  //   navigation.navigate('Menu');
  // };

  return (
    <View style={styles.container}>
      {/* Header (copied from DashboardScreen) */}
      <View style={styles.header}>
        {/* Back Button (replacing Burger Menu for this screen) */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate('Dashboard')}
          activeOpacity={0.7}
        >
          <Svg width="24" height="24" viewBox="0 0 24 24" stroke="#000" fill="none" strokeWidth="2">
            <Path d="M15 19l-7-7 7-7" />
          </Svg>
        </TouchableOpacity>

        {/* Centered Logo */}
        <View style={styles.logoCenteredContainer}>
          <Text style={styles.logo}>
            <Text style={styles.kulay}>Verti</Text>App
          </Text>
        </View>

        {/* Notification Button (kept for consistency, but can be removed if not needed) */}
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}
          activeOpacity={0.7}
        >
          <NotificationIcon />
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        {notifications.map((notification) => (
          <View key={notification.id} style={styles.notificationItem}>
            {/* Icon based on notification type */}
            <View style={styles.iconContainer}>
              {notification.type === 'order' && <CartIcon />}
              {notification.type === 'delivery' && <TruckIcon />}
              {notification.type === 'received' && <PackageIcon />}
              {notification.type === 'plant' && <LeafIcon />}
            </View>
            {/* Notification Text */}
            <View style={styles.notificationTextContainer}>
              <Text style={styles.notificationMessage}>{notification.message}</Text>
              <Text style={styles.notificationTime}>{notification.time}</Text>
            </View>
            {/* Unread Indicator */}
            {notification.unread && <View style={styles.unreadIndicator} />}
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation (copied from DashboardScreen) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Dashboard')}
        >
          {/* Home Icon */}
          <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            fill="none"
          >
            <Path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12L11.204 3.045c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75V19.875c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </Svg>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton}>
          {/* Stats Icon */}
          <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            fill="none"
          >
            <Path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
            />
            <Path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
            />
          </Svg>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton}>
          {/* Third Button Icon */}
          <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            fill="none"
          >
            <Path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
            />
          </Svg>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Profile')}
        >
          {/* Profile Icon */}
          <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            fill="none"
          >
            <Path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </Svg>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles (reused from DashboardScreen with additions for notifications)
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
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  iconContainer: {
    marginRight: 15,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 16,
    color: '#000',
  },
  notificationTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  unreadIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2ecc71',
    marginLeft: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: 'white',
  },
  navButton: {
    backgroundColor: '#6FBF73',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default NotificationsScreen;