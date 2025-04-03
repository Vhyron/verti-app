/* eslint-disable eol-last */
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useNavigation } from '@react-navigation/native';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Loading'
>;

const LoadingScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ImageBackground
      source={require('../assets/loading-background.jpg')}
      style={styles.background}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>VertiApp</Text>
        <Text style={styles.subtitle}>Farming with ease</Text>
      </View>

      {/* Loading Indicator */}
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Please wait...</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: 100,
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 13,
    color: '#ccc',
    textAlign: 'center',
    marginTop: 5,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
  },
});

export default LoadingScreen;