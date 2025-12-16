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
              <MaterialIcons name="warning" size={18} color="#EF4444" />
              <Text style={styles.label}>Allergieën</Text>
            </View>
            <TextInput
              style={styles.input}
              value={allergies}
              onChangeText={setAllergies}
              placeholder="Bijv. Lactose, Noten, Gluten..."
              placeholderTextColor="#999999"
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
              placeholderTextColor="#999999"
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
                  placeholderTextColor="#999999"
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
                  placeholderTextColor="#999999"
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
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 4,
  },
  input: {
    borderWidth: 2,
    borderColor: '#FCD34D',
    backgroundColor: '#FFFBEB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
  },
  preferencesRow: {
    flexDirection: 'row',
    gap: 16,
  },
  preferenceColumn: {
    flex: 1,
  },
  preferenceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 8,
  },
  urgencyContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  urgencyButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  urgencyButtonActive: {
    borderColor: '#F97316',
    backgroundColor: '#FFF7ED',
  },
  urgencyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  urgencyButtonTextActive: {
    color: '#F97316',
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#D1FAE5',
    borderRadius: 8,
    padding: 12,
    gap: 8,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#059669',
    lineHeight: 18,
  },
  actionContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#E5E5E5',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#D1D5DB',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
