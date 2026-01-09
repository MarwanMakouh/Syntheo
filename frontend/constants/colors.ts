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
  green50: '#F0FDF4',
  green100: '#D1FAE5',
  green500: '#10B981',
  green600: '#34C759',
  green700: '#059669',

  // Reds
  red100: '#FEE2E2',
  red200: '#FCA5A5',
  red400: '#EF4444',
  red500: '#DC2626',

  // Oranges & Yellows
  orange100: '#FFF4E6',
  orange200: '#FFF7ED',
  orange400: '#F97316',
  orange500: '#FF9500',
  orange600: '#D97706',
  orange700: '#CA8A04',
  yellow50: '#FFFBEB',
  yellow100: '#FFF9E6',
  yellow300: '#FCD34D',

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
  gray250: '#E5E5E5',
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
  primary: palette.green600,
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

  // Backgrounds (use white app-wide instead of gray variants)
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
  selectedBackground: palette.green50,
  selectedBackgroundPurple: palette.purpleLight,

  // Urgency (for meldingen/notes)
  urgencyHigh: palette.red400,
  urgencyHighBg: palette.orange100,
  urgencyMedium: palette.orange400,
  urgencyMediumText: palette.orange700,
  urgencyMediumBg: palette.yellow100,
  urgencyLow: palette.gray600,
  urgencyLowBg: palette.gray75,

  // Dashboard stats
  statsUrgent: palette.red500,
  statsAttention: palette.orange600,
  statsStable: palette.green500,
  statsCompliance: palette.green500,

  // Alert/Allergy backgrounds
  alertBackground: palette.red100,
  alertBorder: palette.red200,
  alertText: palette.red500,

  // Navigation
  navActive: palette.green600,
  navInactive: palette.gray500,
  navAccent: palette.green700,

  // Icons
  iconDefault: palette.gray500,
  iconMuted: palette.gray300,
  iconPrimary: palette.green600,

  // Buttons
  buttonDisabled: palette.gray300,
  buttonSecondary: palette.gray250,
  buttonSecondaryText: palette.gray500,

  // Success variants (for forms/modals)
  successBackground: palette.green50,
  successText: palette.green700,

  // Warning/Info variants (for forms)
  warningBackground: palette.yellow50,
  warningBorder: palette.yellow300,
  warningMediumBackground: palette.orange200,
  infoBackground: palette.green100,

  // Tab bar
  tabActive: palette.green600,
  tabInactive: palette.gray500,

  // Admin-specific
  adminSidebar: '#1E4D2B',
  grayMedium: '#95A5A6',

  // Additional status light variants
  successLight: '#D5F5E3',
  dangerLight: '#FADBD8',
  warningLight: '#FEF5E7',
} as const;

export type ColorKey = keyof typeof Colors;
