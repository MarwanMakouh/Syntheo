import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/constants';
import type { Note } from '@/types/note';

interface NoteCardProps {
  note: Note;
  residentName: string;
  authorName: string;
  onView: () => void;
  onResolve?: () => void;
  onUnresolve?: () => void;
  onDelete?: () => void;
}

export function NoteCard({ note, residentName, authorName, onView, onResolve, onUnresolve, onDelete }: NoteCardProps) {
  const getUrgencyColor = () => {
    switch (note.urgency) {
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

  const isAssigned = (n: any) => {
    const val = n?.assigned_to ?? n?.assignedTo ?? n?.assignee ?? n?.assigned_user ?? n?.assigned_user_id ?? n?.assignedName ?? n?.assigned?.name;
    if (val === null || val === undefined) return false;
    if (typeof val === 'string') return val.trim() !== '';
    return !!val;
  };

  const getStatusInfo = () => {
    if (note.is_resolved) {
      return { label: 'Afgehandeld', color: '#27AE60' };
    }
    if (isAssigned(note)) {
      return { label: 'In behandeling', color: '#F39C12' };
    }
    return { label: 'Open', color: '#E74C3C' };
  };

  const getAssignedName = (n: any) => {
    const val = n?.assigned_to ?? n?.assignedTo ?? n?.assignee ?? n?.assigned_user ?? n?.assigned_user_id ?? n?.assignedName ?? n?.assigned?.name;
    if (!val) return null;
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return String(val);
    if (typeof val === 'object') return val.name ?? val.email ?? JSON.stringify(val);
    return String(val);
  };

  const statusInfo = getStatusInfo();
  const urgencyColor = getUrgencyColor();

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const created = new Date(timestamp);
    const diffMinutes = Math.floor((now.getTime() - created.getTime()) / 60000);

    if (diffMinutes < 60) return `${diffMinutes} min geleden`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} uur geleden`;
    return `${Math.floor(diffMinutes / 1440)} dagen geleden`;
  };

  return (
    <View style={[styles.card, { borderLeftColor: urgencyColor }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.dot, { backgroundColor: urgencyColor }]} />
          <Text style={styles.residentName}>{residentName}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{note.category}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
            <Text style={styles.statusText}>{statusInfo.label}</Text>
          </View>
          <TouchableOpacity style={styles.viewButton} onPress={onView}>
            <Text style={styles.viewButtonText}>Bekijken</Text>
          </TouchableOpacity>
          {onResolve && (
            <TouchableOpacity
              style={[styles.actionButton, styles.resolveButton]}
              onPress={onResolve}
            >
              <MaterialIcons name="check-circle" size={18} color={Colors.background} />
            </TouchableOpacity>
          )}
          {onUnresolve && (
            <TouchableOpacity
              style={[styles.actionButton, styles.unresolveButton]}
              onPress={onUnresolve}
            >
              <MaterialIcons name="refresh" size={18} color={Colors.background} />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={onDelete}
            >
              <MaterialIcons name="delete" size={18} color={Colors.background} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Text style={styles.content}>{note.content}</Text>

      <View style={styles.footer}>
        <Text style={styles.author}>{authorName}</Text>
        <Text style={styles.separator}>•</Text>
        <Text style={styles.time}>{getTimeAgo(note.created_at)}</Text>
        {isAssigned(note) && (
          <>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.assigned}>
              Toegewezen aan: {getAssignedName(note)}
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  residentName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  statusText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.background,
  },
  viewButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  viewButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.background,
  },
  content: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  author: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  separator: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  time: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  assigned: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resolveButton: {
    backgroundColor: '#27AE60',
  },
  unresolveButton: {
    backgroundColor: '#F39C12',
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
  },
});
