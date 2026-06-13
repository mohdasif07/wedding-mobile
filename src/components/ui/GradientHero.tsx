import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, RADIUS, SHADOW } from '../../utils/constants';

interface Props {
  label?: string;
  title: string;
  subtitle?: string;
  highlight?: string;
  children?: React.ReactNode;
}

export const GradientHero: React.FC<Props> = ({ label, title, subtitle, highlight, children }) => (
  <LinearGradient
    colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.container}
  >
    {label ? <Text style={styles.label}>{label}</Text> : null}
    <Text style={styles.title}>{title}</Text>
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    {highlight ? <Text style={styles.highlight}>{highlight}</Text> : null}
    {children}
  </LinearGradient>
);

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.xl,
    padding: 22,
    marginBottom: 20,
    ...SHADOW.card,
  },
  label: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  title: {
    fontFamily: FONTS.heading,
    fontSize: 26,
    color: '#FFFFFF',
    lineHeight: 32,
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
  },
  highlight: {
    fontFamily: FONTS.heading,
    fontSize: 36,
    color: '#FFFFFF',
    marginTop: 14,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
