import { useState } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight, LineHeight } from '@/constants';

interface MeldingDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  melding: {
    noteId: number; // Added note_id
    residentName: string;
    category: string;
    urgency: string;
    reportedBy: string;
    timestamp: string;
    description: string;
    status: string;
  };
  onSave?: (noteId: number, status: string) => void; // Changed to pass noteId
}

export function MeldingDetailsModal({ visible, onClose, melding, onSave }: MeldingDetailsModalProps) {
  const [status, setStatus] = useState(melding.status);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const statusOptions = ['Open', 'Behandeling', 'Afgehandeld'];

  const handleSave = () => {
    if (onSave) {
      onSave(melding.noteId, status);
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <ScrollView style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={28} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Content Grid */}
          <View style={styles.grid}>
            {/* Bewoner */}
            <View style={styles.field}>
              <Text style={styles.label}>Bewoner</Text>
              <Text style={styles.value}>{melding.residentName}</Text>
            </View>

            {/* Categorie */}
            <View style={styles.field}>
              <Text style={styles.label}>Categorie</Text>
              <Text style={styles.value}>{melding.category}</Text>
            </View>

            {/* Urgentie */}
            <View style={styles.field}>
              <Text style={styles.label}>Urgentie</Text>
              <Text style={styles.value}>{melding.urgency}</Text>
            </View>

            {/* Gemeld door */}
            <View style={styles.field}>
              <Text style={styles.label}>Gemeld door</Text>
              <Text style={styles.value}>{melding.reportedBy}</Text>
            </View>

            {/* Tijdstip */}
            <View style={[styles.field, styles.fieldFullWidth]}>
              <Text style={styles.label}>Tijdstip</Text>
              <Text style={styles.value}>{melding.timestamp}</Text>
            </View>

            {/* Beschrijving */}
            <View style={[styles.field, styles.fieldFullWidth]}>
              <Text style={styles.label}>Beschrijving</Text>
              <View style={styles.descriptionBox}>
                <Text style={styles.descriptionText}>{melding.description}</Text>
              </View>
            </View>

            {/* Status */}
            <View style={[styles.field, styles.fieldFullWidth]}>
              <Text style={styles.label}>Status</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setStatusDropdownOpen(!statusDropdownOpen)}
              >
                <Text style={styles.dropdownText}>{status}</Text>
                <MaterialIcons name="arrow-drop-down" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>

              {statusDropdownOpen && (
                <View style={styles.dropdownList}>
                  {statusOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setStatus(option);
                        setStatusDropdownOpen(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Sluiten</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Opslaan</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing['2xl'],
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: Spacing['3xl'],
  },
  closeButton: {
    padding: Spacing.xs,
  },
  grid: {
    gap: Spacing['3xl'],
    marginBottom: Spacing['5xl'],
  },
  field: {
    width: '48%',
  },
  fieldFullWidth: {
    width: '100%',
  },
  label: {
    fontSize: FontSize.md,
    color: Colors.textTertiary,
    marginBottom: Spacing.md,
  },
  value: {
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
  },
  descriptionBox: {
    backgroundColor: Colors.backgroundTertiary,
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  descriptionText: {
    fontSize: FontSize.md,
    color: Colors.textBody,
    lineHeight: LineHeight.relaxed,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderMedium,
    borderRadius: BorderRadius.md,
  },
  dropdownText: {
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  dropdownList: {
    marginTop: Spacing.md,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderMedium,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  dropdownItemText: {
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing['5xl'],
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textBody,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textOnPrimary,
  },
});
