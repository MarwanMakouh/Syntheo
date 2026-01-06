import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius, FontSize, FontWeight } from '@/constants';

interface ResidentOption {
  resident_id: number;
  name: string;
  currentRoom?: number;
}

interface AssignResidentModalProps {
  visible: boolean;
  roomNumber: number;
  unassignedResidents: ResidentOption[];
  assignedResidents: ResidentOption[];
  onCancel: () => void;
  onAssign: (residentId: number) => void;
  isProcessing?: boolean;
}

export function AssignResidentModal({
  visible,
  roomNumber,
  unassignedResidents,
  assignedResidents,
  onCancel,
  onAssign,
  isProcessing = false,
}: AssignResidentModalProps) {
  const [selectedResidentId, setSelectedResidentId] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const allResidents = [...unassignedResidents, ...assignedResidents];

  const handleAssign = () => {
    if (selectedResidentId) {
      onAssign(selectedResidentId);
      setSelectedResidentId(null);
      setShowDropdown(false);
    }
  };

  const handleCancel = () => {
    setSelectedResidentId(null);
    setShowDropdown(false);
    onCancel();
  };

  const handleSelectResident = (residentId: number) => {
    setSelectedResidentId(residentId);
    setShowDropdown(false);
  };

  const selectedResident = allResidents.find(
    (r) => r.resident_id === selectedResidentId
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <Pressable style={styles.overlay} onPress={handleCancel}>
        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          {/* Modal Content */}
          <View style={styles.content}>
            <Text style={styles.title}>Bewoner toewijzen aan kamer {roomNumber}</Text>
            <Text style={styles.description}>
              Selecteer een bewoner om toe te wijzen aan deze kamer.
            </Text>

            {/* Dropdown Selector */}
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowDropdown(!showDropdown)}
              >
                <Text style={[styles.dropdownText, !selectedResident && styles.dropdownPlaceholder]}>
                  {selectedResident
                    ? `${selectedResident.name}${selectedResident.currentRoom ? ` (Kamer ${selectedResident.currentRoom})` : ''}`
                    : 'Selecteer een bewoner'}
                </Text>
                <MaterialIcons
                  name={showDropdown ? 'arrow-drop-up' : 'arrow-drop-down'}
                  size={24}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>

              {showDropdown && (
                <View style={styles.dropdownList}>
                  <ScrollView style={styles.dropdownScrollView} nestedScrollEnabled>
                    {allResidents.map((resident) => (
                      <TouchableOpacity
                        key={resident.resident_id}
                        style={styles.dropdownItem}
                        onPress={() => handleSelectResident(resident.resident_id)}
                      >
                        <Text style={styles.dropdownItemText}>
                          {resident.name}
                          {resident.currentRoom && ` (Kamer ${resident.currentRoom})`}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Annuleren</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.assignButton,
                  (!selectedResidentId || isProcessing) && styles.assignButtonDisabled,
                ]}
                onPress={handleAssign}
                activeOpacity={0.7}
                disabled={!selectedResidentId || isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator size="small" color={Colors.textOnPrimary} />
                ) : (
                  <Text style={styles.assignButtonText}>Toewijzen</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    width: '90%',
    maxWidth: 500,
    padding: Spacing.xl,
  },
  content: {
    // Modal content
  },
  title: {
    ...Typography.h2,
    fontSize: FontSize['2xl'],
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.md,
  },
  description: {
    ...Typography.body,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  dropdownContainer: {
    marginBottom: Spacing.xl,
    position: 'relative',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    minHeight: 48,
  },
  dropdownText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    flex: 1,
  },
  dropdownPlaceholder: {
    color: Colors.textMuted,
  },
  dropdownList: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownScrollView: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dropdownItemText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    minWidth: 120,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
  },
  assignButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.success,
    minWidth: 120,
    alignItems: 'center',
  },
  assignButtonDisabled: {
    backgroundColor: Colors.buttonDisabled,
  },
  assignButtonText: {
    fontSize: FontSize.md,
    color: Colors.textOnPrimary,
    fontWeight: FontWeight.medium,
  },
});
