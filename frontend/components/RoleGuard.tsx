import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useRole } from '@/contexts/RoleContext';
import { useAuth } from '@/contexts/AuthContext';
import { Colors, FontSize, FontWeight, Spacing } from '@/constants';
import type { UserRole } from '@/types/user';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

/**
 * RoleGuard component that protects routes based on user roles.
 *
 * @param allowedRoles - Array of roles that are allowed to access this route
 * @param redirectTo - Optional redirect path if user doesn't have access (defaults to role-specific home)
 */
export function RoleGuard({ children, allowedRoles, redirectTo }: RoleGuardProps) {
  const router = useRouter();
  const { selectedRole } = useRole();
  const { currentUser, isLoading } = useAuth();

  useEffect(() => {
    // Wait for auth to finish loading
    if (isLoading) {
      return;
    }

    // If no user is logged in, redirect to login
    if (!currentUser) {
      router.replace('/login');
      return;
    }

    // If no role is selected, redirect to role selection
    if (!selectedRole) {
      router.replace('/role-selection');
      return;
    }

    // Check if the current role is allowed
    const hasAccess = allowedRoles.includes(selectedRole);

    if (!hasAccess) {
      // Redirect to appropriate home page based on role
      if (redirectTo) {
        router.replace(redirectTo as any);
      } else {
        // Default redirects based on role
        switch (selectedRole) {
          case 'Beheerder':
            router.replace('/admin/dashboard-home');
            break;
          case 'Hoofdverpleegster':
            router.replace('/dashboard');
            break;
          case 'Verpleegster':
            router.replace('/(tabs)/bewoners');
            break;
          case 'Keukenpersoneel':
            router.replace('/(kitchen-tabs)/allergieen');
            break;
          default:
            router.replace('/role-selection');
        }
      }
    }
  }, [currentUser, selectedRole, isLoading, allowedRoles, router, redirectTo]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Laden...</Text>
      </View>
    );
  }

  // If not authenticated or no role selected, show loading while redirecting
  if (!currentUser || !selectedRole) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Omleiding...</Text>
      </View>
    );
  }

  // Check if user has access
  const hasAccess = allowedRoles.includes(selectedRole);

  // If no access, show unauthorized message while redirecting
  if (!hasAccess) {
    return (
      <View style={styles.unauthorizedContainer}>
        <Text style={styles.unauthorizedTitle}>Geen toegang</Text>
        <Text style={styles.unauthorizedText}>
          Je hebt geen toestemming om deze pagina te bekijken.
        </Text>
        <Text style={styles.unauthorizedText}>Je wordt doorgestuurd...</Text>
      </View>
    );
  }

  // User has access, render the protected content
  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: Spacing.lg,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing['2xl'],
  },
  unauthorizedTitle: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.error,
    marginBottom: Spacing.md,
  },
  unauthorizedText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
});
