import { Image } from 'expo-image';
import { StyleSheet, View, TouchableOpacity, Text, Platform, Modal, Pressable } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter, useSegments } from 'expo-router';
import { Colors, Spacing, FontSize, FontWeight, LineHeight, BorderRadius } from '@/constants';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { useAnnouncements } from '@/contexts/AnnouncementsContext';
import { AnnouncementsDropdown } from '@/components/announcements/announcements-dropdown';
import { useState } from 'react';

export function NavigationBar() {
  const router = useRouter();
  const segments = useSegments();
  const { currentUser } = useAuth();
  const { clearRole, selectedRole } = useRole();
  const { unreadCount } = useAnnouncements();
  const [announcementsModalVisible, setAnnouncementsModalVisible] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Check if user is Hoofdverpleegster
  const isHoofdverpleegster =
    currentUser?.role === 'Hoofdverpleegster' ||
    selectedRole === 'Hoofdverpleegster';

  // Check if we're on a detail page (e.g., /bewoners/[id]) or wijzigingsverzoeken pages
  const isDetailPage =
    (segments.length > 2 && segments[segments.length - 1].startsWith('[')) ||
    (segments as string[]).includes('wijzigingsverzoeken') ||
    (segments as string[]).includes('wijzigingsverzoek-detail') ||
    (segments as string[]).includes('kamerbeheer') ||
    (segments as string[]).includes('meldingen');

  // Only show back button for Hoofdverpleegster
  const showBackButton = isDetailPage && isHoofdverpleegster;

  const handleNotifications = () => {
    setAnnouncementsModalVisible(true);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutConfirm(false);
    await clearRole();
    router.replace('/role-selection');
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  const handleBack = () => {
    // Check if we're on specific pages that need custom back navigation
    const currentSegments = segments as string[];

    if (currentSegments.includes('meldingen')) {
      // From meldingen, go back to hoofdverpleger dashboard
      router.push('/dashboard');
    } else if (currentSegments.includes('wijzigingsverzoeken') || currentSegments.includes('kamerbeheer')) {
      // From wijzigingsverzoeken or kamerbeheer, go back to hoofdverpleger dashboard
      router.push('/dashboard');
    } else if (currentSegments.includes('wijzigingsverzoek-detail')) {
      // From detail page, go back to wijzigingsverzoeken
      router.push('/wijzigingsverzoeken');
    } else {
      // Default back behavior
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      {/* Back button or Logo */}
      {showBackButton ? (
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
            {currentUser?.name || 'User'}
          </Text>
          <Text style={styles.userRole}>
            {currentUser?.role || 'Verpleegster'}
          </Text>
        </View>
      )}

      {/* Right side items */}
      <View style={styles.rightContainer}>
        {/* User info - only on web */}
        {Platform.OS === 'web' && (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {currentUser?.name || 'User'}
            </Text>
            <Text style={styles.userRole}>
              {currentUser?.role || 'Verpleegster'}
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
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Logout icon */}
        <TouchableOpacity onPress={handleLogoutClick} style={styles.iconButton}>
          <MaterialIcons
            name="exit-to-app"
            size={26}
            color={Colors.iconDefault}
          />
        </TouchableOpacity>
      </View>

      {/* Announcements Dropdown */}
      <AnnouncementsDropdown
        visible={announcementsModalVisible}
        onClose={() => setAnnouncementsModalVisible(false)}
      />

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutConfirm}
        transparent
        animationType="fade"
        onRequestClose={handleLogoutCancel}
      >
        <Pressable style={styles.modalOverlay} onPress={handleLogoutCancel}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <MaterialIcons name="logout" size={48} color={Colors.error} />
              <Text style={styles.modalTitle}>Uitloggen</Text>
            </View>
            <Text style={styles.modalMessage}>
              Weet je zeker dat je wilt uitloggen?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={handleLogoutCancel}
              >
                <Text style={styles.modalCancelText}>Annuleren</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handleLogoutConfirm}
              >
                <Text style={styles.modalConfirmText}>Uitloggen</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#E74C3C',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing['2xl'],
    width: '90%',
    maxWidth: 400,
    ...Platform.select({
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      default: {
        elevation: 8,
      },
    }),
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  modalMessage: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing['2xl'],
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.border,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.error,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textOnPrimary,
  },
});
