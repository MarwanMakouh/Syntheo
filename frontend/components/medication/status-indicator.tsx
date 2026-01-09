import { View, StyleSheet } from 'react-native';
import { Colors, BorderRadius } from '@/constants';

interface StatusIndicatorProps {
  status: 'not-started' | 'in-progress' | 'completed';
  roundColor?: 'red' | 'green' | null;
}

export function StatusIndicator({ status, roundColor }: StatusIndicatorProps) {
  const getStatusColor = () => {
    // If roundColor is provided and status is completed, use roundColor
    if (status === 'completed' && roundColor) {
      if (roundColor === 'red') return Colors.error;
      if (roundColor === 'green') return Colors.success;
    }

    // Otherwise use default status colors
    switch (status) {
      case 'not-started':
        return Colors.textSecondary;
      case 'in-progress':
        return Colors.primary;
      case 'completed':
        return Colors.successAlt;
      default:
        return Colors.textSecondary;
    }
  };

  return (
    <View style={[styles.indicator, { backgroundColor: getStatusColor() }]} />
  );
}

const styles = StyleSheet.create({
  indicator: {
    width: 12,
    height: 12,
    borderRadius: BorderRadius.sm,
  },
});
