/**
 * AUTH STACK NAVIGATOR
 * ====================
 * Handles authentication flow screens
 */

import React from 'react';
import { AuthStackParamList } from '../types/navigation.types';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import GettingStartedScreen from '../screens/GettingStartedScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="GettingStartedScreen"
      screenOptions={{
        headerShown: false, // All screens have custom headers
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="GettingStartedScreen"
        component={GettingStartedScreen}
      />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
};

export default AuthStack;
