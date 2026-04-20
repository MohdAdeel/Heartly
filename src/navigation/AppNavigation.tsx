/**
 * APP NAVIGATION
 * ==============
 * Main navigation container with conditional rendering
 * based on authentication state
 */

import React from 'react';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import { useAuth } from '../context/AuthContext';
import SplashScreen from '../screens/SplashScreen';
import { navigationRef } from './navigationService';
import { NavigationContainer } from '@react-navigation/native';
import ConnectionIssueScreen from '../screens/ConnectionIssueScreen';

const AppNavigation = () => {
  // Get auth state from context - will be replaced with Firebase later
  const {
    isAuthenticated,
    isHydrating,
    loading,
    connectionError,
    refreshAuth,
    resetConnectionError,
  } = useAuth();

  console.log(
    'AppNavigation render - isAuthenticated:',
    isAuthenticated,
    'isHydrating:',
    isHydrating,
  );

  if (connectionError) {
    return (
      <NavigationContainer ref={navigationRef}>
        <ConnectionIssueScreen
          onRetry={async () => {
            resetConnectionError();
            await refreshAuth();
          }}
          error={connectionError}
        />
      </NavigationContainer>
    );
  }

  // Hold on Splash until auth state is fully resolved.
  if (isHydrating || loading) {
    return (
      <NavigationContainer ref={navigationRef}>
        <SplashScreen />
      </NavigationContainer>
    );
  }

  // CRITICAL: Single NavigationContainer at root
  // Multiple NavigationContainers prevent proper re-renders when auth state changes
  return (
    <NavigationContainer ref={navigationRef}>
      {!isAuthenticated ? <AuthStack /> : <MainStack />}
    </NavigationContainer>
  );
};

export default AppNavigation;
