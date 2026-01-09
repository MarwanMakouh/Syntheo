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

interface MeldingDetailsPopupProps {
  visible: boolean;
  onClose: () => void;
  melding: {
    noteId: number;
    residentName: string;
    category: string;
    urgency: string;
    reportedBy: string;
    timestamp: string;
    description: string;
    status: string;
    isResolved: boolean;
  };
  onResolve?: () => void;
  onUnresolve?: () => void;
  isResolving?: boolean;
}

export function MeldingDetailsPopup({
  visible,
  onClose,
  melding,
  onResolve,
  onUnresolve,
  isResolving = false,
}: MeldingDetailsPopupProps) {
  if (!melding) return null;

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Hoog':
        return Colors.urgencyHigh || Colors.error;
      case 'Matig':
        return Colors.urgencyMedium || Colors.warning;
      case 'Laag':
        return Colors.urgencyLow || Colors.textSecondary;
      default:
        return Colors.textSecondary;
    }
  };

  const getUrgencyBgColor = (urgency: string) => {
    switch (urgency) {
      case 'Hoog':
        return Colors.urgencyHighBg || '#fee2e2';
      case 'Matig':
        return Colors.urgencyMediumBg || '#fef3c7';
      case 'Laag':
        return Colors.urgencyLowBg || '#e5e7eb';
      default:
        return Colors.backgroundSecondary;
    }
  };

  const getStatusColor = (isResolved: boolean) => {
    return isResolved ? Colors.success : Colors.warning;
  };

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
                <Text style={styles.title}>Melding Details</Text>
                <View
                  style={[
                    styles.urgencyBadge,
                    { backgroundColor: getUrgencyBgColor(melding.urgency) }
                  ]}
                >
                  <Text style={[styles.urgencyText, { color: getUrgencyColor(melding.urgency) }]}>
                    {melding.urgency.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={styles.residentName}>{melding.residentName}</Text>
              <Text style={styles.dateText}>
                {melding.timestamp}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Categorie */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="label" size={18} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Categorie</Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.categoryText}>{melding.category}</Text>
              </View>
            </View>

            {/* Gemeld door */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="person" size={18} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Gemeld door</Text>
              </View>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Naam:</Text>
                  <Text style={styles.infoValue}>{melding.reportedBy}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Tijdstip:</Text>
                  <Text style={styles.infoValue}>{melding.timestamp}</Text>
                </View>
              </View>
            </View>

            {/* Beschrijving */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="description" size={18} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Beschrijving</Text>
              </View>
              <View style={styles.descriptionCard}>
                <Text style={styles.descriptionText}>{melding.description}</Text>
              </View>
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
                  <Text style={[styles.statusText, { color: getStatusColor(melding.isResolved) }]}>
                    {melding.isResolved ? 'Afgehandeld' : 'Open'}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer met action buttons */}
          <View style={styles.footer}>
            {!melding.isResolved && onResolve ? (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.closeButtonSecondary]}
                  onPress={onClose}
                  disabled={isResolving}
                >
                  <Text style={styles.closeButtonSecondaryText}>Sluiten</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.resolveButton]}
                  onPress={onResolve}
                  disabled={isResolving}
                >
                  {isResolving ? (
                    <ActivityIndicator size="small" color={Colors.textOnPrimary} />
                  ) : (
                    <>
                      <MaterialIcons name="check" size={18} color={Colors.textOnPrimary} />
                      <Text style={styles.actionButtonText}>Afhandelen</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            ) : melding.isResolved && onUnresolve ? (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.closeButtonSecondary]}
                  onPress={onClose}
                  disabled={isResolving}
                >
                  <Text style={styles.closeButtonSecondaryText}>Sluiten</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.unresolveButton]}
                  onPress={onUnresolve}
                  disabled={isResolving}
                >
                  {isResolving ? (
                    <ActivityIndicator size="small" color={Colors.textOnPrimary} />
                  ) : (
                    <>
                      <MaterialIcons name="replay" size={18} color={Colors.textOnPrimary} />
                      <Text style={styles.actionButtonText}>Heropenen</Text>
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
  categoryText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
  },
  statusText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    textAlign: 'right',
  },
  descriptionCard: {
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  descriptionText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    lineHeight: 22,
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
  resolveButton: {
    backgroundColor: Colors.success,
  },
  unresolveButton: {
    backgroundColor: Colors.warning,
  },
  closeButtonSecondary: {
    backgroundColor: Colors.border,
  },
  closeButtonSecondaryText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
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
