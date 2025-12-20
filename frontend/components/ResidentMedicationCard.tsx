import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StatusIndicator } from './StatusIndicator';
import { MedicationCheckbox } from './MedicationCheckbox';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight, LineHeight } from '@/constants';

interface ResidentMedicationCardProps {
  resident: {
    resident_id: number;
    name: string;
    room?: {
      room_id: number;
      room_number: string;
      floor_id: number;
    } | null;
    medications: Array<any>;
  };
  status: 'not-started' | 'in-progress' | 'completed';
  isExpanded: boolean;
  checkedMedications: Set<number>;
  completedAt: Date | null;
  onToggle: () => void;
  onSave: () => void;
  onToggleMedication: (scheduleId: number) => void;
}

export function ResidentMedicationCard({
  resident,
  status,
  isExpanded,
  checkedMedications,
  completedAt,
  onToggle,
  onSave,
  onToggleMedication,
}: ResidentMedicationCardProps) {
  const medicationCount = resident.medications.reduce(
    (count: number, med: any) => count + med.schedules.length,
    0
  );

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleHeaderPress = () => {
    if (status !== 'completed') {
      onToggle();
    }
  };

  const renderHeader = () => (
    <TouchableOpacity
      style={styles.header}
      onPress={handleHeaderPress}
      disabled={status === 'completed'}
      activeOpacity={status === 'completed' ? 1 : 0.7}
    >
      <View style={styles.headerLeft}>
        <StatusIndicator status={status} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>
            {resident.room ? `Kamer ${resident.room.room_number}` : 'Kamer onbekend'} - {resident.name}
          </Text>
          <Text style={styles.headerSubtitle}>
            {medicationCount} {medicationCount === 1 ? 'medicatie' : 'medicaties'}
          </Text>
        </View>
      </View>

      {status === 'completed' && completedAt && (
        <View style={styles.completedBadge}>
          <MaterialIcons name="check-circle" size={20} color={Colors.successAlt} />
          <Text style={styles.completedText}>
            Klaar {formatTime(completedAt)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderMedicationList = () => {
    if (!isExpanded) return null;

    return (
      <View style={styles.medicationList}>
        {resident.medications.map((medication: any) =>
          medication.schedules.map((schedule: any) => (
            <MedicationCheckbox
              key={schedule.schedule_id}
              medication={medication}
              checked={checkedMedications.has(schedule.schedule_id)}
              onToggle={() => onToggleMedication(schedule.schedule_id)}
            />
          ))
        )}

        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
          <Text style={styles.saveButtonText}>Opslaan</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.card}>
      {renderHeader()}
      {renderMedicationList()}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.xl,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    marginLeft: Spacing.lg,
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    lineHeight: LineHeight.normal,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: FontSize.xs,
    lineHeight: LineHeight.tight,
    color: Colors.textPrimary,
    opacity: 0.6,
    marginTop: 2,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  completedText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.successAlt,
  },
  medicationList: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  saveButton: {
    marginTop: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textOnPrimary,
  },
});
