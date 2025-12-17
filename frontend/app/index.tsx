import { Redirect } from 'expo-router';
import { useRole } from '@/contexts/RoleContext';

export default function Index() {
  const { selectedRole } = useRole();

  if (!selectedRole) {
    return <Redirect href="/role-selection" />;
  }

  return <Redirect href="/(tabs)/bewoners" />;
}
