import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { MedicationSelector } from './MedicationSelector';
import { ScheduleEntry } from './ScheduleEntry';
import { createResMedication } from '@/Services/resMedicationsApi';
import { createResSchedule } from '@/Services/resSchedulesApi';
import { Colors, FontSize, Spacing, BorderRadius, FontWeight } from '@/constants';

interface ScheduleData {
  time_of_day: 'Ochtend' | 'Middag' | 'Avond' | 'Nacht';
  dosage: string;
  instructions: string;
  day_of_week: string;
}

interface Props {
  visible: boolean;
  residentId: number;
  residentName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const DEFAULT_SCHEDULE: ScheduleData = {
  time_of_day: 'Ochtend',
  dosage: '',
  instructions: '',
  day_of_week: 'daily',
};

export function AddMedicationModal({ visible, residentId, residentName, onClose, onSuccess }: Props) {
  const [selectedMedicationId, setSelectedMedicationId] = useState<number | null>(null);
  const [schedules, setSchedules] = useState<ScheduleData[]>([{ ...DEFAULT_SCHEDULE }]);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  const handleScheduleChange = (index: number, field: keyof ScheduleData, value: string) => {
    const newSchedules = [...schedules];
    newSchedules[index] = {
      ...newSchedules[index],
      [field]: value,
    };
    setSchedules(newSchedules);
  };

  const handleAddSchedule = () => {
    setSchedules([...schedules, { ...DEFAULT_SCHEDULE }]);
  };

  const handleRemoveSchedule = (index: number) => {
    if (schedules.length > 1) {
      setSchedules(schedules.filter((_, i) => i !== index));
    }
  };

  const validateSchedules = (): boolean => {
    for (const schedule of schedules) {
      if (!schedule.dosage.trim()) {
        Alert.alert('Validatiefout', 'Vul een dosering in voor alle schema\'s');
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!selectedMedicationId) {
      Alert.alert('Validatiefout', 'Selecteer een medicatie');
      return;
    }

    if (!validateSchedules()) {
      return;
    }

    try {
      setSaving(true);

      // Step 1: Create ResMedication
      const resMedication = await createResMedication({
        medication_id: selectedMedicationId,
        resident_id: residentId,
        is_active: true,
      });

      // Step 2: Create all schedules
      const schedulePromises = schedules.map(schedule =>
        createResSchedule({
          res_medication_id: resMedication.res_medication_id,
          dosage: schedule.dosage,
          instructions: schedule.instructions || undefined,
          time_of_day: schedule.time_of_day,
          day_of_week: schedule.day_of_week as any,
        })
      );

      await Promise.all(schedulePromises);

      // Reset saving state first
      setSaving(false);

      // Close modal and refresh data
      handleClose();
      onSuccess();

      // Show success message after modal closes
      setTimeout(() => {
        Alert.alert(
          'Succes',
          `Medicatie is succesvol toegevoegd aan ${residentName}`
        );
      }, 100);
    } catch (error) {
      console.error('Failed to save medication:', error);
      setSaving(false);
      Alert.alert(
        'Fout',
        'Er is een fout opgetreden bij het opslaan van de medicatie. Probeer het opnieuw.'
      );
    }
  };

  const handleClose = () => {
    setSelectedMedicationId(null);
    setSchedules([{ ...DEFAULT_SCHEDULE }]);
    setCurrentStep(1);
    onClose();
  };

  const handleNext = () => {
    if (!selectedMedicationId) {
      Alert.alert('Validatiefout', 'Selecteer eerst een medicatie');
      return;
    }
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {currentStep === 2 && (
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            )}
            <View>
              <Text style={styles.title}>Nieuwe Medicatie Toevoegen</Text>
              <Text style={styles.subtitle}>Voor: {residentName}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleClose} disabled={saving}>
            <MaterialIcons name="close" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Step Indicator */}
        <View style={styles.stepIndicator}>
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, currentStep >= 1 && styles.stepCircleActive]}>
              <Text style={[styles.stepNumber, currentStep >= 1 && styles.stepNumberActive]}>1</Text>
            </View>
            <Text style={[styles.stepLabel, currentStep >= 1 && styles.stepLabelActive]}>
              Medicatie
            </Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, currentStep >= 2 && styles.stepCircleActive]}>
              <Text style={[styles.stepNumber, currentStep >= 2 && styles.stepNumberActive]}>2</Text>
            </View>
            <Text style={[styles.stepLabel, currentStep >= 2 && styles.stepLabelActive]}>
              Schema's
            </Text>
          </View>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          nestedScrollEnabled={true}
        >
          {currentStep === 1 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Selecteer Medicatie</Text>
              <Text style={styles.sectionDescription}>
                Kies de medicatie die u wilt toevoegen aan het schema van de bewoner
              </Text>
              <MedicationSelector
                selectedMedicationId={selectedMedicationId}
                onSelect={setSelectedMedicationId}
              />
            </View>
          )}

          {currentStep === 2 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Schema's Toevoegen</Text>
              <Text style={styles.sectionDescription}>
                Voeg één of meerdere schema's toe voor deze medicatie
              </Text>

              {schedules.map((schedule, index) => (
                <ScheduleEntry
                  key={index}
                  index={index}
                  schedule={schedule}
                  onChange={handleScheduleChange}
                  onRemove={handleRemoveSchedule}
                  canRemove={schedules.length > 1}
                />
              ))}

              <TouchableOpacity
                style={styles.addScheduleButton}
                onPress={handleAddSchedule}
                activeOpacity={0.7}
              >
                <MaterialIcons name="add-circle-outline" size={24} color={Colors.primary} />
                <Text style={styles.addScheduleButtonText}>Schema Toevoegen</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          {currentStep === 1 ? (
            <>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}
                activeOpacity={0.7}
                disabled={saving}
              >
                <Text style={styles.cancelButtonText}>Annuleren</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNext}
                activeOpacity={0.7}
                disabled={saving}
              >
                <Text style={styles.nextButtonText}>Volgende</Text>
                <MaterialIcons name="arrow-forward" size={20} color={Colors.background} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleBack}
                activeOpacity={0.7}
                disabled={saving}
              >
                <Text style={styles.cancelButtonText}>Terug</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                onPress={handleSave}
                activeOpacity={0.7}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={Colors.background} />
                ) : (
                  <>
                    <MaterialIcons name="check" size={20} color={Colors.background} />
                    <Text style={styles.saveButtonText}>Opslaan</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  backButton: {
    padding: Spacing.xs,
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.backgroundSecondary,
  },
  stepItem: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  stepCircleActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stepNumber: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  stepNumberActive: {
    color: Colors.background,
  },
  stepLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  stepLabelActive: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.lg,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
    overflow: 'visible' as any,
  },
  section: {
    marginBottom: Spacing.xl,
    overflow: 'visible' as any,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  sectionDescription: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  addScheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
    borderStyle: 'dashed',
  },
  addScheduleButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  actionContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  nextButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.background,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.background,
  },
});
