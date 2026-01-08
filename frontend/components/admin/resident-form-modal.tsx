import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants';
import type { Resident } from '@/types/resident';

interface ResidentFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (residentData: {
    name: string;
    date_of_birth: string;
    photo_url?: string;
    allergies?: Array<{ symptom: string; severity?: string }>;
  }) => void | Promise<void>;
  isLoading?: boolean;
  resident?: Resident; // If provided, modal is in edit mode
}

export function ResidentFormModal({
  visible,
  onClose,
  onSubmit,
  isLoading = false,
  resident,
}: ResidentFormModalProps) {
  const isEditMode = !!resident;

  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [allergies, setAllergies] = useState<Array<{ symptom: string; severity?: string }>>([]);

  // Load resident data when modal opens in edit mode
  useEffect(() => {
    if (resident && visible) {
      setName(resident.name);
      setDateOfBirth(resident.date_of_birth.split('T')[0]); // Format: YYYY-MM-DD
      setPhotoUrl(resident.photo_url || '');
      setAllergies((resident.allergies || []).map(a => ({ symptom: a.symptom || '', severity: a.severity || 'medium' })));
    }
  }, [resident, visible]);

  const handleSubmit = async () => {
    // Validation
    if (name.trim().length === 0) {
      alert('Vul een naam in');
      return;
    }

    if (dateOfBirth.trim().length === 0) {
      alert('Vul een geboortedatum in');
      return;
    }

    // Date validation (YYYY-MM-DD format)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateOfBirth.trim())) {
      alert('Vul een geldige datum in (JJJJ-MM-DD)');
      return;
    }

    const residentData: {
      name: string;
      date_of_birth: string;
      photo_url?: string;
      allergies?: Array<{ symptom: string; severity?: string }>;
    } = {
      name: name.trim(),
      date_of_birth: dateOfBirth.trim(),
    };

    // Only include photo_url if it's provided
    if (photoUrl.trim().length > 0) {
      residentData.photo_url = photoUrl.trim();
    }

    // Include allergies if provided and non-empty
    const cleanedAllergies = allergies
      .map(a => ({ symptom: (a.symptom || '').trim(), severity: a.severity }))
      .filter(a => a.symptom.length > 0);

    if (cleanedAllergies.length > 0) {
      residentData.allergies = cleanedAllergies;
    }

    await onSubmit(residentData);

    // Form will be reset when modal closes via handleClose
  };

  const resetForm = () => {
    setName('');
    setDateOfBirth('');
    setPhotoUrl('');
    setAllergies([]);
  };

  const addAllergy = () => {
    setAllergies(prev => [...prev, { symptom: '', severity: 'medium' }]);
  };

  const updateAllergy = (index: number, field: 'symptom' | 'severity', value: string) => {
    setAllergies(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const removeAllergy = (index: number) => {
    setAllergies(prev => prev.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    resetForm();
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {isEditMode ? 'Bewoner Bewerken' : 'Nieuwe Bewoner'}
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={28} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Naam */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Naam *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Volledige naam"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="words"
            />
          </View>

          {/* Geboortedatum */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Geboortedatum *</Text>
            <TextInput
              style={styles.input}
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholder="JJJJ-MM-DD"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="none"
            />
            <Text style={styles.helpText}>
              Formaat: JJJJ-MM-DD (bijvoorbeeld: 1950-01-15)
            </Text>
          </View>

          {/* Foto URL */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Foto URL (optioneel)</Text>
            <TextInput
              style={styles.input}
              value={photoUrl}
              onChangeText={setPhotoUrl}
              placeholder="https://voorbeeld.nl/foto.jpg"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Allergieën */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Allergieën (optioneel)</Text>
            {allergies.map((a, idx) => (
              <View key={idx} style={{ marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={a.symptom}
                    onChangeText={(text) => updateAllergy(idx, 'symptom', text)}
                    placeholder="Symptoom (bijv. pinda)"
                    placeholderTextColor={Colors.textMuted}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => removeAllergy(idx)} style={{ padding: 8 }}>
                    <Ionicons name="trash" size={20} color={Colors.danger} />
                  </TouchableOpacity>
                </View>
                <View style={{ marginTop: 6 }}>
                  <Text style={styles.helpText}>Ernst (optioneel)</Text>
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                    {['low', 'medium', 'high'].map(level => (
                      <TouchableOpacity
                        key={level}
                        onPress={() => updateAllergy(idx, 'severity', level)}
                        style={{
                          paddingVertical: 6,
                          paddingHorizontal: 12,
                          borderRadius: 6,
                          backgroundColor: a.severity === level ? Colors.primary : '#EEE'
                        }}
                      >
                        <Text style={{ color: a.severity === level ? Colors.textOnPrimary : Colors.textPrimary }}>{level}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            ))}

            <TouchableOpacity onPress={addAllergy} style={{ marginTop: 8 }}>
              <Text style={{ color: Colors.primary }}>+ Voeg allergie toe</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleClose}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Annuleer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.textOnPrimary} />
            ) : (
              <Text style={styles.submitButtonText}>
                {isEditMode ? 'Opslaan' : 'Toevoegen'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing['2xl'],
  },
  fieldContainer: {
    marginBottom: Spacing['2xl'],
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
    backgroundColor: '#EEEEEE',
  },
  helpText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
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
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    backgroundColor: Colors.success,
  },
  submitButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textOnPrimary,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
});
