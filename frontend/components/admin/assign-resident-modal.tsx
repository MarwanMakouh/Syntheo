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
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bewoner Toewijzen</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
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
          {/* Info */}
          <View style={styles.infoContainer}>
            <MaterialIcons name="meeting-room" size={48} color={Colors.primary} />
            <Text style={styles.infoTitle}>Kamer {roomNumber}</Text>
            <Text style={styles.infoText}>
              Selecteer een bewoner om aan deze kamer toe te wijzen
            </Text>
          </View>

          {/* Residents List */}
          {availableResidents.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="person-off" size={48} color={Colors.textSecondary} />
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
    backgroundColor: Colors.background,
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
  infoContainer: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
    padding: Spacing.xl,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoTitle: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: FontSize.md,
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
    padding: Spacing['4xl'],
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
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
