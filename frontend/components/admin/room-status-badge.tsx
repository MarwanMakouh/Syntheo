import { StyleSheet, Text } from 'react-native';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/constants';

interface RoomStatusBadgeProps {
  isOccupied: boolean;
}

export function RoomStatusBadge({ isOccupied }: RoomStatusBadgeProps) {
  return (
    <Text
      style={[
        styles.badge,
        {
          backgroundColor: isOccupied ? '#27AE60' : '#95A5A6',
          color: Colors.background,
        },
      ]}
    >
      {isOccupied ? 'Bezet' : 'Leeg'}
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
    overflow: 'hidden',
  },
});
