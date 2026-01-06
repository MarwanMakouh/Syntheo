import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/constants';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeRoute?: string;
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

export function AdminLayout({ children, activeRoute = 'dashboard' }: AdminLayoutProps) {
  const router = useRouter();
  const [notificationCount] = useState(3);

  const navSections: NavSection[] = [
    {
      title: '',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard-home' },
      ],
    },
    {
      title: 'BEHEER',
      items: [
        { id: 'gebruikers', label: 'Gebruikers', icon: 'group', route: '/admin/dashboard-gebruikers' },
        { id: 'bewoners', label: 'Bewoners', icon: 'people', route: '/admin/dashboard-bewoners' },
        { id: 'kamers', label: 'Kamers', icon: 'meeting-room', route: '/admin/dashboard-kamers' },
      ],
    },
    {
      title: 'COMMUNICATIE',
      items: [
        { id: 'meldingen', label: 'Meldingen', icon: 'message', route: '/admin/dashboard-meldingen' },
      ],
    },
    {
      title: 'SYSTEEM',
      items: [
        { id: 'audit-logs', label: 'Audit Logs', icon: 'description', route: '/admin/dashboard-audit-logs' },
      ],
    },
  ];

  const handleNavigation = (route: string) => {
    router.push(route as any);
  };

  const handleLogout = () => {
    router.replace('/');
  };

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
                const isActive = activeRoute === item.id;
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
            {/* Notifications */}
            <TouchableOpacity style={styles.topBarIcon}>
              <MaterialIcons name="notifications" size={24} color={Colors.textSecondary} />
              {notificationCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>{notificationCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Profile */}
            <View style={styles.profileContainer}>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>admin</Text>
                <Text style={styles.profileRole}>Admin</Text>
              </View>
              <View style={styles.profileAvatar}>
                <MaterialIcons name="person" size={20} color={Colors.textSecondary} />
              </View>
            </View>

            {/* Logout */}
            <TouchableOpacity style={styles.topBarIcon} onPress={handleLogout}>
              <MaterialIcons name="logout" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Page Content */}
        <View style={styles.content}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.backgroundSecondary,
  },
  sidebar: {
    width: 280,
    backgroundColor: '#1E4D2B',
    paddingVertical: Spacing.xl,
    ...Platform.select({
      web: {
        position: 'sticky' as any,
        top: 0,
        height: '100vh',
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
});
