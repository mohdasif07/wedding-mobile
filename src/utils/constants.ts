import Constants from 'expo-constants';
import { Platform } from 'react-native';

const API_PORT = 3000;
const API_PATH = '/api/v1';

/** Optional override in app.json → extra.apiUrl */
const CONFIGURED_URL = Constants.expoConfig?.extra?.apiUrl as string | undefined;

function getExpoLanHost(): string | null {
  const debuggerHost =
    Constants.expoGoConfig?.debuggerHost ??
    Constants.manifest2?.extra?.expoGo?.debuggerHost;

  if (!debuggerHost) return null;

  const host = debuggerHost.split(':')[0];
  if (Platform.OS === 'android' && (host === 'localhost' || host === '127.0.0.1')) {
    return '10.0.2.2';
  }
  return host;
}

export const API_BASE_URL = (() => {
  if (Platform.OS === 'web') {
    return `http://localhost:${API_PORT}${API_PATH}`;
  }

  const expoHost = getExpoLanHost();
  if (expoHost) {
    return `http://${expoHost}:${API_PORT}${API_PATH}`;
  }

  if (CONFIGURED_URL) {
    return CONFIGURED_URL;
  }

  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${API_PORT}${API_PATH}`;
  }

  return `http://localhost:${API_PORT}${API_PATH}`;
})();

if (__DEV__) {
  console.log('[API] Backend URL:', API_BASE_URL);
}

export const COLORS = {
  primary: '#FF6B9D',
  primaryDark: '#E8437A',
  primaryLight: '#FFE4EF',
  secondary: '#A855F7',
  accent: '#1A1A1A',
  background: '#FFF5F8',
  cream: '#FEF3C7',
  surface: '#FFFFFF',
  surfaceSoft: '#FFF9FB',
  text: '#1C1C1E',
  textSoft: '#3A3A3C',
  muted: '#8E8E93',
  border: '#F0E6DE',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  white: '#FFFFFF',
  gradientStart: '#FF6B9D',
  gradientMid: '#A855F7',
  gradientEnd: '#FBBF24',
  chipBg: '#FFFFFF',
  shadow: 'rgba(255, 107, 157, 0.2)',
};

/** Vibrant accent colors for cards, tabs, chips */
export const PALETTE = [
  { main: '#FF6B9D', light: '#FFE4EF', dark: '#E8437A', gradient: ['#FF6B9D', '#FF8FB8'] as const },
  { main: '#A855F7', light: '#F3E8FF', dark: '#7C3AED', gradient: ['#A855F7', '#C084FC'] as const },
  { main: '#F59E0B', light: '#FEF3C7', dark: '#D97706', gradient: ['#F59E0B', '#FBBF24'] as const },
  { main: '#14B8A6', light: '#CCFBF1', dark: '#0D9488', gradient: ['#14B8A6', '#2DD4BF'] as const },
  { main: '#3B82F6', light: '#DBEAFE', dark: '#2563EB', gradient: ['#3B82F6', '#60A5FA'] as const },
  { main: '#EC4899', light: '#FCE7F3', dark: '#DB2777', gradient: ['#EC4899', '#F472B6'] as const },
] as const;

export const TAB_COLORS: Record<string, string> = {
  Dashboard: '#FF6B9D',
  Events: '#A855F7',
  Messages: '#3B82F6',
  Vendors: '#F59E0B',
  Expenses: '#14B8A6',
  Photos: '#EC4899',
};

export const getPalette = (index: number) => PALETTE[index % PALETTE.length];

export const FONTS = {
  heading: 'PlayfairDisplay_700Bold',
  headingMedium: 'PlayfairDisplay_600SemiBold',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodyBold: 'DMSans_700Bold',
};

export const RADIUS = {
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  full: 999,
};

export const SHADOW = {
  card: {
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
};

export const RSVP_STATUSES = ['pending', 'accepted', 'declined', 'maybe'] as const;
export const GUEST_SIDES = ['bride', 'groom'] as const;
export const EXPENSE_CATEGORIES = [
  'venue',
  'catering',
  'decoration',
  'photography',
  'jewelry',
  'travel',
  'miscellaneous',
] as const;
