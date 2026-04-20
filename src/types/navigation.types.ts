/**
 * NAVIGATION TYPES
 * ================
 * Type definitions for React Navigation
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';

// ============================================
// ROOT NAVIGATION PARAMS
// ============================================

export type RootStackParamList = {
  AuthStack: undefined;
  MainStack: undefined;
};

// ============================================
// AUTH STACK PARAMS
// ============================================

export type AuthStackParamList = {
  SplashScreen: undefined;
  GettingStartedScreen: undefined;
  Login: undefined;
  SignUp: undefined;
};

// ============================================
// BOTTOM TAB PARAMS
// ============================================

export type BottomTabParamList = {
  Discover:
    | {
        forceRefreshAt?: number;
      }
    | undefined;
  Interactions: undefined;
  Chats: undefined;
  Profile: undefined;
  Settings: undefined;
};

// ============================================
// MAIN STACK PARAMS
// ============================================

export type MainStackParamList = {
  BTNsecondScreens: undefined;
  MainTabs: NavigatorScreenParams<BottomTabParamList>;
  Home: undefined;
  ProfileSetting: undefined;
  InboxScreen: undefined;
  ChatScreen: {
    conversationId: string;
    userId: string;
    userName: string;
    userAvatar?: string | null;
  };
  ProfileScreen:
    | {
        userId?: string;
        showActionIcons?: boolean;
      }
    | undefined;
  SettingScreen: undefined;
  PremiumScreen: undefined;
  NotificationScreen: undefined;
  FilterScreen: undefined;
  FaceVerificationScreen: undefined;
  AboutUs: undefined;
  PrivacyPolicy: undefined;
  TermsAndConditions: undefined;
  PaymentAndRefundPolicy: undefined;
  HelpAndSupport: undefined;
};

// ============================================
// SCREEN PROPS TYPES
// ============================================

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type MainStackScreenProps<T extends keyof MainStackParamList> =
  NativeStackScreenProps<MainStackParamList, T>;

export type BottomTabScreenPropsType<T extends keyof BottomTabParamList> =
  BottomTabScreenProps<BottomTabParamList, T>;

// ============================================
// NAVIGATION PROP TYPES
// ============================================

export type AuthNavigationProp<T extends keyof AuthStackParamList> =
  AuthStackScreenProps<T>['navigation'];

export type MainNavigationProp<T extends keyof MainStackParamList> =
  MainStackScreenProps<T>['navigation'];
