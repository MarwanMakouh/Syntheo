import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight, LineHeight } from '@/constants';

interface DieetBewerkenModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    allergies: string;
    dietTypes: string;
    likes: string;
    dislikes: string;
    urgency: 'Normaal' | 'Aandacht' | 'Urgent';
  }) => void;
  initialData?: {
    allergies: string;
    dietTypes: string;
    likes: string;
    dislikes: string;
  };
}

const URGENCY_OPTIONS = [
  { value: 'Normaal', label: 'Normaal' },
  { value: 'Aandacht', label: 'Aandacht' },
  { value: 'Urgent', label: 'Urgent' },
] as const;

export function DieetBewerkenModal({ visible, onClose, onSave, initialData }: DieetBewerkenModalProps) {
  const [allergies, setAllergies] = useState(initialData?.allergies || '');
  const [dietTypes, setDietTypes] = useState(initialData?.dietTypes || '');
  const [likes, setLikes] = useState(initialData?.likes || '');
  const [dislikes, setDislikes] = useState(initialData?.dislikes || '');
  const [urgency, setUrgency] = useState<'Normaal' | 'Aandacht' | 'Urgent'>('Aandacht');

  const handleSave = () => {
    onSave({
      allergies,
      dietTypes,
      likes,
      dislikes,
      urgency,
    });
    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setAllergies(initialData?.allergies || '');
    setDietTypes(initialData?.dietTypes || '');
    setLikes(initialData?.likes || '');
    setDislikes(initialData?.dislikes || '');
    setUrgency('Aandacht');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Allergieën */}
          <View style={styles.fieldContainer}>
            <View style={styles.labelRow}>
              <MaterialIcons name="warning" size={18} color={Colors.error} />
              <Text style={styles.label}>Allergieën</Text>
            </View>
            <TextInput
              style={styles.input}
              value={allergies}
              onChangeText={setAllergies}
              placeholder="Bijv. Lactose, Noten, Gluten..."
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          {/* Dieettype */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Dieettype</Text>
            <TextInput
              style={styles.input}
              value={dietTypes}
              onChangeText={setDietTypes}
              placeholder="Bijv. Lactosevrij, Zachte voeding..."
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          {/* Voorkeuren */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Voorkeuren</Text>

            <View style={styles.preferencesRow}>
              <View style={styles.preferenceColumn}>
                <Text style={styles.preferenceLabel}>Houdt van</Text>
                <TextInput
                  style={styles.input}
                  value={likes}
                  onChangeText={setLikes}
                  placeholder="Bijv. Pap, Aardappelpuree..."
                  placeholderTextColor={Colors.textMuted}
                  multiline
                />
              </View>

              <View style={styles.preferenceColumn}>
                <Text style={styles.preferenceLabel}>Houdt niet van</Text>
                <TextInput
                  style={styles.input}
                  value={dislikes}
                  onChangeText={setDislikes}
                  placeholder="Bijv. Rauwe groenten..."
                  placeholderTextColor={Colors.textMuted}
                  multiline
                />
              </View>
            </View>
          </View>

          {/* Urgentie Verzoek */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Urgentie Verzoek</Text>
            <View style={styles.urgencyContainer}>
              {URGENCY_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.urgencyButton,
                    urgency === option.value && styles.urgencyButtonActive,
                  ]}
                  onPress={() => setUrgency(option.value)}
                >
                  <Text
                    style={[
                      styles.urgencyButtonText,
                      urgency === option.value && styles.urgencyButtonTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <MaterialIcons name="info" size={20} color="#059669" />
            <Text style={styles.infoText}>
              Wijzigingen worden niet direct toegepast. Ze worden ter goedkeuring naar de hoofdverpleegkundige gestuurd.
            </Text>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
            <Text style={styles.cancelButtonText}>Annuleer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Verzoek Indienen</Text>
          </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing['2xl'],
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  fieldContainer: {
    marginBottom: Spacing['3xl'],
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginLeft: Spacing.xs,
  },
  input: {
    borderWidth: 2,
    borderColor: Colors.warningBorder,
    backgroundColor: Colors.warningBackground,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  preferencesRow: {
    flexDirection: 'row',
    gap: Spacing.xl,
  },
  preferenceColumn: {
    flex: 1,
  },
  preferenceLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  urgencyContainer: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  urgencyButton: {
    flex: 1,
    paddingVertical: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  urgencyButtonActive: {
    borderColor: Colors.warning,
    backgroundColor: Colors.warningMediumBackground,
  },
  urgencyButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
  urgencyButtonTextActive: {
    color: Colors.warning,
    fontWeight: FontWeight.semibold,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.infoBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.successText,
    lineHeight: LineHeight.normal,
  },
  actionContainer: {
    flexDirection: 'row',
    padding: Spacing['2xl'],
    paddingBottom: Platform.OS === 'ios' ? 40 : Spacing['2xl'],
    gap: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    backgroundColor: Colors.buttonSecondary,
  },
  cancelButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    backgroundColor: Colors.success,
  },
  saveButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textOnPrimary,
  },
});
