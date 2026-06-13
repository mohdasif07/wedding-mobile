import React from 'react';
import { StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS } from '../utils/constants';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<Props> = ({
  value,
  onChange,
  placeholder = 'Search...',
}) => (
  <LinearGradient
    colors={[COLORS.primaryLight, '#F3E8FF', '#FEF3C7']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.wrapper}
  >
    <Searchbar
      placeholder={placeholder}
      value={value}
      onChangeText={onChange}
      style={styles.search}
      inputStyle={styles.input}
      iconColor={COLORS.primary}
      placeholderTextColor={COLORS.muted}
      elevation={0}
    />
  </LinearGradient>
);

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: RADIUS.full,
    padding: 2,
    marginBottom: 14,
  },
  search: {
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
  },
  input: { fontSize: 15 },
});
