import { View, StyleSheet } from 'react-native';
import { Colors, BorderRadius } from '@/constants';

interface StatusIndicatorProps {
  status: 'not-started' | 'in-progress' | 'completed';
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
  const getStatusColor = () => {
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
