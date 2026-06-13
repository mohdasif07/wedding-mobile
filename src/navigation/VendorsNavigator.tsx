import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { VendorListScreen } from '../screens/vendors/VendorListScreen';
import { VendorDetailsScreen } from '../screens/vendors/VendorDetailsScreen';
import { VendorFormScreen } from '../screens/vendors/VendorFormScreen';
import { VendorsStackParamList } from './types';
import { headerStyle } from '../theme';

const Stack = createNativeStackNavigator<VendorsStackParamList>();

export const VendorsNavigator = () => (
  <Stack.Navigator screenOptions={headerStyle}>
    <Stack.Screen name="VendorList" component={VendorListScreen} options={{ title: 'Vendors' }} />
    <Stack.Screen name="VendorDetails" component={VendorDetailsScreen} options={{ title: 'Vendor' }} />
    <Stack.Screen name="VendorForm" component={VendorFormScreen} options={{ title: 'Vendor' }} />
  </Stack.Navigator>
);
