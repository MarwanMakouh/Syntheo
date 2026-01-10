import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useRole } from '@/contexts/RoleContext';
import { useAuth } from '@/contexts/AuthContext';
import { Colors, Spacing, Typography, Shadows, BorderRadius } from '@/constants';
import type { RoleOption, UserRole } from '@/types/user';

const roleOptions: RoleOption[] = [
  {
    id: 'Verpleegster',
    title: 'Verpleegster',
    description: 'Toegang tot bewoners, medicatie en meldingen',
    icon: 'local-hospital',
  },
  {
    id: 'Hoofdverpleegster',
    title: 'Hoofdverpleegster',
    description: 'Volledige toegang en goedkeuringen',
    icon: 'admin-panel-settings',
  },
  {
    id: 'Beheerder',
    title: 'Beheerder',
    description: 'Systeem beheer en configuratie',
    icon: 'settings',
  },
  {
    id: 'Keukenpersoneel',
    title: 'Keukenpersoneel',
    description: 'Toegang tot dieet en voedingsinformatie',
    icon: 'restaurant',
  },
];

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { setSelectedRole } = useRole();
  const { allUsers, setCurrentUser } = useAuth();

  const handleRoleSelect = async (role: UserRole) => {
    await setSelectedRole(role);

    // Find a user with this role and set as current user
    const userWithRole = allUsers.find(user => {
      const userRole = user.role.toLowerCase();
      const selectedRole = role.toLowerCase();

      // Match role (flexible matching)
      if (selectedRole.includes('verpleegster') && !selectedRole.includes('hoofd')) {
        return userRole.includes('verpleegster') && !userRole.includes('hoofd');
      } else if (selectedRole.includes('hoofdverpleegster')) {
        return userRole.includes('hoofdverpleegster') || userRole.includes('hoofd');
      } else if (selectedRole.includes('beheerder')) {
        return userRole.includes('beheerder') || userRole.includes('admin');
      } else if (selectedRole.includes('keuken')) {
        return userRole.includes('keuken');
      }
      return userRole === selectedRole;
    });

    if (userWithRole) {
      await setCurrentUser(userWithRole);
      console.log('Selected user:', userWithRole);
    } else {
      console.warn('No user found with role:', role);
    }

    // Navigate to the appropriate screen based on role
    if (role === 'Beheerder') {
      router.replace('/admin/dashboard-home');
    } else if (role === 'Hoofdverpleegster') {
      router.replace('/dashboard');
    } else if (role === 'Keukenpersoneel') {
      router.replace('/(kitchen-tabs)/allergieen');
    } else {
      router.replace('/(tabs)/bewoners');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welkom bij Syntheo</Text>
          <Text style={styles.subtitle}>Selecteer uw rol om te beginnen</Text>
        </View>

        <View style={styles.roleGrid}>
          {roleOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.roleCard}
              onPress={() => handleRoleSelect(option.id)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <MaterialIcons
                  name={option.icon as any}
                  size={48}
                  color={Colors.primary}
                />
              </View>
              <Text style={styles.roleTitle}>{option.title}</Text>
              <Text style={styles.roleDescription}>{option.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing['3xl'],
    ...Platform.select({
      web: {
        maxWidth: 800,
        marginHorizontal: 'auto',
        width: '100%',
      },
    }),
  },
  header: {
    marginBottom: Spacing['3xl'],
    alignItems: 'center',
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  roleGrid: {
    gap: Spacing.lg,
    ...Platform.select({
      web: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
      },
    }),
  },
  roleCard: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.card,
    ...Platform.select({
      web: {
        width: '48%',
        minWidth: 280,
      },
      default: {
        width: '100%',
      },
    }),
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.selectedBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  roleTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  roleDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
