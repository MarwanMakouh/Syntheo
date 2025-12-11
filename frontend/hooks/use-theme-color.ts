/**
 * @deprecated This hook is deprecated. The app now uses Gluestack UI for theming.
 * Use the useColorScheme hook directly and Gluestack styled components instead.
 *
 * Migration example:
 * Before: const color = useThemeColor({ light: '#fff', dark: '#000' }, 'text');
 * After:  const colorScheme = useColorScheme();
 *         const isDark = colorScheme === 'dark';
 *         const color = isDark ? '#000' : '#fff';
 *
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme } from '@/hooks/use-color-scheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: string
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }

  // Return sensible defaults since Colors is deprecated
  const defaults: Record<string, { light: string; dark: string }> = {
    text: { light: '#11181C', dark: '#ECEDEE' },
    background: { light: '#fff', dark: '#151718' },
    tint: { light: '#0a7ea4', dark: '#fff' },
    icon: { light: '#687076', dark: '#9BA1A6' },
  };

  return defaults[colorName]?.[theme] || '#000000';
}
