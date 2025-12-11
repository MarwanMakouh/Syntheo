import { Image } from 'expo-image';
import { styled } from '@gluestack-style/react';
import { View, Pressable, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColorScheme } from '@/hooks/use-color-scheme';

const StyledView = styled(View, {});
const StyledPressable = styled(Pressable, {});
const StyledText = styled(Text, {});

export function NavigationBar() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleNotifications = () => {
    // TODO: Handle notifications when backend is ready
    console.log('Notifications pressed');
  };

  const handleLogout = () => {
    // TODO: Handle logout when auth is ready
    console.log('Logout pressed');
  };

  const textColor = isDark ? '#ECEDEE' : '#11181C';
  const backgroundColor = isDark ? '#151718' : '#FFFFFF';
  const borderColor = isDark ? '#374151' : '#E5E7EB';

  return (
    <StyledView
      sx={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: backgroundColor,
        borderBottomWidth: 1,
        borderBottomColor: borderColor,
      }}
    >
      {/* Logo */}
      <Image
        source={require('@/assets/images/syntheo.png')}
        style={{ width: 120, height: 40 }}
        contentFit="contain"
      />

      {/* Right side items */}
      <StyledView
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
        }}
      >
        {/* Notifications icon */}
        <StyledPressable
          onPress={handleNotifications}
          style={{
            padding: 8,
          }}
        >
          <MaterialIcons
            name="notifications"
            size={24}
            color={isDark ? '#9BA1A6' : '#687076'}
          />
        </StyledPressable>

        {/* User info */}
        <StyledView
          sx={{
            alignItems: 'flex-end',
          }}
        >
          <StyledText
            sx={{
              fontSize: 14,
              lineHeight: 18,
              color: textColor,
              fontWeight: '600',
            }}
          >
            Jan Janssen
          </StyledText>
          <StyledText
            sx={{
              fontSize: 12,
              lineHeight: 16,
              color: textColor,
              opacity: 0.6,
            }}
          >
            Administrator
          </StyledText>
        </StyledView>

        {/* Logout icon */}
        <StyledPressable
          onPress={handleLogout}
          style={{
            padding: 8,
          }}
        >
          <MaterialIcons
            name="logout"
            size={24}
            color={isDark ? '#9BA1A6' : '#687076'}
          />
        </StyledPressable>
      </StyledView>
    </StyledView>
  );
}
