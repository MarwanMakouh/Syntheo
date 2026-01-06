import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Colors, FontSize, FontWeight, Spacing } from '@/constants';

export interface ActivityItem {
  id: number;
  description: string;
  timestamp: string;
  type: 'success' | 'warning' | 'info';
}

interface ActivityTimelineProps {
  activities: ActivityItem[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const getTimelineColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'success':
        return Colors.success;
      case 'warning':
        return '#FF6B35';
      case 'info':
        return Colors.primary;
      default:
        return Colors.textSecondary;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {activities.map((activity, index) => (
        <View key={activity.id} style={styles.activityItem}>
          <View
            style={[
              styles.timeline,
              { backgroundColor: getTimelineColor(activity.type) },
            ]}
          />
          <View style={styles.activityContent}>
            <Text style={styles.description}>{activity.description}</Text>
            <Text style={styles.timestamp}>{activity.timestamp}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: Spacing.xl,
  },
  timeline: {
    width: 4,
    borderRadius: 2,
    marginRight: Spacing.lg,
  },
  activityContent: {
    flex: 1,
    paddingVertical: Spacing.xs,
  },
  description: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
});
