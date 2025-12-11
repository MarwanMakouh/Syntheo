import { PropsWithChildren, useState } from 'react';
import { styled } from '@gluestack-style/react';
import { Pressable } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

const StyledPressable = styled(Pressable, {});

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? 'light';
  const iconColor = theme === 'dark' ? '#9BA1A6' : '#687076';

  return (
    <ThemedView>
      <StyledPressable
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        }}
        onPress={() => setIsOpen((value) => !value)}
      >
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color={iconColor}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />

        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </StyledPressable>
      {isOpen && (
        <ThemedView
          style={{
            marginTop: 6,
            marginLeft: 24,
          }}
        >
          {children}
        </ThemedView>
      )}
    </ThemedView>
  );
}
