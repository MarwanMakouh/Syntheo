import { Image } from 'expo-image';
import { StyleSheet, View, TouchableOpacity, Text, Platform } from 'react-native';
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

      {/* User info - centered on mobile */}
      {Platform.OS !== 'web' && (
        <View style={styles.userInfoCentered}>
          <Text style={styles.userName}>
            Jan Janssen
          </Text>
          <Text style={styles.userRole}>
            Administrator
          </Text>
        </View>
      )}

      {/* Right side items */}
      <View style={styles.rightContainer}>
        {/* User info - only on web */}
        {Platform.OS === 'web' && (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              Jan Janssen
            </Text>
            <Text style={styles.userRole}>
              Administrator
            </Text>
          </View>
        )}

        {/* Notifications icon */}
        <TouchableOpacity onPress={handleNotifications} style={styles.iconButton}>
          <MaterialIcons
            name="notifications-active"
            size={26}
            color="#666666"
          />
        </TouchableOpacity>

        {/* Logout icon */}
        <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
          <MaterialIcons
            name="exit-to-app"
            size={26}
            color="#666666"
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
    paddingTop: Platform.OS === 'ios' ? 50 : Platform.OS === 'android' ? 40 : 12,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  logo: {
    width: 160,
    height: 50,
    left: -25
  },
  userInfoCentered: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 15,
    alignItems: 'center',
    pointerEvents: 'none',
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
