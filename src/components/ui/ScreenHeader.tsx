import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, RADIUS } from '../../utils/constants';

interface Props {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
}

export const ScreenHeader: React.FC<Props> = ({ title, subtitle, style }) => (
  <LinearGradient
    colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={[styles.header, style]}
  >
    <Text style={styles.title}>{title}</Text>
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
  </LinearGradient>
);

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
    borderBottomLeftRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.lg,
  },
  title: {
    fontFamily: FONTS.heading,
    fontSize: 24,
    color: COLORS.white,
    lineHeight: 32,
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
});
