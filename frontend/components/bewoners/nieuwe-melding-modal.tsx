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
  FlatList,
} from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants';
import type { Resident } from '@/types';

interface NieuweMeldingModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (melding: {
    type: string;
    content: string;
    urgency: 'Laag' | 'Matig' | 'Hoog';
    resident_id?: number;
  }) => void;
  residentId?: number;
  residents?: Resident[];
}

const TYPE_OPTIONS = [
  { value: 'Algemeen', label: 'Algemeen' },
  { value: 'Medisch', label: 'Medisch' },
  { value: 'Incident', label: 'Incident' },
] as const;

const URGENCY_OPTIONS = [
  { value: 'Laag', label: 'Normaal' },
  { value: 'Matig', label: 'Aandacht' },
  { value: 'Hoog', label: 'Urgent' },
] as const;

export function NieuweMeldingModal({ visible, onClose, onSave, residentId, residents }: NieuweMeldingModalProps) {
  const [type, setType] = useState<'Algemeen' | 'Medisch' | 'Incident'>('Algemeen');
  const [content, setContent] = useState('');
  const [urgency, setUrgency] = useState<'Laag' | 'Matig' | 'Hoog'>('Laag');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [showResidentList, setShowResidentList] = useState(false);

  // Filter residents based on search query
  const filteredResidents = residents?.filter(resident =>
    resident.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleSave = () => {
    if (content.trim().length < 10) {
      alert('Melding moet minimaal 10 karakters bevatten');
      return;
    }

    // If no residentId prop is provided, check if a resident is selected
    if (!residentId && !selectedResident) {
      alert('Selecteer een bewoner voor deze melding');
      return;
    }

    onSave({
      type,
      content,
      urgency,
      resident_id: residentId || selectedResident?.resident_id
    });

    // Reset form
    setType('Algemeen');
    setContent('');
    setUrgency('Laag');
    setSearchQuery('');
    setSelectedResident(null);
    setShowResidentList(false);
  };

  const handleClose = () => {
    // Reset form
    setType('Algemeen');
    setContent('');
    setUrgency('Laag');
    setSearchQuery('');
    setSelectedResident(null);
    setShowResidentList(false);
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
          <Text style={styles.title}>Nieuwe Melding</Text>

          {/* Bewoner Selector - Only show if no residentId is provided */}
          {!residentId && residents && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Bewoner *</Text>
              <TouchableOpacity
                style={styles.searchInput}
                onPress={() => setShowResidentList(!showResidentList)}
              >
                <Text style={selectedResident ? styles.selectedResidentText : styles.placeholderText}>
                  {selectedResident ? selectedResident.name : 'Selecteer een bewoner'}
                </Text>
              </TouchableOpacity>

              {showResidentList && (
                <View style={styles.residentListContainer}>
                  <TextInput
                    style={styles.searchBar}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Zoek bewoner..."
                    placeholderTextColor={Colors.textMuted}
                  />
                  <FlatList
                    data={filteredResidents}
                    keyExtractor={(item) => item.resident_id.toString()}
                    style={styles.residentList}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.residentItem}
                        onPress={() => {
                          setSelectedResident(item);
                          setShowResidentList(false);
                          setSearchQuery('');
                        }}
                      >
                        <Text style={styles.residentItemText}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                      <Text style={styles.emptyListText}>Geen bewoners gevonden</Text>
                    }
                  />
                </View>
              )}
            </View>
          )}

          {/* Type */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Type</Text>
            <View style={styles.typeContainer}>
              {TYPE_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.typeButton,
                    type === option.value && styles.typeButtonActive,
                  ]}
                  onPress={() => setType(option.value)}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      type === option.value && styles.typeButtonTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Melding */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Melding (minimum 10 karakters)</Text>
            <TextInput
              style={styles.textArea}
              value={content}
              onChangeText={setContent}
              placeholder="Voer uw melding hier in..."
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
  typeContainer: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  typeButton: {
    flex: 1,
    paddingVertical: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  typeButtonActive: {
    borderColor: Colors.success,
    backgroundColor: '#F0FDF4',
  },
  typeButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
  typeButtonTextActive: {
    color: Colors.success,
    fontWeight: FontWeight.semibold,
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
  searchInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.background,
  },
  selectedResidentText: {
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  placeholderText: {
    fontSize: FontSize.lg,
    color: Colors.textMuted,
  },
  residentListContainer: {
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    maxHeight: 250,
  },
  searchBar: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  residentList: {
    maxHeight: 200,
  },
  residentItem: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  residentItemText: {
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  emptyListText: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: Spacing['2xl'],
  },
});
