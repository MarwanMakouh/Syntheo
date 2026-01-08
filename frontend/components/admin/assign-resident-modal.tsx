import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants';
import type { Resident } from '@/types/resident';

interface AssignResidentModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  roomNumber: string;
  availableResidents: Resident[];
  selectedResidentId: number | null;
  onSelectResident: (residentId: number) => void;
  isLoading?: boolean;
}

export function AssignResidentModal({
  visible,
  onClose,
  onConfirm,
  roomNumber,
  availableResidents,
  selectedResidentId,
  onSelectResident,
  isLoading = false,
}: AssignResidentModalProps) {
  const handleConfirm = async () => {
    if (!selectedResidentId) {
      alert('Selecteer een bewoner');
      return;
    }
    await onConfirm();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Bewoner Toewijzen</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
          {/* Info */}
          <View style={styles.infoContainer}>
            <MaterialIcons name="meeting-room" size={40} color={Colors.primary} />
            <Text style={styles.infoTitle}>Kamer {roomNumber}</Text>
            <Text style={styles.infoText}>
              Selecteer een bewoner om aan deze kamer toe te wijzen
            </Text>
          </View>

          {/* Residents List */}
          {availableResidents.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="person-off" size={40} color={Colors.textSecondary} />
              <Text style={styles.emptyText}>Geen beschikbare bewoners</Text>
              <Text style={styles.emptySubtext}>
                Alle bewoners zijn al toegewezen aan een kamer.
              </Text>
            </View>
          ) : (
            <View style={styles.residentsList}>
              {availableResidents.map((resident) => (
                <TouchableOpacity
                  key={resident.resident_id}
                  style={[
                    styles.residentItem,
                    selectedResidentId === resident.resident_id && styles.residentItemSelected,
                  ]}
                  onPress={() => onSelectResident(resident.resident_id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.residentInfo}>
                    <View style={styles.residentAvatar}>
                      <MaterialIcons name="person" size={24} color={Colors.background} />
                    </View>
                    <View style={styles.residentDetails}>
                      <Text style={styles.residentName}>{resident.name}</Text>
                      <Text style={styles.residentMeta}>
                        {resident.date_of_birth && `Geboren: ${new Date(resident.date_of_birth).toLocaleDateString('nl-NL')}`}
                      </Text>
                    </View>
                  </View>
                  {selectedResidentId === resident.resident_id && (
                    <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Annuleren</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              (!selectedResidentId || isLoading) && styles.confirmButtonDisabled,
            ]}
            onPress={handleConfirm}
            disabled={!selectedResidentId || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.textOnPrimary} />
            ) : (
              <Text style={styles.confirmButtonText}>Toewijzen</Text>
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
    padding: Spacing.xl,
  },
  container: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    width: '100%',
    maxWidth: 600,
    maxHeight: '90%',
    ...Platform.select({
      web: {
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  scrollView: {
    maxHeight: 500,
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  infoTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  infoText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  residentsList: {
    gap: Spacing.md,
  },
  residentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  residentItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.selectedBackground,
  },
  residentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  residentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#95A5A6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  residentDetails: {
    flex: 1,
  },
  residentName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  residentMeta: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    padding: Spacing['2xl'],
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
  },
  emptyText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    padding: Spacing.xl,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
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
    backgroundColor: Colors.success,
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
