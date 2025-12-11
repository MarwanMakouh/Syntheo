import { Image } from 'expo-image';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export function NavigationBar() {
  const colorScheme = useColorScheme();

  const handleNotifications = () => {
    // TODO: Handle notifications when backend is ready
    console.log('Notifications pressed');
  };

  const handleLogout = () => {
    // TODO: Handle logout when auth is ready
    console.log('Logout pressed');
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: colorScheme === 'dark' ? Colors.dark.background : Colors.light.background }
    ]}>
      {/* Logo */}
      <Image
        source={require('@/assets/images/syntheo.png')}
        style={styles.logo}
        contentFit="contain"
      />

      {/* Right side items */}
      <View style={styles.rightContainer}>
        {/* Notifications icon */}
        <TouchableOpacity onPress={handleNotifications} style={styles.iconButton}>
          <IconSymbol
            name="bell.fill"
            size={24}
            color={colorScheme === 'dark' ? Colors.dark.icon : Colors.light.icon}
          />
        </TouchableOpacity>

        {/* User info */}
        <View style={styles.userInfo}>
          <ThemedText type="defaultSemiBold" style={styles.userName}>
            Jan Janssen
          </ThemedText>
          <ThemedText style={styles.userRole}>
            Administrator
          </ThemedText>
        </View>

        {/* Logout icon */}
        <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
          <IconSymbol
            name="rectangle.portrait.and.arrow.right"
            size={24}
            color={colorScheme === 'dark' ? Colors.dark.icon : Colors.light.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  logo: {
    width: 120,
    height: 40,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 8,
  },
  userInfo: {
    alignItems: 'flex-end',
  },
  userName: {
    fontSize: 14,
    lineHeight: 18,
  },
  userRole: {
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.6,
  },
});
