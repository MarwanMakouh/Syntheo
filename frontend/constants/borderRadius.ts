/**
 * Border radius scale
 *
 * Usage: import { BorderRadius } from '@/constants';
 */

export const BorderRadius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 20,
  '2xl': 30,
  full: 9999, // For pills/circles
} as const;

// Helper for circular avatars
export const getCircleRadius = (size: number) => size / 2;

export type BorderRadiusKey = keyof typeof BorderRadius;
