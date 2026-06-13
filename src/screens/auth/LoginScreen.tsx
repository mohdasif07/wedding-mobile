import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Checkbox, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { ErrorMessage } from '../../components/ErrorMessage';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { API_BASE_URL, COLORS, FONTS, PALETTE, RADIUS } from '../../utils/constants';
import { getApiErrorMessage } from '../../utils/apiError';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const BUBBLES = [
  { size: 56, top: 20, left: 24, color: PALETTE[0].main },
  { size: 36, top: 40, right: 30, color: PALETTE[1].main },
  { size: 28, bottom: 30, left: 40, color: PALETTE[2].main },
  { size: 44, bottom: 24, right: 36, color: PALETTE[3].main },
];

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await login(email.trim(), password, remember);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          {BUBBLES.map((b, i) => (
            <View
              key={i}
              style={[
                styles.bubble,
                {
                  width: b.size,
                  height: b.size,
                  borderRadius: b.size / 2,
                  backgroundColor: `${b.color}55`,
                  top: b.top,
                  left: 'left' in b ? b.left : undefined,
                  right: 'right' in b ? b.right : undefined,
                  bottom: 'bottom' in b ? b.bottom : undefined,
                },
              ]}
            />
          ))}
          <View style={styles.iconRing}>
            <MaterialCommunityIcons name="heart" size={40} color={COLORS.primary} />
            <MaterialCommunityIcons name="ring" size={26} color={PALETTE[1].main} style={styles.ringIcon} />
          </View>
        </LinearGradient>

        <Text style={styles.title}>Plan Your Wedding Events Easily</Text>
        <Text style={styles.subtitle}>
          Manage guests, vendors, expenses and memories — all in one beautiful place.
        </Text>
        {__DEV__ ? <Text style={styles.apiHint}>API: {API_BASE_URL}</Text> : null}

        <LinearGradient
          colors={['#FFFFFF', PALETTE[0].light, PALETTE[1].light]}
          style={styles.formCard}
        >
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            outlineStyle={styles.inputOutline}
            activeOutlineColor={COLORS.primary}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
            outlineStyle={styles.inputOutline}
            activeOutlineColor={COLORS.secondary}
          />

          <View style={styles.rememberRow}>
            <Checkbox
              status={remember ? 'checked' : 'unchecked'}
              onPress={() => setRemember(!remember)}
              color={COLORS.primary}
            />
            <Text style={styles.rememberText}>Remember Me</Text>
          </View>

          <ErrorMessage message={error} />

          <PrimaryButton onPress={handleLogin} loading={loading}>
            Get Started
          </PrimaryButton>

          <PrimaryButton mode="text" onPress={() => navigation.navigate('Register')}>
            Create an account
          </PrimaryButton>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 24, flexGrow: 1, justifyContent: 'center' },
  hero: {
    height: 200,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    overflow: 'hidden',
  },
  bubble: { position: 'absolute', opacity: 0.7 },
  iconRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  ringIcon: { position: 'absolute', bottom: 16, right: 12 },
  title: {
    fontFamily: FONTS.heading,
    fontSize: 28,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.muted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  apiHint: {
    fontFamily: FONTS.body,
    color: COLORS.muted,
    textAlign: 'center',
    fontSize: 11,
    marginBottom: 16,
  },
  formCard: {
    borderRadius: RADIUS.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 12,
  },
  input: { marginBottom: 12, backgroundColor: COLORS.white },
  inputOutline: { borderRadius: RADIUS.md },
  rememberRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  rememberText: { fontFamily: FONTS.body, color: COLORS.textSoft },
});
