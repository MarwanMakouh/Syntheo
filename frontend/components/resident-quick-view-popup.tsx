import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants';
import { formatDate } from '@/utils/date';

interface ResidentQuickViewPopupProps {
  visible: boolean;
  onClose: () => void;
  resident: any;
  roomNumber?: string;
  urgentNotes?: any[];
  onNotePress?: (note: any) => void;
}

export function ResidentQuickViewPopup({
  visible,
  onClose,
  resident,
  roomNumber,
  urgentNotes = [],
  onNotePress,
}: ResidentQuickViewPopupProps) {
  if (!resident) return null;

  const age = resident.date_of_birth
    ? new Date().getFullYear() - new Date(resident.date_of_birth).getFullYear()
    : null;

  const contacts = resident.contacts || [];
  const allergies = resident.allergies || [];

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
              <View style={styles.avatarCircle}>
                <MaterialIcons name="person" size={24} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.residentName}>{resident.name}</Text>
                <View style={styles.residentMeta}>
                  {roomNumber && (
                    <View style={styles.metaItem}>
                      <MaterialIcons name="meeting-room" size={14} color={Colors.textSecondary} />
                      <Text style={styles.metaText}>Kamer {roomNumber}</Text>
                    </View>
                  )}
                  {age && (
                    <View style={styles.metaItem}>
                      <MaterialIcons name="cake" size={14} color={Colors.textSecondary} />
                      <Text style={styles.metaText}>{age} jaar</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Urgente Notities */}
            {urgentNotes.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <MaterialIcons name="warning" size={18} color={Colors.error} />
                  <Text style={styles.sectionTitle}>Urgente Notities ({urgentNotes.length})</Text>
                </View>
                {urgentNotes.slice(0, 3).map((note, index) => (
                  <TouchableOpacity
                    key={note.note_id || index}
                    style={styles.noteCard}
                    onPress={() => onNotePress && onNotePress(note)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.noteHeader}>
                      <Text style={styles.noteCategory}>{note.category}</Text>
                      <Text style={styles.noteDate}>
                        {formatDate(note.created_at, 'dd-MM HH:mm')}
                      </Text>
                    </View>
                    <Text style={styles.noteDescription}>
                      {note.content}
                    </Text>
                    {onNotePress && (
                      <MaterialIcons
                        name="chevron-right"
                        size={20}
                        color={Colors.textSecondary}
                        style={styles.noteChevron}
                      />
                    )}
                  </TouchableOpacity>
                ))}
                {urgentNotes.length > 3 && (
                  <Text style={styles.moreText}>+ {urgentNotes.length - 3} meer</Text>
                )}
              </View>
            )}

            {/* Contactpersonen */}
            {contacts.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <MaterialIcons name="contacts" size={18} color={Colors.primary} />
                  <Text style={styles.sectionTitle}>Contactpersonen</Text>
                </View>
                {contacts.slice(0, 2).map((contact: any, index: number) => (
                  <View key={contact.contact_id || index} style={styles.contactCard}>
                    <View style={styles.contactRow}>
                      <Text style={styles.contactName}>{contact.name}</Text>
                      <Text style={styles.contactRelation}>{contact.relationship}</Text>
                    </View>
                    {contact.phone_number && (
                      <View style={styles.contactDetail}>
                        <Ionicons name="call-outline" size={14} color={Colors.textSecondary} />
                        <Text style={styles.contactDetailText}>{contact.phone_number}</Text>
                      </View>
                    )}
                  </View>
                ))}
                {contacts.length > 2 && (
                  <Text style={styles.moreText}>+ {contacts.length - 2} meer</Text>
                )}
              </View>
            )}

            {/* Allergieën */}
            {allergies.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <MaterialIcons name="medical-services" size={18} color={Colors.error} />
                  <Text style={styles.sectionTitle}>Allergieën</Text>
                </View>
                <View style={styles.allergyContainer}>
                  {allergies.map((allergy: any, index: number) => (
                    <View key={allergy.allergy_id || index} style={styles.allergyPill}>
                      <Text style={styles.allergyText}>{allergy.symptom}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Geboortedatum */}
            <View style={styles.section}>
              <View style={styles.infoRow}>
                <MaterialIcons name="calendar-today" size={16} color={Colors.textSecondary} />
                <Text style={styles.infoLabel}>Geboortedatum:</Text>
                <Text style={styles.infoValue}>
                  {formatDate(resident.date_of_birth, 'dd-MM-yyyy')}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.closeButtonBottom} onPress={onClose}>
              <Text style={styles.closeButtonText}>Sluiten</Text>
            </TouchableOpacity>
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
    maxWidth: 500,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.selectedBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  residentName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  residentMeta: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  closeButton: {
    padding: Spacing.xs,
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
  noteCard: {
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.error,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  noteCategory: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.error,
  },
  noteDate: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  noteDescription: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    lineHeight: 18,
    flex: 1,
  },
  noteChevron: {
    position: 'absolute',
    right: Spacing.md,
    top: '50%',
    marginTop: -10,
  },
  moreText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
  contactCard: {
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  contactName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  contactRelation: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  contactDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  contactDetailText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  allergyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  allergyPill: {
    backgroundColor: Colors.alertBackground,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  allergyText: {
    fontSize: FontSize.sm,
    color: Colors.error,
    fontWeight: FontWeight.medium,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  infoLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
  },
  footer: {
    padding: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
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
