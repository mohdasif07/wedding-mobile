import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../utils/constants';

interface Props {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
  color?: string;
}

export const InfoRow: React.FC<Props> = ({ icon, label, value, color = COLORS.primary }) => (
  <View style={styles.row}>
    <View style={[styles.icon, { backgroundColor: `${color}22` }]}>
      <MaterialCommunityIcons name={icon} size={18} color={color} />
    </View>
    <View style={styles.content}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: { flex: 1 },
  label: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    color: COLORS.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.text,
    marginTop: 2,
  },
});
