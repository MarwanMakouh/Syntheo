import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius, FontSize, FontWeight } from '@/constants';

interface DisconnectConfirmationModalProps {
  visible: boolean;
  residentName: string;
  roomNumber: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DisconnectConfirmationModal({
  visible,
  residentName,
  roomNumber,
  onCancel,
  onConfirm,
}: DisconnectConfirmationModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          {/* Modal Content */}
          <View style={styles.content}>
            <Text style={styles.title}>Bewoner loskoppelen</Text>
            <Text style={styles.description}>
              Weet je zeker dat je deze bewoner wilt loskoppelen van de kamer?
            </Text>

            {/* Resident Info */}
            <View style={styles.residentInfo}>
              <Text style={styles.residentName}>{residentName}</Text>
              <Text style={styles.roomNumber}>Kamer {roomNumber}</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onCancel}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Annuleren</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={onConfirm}
                activeOpacity={0.7}
              >
                <Text style={styles.confirmButtonText}>Loskoppelen</Text>
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
    // Modal content styling
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
  residentInfo: {
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
  },
  residentName: {
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  roomNumber: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
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
  confirmButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.error,
    minWidth: 120,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: FontSize.md,
    color: Colors.textOnPrimary,
    fontWeight: FontWeight.medium,
  },
});
