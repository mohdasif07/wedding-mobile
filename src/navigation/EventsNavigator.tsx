import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EventListScreen } from '../screens/events/EventListScreen';
import { EventDetailsScreen } from '../screens/events/EventDetailsScreen';
import { EventFormScreen } from '../screens/events/EventFormScreen';
import { GuestListScreen } from '../screens/guests/GuestListScreen';
import { GuestDetailsScreen } from '../screens/guests/GuestDetailsScreen';
import { GuestFormScreen } from '../screens/guests/GuestFormScreen';
import { AttendanceListScreen } from '../screens/events/AttendanceListScreen';
import { QrScannerScreen } from '../screens/events/QrScannerScreen';
import { PhotoViewerScreen } from '../screens/photos/PhotoViewerScreen';
import { EventsStackParamList } from './types';
import { headerStyle } from '../theme';

const Stack = createNativeStackNavigator<EventsStackParamList>();

export const EventsNavigator = () => (
  <Stack.Navigator screenOptions={headerStyle}>
    <Stack.Screen name="EventList" component={EventListScreen} options={{ title: 'Events' }} />
    <Stack.Screen name="EventDetails" component={EventDetailsScreen} options={{ title: 'Event Details' }} />
    <Stack.Screen name="EventForm" component={EventFormScreen} options={{ title: 'Event' }} />
    <Stack.Screen name="GuestList" component={GuestListScreen} options={{ title: 'Guests' }} />
    <Stack.Screen name="GuestDetails" component={GuestDetailsScreen} options={{ title: 'Guest' }} />
    <Stack.Screen name="GuestForm" component={GuestFormScreen} options={{ title: 'Guest' }} />
    <Stack.Screen name="QrScanner" component={QrScannerScreen} options={{ title: 'QR Check-in' }} />
    <Stack.Screen name="AttendanceList" component={AttendanceListScreen} options={{ title: 'Check-in' }} />
    <Stack.Screen name="PhotoViewer" component={PhotoViewerScreen} options={{ title: 'Photo' }} />
  </Stack.Navigator>
);
