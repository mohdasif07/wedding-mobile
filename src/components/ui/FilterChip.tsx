import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, RADIUS, getPalette } from '../../utils/constants';

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
  colorIndex?: number;
}

export const FilterChip: React.FC<Props> = ({ label, selected, onPress, colorIndex = 0 }) => {
  const palette = getPalette(colorIndex);

  if (selected) {
    return (
      <Pressable onPress={onPress}>
        <LinearGradient
          colors={[...palette.gradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.chip}
        >
          <Text style={styles.labelActive}>{label}</Text>
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={[styles.chip, styles.chipInactive]}>
      <Text style={[styles.label, styles.labelInactive]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    marginRight: 10,
    marginBottom: 10,
  },
  chipInactive: {
    backgroundColor: COLORS.chipBg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  label: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 14,
    textTransform: 'capitalize',
  },
  labelActive: {
    fontFamily: FONTS.bodyBold,
    fontSize: 14,
    color: COLORS.white,
    textTransform: 'capitalize',
  },
  labelInactive: { color: COLORS.textSoft },
});
