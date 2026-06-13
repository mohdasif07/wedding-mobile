import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FONTS, RADIUS, SHADOW, getPalette } from '../utils/constants';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  colorIndex?: number;
}

export const StatCard: React.FC<Props> = ({ title, value, subtitle, icon, colorIndex = 0 }) => {
  const palette = getPalette(colorIndex);

  return (
    <LinearGradient
      colors={[...palette.gradient]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      {icon ? (
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name={icon} size={18} color={palette.main} />
        </View>
      ) : null}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '46%',
    marginBottom: 12,
    borderRadius: RADIUS.lg,
    padding: 16,
    ...SHADOW.card,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },
  value: {
    fontFamily: FONTS.heading,
    fontSize: 24,
    color: '#FFFFFF',
    marginTop: 4,
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
});
