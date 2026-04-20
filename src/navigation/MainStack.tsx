/**
 * MAIN STACK NAVIGATOR
 * ====================
 * Handles main app screens after authentication
 */

import React from 'react';
import { MainStackParamList } from '../types/navigation.types';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Navigators
import BottomTabNavigator from './BottomTabNavigator';

// Screens
import AboutUs from '../screens/AboutUs';
import ChatScreen from '../screens/ChatScreen';
import FilterScreen from '../screens/FilterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingScreen from '../screens/SettingScreen';
import PremiumScreen from '../screens/PremiumScreen';
import PrivacyPolicy from '../screens/PrivacyPolicy';
import TermsAndConditions from '../screens/TermsAndConditions';
import PaymentAndRefundPolicy from '../screens/PaymentAndRefundPolicy';
import NotificationScreen from '../screens/NotificationScreen';
import FaceVerificationScreen from '../screens/FaceVerificationScreen';
import HelpAndSupport from '../screens/HelpAndSupport';

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="PremiumScreen" component={PremiumScreen} />
      <Stack.Screen name="AboutUs" component={AboutUs} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen
        name="TermsAndConditions"
        component={TermsAndConditions}
      />
      <Stack.Screen
        name="PaymentAndRefundPolicy"
        component={PaymentAndRefundPolicy}
      />
      <Stack.Screen name="HelpAndSupport" component={HelpAndSupport} />
      <Stack.Screen name="SettingScreen" component={SettingScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen
        name="FilterScreen"
        component={FilterScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="FaceVerificationScreen"
        component={FaceVerificationScreen}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
