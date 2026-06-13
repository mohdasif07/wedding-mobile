import React, { useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { TextInput } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/auth';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { RolePermissionsCard } from '../../components/RolePermissionsCard';
import { LogoutButton } from '../../components/LogoutButton';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { getRolePermissions } from '../../utils/permissions';
import { sharedStyles } from '../../theme/sharedStyles';
import { DashboardStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<DashboardStackParamList, 'Profile'>;

export const ProfileScreen: React.FC<Props> = () => {
  const { user, role } = useAuth();
  const [form, setForm] = useState({
    first_name: user?.first_name ?? '',
    last_name: user?.last_name ?? '',
    phone: user?.phone ?? '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      const { data } = await authApi.updateProfile(form);
      setMessage('Profile updated!');
      setForm({
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone ?? '',
      });
    } catch {
      setMessage('Could not update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.scrollContent}>
      <ScreenHeader
        title="My Profile"
        subtitle={role ? getRolePermissions(role).label : 'Account'}
      />

      <TextInput
        label="First Name"
        value={form.first_name}
        onChangeText={(v) => setForm({ ...form, first_name: v })}
        mode="outlined"
        style={sharedStyles.input}
        outlineStyle={sharedStyles.inputOutline}
      />
      <TextInput
        label="Last Name"
        value={form.last_name}
        onChangeText={(v) => setForm({ ...form, last_name: v })}
        mode="outlined"
        style={sharedStyles.input}
        outlineStyle={sharedStyles.inputOutline}
      />
      <TextInput
        label="Email"
        value={user?.email ?? ''}
        mode="outlined"
        disabled
        style={sharedStyles.input}
        outlineStyle={sharedStyles.inputOutline}
      />
      <TextInput
        label="Phone"
        value={form.phone}
        onChangeText={(v) => setForm({ ...form, phone: v })}
        mode="outlined"
        style={sharedStyles.input}
        outlineStyle={sharedStyles.inputOutline}
      />

      {message ? <Text style={sharedStyles.hint}>{message}</Text> : null}

      <PrimaryButton onPress={handleSave} loading={loading}>
        Save Profile
      </PrimaryButton>

      {role ? <RolePermissionsCard role={role} /> : null}
      <LogoutButton />
    </ScrollView>
  );
};