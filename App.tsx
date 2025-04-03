/* eslint-disable eol-last */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoadingScreen from './screens/loading';
import LoginScreen from './screens/login';
import SignupScreen from './screens/signup';
import ForgotScreen from './screens/forgot';
import DashboardScreen from './screens/dashboard';
import ProfileScreen from './screens/profile';

export type RootStackParamList = {
  Loading: undefined;
  Login: undefined;
  Signup: undefined;
  Dashboard: undefined;
  Forgot: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading">
        <Stack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Forgot" component={ForgotScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false}}/>
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;