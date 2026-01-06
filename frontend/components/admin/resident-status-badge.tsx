import { StyleSheet, Text } from 'react-native';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/constants';

interface ResidentStatusBadgeProps {
  status: 'Stabiel' | 'Aandacht' | 'Urgent';
}

export function ResidentStatusBadge({ status }: ResidentStatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'Stabiel':
        return '#27AE60';
      case 'Aandacht':
        return '#F39C12';
      case 'Urgent':
        return '#E74C3C';
      default:
        return Colors.textSecondary;
    }
  };

  return (
    <Text
      style={[
        styles.badge,
        {
          borderColor: getStatusColor(),
          color: getStatusColor(),
        },
      ]}
    >
      {status}
    </Text>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
});
