import { styled } from '@gluestack-style/react';
import { View, type ViewProps } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';

const StyledView = styled(View, {});

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Determine background color based on theme
  let backgroundColor;
  if (lightColor || darkColor) {
    backgroundColor = isDark && darkColor ? darkColor : lightColor || darkColor;
  } else {
    backgroundColor = isDark ? '$backgroundDark' : '$backgroundLight';
  }

  return (
    <StyledView
      sx={{
        backgroundColor,
        ...(style as any),
      }}
      {...otherProps}
    />
  );
}
