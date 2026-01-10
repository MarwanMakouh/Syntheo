import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
  Modal,
  Pressable,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter, usePathname } from 'expo-router';
import { AnnouncementsDropdown } from '@/components/announcements/announcements-dropdown';
import { useAnnouncements } from '@/contexts/AnnouncementsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/constants';

interface BaseSidebarLayoutProps {
  children: React.ReactNode;
  navSections: NavSection[];
  activeRoute?: string;
  profileRole: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  route: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export function BaseSidebarLayout({ 
  children, 
  navSections,
  activeRoute,
  profileRole,
}: BaseSidebarLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { unreadCount } = useAnnouncements();
  const { currentUser } = useAuth();
  const { clearRole } = useRole();

  // Auto-detect active route if not provided
  const getActiveRoute = () => {
    if (activeRoute) return activeRoute;
    
    // Try to match pathname against all routes
    for (const section of navSections) {
      for (const item of section.items) {
        if (pathname.includes(item.id)) {
          return item.id;
        }
      }
    }
    return '';
  };

  const currentActiveRoute = getActiveRoute();

  const handleNavigation = (route: string) => {
    router.push(route as any);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    clearRole();
    router.replace('/role-selection');
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  // Mobile: just render children (let existing tab layout handle navigation)
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Image
              source={require('@/assets/images/syntheo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.logoText}>Syntheo</Text>
        </View>

        {/* Navigation */}
        <ScrollView style={styles.nav} showsVerticalScrollIndicator={false}>
          {navSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.navSection}>
              {section.title && (
                <Text style={styles.navSectionTitle}>{section.title}</Text>
              )}
              {section.items.map((item) => {
                const isActive = currentActiveRoute === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.navItem, isActive && styles.navItemActive]}
                    onPress={() => handleNavigation(item.route)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons
                      name={item.icon}
                      size={20}
                      color={Colors.background}
                    />
                    <Text
                      style={[
                        styles.navItemText,
                        isActive && styles.navItemTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Main Content Area */}
      <View style={styles.main}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            {/* Spacer */}
          </View>
          <View style={styles.topBarRight}>
            {/* Announcements */}
            <TouchableOpacity
              style={styles.topBarIcon}
              onPress={() => setShowAnnouncements(!showAnnouncements)}
            >
              <MaterialIcons name="notifications-active" size={24} color={Colors.textSecondary} />
              {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Profile */}
            <View style={styles.profileContainer}>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{currentUser?.username || currentUser?.name || 'Gebruiker'}</Text>
                <Text style={styles.profileRole}>{profileRole}</Text>
              </View>
              <View style={styles.profileAvatar}>
                <MaterialIcons name="person" size={20} color={Colors.textSecondary} />
              </View>
            </View>

            {/* Logout */}
            <TouchableOpacity style={styles.topBarIcon} onPress={handleLogoutClick}>
              <MaterialIcons name="logout" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Page Content */}
        <View style={styles.content}>{children}</View>

        {/* Announcements Dropdown */}
        <AnnouncementsDropdown
          visible={showAnnouncements}
          onClose={() => setShowAnnouncements(false)}
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
    </View>
  );
}

interface Styles {
  container: ViewStyle;
  sidebar: ViewStyle;
  logoContainer: ViewStyle;
  logoCircle: ViewStyle;
  logo: ImageStyle;
  logoText: TextStyle;
  nav: ViewStyle;
  navSection: ViewStyle;
  navSectionTitle: TextStyle;
  navItem: ViewStyle;
  navItemActive: ViewStyle;
  navItemText: TextStyle;
  navItemTextActive: TextStyle;
  main: ViewStyle;
  topBar: ViewStyle;
  topBarLeft: ViewStyle;
  topBarRight: ViewStyle;
  topBarIcon: ViewStyle;
  notificationBadge: ViewStyle;
  notificationBadgeText: TextStyle;
  profileContainer: ViewStyle;
  profileInfo: ViewStyle;
  profileName: TextStyle;
  profileRole: TextStyle;
  profileAvatar: ViewStyle;
  content: ViewStyle;
  modalOverlay: ViewStyle;
  modalContent: ViewStyle;
  modalHeader: ViewStyle;
  modalTitle: TextStyle;
  modalMessage: TextStyle;
  modalButtons: ViewStyle;
  modalCancelButton: ViewStyle;
  modalCancelText: TextStyle;
  modalConfirmButton: ViewStyle;
  modalConfirmText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.backgroundSecondary,
  },
  sidebar: {
    width: 240,
    backgroundColor: '#1E4D2B',
    paddingVertical: Spacing.xl,
    ...Platform.select({
      web: {
        position: 'sticky' as any,
        top: 0,
        height: '100vh' as any,
      },
    }),
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing['2xl'],
  },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    padding: Spacing.xs,
  },
  logo: {
    width: 32,
    height: 32,
  },
  logoText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.background,
  },
  nav: {
    flex: 1,
  },
  navSection: {
    marginBottom: Spacing['2xl'],
  },
  navSectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: '#95A5A6',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    letterSpacing: 0.5,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  navItemActive: {
    backgroundColor: Colors.primary,
  },
  navItemText: {
    fontSize: FontSize.md,
    color: Colors.background,
    marginLeft: Spacing.md,
    fontWeight: FontWeight.medium,
  },
  navItemTextActive: {
    color: Colors.background,
    fontWeight: FontWeight.semibold,
  },
  main: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  topBarLeft: {
    flex: 1,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  topBarIcon: {
    position: 'relative',
    padding: Spacing.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#E74C3C',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.background,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  profileInfo: {
    alignItems: 'flex-end',
  },
  profileName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  profileRole: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  profileAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
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
