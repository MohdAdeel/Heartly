import React from 'react';
import Home from '../screens/Home';
import InboxScreen from '../screens/InboxScreen';
import Interactions from '../screens/Interactions';
import SettingScreen from '../screens/SettingScreen';
import ProfileSetting from '../screens/ProfileSetting';
import { verticalScale } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BottomTabParamList } from '../types/navigation.types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';

const Tab = createBottomTabNavigator<BottomTabParamList>();
const SCREEN_WIDTH = Dimensions.get('window').width;

const TAB_CONFIG = [
  { name: 'Discover', filled: 'compass', outline: 'compass-outline' },
  { name: 'Interactions', filled: 'heart', outline: 'heart-outline' },
  { name: 'Chats', filled: 'chatbubble', outline: 'chatbubble-outline' },
  { name: 'Profile', filled: 'person', outline: 'person-outline' },
  {
    name: 'Settings',
    filled: 'settings',
    outline: 'settings-outline',
  },
] as const;

const CustomTabBar = ({ state, navigation }: any) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBar]}>
      {TAB_CONFIG.map((tab, index) => {
        const isFocused = state.index === index;

        return (
          <TouchableOpacity
            key={tab.name}
            style={[styles.tabButton, isFocused && styles.tabButtonActive]}
            activeOpacity={0.9}
            onPress={() => navigation.navigate(tab.name)}
          >
            <Ionicons
              name={isFocused ? tab.filled : tab.outline}
              size={20}
              color={isFocused ? '#FFFFFF' : '#A6A0B7'}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const BTNsecond = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Discover" component={Home} />
      <Tab.Screen name="Interactions" component={Interactions} />
      <Tab.Screen name="Chats" component={InboxScreen} />
      <Tab.Screen name="Profile" component={ProfileSetting} />
      <Tab.Screen name="Settings" component={SettingScreen} />
    </Tab.Navigator>
  );
};

export default BTNsecond;

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: verticalScale(30),
    left: (SCREEN_WIDTH - SCREEN_WIDTH * 0.76) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH * 0.76,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 26,
    backgroundColor: 'rgba(20, 20, 26, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  tabButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
});
