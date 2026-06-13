import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DashboardNavigator } from './DashboardNavigator';
import { EventsNavigator } from './EventsNavigator';
import { MessagesNavigator } from './MessagesNavigator';
import { VendorsNavigator } from './VendorsNavigator';
import { ExpensesNavigator } from './ExpensesNavigator';
import { PhotosNavigator } from './PhotosNavigator';
import { MainTabParamList } from './types';
import { COLORS, FONTS, TAB_COLORS } from '../utils/constants';
import { headerStyle } from '../theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => {
      const activeColor = TAB_COLORS[route.name] ?? COLORS.primary;
      return {
        ...headerStyle,
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ size, focused }) => {
          const icons: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
            Dashboard: focused ? 'view-dashboard' : 'view-dashboard-outline',
            Events: focused ? 'calendar-heart' : 'calendar-heart',
            Messages: focused ? 'email-multiple' : 'email-multiple-outline',
            Vendors: focused ? 'store' : 'store-outline',
            Expenses: focused ? 'cash' : 'cash-multiple',
            Photos: focused ? 'image-album' : 'image-album',
          };
          return (
            <MaterialCommunityIcons
              name={icons[route.name]}
              size={size}
              color={focused ? activeColor : COLORS.muted}
            />
          );
        },
      };
    }}
  >
    <Tab.Screen name="Dashboard" component={DashboardNavigator} options={{ headerShown: false }} />
    <Tab.Screen name="Events" component={EventsNavigator} options={{ headerShown: false }} />
    <Tab.Screen name="Messages" component={MessagesNavigator} options={{ headerShown: false }} />
    <Tab.Screen name="Vendors" component={VendorsNavigator} options={{ headerShown: false }} />
    <Tab.Screen name="Expenses" component={ExpensesNavigator} options={{ headerShown: false }} />
    <Tab.Screen name="Photos" component={PhotosNavigator} options={{ headerShown: false }} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingTop: 6,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
  },
  tabLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
  },
});
