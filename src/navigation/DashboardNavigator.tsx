import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { ChecklistScreen } from '../screens/planning/ChecklistScreen';
import { EventTimelineScreen } from '../screens/planning/EventTimelineScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { DashboardStackParamList } from './types';
import { headerStyle } from '../theme';

const Stack = createNativeStackNavigator<DashboardStackParamList>();

export const DashboardNavigator = () => (
  <Stack.Navigator screenOptions={headerStyle}>
    <Stack.Screen name="DashboardHome" component={DashboardScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Checklist" component={ChecklistScreen} options={{ title: 'Checklist' }} />
    <Stack.Screen name="Timeline" component={EventTimelineScreen} options={{ title: 'Timeline' }} />
    <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
  </Stack.Navigator>
);
