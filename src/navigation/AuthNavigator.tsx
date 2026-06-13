import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { GuestRsvpScreen } from '../screens/guest-portal/GuestRsvpScreen';
import { AuthStackParamList } from './types';
import { headerStyle } from '../theme';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => (
  <Stack.Navigator screenOptions={headerStyle}>
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
    <Stack.Screen name="GuestRsvp" component={GuestRsvpScreen} options={{ title: 'RSVP', headerShown: false }} />
  </Stack.Navigator>
);
