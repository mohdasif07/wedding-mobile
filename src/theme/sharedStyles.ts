import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS } from '../utils/constants';

export const sharedStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  body: { flex: 1, padding: 20 },
  scrollContent: { padding: 20, paddingBottom: 32 },
  input: { marginBottom: 12, backgroundColor: COLORS.surfaceSoft },
  inputOutline: { borderRadius: RADIUS.md },
  sectionTitle: {
    fontFamily: FONTS.headingMedium,
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 12,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    borderRadius: RADIUS.full,
  },
  hint: {
    fontFamily: FONTS.body,
    color: COLORS.muted,
    marginBottom: 12,
    lineHeight: 20,
  },
  error: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.error,
    marginBottom: 12,
  },
});
