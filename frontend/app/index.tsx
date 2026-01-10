import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';

export default function Index() {
  const { currentUser, isLoading } = useAuth();
  const { selectedRole } = useRole();

  // Show nothing while checking auth state
  if (isLoading) {
    return null;
  }

  // If not logged in, redirect to login
  if (!currentUser) {
    return <Redirect href="/login" />;
  }

  // If logged in but no role selected, redirect to role selection
  if (!selectedRole) {
    return <Redirect href="/role-selection" />;
  }

  // Redirect based on selected role
  if (selectedRole === 'Beheerder') {
    return <Redirect href="/admin/dashboard-home" />;
  } else if (selectedRole === 'Hoofdverpleegster') {
    return <Redirect href="/dashboard" />;
  } else if (selectedRole === 'Keukenpersoneel') {
    return <Redirect href="/(kitchen-tabs)/allergieen" />;
  } else if (selectedRole === 'Verpleegster') {
    return <Redirect href="/(tabs)/bewoners" />;
  }

  // Default fallback
  return <Redirect href="/role-selection" />;
}
