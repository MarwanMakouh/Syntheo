import { StyleSheet, Text } from 'react-native';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/constants';

interface RoleBadgeProps {
  role: string;
}

const roleColors: Record<string, string> = {
  'Beheerder': '#E74C3C',
  'Hoofdverpleegster': '#10B981',
  'Verpleegster': '#27AE60',
  'Keukenpersoneel': '#F39C12',
};

export function RoleBadge({ role }: RoleBadgeProps) {
  const backgroundColor = roleColors[role] || Colors.textSecondary;

  return (
    <Text style={[styles.badge, { backgroundColor }]}>
      {role.toUpperCase()}
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
