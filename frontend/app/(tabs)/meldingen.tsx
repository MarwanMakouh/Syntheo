import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Platform } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { MeldingenFilterDropdown } from '@/components/meldingen/meldingen-filter-dropdown';
import { MeldingCard } from '@/components/meldingen/melding-card';
import { MeldingDetailsModal } from '@/components/meldingen/melding-details-modal';
import { NieuweMeldingModal } from '@/components';
import { StaffLayout } from '@/components/staff';
import { PageHeader, LoadingState, ErrorState } from '@/components/ui';
import { fetchNotes, createNote, resolveNote, unresolveNote } from '@/Services/notesApi';
import { useAuth } from '@/contexts/AuthContext';
import { fetchResidents } from '@/Services/residentsApi';
import type { Note } from '@/types/note';
import type { Resident } from '@/types/resident';
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
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMelding, setSelectedMelding] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showNewMeldingModal, setShowNewMeldingModal] = useState(false);
  const [filters, setFilters] = useState({ urgentie: 'all', status: 'all' });

  const { currentUser, allUsers } = useAuth();

  // Helper functions to get resident and user by ID
  const getResidentById = (id: number): Resident | undefined => {
    return residents.find(r => r.resident_id === id);
  };

  const getUserById = (id: number): { user_id: number; name: string } | undefined => {
    return allUsers?.find(u => u.user_id === id);
  };

  // Fetch notes and residents from backend on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load both notes and residents in parallel
      const [fetchedNotes, fetchedResidents] = await Promise.all([
        fetchNotes(),
        fetchResidents()
      ]);

      setNotes(fetchedNotes);
      setResidents(fetchedResidents);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Kon gegevens niet laden. Zorg ervoor dat de backend server draait.');
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
      const authorId = currentUser?.user_id || 1;
      await createNote({
        resident_id: melding.resident_id,
        category: melding.type,
        urgency: melding.urgency,
        content: melding.content,
        author_id: authorId,
      });
      setShowNewMeldingModal(false);
      // Refresh the notes list
      await loadData();
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
      noteId: note.note_id, // Added note_id
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

  const handleSaveMelding = async (noteId: number, status: string) => {
    try {
      // Map status to API action
      if (status === 'Afgehandeld') {
        // Resolve the note
        await resolveNote(noteId, currentUser?.user_id || 1);
      } else if (status === 'Open') {
        // Unresolve the note
        await unresolveNote(noteId);
      }
      // For 'Behandeling' we don't change the resolved status, only display differs

      // Refresh the notes list to show updated status
      await loadData();
    } catch (err) {
      console.error('Failed to update note status:', err);
      alert('Fout bij bijwerken van status. Probeer opnieuw.');
    }
  };

  const handleFilterChange = (newFilters: { urgentie: string; status: string }) => {
    setFilters(newFilters);
  };

  // Filter notes based on selected filters
  const filteredNotes = notes.filter((note) => {
    const noteStatus = getStatus(note);

    // Filter by urgentie
    if (filters.urgentie !== 'all' && note.urgency !== filters.urgentie) {
      return false;
    }

    // Filter by status
    if (filters.status !== 'all' && noteStatus !== filters.status) {
      return false;
    }

    return true;
  });

  // Show loading state
  if (loading) {
    return (
      <StaffLayout activeRoute="meldingen">
        <LoadingState message="Meldingen laden..." />
      </StaffLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <StaffLayout activeRoute="meldingen">
        <ErrorState message={error} onRetry={loadData} />
      </StaffLayout>
    );
  }

  return (
    <StaffLayout activeRoute="meldingen">
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Page Header */}
          <PageHeader
            title="Meldingen"
            actionButton={{
              label: 'Nieuwe Melding',
              onPress: handleNewMelding,
              icon: <MaterialIcons name="add" size={20} color={Colors.textOnPrimary} />,
            }}
          />

          {/* Filter */}
          <View style={styles.filterContainer}>
            <MeldingenFilterDropdown onFilterChange={handleFilterChange} />
          </View>

          {/* Meldingen List */}
          {filteredNotes.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="inbox" size={64} color={Colors.textSecondary} />
              <Text style={styles.emptyText}>Geen meldingen gevonden</Text>
            </View>
          ) : (
            <View style={styles.meldingenList}>
              {filteredNotes.map((note) => {
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
              })}
            </View>
          )}
        </View>
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
    </StaffLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  content: {
    padding: Spacing['2xl'],
    maxWidth: Layout.webContentMaxWidth,
    width: '100%',
    alignSelf: 'center',
    ...Platform.select({
      web: {
        paddingTop: Spacing['3xl'],
      },
    }),
  },
  filterContainer: {
    marginBottom: Spacing.xl,
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
  meldingenList: {
    gap: Spacing.md,
  },
});
