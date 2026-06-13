import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { TextInput } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { ErrorMessage } from '../../components/ErrorMessage';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { COLORS, FONTS, RADIUS } from '../../utils/constants';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { register } = useAuth();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleRegister = async () => {
    if (form.password !== form.password_confirmation) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await register(form);
    } catch {
      setError('Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.subtitle}>Join and start planning your perfect celebration</Text>
        </LinearGradient>

        <TextInput label="First Name" value={form.first_name} onChangeText={(v) => update('first_name', v)} mode="outlined" style={styles.input} outlineStyle={styles.inputOutline} />
        <TextInput label="Last Name" value={form.last_name} onChangeText={(v) => update('last_name', v)} mode="outlined" style={styles.input} outlineStyle={styles.inputOutline} />
        <TextInput label="Email" value={form.email} onChangeText={(v) => update('email', v)} mode="outlined" autoCapitalize="none" keyboardType="email-address" style={styles.input} outlineStyle={styles.inputOutline} />
        <TextInput label="Phone" value={form.phone} onChangeText={(v) => update('phone', v)} mode="outlined" keyboardType="phone-pad" style={styles.input} outlineStyle={styles.inputOutline} />
        <TextInput label="Password" value={form.password} onChangeText={(v) => update('password', v)} mode="outlined" secureTextEntry style={styles.input} outlineStyle={styles.inputOutline} />
        <TextInput label="Confirm Password" value={form.password_confirmation} onChangeText={(v) => update('password_confirmation', v)} mode="outlined" secureTextEntry style={styles.input} outlineStyle={styles.inputOutline} />

        <ErrorMessage message={error} />

        <PrimaryButton onPress={handleRegister} loading={loading}>
          Register
        </PrimaryButton>
        <PrimaryButton mode="text" onPress={() => navigation.goBack()}>
          Back to Login
        </PrimaryButton>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 24 },
  header: {
    borderRadius: RADIUS.xl,
    padding: 22,
    marginBottom: 20,
  },
  title: {
    fontFamily: FONTS.heading,
    fontSize: 26,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FONTS.body,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
  },
  input: { marginBottom: 12, backgroundColor: COLORS.surfaceSoft },
  inputOutline: { borderRadius: RADIUS.md },
});
