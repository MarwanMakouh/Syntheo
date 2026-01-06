import { useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { AdminLayout, ConfirmationModal } from '@/components/admin';
import { StatsCard } from '@/components/admin/stats-card';
import { NoteCard } from '@/components/admin/note-card';
import { NotesFilters } from '@/components/admin/notes-filters';
import { fetchNotes, resolveNote, unresolveNote, deleteNote } from '@/Services/notesApi';
import { fetchResidents } from '@/Services/residentsApi';
import { fetchUsers } from '@/Services';
import type { Note } from '@/types/note';
import type { Resident } from '@/types/resident';
import type { User } from '@/types/user';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Layout } from '@/constants';

export default function DashboardMeldingenScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load data from API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [notesData, residentsData, usersData] = await Promise.all([
        fetchNotes(),
        fetchResidents(),
        fetchUsers(),
      ]);
      setNotes(notesData);
      setResidents(residentsData);
      setUsers(usersData);
    } catch (err) {
      setError('Fout bij het laden van meldingen');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const total = notes.length;
    const open = notes.filter((n) => !n.is_resolved && !(n as any).assigned_to).length;
    const inProgress = notes.filter((n) => !n.is_resolved && (n as any).assigned_to).length;
    const resolved = notes.filter((n) => n.is_resolved).length;
    const urgent = notes.filter((n) => n.urgency === 'Hoog').length;

    return { total, open, inProgress, resolved, urgent };
  }, []);

  // Filter notes
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      // Urgency filter
      const matchesUrgency = urgencyFilter === 'all' || note.urgency === urgencyFilter;

      // Category filter
      const matchesCategory = categoryFilter === 'all' || note.category === categoryFilter;

      // Status filter
      let matchesStatus = true;
      if (statusFilter === 'open') {
        matchesStatus = !note.is_resolved && !(note as any).assigned_to;
      } else if (statusFilter === 'in_progress') {
        matchesStatus = !note.is_resolved && !!(note as any).assigned_to;
      } else if (statusFilter === 'resolved') {
        matchesStatus = note.is_resolved;
      }

      // Search filter
      const resident = residents.find((r) => r.resident_id === note.resident_id);
      const author = users.find((u) => u.user_id === note.author_id);
      const matchesSearch =
        searchQuery === '' ||
        resident?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        author?.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Date filter (basic - you can enhance this)
      const matchesDate = dateFilter === '' || note.created_at.startsWith(dateFilter);

      return matchesUrgency && matchesCategory && matchesStatus && matchesSearch && matchesDate;
    });
  }, [urgencyFilter, categoryFilter, statusFilter, dateFilter, searchQuery]);

  const handleViewNote = (noteId: number) => {
    const note = notes.find(n => n.note_id === noteId);
    if (!note || !note.resident_id) return;

    // Navigate to resident detail page
    router.push(`/(tabs)/bewoners/${note.resident_id}` as any);
  };

  const handleResolveNote = async (noteId: number) => {
    try {
      await resolveNote(noteId);
      await loadData();
      Alert.alert('Succes', 'Melding succesvol afgehandeld');
    } catch (err) {
      console.error('Error resolving note:', err);
      Alert.alert('Fout', 'Kon melding niet afhandelen');
    }
  };

  const handleUnresolveNote = async (noteId: number) => {
    try {
      await unresolveNote(noteId);
      await loadData();
      Alert.alert('Succes', 'Melding succesvol heropend');
    } catch (err) {
      console.error('Error unresolving note:', err);
      Alert.alert('Fout', 'Kon melding niet heropenen');
    }
  };

  const handleDeleteNote = (note: Note) => {
    setNoteToDelete(note);
    setShowDeleteModal(true);
  };

  const confirmDeleteNote = async () => {
    if (!noteToDelete) return;

    try {
      setIsDeleting(true);
      await deleteNote(noteToDelete.note_id);
      await loadData();
      setShowDeleteModal(false);
      setNoteToDelete(null);
      Alert.alert('Succes', 'Melding succesvol verwijderd');
    } catch (err) {
      console.error('Error deleting note:', err);
      Alert.alert('Fout', 'Kon melding niet verwijderen');
    } finally {
      setIsDeleting(false);
    }
  };

  const getResidentName = (residentId: number) => {
    return residents.find((r) => r.resident_id === residentId)?.name || 'Onbekend';
  };

  const getAuthorName = (authorId: number) => {
    return users.find((u) => u.user_id === authorId)?.name || 'Onbekend';
  };

  return (
    <AdminLayout activeRoute="meldingen">
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <MaterialIcons name="info" size={32} color={Colors.primary} />
              <Text style={styles.pageTitle}>Meldingen</Text>
            </View>
            <Text style={styles.breadcrumb}>Home / Meldingen</Text>
          </View>

          {/* Loading State */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Meldingen laden...</Text>
            </View>
          ) : error ? (
            /* Error State */
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={64} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadData}>
                <Text style={styles.retryButtonText}>Opnieuw proberen</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Stats Cards */}
              <View style={styles.statsContainer}>
                <StatsCard label="Totaal" value={stats.total} color="#34C759" />
                <StatsCard label="Open" value={stats.open} color="#E74C3C" />
                <StatsCard label="In behandeling" value={stats.inProgress} color="#F39C12" />
                <StatsCard label="Afgehandeld" value={stats.resolved} color="#27AE60" />
                <StatsCard label="Urgent" value={stats.urgent} color="#E74C3C" />
              </View>

              {/* Filters */}
              <NotesFilters
                urgencyFilter={urgencyFilter}
                categoryFilter={categoryFilter}
                statusFilter={statusFilter}
                dateFilter={dateFilter}
                searchQuery={searchQuery}
                onUrgencyFilterChange={setUrgencyFilter}
                onCategoryFilterChange={setCategoryFilter}
                onStatusFilterChange={setStatusFilter}
                onDateFilterChange={setDateFilter}
                onSearchChange={setSearchQuery}
              />

              {/* Notes List */}
              {filteredNotes.length === 0 ? (
                <View style={styles.emptyState}>
                  <MaterialIcons name="speaker-notes-off" size={64} color={Colors.textSecondary} />
                  <Text style={styles.emptyText}>Geen meldingen gevonden</Text>
                  <Text style={styles.emptySubtext}>
                    Probeer je filters aan te passen of verwijder de zoekterm.
                  </Text>
                </View>
              ) : (
                <View style={styles.notesList}>
                  {filteredNotes.map((note) => (
                    <NoteCard
                      key={note.note_id}
                      note={note}
                      residentName={getResidentName(note.resident_id)}
                      authorName={getAuthorName(note.author_id)}
                      onView={() => handleViewNote(note.note_id)}
                      onResolve={note.is_resolved ? undefined : () => handleResolveNote(note.note_id)}
                      onUnresolve={note.is_resolved ? () => handleUnresolveNote(note.note_id) : undefined}
                      onDelete={() => handleDeleteNote(note)}
                    />
                  ))}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        visible={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setNoteToDelete(null);
        }}
        onConfirm={confirmDeleteNote}
        title="Melding Verwijderen"
        message={`Weet je zeker dat je deze melding wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.`}
        confirmText="Verwijderen"
        cancelText="Annuleren"
        isLoading={isDeleting}
        type="danger"
      />
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  content: {
    padding: Layout.screenPaddingLarge,
    ...Platform.select({
      web: {
        maxWidth: 1400,
        alignSelf: 'center',
        width: '100%',
      },
    }),
  },
  header: {
    marginBottom: Spacing['2xl'],
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xs,
  },
  pageTitle: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  breadcrumb: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing['2xl'],
    flexWrap: 'wrap',
  },
  notesList: {
    flex: 1,
  },
  emptyState: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing['4xl'],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  emptyText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['4xl'],
    minHeight: 400,
  },
  loadingText: {
    marginTop: Spacing.lg,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['4xl'],
    minHeight: 400,
  },
  errorText: {
    marginTop: Spacing.lg,
    fontSize: FontSize.lg,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
  },
  retryButtonText: {
    color: Colors.background,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
});
