import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Modal, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { DagdeelDropdown } from '@/components/DagdeelDropdown';
import { VerdiepingDropdown } from '@/components/VerdiepingDropdown';
import { ResidentMedicationCard } from '@/components/ResidentMedicationCard';
import { RoleGuard } from '@/components';
import { fetchResidentsWithMedicationForDagdeel } from '@/Services/residentsApi';
import { saveMedicationRoundsBulk, fetchMedicationRounds } from '@/Services/medicationRoundsApi';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Layout, Shadows } from '@/constants';

// backend callen
const CURRENT_USER_ID = 1;

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

interface ResidentState {
  isExpanded: boolean;
  checkedMedications: Set<number>;
  completedAt: Date | null;
  medicationRounds: any[];
}

interface ResidentStates {
  [residentId: number]: ResidentState;
}

// Function to determine current dagdeel based on time
const getCurrentDagdeel = (): string => {
  const hour = new Date().getHours();

  if (hour >= 7 && hour < 12) return 'Ochtend';
  if (hour >= 12 && hour < 18) return 'Middag';
  if (hour >= 18 && hour < 22) return 'Avond';
  return 'Nacht';
};

export default function MedicatierondeScreen() {
    const [selectedDagdeel, setSelectedDagdeel] = useState(getCurrentDagdeel());
  const [selectedVerdieping, setSelectedVerdieping] = useState('Alle verdiepingen');
  const [residents, setResidents] = useState<any[]>([]);
  const [residentStates, setResidentStates] = useState<ResidentStates>({});
  const [modalState, setModalState] = useState<{
    visible: boolean;
    residentId: number | null;
    uncheckedMedications: Array<{
      medicationName: string;
      dosage: string;
      scheduleId: number;
    }>;
    reason: string;
  }>({
    visible: false,
    residentId: null,
    uncheckedMedications: [],
    reason: '',
  });

  useEffect(() => {
    loadResidentsForDagdeel(selectedDagdeel);
  }, [selectedDagdeel]);

  const loadResidentsForDagdeel = async (dagdeel: string) => {
    try {
      // Fetch residents with medications for this dagdeel
      const residentsData = await fetchResidentsWithMedicationForDagdeel(dagdeel);
      setResidents(residentsData);

      // Fetch medication rounds for today
      const today = getTodayDateString();
      let todaysRounds: any[] = [];

      try {
        todaysRounds = await fetchMedicationRounds({
          date_from: today,
          date_to: today,
        });
      } catch (roundsError) {
        console.error('Failed to load medication rounds (continuing anyway):', roundsError);
        // Continue even if rounds can't be loaded
      }

      // Initialize states based on existing rounds
      const initialStates: ResidentStates = {};
      residentsData.forEach((resident: any) => {
        // Find all rounds for this resident today
        const residentRounds = todaysRounds.filter(
          (round: any) => round.resident_id === resident.resident_id
        );

        // Check if this resident has completed rounds for this dagdeel
        const hasCompletedRounds = residentRounds.length > 0;

        // Get all schedule IDs for this resident in this dagdeel
        const allScheduleIds: number[] = [];
        resident.medications.forEach((medication: any) => {
          medication.schedules.forEach((schedule: any) => {
            allScheduleIds.push(schedule.schedule_id);
          });
        });

        // Find which schedules were marked as 'given'
        const givenScheduleIds = new Set<number>();
        let completedAt: Date | null = null;

        residentRounds.forEach((round: any) => {
          // Check if this round's schedule is for this dagdeel
          if (allScheduleIds.includes(round.schedule_id)) {
            if (round.status === 'given') {
              givenScheduleIds.add(round.schedule_id);
            }
            // Set completed time to the first round's given_at
            if (!completedAt && round.given_at) {
              completedAt = new Date(round.given_at);
            }
          }
        });

        initialStates[resident.resident_id] = {
          isExpanded: false,
          checkedMedications: givenScheduleIds,
          completedAt: hasCompletedRounds ? completedAt : null,
          medicationRounds: residentRounds.filter(round =>
            allScheduleIds.includes(round.schedule_id)
          ),
        };
      });

      setResidentStates(initialStates);
    } catch (error) {
      console.error('Failed to load residents:', error);
      setResidents([]);
    }
  };

  const getUncheckedMedications = (residentId: number) => {
    const resident = residents.find((r) => r.resident_id === residentId);
    const state = residentStates[residentId];

    if (!resident || !state) return [];

    const unchecked: Array<{
      medicationName: string;
      dosage: string;
      scheduleId: number;
    }> = [];

    resident.medications.forEach((medication: any) => {
      medication.schedules.forEach((schedule: any) => {
        if (!state.checkedMedications.has(schedule.schedule_id)) {
          unchecked.push({
            medicationName: medication.medication.name,
            dosage: schedule.dosage,
            scheduleId: schedule.schedule_id,
          });
        }
      });
    });

    return unchecked;
  };

  const handleDagdeelChange = (dagdeel: string) => {
    setSelectedDagdeel(dagdeel);
  };

  const handleVerdiepingChange = (verdieping: string) => {
    setSelectedVerdieping(verdieping);
  };

  // Filter residents by selected verdieping
  const filteredResidents = residents.filter((resident: any) => {
    if (selectedVerdieping === 'Alle verdiepingen') {
      return true;
    }

    // Extract floor number from "Verdieping X"
    const floorNumber = parseInt(selectedVerdieping.replace('Verdieping ', ''));

    // Check if resident's room is on the selected floor
    return resident.room?.floor_id === floorNumber;
  });

  const handleToggle = (residentId: number) => {
    setResidentStates((prev) => ({
      ...prev,
      [residentId]: {
        ...prev[residentId],
        isExpanded: !prev[residentId].isExpanded,
      },
    }));
  };

  const handleSave = (residentId: number) => {
    const state = residentStates[residentId];
    const resident = residents.find((r: any) => r.resident_id === residentId);

    if (!resident) return;

    const totalMedications = resident.medications.reduce(
      (count: number, med: any) => count + med.schedules.length,
      0
    );

    // Check if all medications are checked
    if (state.checkedMedications.size < totalMedications) {
      // Some or no medications are checked - show modal
      const unchecked = getUncheckedMedications(residentId);
      setModalState({
        visible: true,
        residentId: residentId,
        uncheckedMedications: unchecked,
        reason: '',
      });
    } else {
      // All checked - proceed with normal save
      completeSave(residentId, null);
    }
  };

  const completeSave = async (residentId: number, skipReason: string | null) => {
    const resident = residents.find((r: any) => r.resident_id === residentId);
    const state = residentStates[residentId];

    if (!resident || !state) {
      Alert.alert('Fout', 'Bewoner of medicatiegegevens niet gevonden');
      return;
    }

    try {
      // Prepare medications data for API
      const medications: Array<{
        schedule_id: number;
        res_medication_id: number;
        status: 'given' | 'missed' | 'refused' | 'delayed';
        notes?: string;
      }> = [];

      resident.medications.forEach((medication: any) => {
        medication.schedules.forEach((schedule: any) => {
          const isChecked = state.checkedMedications.has(schedule.schedule_id);

          medications.push({
            schedule_id: schedule.schedule_id,
            res_medication_id: medication.res_medication_id,
            status: isChecked ? 'given' : 'missed',
            notes: !isChecked && skipReason ? skipReason : undefined,
          });
        });
      });

      // Save to backend
      const savedRounds = await saveMedicationRoundsBulk({
        resident_id: residentId,
        given_by: CURRENT_USER_ID,
        medications: medications,
      });

      // Update local state
      setResidentStates((prev) => ({
        ...prev,
        [residentId]: {
          ...prev[residentId],
          isExpanded: false,
          completedAt: new Date(),
          medicationRounds: savedRounds,
        },
      }));

      Alert.alert('Succes', 'Medicatieronde succesvol opgeslagen');
    } catch (error) {
      console.error('Error saving medication round:', error);
      Alert.alert('Fout', 'Er is een fout opgetreden bij het opslaan van de medicatieronde');
    }
  };

  const handleModalGoBack = () => {
    setModalState({
      visible: false,
      residentId: null,
      uncheckedMedications: [],
      reason: '',
    });
  };

  const handleModalSaveAnyway = () => {
    if (modalState.residentId && modalState.reason.trim()) {
      completeSave(modalState.residentId, modalState.reason);
      setModalState({
        visible: false,
        residentId: null,
        uncheckedMedications: [],
        reason: '',
      });
    }
  };

  const handleToggleMedication = (residentId: number, scheduleId: number) => {
    setResidentStates((prev) => {
      const currentState = prev[residentId];
      const newCheckedMedications = new Set(currentState.checkedMedications);

      if (newCheckedMedications.has(scheduleId)) {
        newCheckedMedications.delete(scheduleId);
      } else {
        newCheckedMedications.add(scheduleId);
      }

      return {
        ...prev,
        [residentId]: {
          ...currentState,
          checkedMedications: newCheckedMedications,
        },
      };
    });
  };

  const getResidentStatus = (residentId: number) => {
    const state = residentStates[residentId];
    const resident = residents.find((r: any) => r.resident_id === residentId);

    if (!state || !resident) return 'not-started';

    const totalMedications = resident.medications.reduce(
      (count: number, med: any) => count + med.schedules.length,
      0
    );

    const checkedCount = state.checkedMedications.size;

    if (state.completedAt) return 'completed';
    if (checkedCount === 0) return 'not-started';
    if (checkedCount === totalMedications) return 'completed';
    return 'in-progress';
  };

  const getResidentRoundColor = (residentId: number): 'red' | 'green' | null => {
    const state = residentStates[residentId];

    if (!state?.completedAt || !state.medicationRounds || state.medicationRounds.length === 0) {
      return null;
    }

    const hasIssues = state.medicationRounds.some(round =>
      round.status === 'missed' ||
      round.status === 'refused' ||
      round.status === 'delayed'
    );

    if (hasIssues) return 'red';

    const allGiven = state.medicationRounds.every(round =>
      round.status === 'given'
    );

    return allGiven ? 'green' : null;
  };

  const renderUncheckedMedicationModal = () => {
    return (
      <Modal
        visible={modalState.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleModalGoBack}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <MaterialIcons name="warning" size={24} color="#FF9500" />
              <Text style={styles.modalTitle}>
                Let op: Niet alle medicaties zijn aangevinkt
              </Text>
            </View>

            {/* Body */}
            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalLabel}>
                De volgende medicaties zijn niet aangevinkt:
              </Text>
              {modalState.uncheckedMedications.map((med, index) => (
                <View key={med.scheduleId} style={styles.medicationItem}>
                  <Text style={styles.medicationText}>
                    • {med.medicationName} - {med.dosage}
                  </Text>
                </View>
              ))}

              <Text style={styles.reasonLabel}>Reden (verplicht):</Text>
              <TextInput
                style={styles.reasonInput}
                placeholder="Bijv. Bewoner weigerde, misselijk, etc."
                value={modalState.reason}
                onChangeText={(text) => setModalState(prev => ({ ...prev, reason: text }))}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </ScrollView>

            {/* Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalButtonSecondary}
                onPress={handleModalGoBack}
              >
                <Text style={styles.modalButtonSecondaryText}>Terug</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButtonPrimary,
                  !modalState.reason.trim() && styles.modalButtonDisabled
                ]}
                onPress={handleModalSaveAnyway}
                disabled={!modalState.reason.trim()}
              >
                <Text style={styles.modalButtonPrimaryText}>Toch opslaan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <RoleGuard allowedRoles={['Verpleegster', 'Hoofdverpleegster']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <DagdeelDropdown value={selectedDagdeel} onChange={handleDagdeelChange} />
          <VerdiepingDropdown value={selectedVerdieping} onChange={handleVerdiepingChange} />
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {filteredResidents.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                Geen bewoners met medicatie voor {selectedDagdeel.toLowerCase()}
                {selectedVerdieping !== 'Alle verdiepingen' && ` op ${selectedVerdieping.toLowerCase()}`}
              </Text>
            </View>
          ) : (
            filteredResidents.map((resident: any) => (
              <ResidentMedicationCard
                key={resident.resident_id}
                resident={resident}
                status={getResidentStatus(resident.resident_id)}
                isExpanded={residentStates[resident.resident_id]?.isExpanded || false}
                checkedMedications={residentStates[resident.resident_id]?.checkedMedications || new Set()}
                completedAt={residentStates[resident.resident_id]?.completedAt || null}
                roundColor={getResidentRoundColor(resident.resident_id)}
                medicationRounds={residentStates[resident.resident_id]?.medicationRounds || []}
                onToggle={() => handleToggle(resident.resident_id)}
                onSave={() => handleSave(resident.resident_id)}
                onToggleMedication={(scheduleId) =>
                  handleToggleMedication(resident.resident_id, scheduleId)
                }
              />
            ))
          )}
        </ScrollView>

        {renderUncheckedMedicationModal()}
      </View>
    </RoleGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Layout.screenPaddingLarge,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    ...(Platform.OS === 'web' && { overflow: 'visible', zIndex: 900}),
    backgroundColor: Colors.background,
    gap: Spacing.xl,
  },
  title: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Layout.screenPadding,
  },
  scrollView: {
    flex: 1,
    ...(Platform.OS === 'web' && { zIndex: 1 }),
  },
  scrollContent: {
    padding: Layout.screenPaddingLarge,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  // Modal styles
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
    maxWidth: 500,
    maxHeight: '80%',
    ...Shadows.modal,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.screenPaddingLarge,
    paddingBottom: Layout.screenPadding,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.lg,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    flex: 1,
  },
  modalBody: {
    padding: Layout.screenPaddingLarge,
    maxHeight: 400,
  },
  modalLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  medicationItem: {
    paddingVertical: Spacing.sm,
  },
  medicationText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  reasonLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginTop: Layout.screenPaddingLarge,
    marginBottom: Spacing.md,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    padding: Spacing.lg,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    minHeight: 80,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: Layout.screenPaddingLarge,
    paddingTop: Layout.screenPadding,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.lg,
  },
  modalButtonSecondary: {
    flex: 1,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
  },
  modalButtonSecondaryText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  modalButtonPrimary: {
    flex: 1,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  modalButtonPrimaryText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textOnPrimary,
  },
  modalButtonDisabled: {
    backgroundColor: Colors.buttonDisabled,
    opacity: 0.6,
  },
});
