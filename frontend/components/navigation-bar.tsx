import { Image } from 'expo-image';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export function NavigationBar() {
  const handleNotifications = () => {
    // TODO: Handle notifications when backend is ready
    console.log('Notifications pressed');
  };

  const handleLogout = () => {
    // TODO: Handle logout when auth is ready
    console.log('Logout pressed');
  };

  return (
    <View style={styles.container}>
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
          <MaterialIcons
            name="notifications"
            size={24}
            color="#000000"
          />
        </TouchableOpacity>

        {/* User info */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            Jan Janssen
          </Text>
          <Text style={styles.userRole}>
            Administrator
          </Text>
        </View>

        {/* Logout icon */}
        <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
          <MaterialIcons
            name="logout"
            size={24}
            color="#000000"
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
    backgroundColor: '#ffffff',
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
    color: '#000000',
    fontWeight: '600',
  },
  userRole: {
    fontSize: 12,
    lineHeight: 16,
    color: '#000000',
    opacity: 0.6,
  },
});
