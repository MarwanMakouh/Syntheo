import { StyleSheet, Text } from 'react-native';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/constants';

interface ActionBadgeProps {
  action: string;
}

const actionColors: Record<string, string> = {
  'CREATE': '#27AE60',
  'UPDATE': '#27AE60',
  'DELETE': '#E74C3C',
  'APPROVE': '#3498DB',
  'REJECT': '#E74C3C',
};

const actionLabels: Record<string, string> = {
  'CREATE': 'Toegevoegd',
  'UPDATE': 'Bewerkt',
  'DELETE': 'Verwijderd',
  'APPROVE': 'Goedgekeurd',
  'REJECT': 'Afgekeurd',
};

export function ActionBadge({ action }: ActionBadgeProps) {
  const backgroundColor = actionColors[action] || Colors.textSecondary;
  const label = actionLabels[action] || action;

  return (
    <Text style={[styles.badge, { backgroundColor }]}>
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.background,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
});
