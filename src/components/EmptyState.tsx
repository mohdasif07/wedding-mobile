import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PrimaryButton } from './ui/PrimaryButton';
import { COLORS, FONTS, RADIUS } from '../utils/constants';

interface Props {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<Props> = ({ title, description, actionLabel, onAction }) => (
  <View style={styles.container}>
    <LinearGradient
      colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
      style={styles.iconWrap}
    >
      <MaterialCommunityIcons name="flower" size={36} color={COLORS.white} />
    </LinearGradient>
    <Text style={styles.title}>{title}</Text>
    {description ? <Text style={styles.description}>{description}</Text> : null}
    {actionLabel && onAction ? (
      <View style={styles.btnWrap}>
        <PrimaryButton onPress={onAction}>{actionLabel}</PrimaryButton>
      </View>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: FONTS.headingMedium,
    fontSize: 18,
    color: COLORS.text,
    textAlign: 'center',
  },
  description: {
    fontFamily: FONTS.body,
    color: COLORS.muted,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  btnWrap: { marginTop: 16, width: '100%' },
});
