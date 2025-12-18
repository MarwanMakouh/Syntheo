/**
 * Typography constants for consistent text styling
 *
 * Usage: import { Typography, FontSize, FontWeight } from '@/constants';
 */

export const FontSize = {
  xs: 12,
  sm: 13,
  md: 14,
  lg: 16,
  xl: 18,
  '2xl': 24,
  '3xl': 28,
  '4xl': 36,
} as const;

export const FontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const LineHeight = {
  tight: 16,
  normal: 18,
  relaxed: 20,
  loose: 24,
};

// Pre-composed text styles
export const Typography = {
  // Headings
  h1: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
  },
  h2: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
  },
  h3: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },

  // Body text
  bodyLarge: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.normal,
  },
  body: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.normal,
  },
  bodySmall: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.normal,
  },

  // Labels
  label: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  labelSmall: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },

  // Captions
  caption: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.normal,
  },

  // Buttons
  buttonLarge: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
  },
  buttonMedium: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  buttonSmall: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
} as const;

export type FontSizeKey = keyof typeof FontSize;
export type FontWeightKey = keyof typeof FontWeight;
export type TypographyKey = keyof typeof Typography;
