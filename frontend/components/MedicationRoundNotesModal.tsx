import { StyleSheet, View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight, LineHeight, Layout, Shadows } from '@/constants';
import type { MedicationRound } from '@/types/medication';

interface MedicationRoundNotesModalProps {
  visible: boolean;
  onClose: () => void;
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
  medicationRounds: MedicationRound[];
}

export function MedicationRoundNotesModal({
  visible,
  onClose,
  resident,
  medicationRounds,
}: MedicationRoundNotesModalProps) {

  // Build medication info lookup map
  const getMedicationInfo = (scheduleId: number) => {
    for (const medication of resident.medications) {
      const schedule = medication.schedules.find((s: any) => s.schedule_id === scheduleId);
      if (schedule) {
        return {
          name: medication.medication.name,
          dosage: schedule.dosage,
        };
      }
    }
    return null;
  };

  // Separate rounds by status
  const notGivenRounds = medicationRounds.filter(round =>
    round.status === 'missed' || round.status === 'refused' || round.status === 'delayed'
  );
  const givenRounds = medicationRounds.filter(round => round.status === 'given');

  // Get status display info
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'given':
        return { label: 'Gegeven', color: Colors.success, icon: 'check-circle' };
      case 'missed':
        return { label: 'Gemist', color: Colors.error, icon: 'cancel' };
      case 'refused':
        return { label: 'Geweigerd', color: Colors.error, icon: 'block' };
      case 'delayed':
        return { label: 'Vertraagd', color: Colors.warning, icon: 'schedule' };
      default:
        return { label: status, color: Colors.textSecondary, icon: 'info' };
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <MaterialIcons name="medication" size={24} color={Colors.primary} />
              <View>
                <Text style={styles.modalTitle}>Medicatieronde Details</Text>
                <Text style={styles.modalSubtitle}>
                  {resident.room ? `Kamer ${resident.room.room_number}` : 'Kamer onbekend'} - {resident.name}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <ScrollView style={styles.modalBody}>
            {/* Medications NOT Given Section */}
            {notGivenRounds.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <MaterialIcons name="warning" size={20} color={Colors.error} />
                  <Text style={styles.sectionTitle}>
                    Niet Gegeven ({notGivenRounds.length})
                  </Text>
                </View>

                {notGivenRounds.map((round, index) => {
                  const medInfo = getMedicationInfo(round.schedule_id);
                  const statusDisplay = getStatusDisplay(round.status);

                  return (
                    <View key={round.round_id || index} style={styles.medicationItem}>
                      <View style={styles.medicationHeader}>
                        <MaterialIcons
                          name={statusDisplay.icon as any}
                          size={20}
                          color={statusDisplay.color}
                        />
                        <View style={styles.medicationInfo}>
                          <Text style={styles.medicationName}>
                            {medInfo?.name || 'Onbekende medicatie'}
                          </Text>
                          <Text style={styles.medicationDosage}>
                            {medInfo?.dosage || 'Dosering onbekend'}
                          </Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: statusDisplay.color + '20' }]}>
                          <Text style={[styles.statusText, { color: statusDisplay.color }]}>
                            {statusDisplay.label}
                          </Text>
                        </View>
                      </View>

                      {round.notes && (
                        <View style={styles.notesContainer}>
                          <Text style={styles.notesLabel}>Reden:</Text>
                          <Text style={styles.notesText}>{round.notes}</Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}

            {/* Medications Given Section */}
            {givenRounds.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <MaterialIcons name="check-circle" size={20} color={Colors.success} />
                  <Text style={styles.sectionTitle}>
                    Gegeven ({givenRounds.length})
                  </Text>
                </View>

                {givenRounds.map((round, index) => {
                  const medInfo = getMedicationInfo(round.schedule_id);

                  return (
                    <View key={round.round_id || index} style={styles.medicationItemGiven}>
                      <MaterialIcons name="check-circle" size={18} color={Colors.success} />
                      <Text style={styles.medicationNameGiven}>
                        {medInfo?.name || 'Onbekende medicatie'}
                      </Text>
                      <Text style={styles.medicationDosageGiven}>
                        {medInfo?.dosage || ''}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Empty State */}
            {medicationRounds.length === 0 && (
              <View style={styles.emptyState}>
                <MaterialIcons name="info-outline" size={48} color={Colors.textSecondary} />
                <Text style={styles.emptyText}>
                  Geen medicatiegegevens beschikbaar
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.closeButtonBottom}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>Sluiten</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    width: '100%',
    maxWidth: 600,
    maxHeight: '85%',
    ...Shadows.modal,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Layout.screenPaddingLarge,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    flex: 1,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  modalBody: {
    padding: Layout.screenPaddingLarge,
    maxHeight: 500,
  },
  section: {
    marginBottom: Spacing['3xl'],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  medicationItem: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  medicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
    lineHeight: LineHeight.normal,
  },
  medicationDosage: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  notesContainer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  notesLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  notesText: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    lineHeight: LineHeight.relaxed,
  },
  medicationItemGiven: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: '#E5F5E5',
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  medicationNameGiven: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    flex: 1,
  },
  medicationDosageGiven: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
  },
  modalFooter: {
    padding: Layout.screenPaddingLarge,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  closeButtonBottom: {
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textOnPrimary,
  },
});
