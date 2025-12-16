import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StatusIndicator } from './StatusIndicator';
import { MedicationCheckbox } from './MedicationCheckbox';

interface ResidentMedicationCardProps {
  resident: {
    resident_id: number;
    name: string;
    room_id: number | null;
    medications: Array<any>;
  };
  status: 'not-started' | 'in-progress' | 'completed';
  isExpanded: boolean;
  checkedMedications: Set<number>;
  completedAt: Date | null;
  onStart: () => void;
  onClose: () => void;
  onSave: () => void;
  onToggleMedication: (scheduleId: number) => void;
}

export function ResidentMedicationCard({
  resident,
  status,
  isExpanded,
  checkedMedications,
  completedAt,
  onStart,
  onClose,
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

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <StatusIndicator status={status} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>
            {resident.room_id ? `Kamer ${resident.room_id}` : 'Kamer onbekend'} - {resident.name}
          </Text>
          <Text style={styles.headerSubtitle}>
            {medicationCount} {medicationCount === 1 ? 'medicatie' : 'medicaties'}
          </Text>
        </View>
      </View>

      <View style={styles.headerRight}>
        {status === 'completed' && completedAt ? (
          <View style={styles.completedBadge}>
            <MaterialIcons name="check-circle" size={20} color="#34C759" />
            <Text style={styles.completedText}>
              Klaar {formatTime(completedAt)}
            </Text>
          </View>
        ) : status === 'not-started' ? (
          <TouchableOpacity style={styles.startButton} onPress={onStart}>
            <Text style={styles.startButtonText}>Start</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Sluit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
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
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    color: '#000000',
  },
  headerSubtitle: {
    fontSize: 12,
    lineHeight: 16,
    color: '#000000',
    opacity: 0.6,
    marginTop: 2,
  },
  headerRight: {
    marginLeft: 12,
  },
  startButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  closeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  completedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34C759',
  },
  medicationList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  saveButton: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 6,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});
