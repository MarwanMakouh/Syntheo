import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ResMedication, MedicationLibrary, ResSchedule } from '@/types/medication';
import { Colors, FontSize, Spacing, BorderRadius, FontWeight, Shadows } from '@/constants';
import { ConfirmationModal } from '@/components/admin/confirmation-modal';

interface Props {
  resMedication: ResMedication & {
    medication: MedicationLibrary;
    schedules: ResSchedule[];
  };
  onStatusChange: (id: number, activate: boolean) => void;
  onDelete?: (id: number) => void;
}

export function MedicationManagementCard({ resMedication, onStatusChange, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleStatusChange = () => {
    console.log('[MedicationManagementCard] handleStatusChange called', {
      resMedicationId: resMedication.res_medication_id,
      currentStatus: resMedication.is_active
    });
    setShowStatusModal(true);
  };

  const confirmStatusChange = () => {
    console.log('[MedicationManagementCard] User confirmed, calling parent onStatusChange');
    onStatusChange(resMedication.res_medication_id, !resMedication.is_active);
    setShowStatusModal(false);
  };

  const handleDelete = () => {
    console.log('[MedicationManagementCard] handleDelete called', {
      resMedicationId: resMedication.res_medication_id
    });
    if (onDelete) {
      setShowDeleteModal(true);
    }
  };

  const confirmDelete = () => {
    console.log('[MedicationManagementCard] User confirmed delete, calling parent onDelete');
    if (onDelete) {
      onDelete(resMedication.res_medication_id);
    }
    setShowDeleteModal(false);
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.medicationName}>{resMedication.medication.name}</Text>
          <View style={styles.badges}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{resMedication.medication.category}</Text>
            </View>
            <View style={[
              styles.statusBadge,
              resMedication.is_active ? styles.statusBadgeActive : styles.statusBadgeInactive
            ]}>
              <Text style={[
                styles.statusText,
                resMedication.is_active ? styles.statusTextActive : styles.statusTextInactive
              ]}>
                {resMedication.is_active ? 'Actief' : 'Inactief'}
              </Text>
            </View>
          </View>
        </View>
        <MaterialIcons
          name={expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={24}
          color={Colors.iconDefault}
        />
      </TouchableOpacity>

      {/* Expanded Content */}
      {expanded && (
        <View style={styles.content}>
          {/* Schedules */}
          <View style={styles.schedulesSection}>
            <Text style={styles.sectionTitle}>Schema's ({resMedication.schedules.length})</Text>
            {resMedication.schedules.length === 0 ? (
              <Text style={styles.noSchedulesText}>Geen schema's gevonden</Text>
            ) : (
              resMedication.schedules.map((schedule) => (
                <View key={schedule.schedule_id} style={styles.scheduleItem}>
                  <View style={styles.scheduleItemLeft}>
                    <Text style={styles.scheduleTime}>{schedule.time_of_day}</Text>
                    <Text style={styles.scheduleDosage}>{schedule.dosage}</Text>
                    {schedule.instructions && (
                      <Text style={styles.scheduleInstructions}>{schedule.instructions}</Text>
                    )}
                    <Text style={styles.scheduleDay}>
                      {schedule.day_of_week === null || schedule.day_of_week === 'daily'
                        ? 'Dagelijks'
                        : schedule.day_of_week}
                    </Text>
                  </View>
                  <MaterialIcons name="schedule" size={20} color={Colors.primary} />
                </View>
              ))
            )}
          </View>

          {/* End Date */}
          {resMedication.end_date && (
            <View style={styles.endDateSection}>
              <MaterialIcons name="event" size={16} color={Colors.textSecondary} />
              <Text style={styles.endDateText}>
                Einddatum: {new Date(resMedication.end_date).toLocaleDateString('nl-NL')}
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                resMedication.is_active ? styles.deactivateButton : styles.activateButton
              ]}
              onPress={handleStatusChange}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={resMedication.is_active ? "pause-circle-outline" : "play-circle-outline"}
                size={20}
                color={resMedication.is_active ? Colors.warning : Colors.success}
              />
              <Text style={[
                styles.actionButtonText,
                resMedication.is_active ? styles.deactivateButtonText : styles.activateButtonText
              ]}>
                {resMedication.is_active ? 'Deactiveren' : 'Activeren'}
              </Text>
            </TouchableOpacity>

            {onDelete && (
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={handleDelete}
                activeOpacity={0.7}
              >
                <MaterialIcons name="delete-outline" size={20} color={Colors.error} />
                <Text style={styles.deleteButtonText}>Verwijderen</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Status Change Confirmation Modal */}
      <ConfirmationModal
        visible={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onConfirm={confirmStatusChange}
        title={resMedication.is_active ? 'Medicatie Deactiveren' : 'Medicatie Activeren'}
        message={`Weet u zeker dat u deze medicatie wilt ${resMedication.is_active ? 'deactiveren' : 'activeren'}?`}
        confirmText="Bevestigen"
        cancelText="Annuleren"
        type={resMedication.is_active ? 'warning' : 'info'}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Medicatie Verwijderen"
        message={`Weet u zeker dat u ${resMedication.medication.name} wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`}
        confirmText="Verwijderen"
        cancelText="Annuleren"
        type="danger"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  headerLeft: {
    flex: 1,
  },
  medicationName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  badges: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  categoryBadge: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  categoryText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.background,
  },
  statusBadge: {
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  statusBadgeActive: {
    backgroundColor: Colors.successBackground,
  },
  statusBadgeInactive: {
    backgroundColor: Colors.backgroundSecondary,
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  statusTextActive: {
    color: Colors.success,
  },
  statusTextInactive: {
    color: Colors.textSecondary,
  },
  content: {
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    padding: Spacing.lg,
  },
  schedulesSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  noSchedulesText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  scheduleItemLeft: {
    flex: 1,
  },
  scheduleTime: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  scheduleDosage: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  scheduleInstructions: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  scheduleDay: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  endDateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  endDateText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  activateButton: {
    borderColor: Colors.success,
    backgroundColor: Colors.successBackground,
  },
  deactivateButton: {
    borderColor: Colors.warning,
    backgroundColor: Colors.warningBackground,
  },
  deleteButton: {
    borderColor: Colors.error,
    backgroundColor: Colors.errorBackground,
  },
  actionButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  activateButtonText: {
    color: Colors.success,
  },
  deactivateButtonText: {
    color: Colors.warning,
  },
  deleteButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.error,
  },
});
