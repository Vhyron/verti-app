/* eslint-disable eol-last */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import Svg, { Path } from 'react-native-svg';

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

const DashboardScreen = () => {
  const temperature = '70-75';
  const humidity = 80;
  const lightIntensity = '35-40';
  const waterLevel = 250;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>
          <Text style={styles.kulay}>Verti</Text>App
        </Text>
        <Text style={styles.notification}>🔔</Text>
      </View>

      {/* ImageBackground for the main content */}
      <ImageBackground
        source={require('../assets/dashBG.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <ScrollView style={styles.scrollContainer}>
          <Text style={styles.greeting}>Hello, User!</Text>
          <Text style={styles.subtext}>Good morning, welcome back.</Text>

          {/* Recent Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Notification</Text>
            <View style={styles.notificationItem}>
              <Text style={styles.notificationText}>ALERT: </Text>
            </View>
            <View style={styles.notificationItem}>
              <Text style={styles.notificationText}>Water Level: </Text>
            </View>
          </View>

          {/* Modified System Status Section */}
          <View style={[styles.section, styles.statusSection]}>
            <Text style={styles.sectionTitle}>System Status</Text>
            <View style={styles.metricsContainer}>
              <View style={styles.metricRow}>
                <View style={styles.metric}>
                  <View style={styles.iconContainer}>
                    <LightIcon />
                  </View>
                  <Text style={styles.metricLabel}>LIGHT</Text>
                  <Text style={styles.metricValue}>{lightIntensity}%</Text>
                </View>

                <View style={styles.metric}>
                  <View style={styles.iconContainer}>
                    <TemperatureIcon />
                  </View>
                  <Text style={styles.metricLabel}>TEMPERATURE</Text>
                  <Text style={styles.metricValue}>{temperature}°F</Text>
                </View>
              </View>

              <View style={styles.metricRow}>
                <View style={styles.metric}>
                  <View style={styles.iconContainer}>
                    <HumidityIcon />
                  </View>
                  <Text style={styles.metricLabel}>HUMIDITY</Text>
                  <Text style={styles.metricValue}>{humidity}%</Text>
                </View>

                <View style={styles.metric}>
                  <View style={styles.iconContainer}>
                    <WaterIcon />
                  </View>
                  <Text style={styles.metricLabel}>WATER</Text>
                  <Text style={styles.metricValue}>{waterLevel}ml</Text>
                </View>
              </View>
            </View>

            <View style={styles.healthContainer}>
              <View style={styles.healthStatus}>
                <Text style={styles.healthText}>Water Flow: 100Psi</Text>
              </View>
            </View>
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
    padding: 15,
    backgroundColor: 'white',
    zIndex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  logo: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  notification: {
    fontSize: 20,
    color: 'green',
  },
  scrollContainer: {
    paddingHorizontal: 10,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
    marginTop: 15,
    marginLeft: 5,
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
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  notificationText: {
    marginLeft: 10,
  },
  statusText: {
    fontSize: 14,
    color: '#2d3436',
  },
  boldText: {
    fontWeight: 'bold',
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
    backgroundColor: 'rgba(232, 245, 233, 0.9)',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricsContainer: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  metric: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
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
    marginTop: 15,
    alignItems: 'center',
  },
  healthStatus: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  healthText: {
    color: '#2E7D32',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default DashboardScreen;