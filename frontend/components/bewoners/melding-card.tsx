import { StyleSheet, View, Text } from 'react-native';
import type { Note } from '@/types';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight, LineHeight } from '@/constants';

interface BewonerMeldingCardProps {
  note: Note;
  authorName: string;
}

export function BewonerMeldingCard({ note, authorName }: BewonerMeldingCardProps) {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}-${month}, ${hours}:${minutes}`;
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Hoog':
        return Colors.urgencyHighBg;
      case 'Matig':
        return Colors.urgencyMediumBg;
      case 'Laag':
        return Colors.urgencyLowBg;
      default:
        return Colors.background;
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'Hoog':
        return 'URGENT';
      case 'Matig':
        return 'AANDACHT';
      case 'Laag':
        return 'INFO';
      default:
        return urgency.toUpperCase();
    }
  };

  const getUrgencyTextColor = (urgency: string) => {
    switch (urgency) {
      case 'Hoog':
        return Colors.error;
      case 'Matig':
        return Colors.warningAlt;
      case 'Laag':
        return Colors.textSecondary;
      default:
        return Colors.textPrimary;
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: getUrgencyColor(note.urgency) }]}>
      <View style={styles.header}>
        <Text style={[styles.urgencyLabel, { color: getUrgencyTextColor(note.urgency) }]}>
          {getUrgencyLabel(note.urgency)}
        </Text>
        <Text style={styles.category}>{note.category}</Text>
      </View>

      <View style={styles.meta}>
        <Text style={styles.dateTime}>{formatDateTime(note.created_at)}</Text>
        <Text style={styles.separator}>·</Text>
        <Text style={styles.author}>{authorName}</Text>
      </View>

      <Text style={styles.content}>{note.content}</Text>

      {note.is_resolved && (
        <View style={styles.resolvedBadge}>
          <Text style={styles.resolvedText}>Opgelost</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  urgencyLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.5,
  },
  category: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  dateTime: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
  },
  separator: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    marginHorizontal: Spacing.md,
  },
  author: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  content: {
    fontSize: FontSize.md,
    color: Colors.textBody,
    lineHeight: LineHeight.relaxed,
  },
  resolvedBadge: {
    marginTop: Spacing.lg,
    alignSelf: 'flex-start',
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.lg,
  },
  resolvedText: {
    fontSize: FontSize.xs,
    color: Colors.textOnPrimary,
    fontWeight: FontWeight.semibold,
  },
});
