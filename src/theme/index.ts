import { MD3LightTheme } from 'react-native-paper';
import { COLORS, FONTS } from '../utils/constants';

export const appTheme = {
  ...MD3LightTheme,
  roundness: 16,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
    onPrimary: COLORS.white,
    primaryContainer: COLORS.primaryLight,
    secondary: COLORS.secondary,
    background: COLORS.background,
    surface: COLORS.surface,
    surfaceVariant: COLORS.cream,
    onSurface: COLORS.text,
    onSurfaceVariant: COLORS.muted,
    outline: COLORS.border,
    error: COLORS.error,
  },
  fonts: {
    ...MD3LightTheme.fonts,
    displayLarge: { ...MD3LightTheme.fonts.displayLarge, fontFamily: FONTS.heading },
    displayMedium: { ...MD3LightTheme.fonts.displayMedium, fontFamily: FONTS.heading },
    displaySmall: { ...MD3LightTheme.fonts.displaySmall, fontFamily: FONTS.heading },
    headlineLarge: { ...MD3LightTheme.fonts.headlineLarge, fontFamily: FONTS.heading },
    headlineMedium: { ...MD3LightTheme.fonts.headlineMedium, fontFamily: FONTS.headingMedium },
    headlineSmall: { ...MD3LightTheme.fonts.headlineSmall, fontFamily: FONTS.headingMedium },
    titleLarge: { ...MD3LightTheme.fonts.titleLarge, fontFamily: FONTS.bodyBold },
    titleMedium: { ...MD3LightTheme.fonts.titleMedium, fontFamily: FONTS.bodyBold },
    titleSmall: { ...MD3LightTheme.fonts.titleSmall, fontFamily: FONTS.bodyMedium },
    bodyLarge: { ...MD3LightTheme.fonts.bodyLarge, fontFamily: FONTS.body },
    bodyMedium: { ...MD3LightTheme.fonts.bodyMedium, fontFamily: FONTS.body },
    bodySmall: { ...MD3LightTheme.fonts.bodySmall, fontFamily: FONTS.body },
    labelLarge: { ...MD3LightTheme.fonts.labelLarge, fontFamily: FONTS.bodyMedium },
    labelMedium: { ...MD3LightTheme.fonts.labelMedium, fontFamily: FONTS.bodyMedium },
    labelSmall: { ...MD3LightTheme.fonts.labelSmall, fontFamily: FONTS.body },
  },
};

export const headerStyle = {
  headerStyle: { backgroundColor: COLORS.background },
  headerTintColor: COLORS.text,
  headerTitleStyle: { fontFamily: FONTS.headingMedium, color: COLORS.text },
  headerShadowVisible: false,
};
