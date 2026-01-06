import { Image } from 'expo-image';
import { StyleSheet, View, TouchableOpacity, Text, Platform } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter, useSegments } from 'expo-router';
import { Colors, Spacing, FontSize, FontWeight, LineHeight } from '@/constants';
import { useRole } from '@/contexts/RoleContext';

// backend callen
const CURRENT_USER = {
  name: 'User',
  role: 'Verpleegster'
};

export function NavigationBar() {
  const router = useRouter();
  const segments = useSegments();
  const { selectedRole, clearRole } = useRole();

  // Check if we're on a detail page (e.g., /bewoners/[id]) or wijzigingsverzoeken pages
  const isDetailPage =
    (segments.length > 2 && segments[segments.length - 1].startsWith('[')) ||
    (segments as string[]).includes('wijzigingsverzoeken') ||
    (segments as string[]).includes('wijzigingsverzoek-detail') ||
    (segments as string[]).includes('kamerbeheer');

  const handleNotifications = () => {
    // TODO: backend callen
    console.log('Notifications pressed');
  };

  const handleLogout = () => {
    clearRole();
    router.replace('/role-selection');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Back button or Logo */}
      {isDetailPage ? (
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.navAccent} />
          <Text style={styles.backText}>Terug</Text>
        </TouchableOpacity>
      ) : (
        <Image
          source={require('@/assets/images/syntheo.png')}
          style={styles.logo}
          contentFit="contain"
        />
      )}

      {/* User info - centered on mobile */}
      {Platform.OS !== 'web' && (
        <View style={styles.userInfoCentered}>
          <Text style={styles.userName}>
            {CURRENT_USER.name}
          </Text>
          <Text style={styles.userRole}>
            {selectedRole || CURRENT_USER.role}
          </Text>
        </View>
      )}

      {/* Right side items */}
      <View style={styles.rightContainer}>
        {/* User info - only on web */}
        {Platform.OS === 'web' && (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {CURRENT_USER.name}
            </Text>
            <Text style={styles.userRole}>
              {selectedRole || CURRENT_USER.role}
            </Text>
          </View>
        )}

        {/* Notifications icon */}
        <TouchableOpacity onPress={handleNotifications} style={styles.iconButton}>
          <MaterialIcons
            name="notifications-active"
            size={26}
            color={Colors.iconDefault}
          />
        </TouchableOpacity>

        {/* Logout icon */}
        <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
          <MaterialIcons
            name="exit-to-app"
            size={26}
            color={Colors.iconDefault}
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
    paddingLeft: Spacing.md,
    paddingRight: Spacing.xl,
    paddingTop: Platform.OS === 'ios' ? 50 : Platform.OS === 'android' ? 40 : Spacing.lg,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  logo: {
    width: 160,
    height: 50,
    marginLeft: -25,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.md,
  },
  backText: {
    fontSize: FontSize.lg,
    color: Colors.navAccent,
    marginLeft: Spacing.md,
    fontWeight: FontWeight.medium,
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
    gap: Spacing.xl,
  },
  iconButton: {
    padding: Spacing.md,
  },
  userInfo: {
    alignItems: 'flex-end',
  },
  userName: {
    fontSize: FontSize.md,
    lineHeight: LineHeight.normal,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
  },
  userRole: {
    fontSize: FontSize.xs,
    lineHeight: LineHeight.tight,
    color: Colors.textPrimary,
    opacity: 0.6,
  },
});
