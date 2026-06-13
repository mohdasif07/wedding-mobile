import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator } from 'react-native-paper';
import { COLORS, FONTS, RADIUS } from '../../utils/constants';

interface Props {
  onPress: () => void;
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  mode?: 'contained' | 'outlined' | 'text';
}

export const PrimaryButton: React.FC<Props> = ({
  onPress,
  children,
  loading,
  disabled,
  mode = 'contained',
}) => {
  if (mode === 'text') {
    return (
      <Pressable onPress={onPress} disabled={disabled || loading} style={styles.textBtn}>
        {loading ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : (
          <Text style={styles.textLabel}>{children}</Text>
        )}
      </Pressable>
    );
  }

  if (mode === 'outlined') {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        style={[styles.outlinedBtn, disabled && styles.disabled]}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : (
          <Text style={styles.outlinedLabel}>{children}</Text>
        )}
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} disabled={disabled || loading} style={[disabled && styles.disabled, mode === 'contained' && styles.btnWrap]}>
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBtn}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.containedLabel}>{children}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  gradientBtn: {
    borderRadius: RADIUS.full,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containedLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 16,
    color: COLORS.white,
  },
  outlinedBtn: {
    borderRadius: RADIUS.full,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginTop: 8,
  },
  outlinedLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 16,
    color: COLORS.primary,
  },
  textBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  textLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 15,
    color: COLORS.secondary,
  },
  disabled: { opacity: 0.5 },
  btnWrap: { marginBottom: 8 },
});
