import { Redirect } from 'expo-router';
import { useRole } from '@/contexts/RoleContext';

export default function Index() {
  const { selectedRole } = useRole();

  if (!selectedRole) {
    return <Redirect href="/role-selection" />;
  }

  // Hoofdverpleegster gets dashboard, others get bewoners
  if (selectedRole === 'Hoofdverpleegster') {
    return <Redirect href="/dashboard" />;
  }

  return <Redirect href="/(tabs)/bewoners" />;
}
