/* eslint-disable eol-last */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';

// Icons for the status metrics
const LightIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" stroke="#000" fill="none" strokeWidth="2">
      <Path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      <Path d="M12 6a6 6 0 0 0 0 12 6 6 0 0 0 0-12z" fill="#FFD700" stroke="#000" />
    </Svg>
);

const TemperatureIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" stroke="#000" fill="none" strokeWidth="2">
      <Path d="M14 4v12.5c0 1.38-1.12 2.5-2.5 2.5S9 17.88 9 16.5V4c0-1.38 1.12-2.5 2.5-2.5S14 2.62 14 4z" />
      <Path d="M12 15a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" fill="#FF6B6B" />
    </Svg>
);

const HumidityIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" stroke="#000" fill="none" strokeWidth="2">
      <Path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="#6FB1FC" />
    </Svg>
);

const WaterIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" stroke="#000" fill="none" strokeWidth="2">
      <Path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="#00BCD4" />
    </Svg>
);

// Water Level Sensor Icon
const WaterLevelSensorIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" stroke="#000" fill="none" strokeWidth="2">
      <Path d="M3 3h18v18H3z" />
      <Path d="M3 15h18" />
      <Path d="M3 11h18" />
      <Path d="M3 7h18" />
      <Path d="M7 3v18" />
      <Circle cx="7" cy="15" r="1.5" fill="#00BCD4" />
    </Svg>
);

// Water Flow Sensor Icon
const WaterFlowSensorIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" stroke="#000" fill="none" strokeWidth="2">
      <Path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="#87CEFA" opacity="0.3" />
      <Path d="M7 10.5c1-1 2-1.5 3-1.5s2 .5 3 1.5" />
      <Path d="M11 13.5c1-1 2-1.5 3-1.5s2 .5 3 1.5" />
    </Svg>
);

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

