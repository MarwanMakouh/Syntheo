import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Modal, TextInput, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { DagdeelDropdown } from '@/components/DagdeelDropdown';
import { ResidentMedicationCard } from '@/components/ResidentMedicationCard';
import { getResidentsWithMedicationForDagdeel } from '@/Services/API';

interface ResidentState {
  isExpanded: boolean;
  checkedMedications: Set<number>;
  completedAt: Date | null;
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

  const loadResidentsForDagdeel = (dagdeel: string) => {
    const residentsData = getResidentsWithMedicationForDagdeel(dagdeel);
    setResidents(residentsData);

    const initialStates: ResidentStates = {};
    residentsData.forEach((resident: any) => {
      initialStates[resident.resident_id] = {
        isExpanded: false,
        checkedMedications: new Set(),
        completedAt: null,
      };
    });
    setResidentStates(initialStates);
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

  const completeSave = (residentId: number, skipReason: string | null) => {
    setResidentStates((prev) => ({
      ...prev,
      [residentId]: {
        ...prev[residentId],
        isExpanded: false,
        completedAt: new Date(),
      },
    }));

    console.log('Saved medication round for resident:', residentId);
    console.log('Checked medications:', Array.from(residentStates[residentId].checkedMedications));
    if (skipReason) {
      console.log('Skipped medications reason:', skipReason);
      console.log('Unchecked count:', modalState.uncheckedMedications.length);
    }

    // TODO: Send to backend with reason when integrated
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
                <Text style={styles.modalButtonSecondaryText}>Terug gaan</Text>
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
    <View style={styles.container}>
      <View style={styles.header}>
        <DagdeelDropdown value={selectedDagdeel} onChange={handleDagdeelChange} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {residents.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Geen bewoners met medicatie voor {selectedDagdeel.toLowerCase()}
            </Text>
          </View>
        ) : (
          residents.map((resident: any) => (
            <ResidentMedicationCard
              key={resident.resident_id}
              resident={resident}
              status={getResidentStatus(resident.resident_id)}
              isExpanded={residentStates[resident.resident_id]?.isExpanded || false}
              checkedMedications={residentStates[resident.resident_id]?.checkedMedications || new Set()}
              completedAt={residentStates[resident.resident_id]?.completedAt || null}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
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
    backgroundColor: '#ffffff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    gap: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  modalBody: {
    padding: 20,
    maxHeight: 400,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  medicationItem: {
    paddingVertical: 6,
  },
  medicationText: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
  },
  reasonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginTop: 20,
    marginBottom: 8,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    color: '#000000',
    minHeight: 80,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  modalButtonSecondary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignItems: 'center',
  },
  modalButtonSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  modalButtonPrimary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  modalButtonPrimaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  modalButtonDisabled: {
    backgroundColor: '#cccccc',
    opacity: 0.6,
  },
});
