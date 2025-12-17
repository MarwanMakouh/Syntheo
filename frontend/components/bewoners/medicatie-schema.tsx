import { StyleSheet, View, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants';

interface MedicationItem {
  medication?: {
    name: string;
    category: string;
  };
  schedules: Array<{
    dosage: string;
    time_of_day: string;
    instructions: string;
  }>;
}

interface MedicatieSchemaProps {
  medications: MedicationItem[];
}

export function MedicatieSchema({ medications }: MedicatieSchemaProps) {
  const getTimeLabel = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 6 && hour < 10) return 'Ochtend (6-10u)';
    if (hour >= 10 && hour < 14) return 'Middag (10-14u)';
    if (hour >= 14 && hour < 18) return 'Namiddag (14-18u)';
    if (hour >= 18 && hour < 22) return 'Avond (18-22u)';
    return 'Nacht (22-6u)';
  };

  const groupByTime = (schedules: any[]) => {
    const grouped: { [key: string]: any[] } = {};
    schedules.forEach((schedule) => {
      const label = getTimeLabel(schedule.time_of_day);
      if (!grouped[label]) {
        grouped[label] = [];
      }
      grouped[label].push(schedule);
    });
    return grouped;
  };

  if (medications.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="medication" size={64} color={Colors.iconMuted} />
        <Text style={styles.emptyText}>Geen medicatie gevonden</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Medicatieschema</Text>

      {medications.map((item, index) => {
        if (!item.medication) return null;

        const groupedSchedules = groupByTime(item.schedules);

        return (
          <View key={index} style={styles.medicationCard}>
            {Object.entries(groupedSchedules).map(([timeLabel, schedules]) => (
              <View key={timeLabel} style={styles.timeGroup}>
                <Text style={styles.timeLabel}>{timeLabel}</Text>

                {schedules.map((schedule, idx) => (
                  <View key={idx} style={styles.medicationItem}>
                    <Text style={styles.medicationName}>{item.medication!.name}</Text>
                    <Text style={styles.dosage}>{schedule.dosage}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xl,
  },
  medicationCard: {
    backgroundColor: Colors.backgroundTertiary,
    borderRadius: BorderRadius.md,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  timeGroup: {
    marginBottom: Spacing.xl,
  },
  timeLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  medicationItem: {
    paddingLeft: Spacing.xl,
    marginBottom: Spacing.xs,
  },
  medicationName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textBody,
  },
  dosage: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: FontSize.lg,
    color: Colors.textMuted,
    marginTop: Spacing.xl,
  },
});
