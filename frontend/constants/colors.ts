/**
 * Color palette for Syntheo app
 *
 * Usage: import { Colors } from '@/constants';
 */

// Base palette - raw color values
const palette = {
  // Blues
  blue500: '#007AFF',

  // Purples
  purple500: '#5B47FB',

  // Greens
  green500: '#10B981',
  green600: '#34C759',
  green700: '#00A86B',

  // Reds
  red100: '#FEE2E2',
  red200: '#FCA5A5',
  red400: '#EF4444',
  red500: '#DC2626',

  // Oranges
  orange100: '#FFF4E6',
  orange400: '#F97316',
  orange500: '#FF9500',
  orange600: '#D97706',
  orange700: '#CA8A04',
  yellow100: '#FFF9E6',

  // Neutrals
  black: '#000000',
  white: '#FFFFFF',
  gray900: '#1F2937',
  gray800: '#374151',
  gray700: '#4B5563',
  gray600: '#6B7280',
  gray500: '#666666',
  gray400: '#999999',
  gray300: '#cccccc',
  gray200: '#D1D5DB',
  gray150: '#E5E7EB',
  gray100: '#e0e0e0',
  gray75: '#f0f0f0',
  gray50: '#F5F5F5',
  gray25: '#F9FAFB',

  // Special
  blueLight: '#f5f9ff',
  purpleLight: '#F5F5FF',
} as const;

// Semantic colors - use these in components
export const Colors = {
  // Brand
  primary: palette.blue500,
  secondary: palette.purple500,

  // Status
  success: palette.green500,
  successAlt: palette.green600,
  error: palette.red400,
  errorDark: palette.red500,
  warning: palette.orange400,
  warningAlt: palette.orange500,

  // Text
  textPrimary: palette.black,
  textSecondary: palette.gray500,
  textTertiary: palette.gray600,
  textMuted: palette.gray400,
  textDisabled: palette.gray300,
  textOnPrimary: palette.white,
  textBody: palette.gray800,

  // Backgrounds
  background: palette.white,
  backgroundSecondary: palette.gray50,
  backgroundTertiary: palette.gray25,
  backgroundMuted: palette.gray75,

  // Borders
  border: palette.gray100,
  borderLight: palette.gray150,
  borderMedium: palette.gray200,
  divider: palette.gray75,

  // Interactive states
  selectedBackground: palette.blueLight,
  selectedBackgroundPurple: palette.purpleLight,

  // Urgency (for meldingen/notes)
  urgencyHigh: palette.red400,
  urgencyHighBg: palette.orange100,
  urgencyMedium: palette.orange400,
  urgencyMediumBg: palette.yellow100,
  urgencyLow: palette.gray600,
  urgencyLowBg: palette.gray75,

  // Alert/Allergy backgrounds
  alertBackground: palette.red100,
  alertBorder: palette.red200,
  alertText: palette.red500,

  // Navigation
  navActive: palette.blue500,
  navInactive: palette.gray500,
  navAccent: palette.green700,

  // Icons
  iconDefault: palette.gray500,
  iconMuted: palette.gray300,
  iconPrimary: palette.blue500,

  // Buttons
  buttonDisabled: palette.gray300,

  // Tab bar
  tabActive: palette.blue500,
  tabInactive: palette.gray500,
} as const;

export type ColorKey = keyof typeof Colors;
