import { StyleSheet, View, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

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
        <MaterialIcons name="medication" size={64} color="#cccccc" />
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
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  medicationCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  timeGroup: {
    marginBottom: 16,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  medicationItem: {
    paddingLeft: 16,
    marginBottom: 4,
  },
  medicationName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  dosage: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
    marginTop: 16,
  },
});
