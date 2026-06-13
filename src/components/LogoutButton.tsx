import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { PrimaryButton } from './ui/PrimaryButton';

export const LogoutButton: React.FC = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      queryClient.clear();
    } catch {
      queryClient.clear();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.buttonWrap}>
      <PrimaryButton mode="outlined" onPress={handleLogout} loading={loading}>
        Logout
      </PrimaryButton>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonWrap: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
  },
});
