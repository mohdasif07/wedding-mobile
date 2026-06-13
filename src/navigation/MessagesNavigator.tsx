import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MessageListScreen } from '../screens/messages/MessageListScreen';
import { ComposeMessageScreen } from '../screens/messages/ComposeMessageScreen';
import { MessageDetailsScreen } from '../screens/messages/MessageDetailsScreen';
import { MessagesStackParamList } from './types';
import { headerStyle } from '../theme';

const Stack = createNativeStackNavigator<MessagesStackParamList>();

export const MessagesNavigator = () => (
  <Stack.Navigator screenOptions={headerStyle}>
    <Stack.Screen name="MessageList" component={MessageListScreen} options={{ title: 'Messages' }} />
    <Stack.Screen name="ComposeMessage" component={ComposeMessageScreen} options={{ title: 'Compose' }} />
    <Stack.Screen name="MessageDetails" component={MessageDetailsScreen} options={{ title: 'Message' }} />
  </Stack.Navigator>
);
