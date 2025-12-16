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

interface NieuweNotitieModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (notitie: {
    type: string;
    content: string;
    urgency: 'Laag' | 'Matig' | 'Hoog';
  }) => void;
}

const URGENCY_OPTIONS = [
  { value: 'Laag', label: 'Normaal' },
  { value: 'Matig', label: 'Aandacht' },
  { value: 'Hoog', label: 'Urgent' },
] as const;

export function NieuweNotitieModal({ visible, onClose, onSave }: NieuweNotitieModalProps) {
  const [type, setType] = useState('');
  const [content, setContent] = useState('');
  const [urgency, setUrgency] = useState<'Laag' | 'Matig' | 'Hoog'>('Laag');

  const handleSave = () => {
    if (content.trim().length < 10) {
      alert('Notitie moet minimaal 10 karakters bevatten');
      return;
    }

    onSave({ type, content, urgency });

    // Reset form
    setType('');
    setContent('');
    setUrgency('Laag');
  };

  const handleClose = () => {
    // Reset form
    setType('');
    setContent('');
    setUrgency('Laag');
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
          {/* Header */}
          <Text style={styles.title}>Nieuwe Notitie</Text>

          {/* Type */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Type</Text>
            <TextInput
              style={styles.input}
              value={type}
              onChangeText={setType}
              placeholder="Bijv. Gezondheid, Gedrag, Medicatie..."
              placeholderTextColor="#999999"
            />
          </View>

          {/* Notitie */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Notitie (minimum 10 karakters)</Text>
            <TextInput
              style={styles.textArea}
              value={content}
              onChangeText={setContent}
              placeholder="Voer uw notitie hier in..."
              placeholderTextColor="#999999"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>
              {content.length}/10 minimum
            </Text>
          </View>

          {/* Urgentie */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Urgentie</Text>
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

          {/* Foto's Toevoegen */}
          <TouchableOpacity style={styles.photoButton}>
            <MaterialIcons name="photo-camera" size={20} color="#666666" />
            <Text style={styles.photoButtonText}>Foto's Toevoegen</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
            <Text style={styles.cancelButtonText}>Annuleer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Opslaan</Text>
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 24,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
    minHeight: 120,
  },
  charCount: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
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
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  urgencyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  urgencyButtonTextActive: {
    color: '#10B981',
    fontWeight: '600',
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  photoButtonText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
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
    backgroundColor: '#10B981',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
