import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants';

interface MedicationCheckboxProps {
  medication: {
    medication: {
      name: string;
    };
    schedules: Array<{
      dosage: string;
      instructions: string;
    }>;
  };
  checked: boolean;
  onToggle: () => void;
}

export function MedicationCheckbox({ medication, checked, onToggle }: MedicationCheckboxProps) {
  const schedule = medication.schedules[0];

  return (
    <TouchableOpacity style={styles.container} onPress={onToggle}>
      <View style={styles.checkbox}>
        {checked && (
          <MaterialIcons name="check" size={18} color={Colors.primary} />
        )}
      </View>
      <Text style={styles.text}>
        {medication.medication.name} - {schedule.dosage}
        {schedule.instructions && ` (${schedule.instructions})`}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.xs,
    marginRight: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    flex: 1,
  },
});
