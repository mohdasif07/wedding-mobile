import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { COLORS } from '../utils/constants';

export const ErrorMessage: React.FC<{ message?: string }> = ({ message }) =>
  message ? <Text style={styles.error}>{message}</Text> : null;

const styles = StyleSheet.create({
  error: { color: COLORS.error, marginBottom: 12 },
});
