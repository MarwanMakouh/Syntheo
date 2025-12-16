import { StyleSheet, View, Text } from 'react-native';
import type { Note } from '@/types';

interface NotitieCardProps {
  note: Note;
  authorName: string;
}

export function NotitieCard({ note, authorName }: NotitieCardProps) {
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
        return '#FFF4E6'; // Licht oranje
      case 'Matig':
        return '#FFF9E6'; // Licht geel
      case 'Laag':
        return '#F0F0F0'; // Licht grijs
      default:
        return '#FFFFFF';
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'Hoog':
        return 'AANDACHT';
      case 'Matig':
        return 'MATIG';
      case 'Laag':
        return 'INFO';
      default:
        return urgency.toUpperCase();
    }
  };

  const getUrgencyTextColor = (urgency: string) => {
    switch (urgency) {
      case 'Hoog':
        return '#D97706'; // Oranje
      case 'Matig':
        return '#CA8A04'; // Geel
      case 'Laag':
        return '#666666'; // Grijs
      default:
        return '#000000';
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  urgencyLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  category: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateTime: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
  },
  separator: {
    fontSize: 14,
    color: '#999999',
    marginHorizontal: 8,
  },
  author: {
    fontSize: 14,
    color: '#666666',
  },
  content: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  resolvedBadge: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  resolvedText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
