/**
 * Spacing scale for consistent layout
 *
 * Usage: import { Spacing, Layout } from '@/constants';
 */

export const Spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  '4xl': 28,
  '5xl': 32,
  '6xl': 40,
  '7xl': 50,
  '8xl': 60,
  '9xl': 64,
} as const;

// Common layout values
export const Layout = {
  // Screen padding
  screenPadding: Spacing.xl, // 16
  screenPaddingLarge: Spacing['2xl'], // 20

  // Card padding
  cardPadding: Spacing.xl, // 16

  // Component gaps
  gapSmall: Spacing.sm, // 6
  gapMedium: Spacing.md, // 8
  gapLarge: Spacing.lg, // 12
  gapXLarge: Spacing.xl, // 16

  // Margins between components
  componentMargin: Spacing.lg, // 12
  sectionMargin: Spacing['3xl'], // 24

  // Web max width
  webMaxWidth: 600,
  webMaxWidthLarge: 800,
} as const;

export type SpacingKey = keyof typeof Spacing;
export type LayoutKey = keyof typeof Layout;
