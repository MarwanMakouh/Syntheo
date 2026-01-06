import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadows } from '@/constants';
import type { Note } from '@/types/note';

interface NotificationsDropdownProps {
  visible: boolean;
  notes: Note[];
  residents: { resident_id: number; name: string }[];
  onClose: () => void;
}

export function NotificationsDropdown({
  visible,
  notes,
  residents,
  onClose,
}: NotificationsDropdownProps) {
  const router = useRouter();

  if (!visible) return null;

  const getResidentName = (residentId: number) => {
    return residents.find(r => r.resident_id === residentId)?.name || 'Onbekend';
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Hoog':
        return '#E74C3C';
      case 'Matig':
        return '#F39C12';
      case 'Laag':
        return '#27AE60';
      default:
        return Colors.textSecondary;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const created = new Date(timestamp);
    const diffMinutes = Math.floor((now.getTime() - created.getTime()) / 60000);

    if (diffMinutes < 60) return `${diffMinutes} min geleden`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} uur geleden`;
    return `${Math.floor(diffMinutes / 1440)} dagen geleden`;
  };

  const handleNoteClick = (note: Note) => {
    onClose();
    if (note.resident_id) {
      router.push(`/(tabs)/bewoners/${note.resident_id}` as any);
    }
  };

  const handleViewAll = () => {
    onClose();
    router.push('/admin/dashboard-meldingen' as any);
  };

  return (
    <>
      {/* Backdrop */}
      <TouchableOpacity
        style={styles.backdrop}
        onPress={onClose}
        activeOpacity={1}
      />

      {/* Dropdown */}
      <View style={styles.dropdown}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Recente Meldingen</Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {notes.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="notifications-none" size={48} color={Colors.textSecondary} />
              <Text style={styles.emptyText}>Geen meldingen</Text>
            </View>
          ) : (
            notes.map((note) => (
              <TouchableOpacity
                key={note.note_id}
                style={styles.noteItem}
                onPress={() => handleNoteClick(note)}
                activeOpacity={0.7}
              >
                <View style={styles.noteHeader}>
                  <View style={styles.noteLeft}>
                    <View
                      style={[
                        styles.urgencyDot,
                        { backgroundColor: getUrgencyColor(note.urgency) },
                      ]}
                    />
                    <Text style={styles.residentName}>
                      {getResidentName(note.resident_id)}
                    </Text>
                  </View>
                  <Text style={styles.timeAgo}>{getTimeAgo(note.created_at)}</Text>
                </View>
                <Text style={styles.noteContent} numberOfLines={2}>
                  {note.content}
                </Text>
                <View style={styles.noteFooter}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{note.category}</Text>
                  </View>
                  <Text style={styles.urgencyText}>{note.urgency}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {notes.length > 0 && (
          <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAll}>
            <Text style={styles.viewAllText}>Bekijk alle meldingen</Text>
            <MaterialIcons name="arrow-forward" size={16} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  dropdown: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 400,
    maxHeight: 500,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.dropdown,
    zIndex: 10000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  scrollView: {
    maxHeight: 400,
  },
  emptyState: {
    padding: Spacing['4xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  noteItem: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  noteLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  urgencyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  residentName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  timeAgo: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  noteContent: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    lineHeight: 18,
  },
  noteFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  categoryText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  urgencyText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  viewAllText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
});
