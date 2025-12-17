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
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants';

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
              placeholderTextColor={Colors.textMuted}
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
              placeholderTextColor={Colors.textMuted}
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
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing['2xl'],
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing['3xl'],
  },
  fieldContainer: {
    marginBottom: Spacing['3xl'],
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
  },
  textArea: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
    minHeight: 120,
  },
  charCount: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
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
    borderColor: Colors.success,
    backgroundColor: '#F0FDF4',
  },
  urgencyButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
  urgencyButtonTextActive: {
    color: Colors.success,
    fontWeight: FontWeight.semibold,
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
    backgroundColor: '#E5E5E5',
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
