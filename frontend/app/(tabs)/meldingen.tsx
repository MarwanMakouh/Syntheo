import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { MeldingenFilterDropdown } from '@/components/MeldingenFilterDropdown';
import { MeldingCard } from '@/components/MeldingCard';
import { MeldingDetailsModal } from '@/components/MeldingDetailsModal';
import { NieuweMeldingModal } from '@/components';
import { getResidentById, getUserById, residents } from '@/Services/API';
import { fetchNotes, createNote } from '@/Services/notesApi';
import type { Note } from '@/types/note';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Layout } from '@/constants';

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

// Format timestamp for modal
const formatTimestamp = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}-${month}-${year}, ${hours}:${minutes}`;
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

// Map status to display text
const getStatusDisplayText = (status: 'open' | 'in_behandeling' | 'afgehandeld'): string => {
  switch (status) {
    case 'open':
      return 'Open';
    case 'in_behandeling':
      return 'Behandeling';
    case 'afgehandeld':
      return 'Afgehandeld';
    default:
      return 'Open';
  }
};

export default function MeldingenScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMelding, setSelectedMelding] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showNewMeldingModal, setShowNewMeldingModal] = useState(false);

  // Fetch notes from backend on mount
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedNotes = await fetchNotes();
      setNotes(fetchedNotes);
    } catch (err) {
      console.error('Failed to load notes:', err);
      setError('Kon meldingen niet laden. Zorg ervoor dat de backend server draait.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewMelding = () => {
    setShowNewMeldingModal(true);
  };

  const handleSaveNewMelding = async (melding: {
    type: string;
    content: string;
    urgency: 'Laag' | 'Matig' | 'Hoog';
    resident_id?: number;
  }) => {
    try {
      await createNote({
        resident_id: melding.resident_id,
        category: melding.type,
        urgency: melding.urgency,
        content: melding.content,
      });
      setShowNewMeldingModal(false);
      // Refresh the notes list
      await loadNotes();
      alert('Melding succesvol opgeslagen!');
    } catch (err) {
      console.error('Failed to create note:', err);
      alert('Fout bij opslaan van melding. Probeer opnieuw.');
    }
  };

  const handleOpenMelding = (note: any) => {
    const resident = getResidentById(note.resident_id);
    const author = getUserById(note.author_id);
    const status = getStatus(note);

    setSelectedMelding({
      residentName: resident?.name || 'Onbekend',
      category: note.category,
      urgency: note.urgency,
      reportedBy: author?.name || 'Onbekend',
      timestamp: formatTimestamp(note.created_at),
      description: note.content,
      status: getStatusDisplayText(status),
    });
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedMelding(null);
  };

  const handleSaveMelding = (status: string) => {
    console.log('Save melding with status:', status);
    // Here you would update the melding in your backend/state
  };

  // Show loading state
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Meldingen laden...</Text>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <MaterialIcons name="error-outline" size={48} color={Colors.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadNotes}>
          <Text style={styles.retryButtonText}>Opnieuw proberen</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Filter and New Button */}
      <View style={styles.header}>
        <MeldingenFilterDropdown />
        <TouchableOpacity style={styles.newButton} onPress={handleNewMelding}>
          <MaterialIcons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.newButtonText}>Nieuwe Melding</Text>
        </TouchableOpacity>
      </View>

      {/* Meldingen List */}
      <ScrollView style={styles.meldingenList}>
        {notes.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="inbox" size={64} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>Geen meldingen gevonden</Text>
          </View>
        ) : (
          notes.map((note) => {
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
                onPress={() => handleOpenMelding(note)}
              />
            );
          })
        )}
      </ScrollView>

      {/* Details Modal */}
      {selectedMelding && (
        <MeldingDetailsModal
          visible={modalVisible}
          onClose={handleCloseModal}
          melding={selectedMelding}
          onSave={handleSaveMelding}
        />
      )}

      {/* Nieuwe Melding Modal */}
      <NieuweMeldingModal
        visible={showNewMeldingModal}
        onClose={() => setShowNewMeldingModal(false)}
        onSave={handleSaveNewMelding}
        residents={residents}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.screenPaddingLarge,
  },
  loadingText: {
    marginTop: Spacing.lg,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  errorText: {
    marginTop: Spacing.lg,
    fontSize: FontSize.md,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.screenPaddingLarge,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  retryButtonText: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: Spacing.lg,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.screenPaddingLarge,
    paddingTop: Layout.screenPadding,
    paddingBottom: Layout.screenPadding,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: Layout.screenPadding,
    zIndex: 1000,
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  newButtonText: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  meldingenList: {
    flex: 1,
    paddingHorizontal: Layout.screenPaddingLarge,
    paddingTop: Layout.screenPadding,
  },
});
