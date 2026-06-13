import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { COLORS, RADIUS, SHADOW, getPalette } from '../../utils/constants';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  colorIndex?: number;
}

export const AppCard: React.FC<Props> = ({ children, onPress, style, colorIndex = 0 }) => {
  const palette = getPalette(colorIndex);

  const content = (
    <View style={[styles.card, style]}>
      <View style={[styles.accent, { backgroundColor: palette.main }]} />
      <View style={styles.inner}>{children}</View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
        {content}
      </Pressable>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    flexDirection: 'row',
    ...SHADOW.soft,
  },
  accent: {
    width: 5,
  },
  inner: {
    flex: 1,
    padding: 16,
  },
  pressed: { opacity: 0.92 },
});
