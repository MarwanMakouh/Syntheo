import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { currentUser, isLoading } = useAuth();

  // Show nothing while checking auth state
  if (isLoading) {
    return null;
  }

  // If not logged in, redirect to role selection for easier testing
  // (change to /login for production)
  if (!currentUser) {
    return <Redirect href="/role-selection" />;
  }

  // Redirect based on user role
  const role = currentUser.role.toLowerCase();

  if (role.includes('beheerder') || role.includes('admin')) {
    return <Redirect href="/admin/dashboard-home" />;
  } else if (role.includes('hoofdverpleegster') || role.includes('hoofd')) {
    return <Redirect href="/dashboard" />;
  } else if (role.includes('keuken')) {
    return <Redirect href="/(kitchen-tabs)/allergieen" />;
  } else if (role.includes('verpleegster') || role.includes('verpleger')) {
    return <Redirect href="/(tabs)/bewoners" />;
  }

  // Default fallback
  return <Redirect href="/(tabs)/bewoners" />;
}