type RootStackParamList = {
  Dashboard: undefined;
  Profile: undefined;
  Notifications: undefined;
  Menu: undefined;
  Plants: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard' | 'Profile' | 'Notifications' | 'Menu' | 'Plants'>;

// Interface for sensor data
interface SensorData {
  lightIntensity: number;
  temperature: number;
  humidity: number;
  pillars: {
    [key: string]: {
      waterLevel: 'sufficient' | 'low'; // Changed to reflect binary state
      waterFlow: number;
    }
  }
}

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  // State for user data and loading status
  const [userName, setUserName] = useState<string>('User');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for sensor data
  const [sensorData, setSensorData] = useState<SensorData>({
    lightIntensity: 0,
    temperature: 0,
    humidity: 0,
    pillars: {
      'Pillar 1': { waterLevel: 'sufficient', waterFlow: 0 },
      'Pillar 2': { waterLevel: 'sufficient', waterFlow: 0 },
      'Pillar 3': { waterLevel: 'sufficient', waterFlow: 0 },
    },
  });

  const [sensorLoading, setSensorLoading] = useState<boolean>(true);
  const [sensorError, setSensorError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Track active tab
  const [, setActiveTab] = useState('home');

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://192.168.5.201:8080/users', {
          timeout: 5000, // 5 second timeout
        });

        const userData = response.data;
        if (userData && userData.name) {
          setUserName(userData.name);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Could not load user data');

        // Set fallback data
        setUserName('John Doe');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Fetch sensor data
  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        setSensorLoading(true);
        const response = await axios.get('http://192.168.5.201:8080/sensors', {
          timeout: 5000, // 5 second timeout
        });

        if (response.data) {
          setSensorData(response.data);

          // Check for any alerts based on sensor data
          const newNotifications = [];

          if (response.data.temperature > 85) {
            newNotifications.push(`ALERT: High temperature detected (${response.data.temperature}°F)`);
          }

          if (response.data.humidity < 50) {
            newNotifications.push(`ALERT: Low humidity detected (${response.data.humidity}%)`);
          }

          // Check water levels in each pillar
          for (const [pillar, pillarData] of Object.entries(response.data.pillars)) {
            const data = pillarData as { waterLevel: string; waterFlow: number };

            if (data.waterLevel === 'low') {
              newNotifications.push(`ALERT: ${pillar} water level is low`);
            }

            if (data.waterFlow < 80) {
              newNotifications.push(`ALERT: ${pillar} water flow is below optimal (${data.waterFlow}Psi)`);
            }
          }

          setNotifications(newNotifications);
        }

        setSensorError(null);
      } catch (err) {
        console.error('Error fetching sensor data:', err);
        setSensorError('Could not load sensor data');

        // Use fallback data
        setSensorData({
          lightIntensity: 75,
          temperature: 78,
          humidity: 65,
          pillars: {
            'Pillar 1': { waterLevel: 'sufficient', waterFlow: 85 },
            'Pillar 2': { waterLevel: 'sufficient', waterFlow: 90 },
            'Pillar 3': { waterLevel: 'low', waterFlow: 75 },
          },
        });

        // Add some example notifications for the fallback data
        setNotifications([
          'ALERT: Pillar 3 water level is low',
          'ALERT: Pillar 3 water flow is below optimal (75Psi)',
        ]);

      } finally {
        setSensorLoading(false);
      }
    };

    // Fetch initial data
    fetchSensorData();

    // Set up interval to fetch data every 30 seconds
    const intervalId = setInterval(fetchSensorData, 30000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Handler for burger menu
  const handleBurgerMenuPress = () => {
    navigation.navigate('Menu');
  };

  // Handle navigation
  const handleNavigation = (screenName: keyof RootStackParamList) => {
    // Don't navigate if we're already on Dashboard
    if (screenName === 'Dashboard') {
      return;
    }

    navigation.navigate(screenName);
  };

  // Format temperature for display
  const formatTemperature = (temp: number) => {
    return `${temp}°F`;
  };

  return (
    <View style={styles.container}>
      {/* Updated Header */}
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

      {/* Show a banner if using fallback data
      {usingFallbackData && (
        <View style={styles.fallbackBanner}>
          <Text style={styles.fallbackText}>Using demo data (no server connection)</Text>
        </View>
      )} */}

      {/* ImageBackground for the main content */}
      <ImageBackground
        source={require('../assets/dashBG.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <ScrollView style={styles.scrollContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#2ecc71" />
              <Text style={styles.loadingText}>Loading user data...</Text>
            </View>
          ) : error ? (
            <Text style={styles.greeting}>Hello, User!</Text>
          ) : (
            <Text style={styles.greeting}>Hello, {userName}!</Text>
          )}
          <Text style={styles.subtext}>Good morning, welcome back.</Text>

          {/* Recent Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Notifications</Text>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <View key={index} style={styles.notificationItem}>
                  <Text style={styles.notificationText}>{notification}</Text>
                </View>
              ))
            ) : (
              <View style={styles.notificationItem}>
                <Text style={styles.notificationText}>No alerts at this time.</Text>
              </View>
            )}
          </View>

          {/* Modified System Status Section */}
          <View style={[styles.section, styles.statusSection]}>
            <Text style={styles.sectionTitle}>System Status:</Text>
            {sensorLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#2ecc71" />
                <Text style={styles.loadingText}>Loading sensor data...</Text>
              </View>
            ) : sensorError ? (
              <Text style={styles.errorText}>Error loading sensor data. Please try again.</Text>
            ) : (
              <>
                <View style={styles.metricsContainer}>
                  <View style={styles.metricRow}>
                    <View style={styles.metric}>
                      <View style={styles.iconContainer}>
                        <LightIcon />
                      </View>
                      <Text style={styles.metricLabel}>LIGHT</Text>
                      <Text style={styles.metricValue}>{sensorData.lightIntensity}%</Text>
                    </View>

                    <View style={styles.metric}>
                      <View style={styles.iconContainer}>
                        <TemperatureIcon />
                      </View>
                      <Text style={styles.metricLabel}>TEMPERATURE</Text>
                      <Text style={styles.metricValue}>{formatTemperature(sensorData.temperature)}</Text>
                    </View>
                  </View>

                  <View style={styles.metricRow}>
                    <View style={styles.metric}>
                      <View style={styles.iconContainer}>
                        <HumidityIcon />
                      </View>
                      <Text style={styles.metricLabel}>HUMIDITY</Text>
                      <Text style={styles.metricValue}>{sensorData.humidity}%</Text>
                    </View>

                    <View style={styles.metric}>
                      <View style={styles.iconContainer}>
                        <WaterIcon />
                      </View>
                      <Text style={styles.metricLabel}>WATER STATUS</Text>
                      <Text style={styles.metricValue}>
                        {Object.values(sensorData.pillars).every(p => p.waterLevel === 'sufficient')
                          ? 'Sufficient'
                          : 'Check Pillars'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Water flow and level for each pillar with sensor icons */}
                {Object.entries(sensorData.pillars).map(([pillar, data], index) => (
                  <View key={index} style={styles.healthContainer}>
                    <View style={styles.healthStatus}>
                      <View style={styles.sensorIconContainer}>
                        <WaterLevelSensorIcon />
                      </View>
                      <Text style={styles.healthText}>
                        {pillar}: Water Level: <Text style={data.waterLevel === 'sufficient' ? styles.goodStatus : styles.alertStatus}>
                          {data.waterLevel}
                        </Text>
                      </Text>
                    </View>
                    <View style={styles.healthStatus}>
                      <View style={styles.sensorIconContainer}>
                        <WaterFlowSensorIcon />
                      </View>
                      <Text style={styles.healthText}>
                        Water Flow: <Text style={data.waterFlow >= 80 ? styles.goodStatus : styles.alertStatus}>
                          {data.waterFlow}Psi
                        </Text>
                      </Text>
                    </View>
                  </View>
                ))}
              </>
            )}
          </View>

          {/* Plant Overall Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Plant Overall Status</Text>
            <Text style={styles.statusText}>
              🌿 32 Plants are <Text style={styles.kulay}>healthy</Text> and happy.
            </Text>
          </View>
        </ScrollView>
      </ImageBackground>

      {/* iOS-style Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        {/* Home Button - Already active */}
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
          <Text style={[styles.navLabel, styles.activeNavLabel]}>Home</Text>
          <View style={styles.activeTabIndicator} />
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
            strokeWidth={1.5}
            stroke="#8E8E93"
            fill="none"
          >
            <Path
              d="M18 20V10M12 20V4M6 20v-6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={styles.navLabel}>Plants</Text>
        </TouchableOpacity>

        {/* Apps Button */}
        <TouchableOpacity
          style={styles.navButton}
          activeOpacity={0.7}
        >
          <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#8E8E93"
            fill="none"
          >
            <Path
              d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={styles.navLabel}>Apps</Text>
        </TouchableOpacity>

        {/* Profile Button */}
        <TouchableOpacity
          style={styles.navButton}
          activeOpacity={0.7}
          onPress={() => {
            setActiveTab('profile');
            handleNavigation('Profile');
          }}
        >
          <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#8E8E93"
            fill="none"
          >
            <Path
              d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle cx="12" cy="7" r="4" />
          </Svg>
          <Text style={styles.navLabel}>Profile</Text>
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
  fallbackBanner: {
    backgroundColor: 'rgba(255, 204, 0, 0.9)',
    padding: 8,
    alignItems: 'center',
  },
  fallbackText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 12,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    paddingHorizontal: 10,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 10,
    marginTop: 15,
    marginLeft: 5,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginLeft: 5,
  },
  loadingText: {
    fontSize: 16,
    color: '#2d3436',
    marginLeft: 10,
  },
  errorText: {
    color: '#e74c3c',
    textAlign: 'center',
    marginVertical: 10,
  },
  subtext: {
    fontSize: 14,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
    marginLeft: 5,
    marginBottom: 15,
  },
  section: {
    marginVertical: 15,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    padding: 5,
  },
  notificationText: {
    marginLeft: 10,
  },
  statusText: {
    fontSize: 14,
    color: '#2d3436',
  },
  statusSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricsContainer: {
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  metric: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 15,
  },
  iconContainer: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    alignSelf: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#616161',
    marginBottom: 4,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B5E20',
    textAlign: 'center',
  },
  healthContainer: {
    marginTop: 8,
    alignItems: 'center',
    width: '100%',
  },
  healthStatus: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 5,
    width: '100%',
  },
  sensorIconContainer: {
    marginRight: 10,
  },
  healthText: {
    color: '#2E7D32',
    fontWeight: '500',
    flex: 1,
  },
  goodStatus: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  alertStatus: {
    color: '#e74c3c',
    fontWeight: 'bold',
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

export default DashboardScreen;