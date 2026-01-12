import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaffLayout } from '@/components/staff';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Layout } from '@/constants';

interface MenuItem {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  route: string;
  color: string;
}

export default function MenuScreen() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { selectedRole } = useRole();

  // Check if user is Hoofdverpleegster
  const isHoofdverpleegster =
    currentUser?.role === 'Hoofdverpleegster' ||
    selectedRole === 'Hoofdverpleegster';

  // Menu items for Hoofdverpleegster
  const menuItems: MenuItem[] = [
    ...(Platform.OS === 'web' ? [{
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Overzicht van alle belangrijke informatie',
      icon: 'dashboard' as const,
      route: '/dashboard',
      color: Colors.primary,
    }] : []),
    {
      id: 'medicatie-beheer',
      title: 'Medicatie Beheer',
      description: 'Beheer medicatie van bewoners',
      icon: 'medication',
      route: '/(medication-management-tabs)',
      color: '#3498DB',
    },
    {
      id: 'wijzigingsverzoeken',
      title: 'Wijzigingsverzoeken',
      description: 'Bekijk en beheer wijzigingsverzoeken',
      icon: 'description',
      route: '/wijzigingsverzoeken',
      color: '#9B59B6',
    },
    {
      id: 'kamerbeheer',
      title: 'Kamerbeheer',
      description: 'Beheer kamers en bewonertoewijzingen',
      icon: 'meeting-room',
      route: '/kamerbeheer',
      color: '#E67E22',
    },
    {
      id: 'aankondigingen',
      title: 'Aankondigingen',
      description: 'Maak en beheer aankondigingen',
      icon: 'campaign',
      route: '/aankondigingen',
      color: '#E74C3C',
    },
  ];

  // If not Hoofdverpleegster, show message
  if (!isHoofdverpleegster) {
    return (
      <StaffLayout activeRoute="menu">
        <View style={styles.emptyContainer}>
          <MaterialIcons name="info" size={64} color={Colors.textSecondary} />
          <Text style={styles.emptyText}>
            Deze sectie is alleen beschikbaar voor hoofdverpleegsters
          </Text>
        </View>
      </StaffLayout>
    );
  }

  const handleMenuPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <StaffLayout activeRoute="menu">
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Menu</Text>
          <Text style={styles.subtitle}>Hoofdverpleegster functies</Text>
        </View>

        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuCard}
              onPress={() => handleMenuPress(item.route)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                <MaterialIcons name={item.icon} size={32} color={Colors.textOnPrimary} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </StaffLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  contentContainer: {
    padding: Spacing.xl,
    ...Platform.select({
      web: {
        maxWidth: Layout.webContentMaxWidth,
        alignSelf: 'center',
        width: '100%',
      },
      default: {
        paddingBottom: Platform.OS === 'ios' ? 88 : 65, // Add padding for tab bar
      },
    }),
  },
  header: {
    marginBottom: Spacing['2xl'],
  },
  title: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
  },
  menuGrid: {
    gap: Spacing.md,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.lg,
    ...Platform.select({
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      default: {
        elevation: 2,
      },
    }),
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  menuDescription: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['2xl'],
  },
  emptyText: {
    marginTop: Spacing.lg,
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
