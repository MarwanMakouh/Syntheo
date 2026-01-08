import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants';
import { formatDate } from '@/utils/date';
import { mapUrgencyFromBackend } from '@/Services/noteMapper';

interface ChangeRequestPopupProps {
  visible: boolean;
  onClose: () => void;
  request: any;
  resident: any;
  requester: any;
  reviewer?: any;
  onApprove?: () => void;
  onReject?: () => void;
  isApproving?: boolean;
  isRejecting?: boolean;
}

export function ChangeRequestPopup({
  visible,
  onClose,
  request,
  resident,
  requester,
  reviewer,
  onApprove,
  onReject,
  isApproving = false,
  isRejecting = false,
}: ChangeRequestPopupProps) {
  if (!request) return null;

  const mapUrgency = (u: string) => mapUrgencyFromBackend(u || '');
  const mapStatus = (s: string) => {
    switch (s) {
      case 'approved':
        return 'Goedgekeurd';
      case 'rejected':
        return 'Afgekeurd';
      case 'pending':
      default:
        return 'In behandeling';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Hoog':
        return Colors.urgencyHigh;
      case 'Matig':
        return Colors.urgencyMedium;
      case 'Laag':
        return Colors.urgencyLow;
      default:
        return Colors.textSecondary;
    }
  };

  const getUrgencyBgColor = (urgency: string) => {
    switch (urgency) {
      case 'Hoog':
        return Colors.urgencyHighBg;
      case 'Matig':
        return Colors.urgencyMediumBg;
      case 'Laag':
        return Colors.urgencyLowBg;
      default:
        return Colors.backgroundSecondary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Goedgekeurd':
        return Colors.success;
      case 'Afgekeurd':
        return Colors.error;
      case 'In behandeling':
        return Colors.warning;
      default:
        return Colors.textSecondary;
    }
  };

  const translateFieldName = (fieldName: string): string => {
    const translations: Record<string, string> = {
      'diet_type': 'Dieet',
      'medication_dosage': 'Medicatie Dosering',
      'contact_phone': 'Contactpersoon Telefoon',
      'medication': 'Medicatie',
      'allergy': 'Allergie',
    };
    return translations[fieldName] || fieldName;
  };

  const fields = request.changeFields || request.change_fields || [];
  const urgency = mapUrgency(request.urgency);
  const status = mapStatus(request.status);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.popup} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerTop}>
                <Text style={styles.title}>Wijzigingsverzoek</Text>
                <View
                  style={[
                    styles.urgencyBadge,
                    { backgroundColor: getUrgencyBgColor(urgency) }
                  ]}
                >
                  <Text style={[styles.urgencyText, { color: getUrgencyColor(urgency) }]}>
                    {urgency.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={styles.residentName}>{resident?.name || 'Onbekende bewoner'}</Text>
              <Text style={styles.dateText}>
                {formatDate(request.created_at, 'dd-MM, HH:mm')}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Aanvrager */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="person" size={18} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Aanvrager</Text>
              </View>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Naam:</Text>
                  <Text style={styles.infoValue}>{requester?.name || 'Onbekend'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Rol:</Text>
                  <Text style={styles.infoValue}>{requester?.role || '-'}</Text>
                </View>
              </View>
            </View>

            {/* Wijzigingen */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="edit" size={18} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Wijzigingen</Text>
              </View>
              {fields && fields.length > 0 ? (
                fields.map((field: any) => (
                  <View key={field.field_id} style={styles.changeItem}>
                    <Text style={styles.fieldName}>{translateFieldName(field.field_name)}</Text>
                    <View style={styles.changeRow}>
                      <View style={styles.changeBox}>
                        <Text style={styles.changeLabel}>Oud</Text>
                        <Text style={styles.oldValue} numberOfLines={2}>{field.old || '-'}</Text>
                      </View>
                      <MaterialIcons name="arrow-forward" size={16} color={Colors.textSecondary} />
                      <View style={styles.changeBox}>
                        <Text style={styles.changeLabel}>Nieuw</Text>
                        <Text style={styles.newValue} numberOfLines={2}>{field.new}</Text>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>Geen wijzigingen gevonden</Text>
              )}
            </View>

            {/* Status */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="info" size={18} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Status</Text>
              </View>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Status:</Text>
                  <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
                    {status}
                  </Text>
                </View>
                {request.reviewed_at && (
                  <>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Behandeld:</Text>
                      <Text style={styles.infoValue}>
                        {formatDate(request.reviewed_at, 'dd-MM HH:mm')}
                      </Text>
                    </View>
                    {reviewer && (
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Door:</Text>
                        <Text style={styles.infoValue}>{reviewer.name}</Text>
                      </View>
                    )}
                  </>
                )}
              </View>
            </View>
          </ScrollView>

          {/* Footer met action buttons */}
          <View style={styles.footer}>
            {request.status === 'pending' && onApprove && onReject ? (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={onReject}
                  disabled={isRejecting || isApproving}
                >
                  {isRejecting ? (
                    <ActivityIndicator size="small" color={Colors.textOnPrimary} />
                  ) : (
                    <>
                      <MaterialIcons name="close" size={18} color={Colors.textOnPrimary} />
                      <Text style={styles.actionButtonText}>Afkeuren</Text>
                    </>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.approveButton]}
                  onPress={onApprove}
                  disabled={isRejecting || isApproving}
                >
                  {isApproving ? (
                    <ActivityIndicator size="small" color={Colors.textOnPrimary} />
                  ) : (
                    <>
                      <MaterialIcons name="check" size={18} color={Colors.textOnPrimary} />
                      <Text style={styles.actionButtonText}>Goedkeuren</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.closeButtonBottom} onPress={onClose}>
                <Text style={styles.closeButtonText}>Sluiten</Text>
              </TouchableOpacity>
            )}
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
    padding: Spacing.xl,
  },
  popup: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    width: '100%',
    maxWidth: 600,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flex: 1,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  urgencyBadge: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  urgencyText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.5,
  },
  residentName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  dateText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  closeButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.md,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  infoCard: {
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
    textAlign: 'right',
    flex: 1,
    marginLeft: Spacing.md,
  },
  statusText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    textAlign: 'right',
  },
  changeItem: {
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  fieldName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  changeBox: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  changeLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
    fontWeight: FontWeight.semibold,
  },
  oldValue: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  newValue: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: Spacing.md,
  },
  footer: {
    padding: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
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
  },
  approveButton: {
    backgroundColor: Colors.success,
  },
  rejectButton: {
    backgroundColor: Colors.error,
  },
  actionButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textOnPrimary,
  },
  closeButtonBottom: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textOnPrimary,
  },
});
