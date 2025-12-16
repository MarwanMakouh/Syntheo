import { StyleSheet, View, ScrollView } from 'react-native';
import { MeldingenHeader } from '@/components/MeldingenHeader';
import { MeldingenFilterBar } from '@/components/MeldingenFilterBar';
import { MeldingCard } from '@/components/MeldingCard';
import { notes, getResidentById } from '@/Services/API';

// Helper function to format time ago
const getTimeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} min geleden`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} uur geleden`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} dag${days > 1 ? 'en' : ''} geleden`;
  }
};

// Get status for each note
const getStatus = (note: any): 'open' | 'in_behandeling' | 'afgehandeld' => {
  if (note.is_resolved) {
    return 'afgehandeld';
  }
  // Check if note has been viewed/acknowledged (for demo, we'll mark some as "in behandeling")
  if (note.note_id === 4 || note.note_id === 6) {
    return 'in_behandeling';
  }
  return 'open';
};

export default function MeldingenScreen() {
  const handleNewMelding = () => {
    console.log('Create new melding');
  };

  const handleViewMelding = (noteId: number) => {
    console.log('View melding:', noteId);
  };

  return (
    <View style={styles.container}>
      <MeldingenHeader onNewMelding={handleNewMelding} />
      <MeldingenFilterBar />

      {/* Meldingen List */}
      <ScrollView style={styles.meldingenList}>
        {notes.map((note) => {
          const resident = getResidentById(note.resident_id);
          const status = getStatus(note);

          return (
            <MeldingCard
              key={note.note_id}
              residentName={resident?.name || 'Onbekend'}
              description={note.content}
              timeAgo={getTimeAgo(note.created_at)}
              urgency={note.urgency as 'Hoog' | 'Matig' | 'Laag'}
              status={status}
              onView={() => handleViewMelding(note.note_id)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  meldingenList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});
