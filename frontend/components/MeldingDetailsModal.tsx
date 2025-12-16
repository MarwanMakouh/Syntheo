import { useState } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface MeldingDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  melding: {
    residentName: string;
    category: string;
    urgency: string;
    reportedBy: string;
    timestamp: string;
    description: string;
    status: string;
  };
  onSave?: (status: string) => void;
}

export function MeldingDetailsModal({ visible, onClose, melding, onSave }: MeldingDetailsModalProps) {
  const [status, setStatus] = useState(melding.status);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const statusOptions = ['Open', 'Behandeling', 'Afgehandeld'];

  const handleSave = () => {
    if (onSave) {
      onSave(status);
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
              <MaterialIcons name="close" size={28} color="#000000" />
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
                <MaterialIcons name="arrow-drop-down" size={24} color="#000000" />
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
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 24,
  },
  closeButton: {
    padding: 4,
  },
  grid: {
    gap: 24,
    marginBottom: 32,
  },
  field: {
    width: '48%',
  },
  fieldFullWidth: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  descriptionBox: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  descriptionText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
  },
  dropdownText: {
    fontSize: 16,
    color: '#000000',
  },
  dropdownList: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#000000',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#5B47FB',
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
