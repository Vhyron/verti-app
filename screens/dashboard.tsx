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
  Profile: undefined;
  Notifications: undefined;
  Menu: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Profile' | 'Notifications' | 'Menu'>;

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

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://192.168.1.4:8080/users');

        const userData = response.data;
        // Assuming the API returns an object with a name property
        if (userData && userData.name) {
          setUserName(userData.name);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Could not load user data');
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
        const response = await axios.get('http://192.168.5.200:8080/sensors');

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
          onPress={() => navigation.navigate('Notifications')}
          activeOpacity={0.7}
        >
          <NotificationIcon />
        </TouchableOpacity>
      </View>

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

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
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
});

export default DashboardScreen;