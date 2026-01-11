import { Stack } from 'expo-router';
import { RoleGuard } from '@/components/RoleGuard';

export default function MedicationManagementLayout() {
  return (
    <RoleGuard allowedRoles={['Beheerder', 'Hoofdverpleegster']}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="[id]" />
      </Stack>
    </RoleGuard>
  );
}
