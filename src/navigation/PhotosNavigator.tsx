import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AlbumListScreen } from '../screens/photos/AlbumListScreen';
import { AlbumDetailsScreen } from '../screens/photos/AlbumDetailsScreen';
import { PhotoViewerScreen } from '../screens/photos/PhotoViewerScreen';
import { AlbumFormScreen } from '../screens/photos/AlbumFormScreen';
import { PhotoUploadScreen } from '../screens/photos/PhotoUploadScreen';
import { PhotosStackParamList } from './types';
import { headerStyle } from '../theme';

const Stack = createNativeStackNavigator<PhotosStackParamList>();

export const PhotosNavigator = () => (
  <Stack.Navigator screenOptions={headerStyle}>
    <Stack.Screen name="AlbumList" component={AlbumListScreen} options={{ title: 'Albums' }} />
    <Stack.Screen name="AlbumDetails" component={AlbumDetailsScreen} options={{ title: 'Album' }} />
    <Stack.Screen name="PhotoViewer" component={PhotoViewerScreen} options={{ title: 'Photo' }} />
    <Stack.Screen name="AlbumForm" component={AlbumFormScreen} options={{ title: 'Album' }} />
    <Stack.Screen name="PhotoUpload" component={PhotoUploadScreen} options={{ title: 'Upload' }} />
  </Stack.Navigator>
);
