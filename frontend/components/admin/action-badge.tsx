import { StyleSheet, Text } from 'react-native';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/constants';

interface ActionBadgeProps {
  action: string;
}

// Use lowercased keys so matching is case-insensitive
const actionColors: Record<string, string> = {
  // Dutch
  'toegevoegd': '#27AE60', // green
  'bewerkt': '#3498DB', // blue
  'verwijderd': '#E74C3C', // red
  'goedgekeurd': '#27AE60',
  'afgekeurd': '#E74C3C',

  // English fallbacks
  'create': '#27AE60',
  'created': '#27AE60',
  'update': '#3498DB',
  'updated': '#3498DB',
  'delete': '#E74C3C',
  'deleted': '#E74C3C',
  'approve': '#27AE60',
  'approved': '#27AE60',
  'reject': '#E74C3C',
  'rejected': '#E74C3C',
};

const actionLabels: Record<string, string> = {
  // Dutch labels (preferred)
  'toegevoegd': 'Toegevoegd',
  'bewerkt': 'Bewerkt',
  'verwijderd': 'Verwijderd',
  'goedgekeurd': 'Goedgekeurd',
  'afgekeurd': 'Afgekeurd',

  // English fallbacks
  'create': 'Toegevoegd',
  'created': 'Toegevoegd',
  'update': 'Bewerkt',
  'updated': 'Bewerkt',
  'delete': 'Verwijderd',
  'deleted': 'Verwijderd',
  'approve': 'Goedgekeurd',
  'approved': 'Goedgekeurd',
  'reject': 'Afgekeurd',
  'rejected': 'Afgekeurd',
};

export function ActionBadge({ action }: ActionBadgeProps) {
  const key = (action || '').toString().toLowerCase().trim();
  const backgroundColor = actionColors[key] || Colors.textSecondary;
  const label = actionLabels[key] || action;

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
