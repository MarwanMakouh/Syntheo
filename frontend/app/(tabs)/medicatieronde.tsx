import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { DagdeelDropdown } from '@/components/DagdeelDropdown';
import { ResidentMedicationCard } from '@/components/ResidentMedicationCard';
import { getResidentsWithMedicationForDagdeel } from '@/services/API';

interface ResidentState {
  isExpanded: boolean;
  checkedMedications: Set<number>;
  completedAt: Date | null;
}

interface ResidentStates {
  [residentId: number]: ResidentState;
}

export default function MedicatierondeScreen() {
  const [selectedDagdeel, setSelectedDagdeel] = useState('Ochtend');
  const [residents, setResidents] = useState<any[]>([]);
  const [residentStates, setResidentStates] = useState<ResidentStates>({});

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

  const handleDagdeelChange = (dagdeel: string) => {
    setSelectedDagdeel(dagdeel);
  };

  const handleStart = (residentId: number) => {
    setResidentStates((prev) => ({
      ...prev,
      [residentId]: {
        ...prev[residentId],
        isExpanded: true,
      },
    }));
  };

  const handleClose = (residentId: number) => {
    setResidentStates((prev) => ({
      ...prev,
      [residentId]: {
        ...prev[residentId],
        isExpanded: false,
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

    if (state.checkedMedications.size > 0) {
      setResidentStates((prev) => ({
        ...prev,
        [residentId]: {
          ...prev[residentId],
          isExpanded: false,
          completedAt: new Date(),
        },
      }));

      console.log('Saved medication round for resident:', residentId);
      console.log('Checked medications:', Array.from(state.checkedMedications));
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Medicatieronde</Text>
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
              onStart={() => handleStart(resident.resident_id)}
              onClose={() => handleClose(resident.resident_id)}
              onSave={() => handleSave(resident.resident_id)}
              onToggleMedication={(scheduleId) =>
                handleToggleMedication(resident.resident_id, scheduleId)
              }
            />
          ))
        )}
      </ScrollView>
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
});
