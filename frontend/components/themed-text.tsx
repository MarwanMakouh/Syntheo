import { styled } from '@gluestack-style/react';
import { Text as RNText, type TextProps } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';

const StyledText = styled(RNText, {});

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Determine color based on type and theme
  let color = lightColor || darkColor;
  if (!color) {
    color = isDark ? '$textDark' : '$textLight';
  } else {
    color = isDark && darkColor ? darkColor : lightColor || color;
  }

  // Map type to styling props
  const getTypeStyles = () => {
    switch (type) {
      case 'title':
        return {
          fontSize: '$4xl',
          fontWeight: '$bold',
          lineHeight: 32,
        };
      case 'subtitle':
        return {
          fontSize: '$xl',
          fontWeight: '$bold',
        };
      case 'defaultSemiBold':
        return {
          fontSize: '$md',
          fontWeight: '$semibold',
          lineHeight: 24,
        };
      case 'link':
        return {
          fontSize: '$md',
          lineHeight: 30,
          color: isDark ? '$primaryDark' : '$primaryLight',
        };
      case 'default':
      default:
        return {
          fontSize: '$md',
          lineHeight: 24,
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <StyledText
      sx={{
        color: typeStyles.color || color,
        fontSize: typeStyles.fontSize,
        fontWeight: typeStyles.fontWeight,
        lineHeight: typeStyles.lineHeight,
        ...(style as any),
      }}
      {...rest}
    />
  );
}
