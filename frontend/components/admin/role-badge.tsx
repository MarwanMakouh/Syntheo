import { StyleSheet, Text } from 'react-native';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/constants';

interface RoleBadgeProps {
  role: string;
}

// Map backend roles to display names
const roleMapping: Record<string, string> = {
  'admin': 'Beheerder',
  'verpleegkundige': 'Verpleegster',
  'dokter': 'Dokter',
  'keukenpersoneel': 'Keukenpersoneel',
};

const roleColors: Record<string, string> = {
  'Beheerder': '#E74C3C',
  'Dokter': '#10B981',
  'Verpleegster': '#27AE60',
  'Keukenpersoneel': '#F39C12',
};

export function RoleBadge({ role }: RoleBadgeProps) {
  // Map backend role to display name
  const displayRole = roleMapping[role.toLowerCase()] || role;
  const backgroundColor = roleColors[displayRole] || Colors.textSecondary;

  return (
    <Text style={[styles.badge, { backgroundColor }]}>
      {displayRole.toUpperCase()}
    </Text>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.background,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
});
