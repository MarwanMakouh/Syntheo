import { StyleSheet, Text } from 'react-native';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/constants';

interface StatusBadgeProps {
  status: 'Actief' | 'Inactief';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isActive = status === 'Actief';

  return (
    <Text
      style={[
        styles.badge,
        {
          backgroundColor: isActive ? '#D5F5E3' : '#FADBD8',
          color: isActive ? '#27AE60' : '#E74C3C',
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
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
});
