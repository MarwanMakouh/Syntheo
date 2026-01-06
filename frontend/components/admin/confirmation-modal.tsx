import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants';

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  type?: 'danger' | 'warning' | 'info';
}

export function ConfirmationModal({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Bevestigen',
  cancelText = 'Annuleren',
  isLoading = false,
  type = 'danger',
}: ConfirmationModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  const getIconName = () => {
    switch (type) {
      case 'danger':
        return 'warning';
      case 'warning':
        return 'error-outline';
      case 'info':
        return 'info-outline';
      default:
        return 'warning';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'danger':
        return Colors.error;
      case 'warning':
        return Colors.warning;
      case 'info':
        return Colors.primary;
      default:
        return Colors.error;
    }
  };

  const getConfirmButtonColor = () => {
    switch (type) {
      case 'danger':
        return Colors.error;
      case 'warning':
        return Colors.warning;
      case 'info':
        return Colors.primary;
      default:
        return Colors.error;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Ionicons
              name={getIconName()}
              size={64}
              color={getIconColor()}
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.confirmButton,
                { backgroundColor: getConfirmButtonColor() },
                isLoading && styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.textOnPrimary} />
              ) : (
                <Text style={styles.confirmButtonText}>{confirmText}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['2xl'],
  },
  modalContainer: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing['3xl'],
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  message: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    marginBottom: Spacing['3xl'],
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Spacing.lg,
    width: '100%',
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
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textOnPrimary,
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
});
