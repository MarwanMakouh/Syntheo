import { createConfig } from '@gluestack-style/react';

// Custom color palette matching the original theme
const customColors = {
  // Light mode colors
  textLight: '#11181C',
  backgroundLight: '#FFFFFF',
  primaryLight: '#0a7ea4',
  iconLight: '#687076',
  tabIconDefaultLight: '#687076',
  tabIconSelectedLight: '#0a7ea4',

  // Dark mode colors
  textDark: '#ECEDEE',
  backgroundDark: '#151718',
  primaryDark: '#FFFFFF',
  iconDark: '#9BA1A6',
  tabIconDefaultDark: '#9BA1A6',
  tabIconSelectedDark: '#FFFFFF',

  // Additional semantic colors
  borderLight: '#E5E7EB',
  borderDark: '#374151',
};

export const gluestackUIConfig = createConfig({
  aliases: {
    bg: 'backgroundColor',
    bgColor: 'backgroundColor',
    h: 'height',
    w: 'width',
    p: 'padding',
    px: 'paddingHorizontal',
    py: 'paddingVertical',
    pt: 'paddingTop',
    pb: 'paddingBottom',
    pl: 'paddingLeft',
    pr: 'paddingRight',
    m: 'margin',
    mx: 'marginHorizontal',
    my: 'marginVertical',
    mt: 'marginTop',
    mb: 'marginBottom',
    ml: 'marginLeft',
    mr: 'marginRight',
  },
  tokens: {
    colors: customColors,
    space: {
      '0': 0,
      '1': 4,
      '2': 8,
      '3': 12,
      '4': 16,
      '5': 20,
      '6': 24,
      '7': 28,
      '8': 32,
      '9': 36,
      '10': 40,
      '11': 44,
      '12': 48,
    },
    borderWidths: {
      '0': 0,
      '1': 1,
      '2': 2,
      '4': 4,
      '8': 8,
    },
    radii: {
      'none': 0,
      'xs': 4,
      'sm': 6,
      'md': 8,
      'lg': 12,
      'xl': 16,
      '2xl': 24,
      'full': 9999,
    },
    fontSizes: {
      '2xs': 10,
      'xs': 12,
      'sm': 14,
      'md': 16,
      'lg': 18,
      'xl': 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
      '6xl': 60,
    },
    fontWeights: {
      'hairline': '100',
      'thin': '200',
      'light': '300',
      'normal': '400',
      'medium': '500',
      'semibold': '600',
      'bold': '700',
      'extrabold': '800',
      'black': '900',
    },
  },
  globalStyle: {
    variants: {
      hardShadow: {
        '1': {
          shadowColor: '$backgroundLight900',
          shadowOffset: {
            width: -2,
            height: 2,
          },
          shadowRadius: 8,
          shadowOpacity: 0.5,
          elevation: 10,
        },
      },
      softShadow: {
        '1': {
          shadowColor: '$backgroundLight900',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowRadius: 10,
          shadowOpacity: 0.1,
          elevation: 5,
        },
      },
    },
  },
} as const);

type Config = typeof gluestackUIConfig;

export type { Config };
