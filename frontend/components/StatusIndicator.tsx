import { View, StyleSheet } from 'react-native';

interface StatusIndicatorProps {
  status: 'not-started' | 'in-progress' | 'completed';
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'not-started':
        return '#666666'; // Gray
      case 'in-progress':
        return '#007AFF'; // Blue
      case 'completed':
        return '#34C759'; // Green
      default:
        return '#666666';
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
    borderRadius: 6,
  },
});
