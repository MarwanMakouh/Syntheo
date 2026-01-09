import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, ActivityIndicator, Platform, TextInput } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { NavigationBar } from '@/components';
import { MeldingDetailsPopup } from '@/components/melding-details-popup';
import { fetchNotes, resolveNote, unresolveNote } from '@/Services/notesApi';
import { fetchResidents } from '@/Services/residentsApi';
import { fetchUsers } from '@/Services/usersApi';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/utils/date';
import type { Note } from '@/types/note';
import type { Resident } from '@/types/resident';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Layout } from '@/constants';

type UrgencyFilter = 'all' | 'Hoog' | 'Matig' | 'Laag';
type StatusFilter = 'all' | 'open' | 'resolved';

export default function HoofdverplegerMeldingenScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMelding, setSelectedMelding] = useState<any>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  const { currentUser } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [fetchedNotes, fetchedResidents, fetchedUsers] = await Promise.all([
        fetchNotes(),
        fetchResidents(),
        fetchUsers(),
      ]);

      setNotes(fetchedNotes);
      setResidents(fetchedResidents);
      setUsers(fetchedUsers);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Kon gegevens niet laden. Zorg ervoor dat de backend server draait.');
    } finally {
      setLoading(false);
    }
  };

  const getResidentById = (id: number): Resident | undefined => {
    return residents.find(r => r.resident_id === id);
  };

  const getUserById = (id: number): any | undefined => {
    return users.find(u => u.user_id === id);
  };

  const handleMeldingPress = (note: Note) => {
    const resident = getResidentById(note.resident_id);
    const author = getUserById(note.author_id);

    setSelectedMelding({
      noteId: note.note_id,
      residentName: resident?.name || 'Onbekend',
      category: note.category,
      urgency: note.urgency,
      reportedBy: author?.name || 'Onbekend',
      timestamp: formatDate(note.created_at, 'dd-MM-yyyy, HH:mm'),
      description: note.content,
      status: note.is_resolved ? 'Afgehandeld' : 'Open',
      isResolved: note.is_resolved,
    });
    setPopupVisible(true);
  };

  const handleResolve = async () => {
    if (!selectedMelding || !currentUser) return;

    try {
      setIsResolving(true);
      await resolveNote(selectedMelding.noteId, currentUser.user_id);
      setPopupVisible(false);
      setSelectedMelding(null);
      await loadData();
    } catch (err) {
      console.error('Failed to resolve note:', err);
      alert('Kon melding niet afhandelen');
    } finally {
      setIsResolving(false);
    }
  };

  const handleUnresolve = async () => {
    if (!selectedMelding) return;

    try {
      setIsResolving(true);
      await unresolveNote(selectedMelding.noteId);
      setPopupVisible(false);
      setSelectedMelding(null);
      await loadData();
    } catch (err) {
      console.error('Failed to unresolve note:', err);
      alert('Kon melding niet heropenen');
    } finally {
      setIsResolving(false);
    }
  };

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

  // Filter and search notes
  const filteredNotes = notes.filter((note) => {
    // Filter by urgency
    if (urgencyFilter !== 'all' && note.urgency !== urgencyFilter) {
      return false;
    }

    // Filter by status
    if (statusFilter === 'open' && note.is_resolved) {
      return false;
    }

    if (statusFilter === 'resolved' && !note.is_resolved) {
      return false;
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const resident = getResidentById(note.resident_id);
      const residentName = resident?.name?.toLowerCase() || '';
      const category = note.category?.toLowerCase() || '';
      const content = note.content?.toLowerCase() || '';

      if (!residentName.includes(query) && !category.includes(query) && !content.includes(query)) {
        return false;
      }
    }

    return true;
  });

  // Sort notes: pending first, then by date
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (!a.is_resolved && b.is_resolved) return -1;
    if (a.is_resolved && !b.is_resolved) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <NavigationBar />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Laden...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <NavigationBar />
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NavigationBar />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.pageTitle}>Meldingen</Text>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: Colors.error }]}>
              {notes.filter(n => n.urgency === 'Hoog' && !n.is_resolved).length}
            </Text>
            <Text style={styles.statLabel}>Urgent</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: Colors.warningAlt || Colors.warning }]}>
              {notes.filter(n => n.urgency === 'Matig' && !n.is_resolved).length}
            </Text>
            <Text style={styles.statLabel}>Aandacht</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: Colors.textSecondary }]}>
              {notes.filter(n => !n.is_resolved).length}
            </Text>
            <Text style={styles.statLabel}>Open</Text>
          </View>
        </View>

        {/* Filters and Search Row */}
        <View style={styles.filtersSearchRow}>
          {/* Urgency Filter */}
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={urgencyFilter}
              onValueChange={(value) => setUrgencyFilter(value as UrgencyFilter)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Alle urgentie" value="all" />
              <Picker.Item label="Urgent" value="Hoog" />
              <Picker.Item label="Aandacht" value="Matig" />
              <Picker.Item label="Stabiel" value="Laag" />
            </Picker>
          </View>

          {/* Status Filter */}
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={statusFilter}
              onValueChange={(value) => setStatusFilter(value as StatusFilter)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Alle statussen" value="all" />
              <Picker.Item label="Open" value="open" />
              <Picker.Item label="Afgehandeld" value="resolved" />
            </Picker>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Zoek op bewoner, categorie of beschrijving..."
              placeholderTextColor={Colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                <MaterialIcons name="close" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Meldingen List */}
        {sortedNotes.map((note) => {
          const resident = getResidentById(note.resident_id);
          const author = getUserById(note.author_id);

          return (
            <TouchableOpacity
              key={note.note_id}
              style={[
                styles.meldingCard,
                !note.is_resolved && styles.meldingCardOpen,
                note.is_resolved && styles.meldingCardResolved,
              ]}
              onPress={() => handleMeldingPress(note)}
              activeOpacity={0.7}
            >
              {/* Urgency Badge */}
              <View
                style={[
                  styles.urgencyBadge,
                  { backgroundColor: getUrgencyBgColor(note.urgency) }
                ]}
              >
                <Text
                  style={[
                    styles.urgencyText,
                    { color: getUrgencyColor(note.urgency) }
                  ]}
                >
                  {note.urgency.toUpperCase()}
                </Text>
              </View>

              {/* Content */}
              <View style={styles.meldingContent}>
                {/* Header Row */}
                <View style={styles.meldingHeader}>
                  <Text style={[
                    styles.residentName,
                    note.is_resolved && styles.textMuted
                  ]}>
                    {resident?.name || 'Onbekend'}
                  </Text>
                  <View style={styles.headerRight}>
                    {note.is_resolved && (
                      <View style={styles.statusBadgeResolved}>
                        <Text style={styles.statusTextResolved}>
                          Afgehandeld
                        </Text>
                      </View>
                    )}
                    <MaterialIcons
                      name="chevron-right"
                      size={24}
                      color={note.is_resolved ? Colors.iconMuted || Colors.textSecondary : Colors.textSecondary}
                    />
                  </View>
                </View>

                {/* Info Row */}
                <View style={styles.infoSection}>
                  <View style={styles.infoItem}>
                    <MaterialIcons
                      name="label"
                      size={16}
                      color={note.is_resolved ? Colors.iconMuted || Colors.textSecondary : Colors.textSecondary}
                    />
                    <Text style={[
                      styles.infoText,
                      note.is_resolved && styles.textMuted
                    ]}>
                      {note.category}
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <MaterialIcons
                      name="access-time"
                      size={16}
                      color={note.is_resolved ? Colors.iconMuted || Colors.textSecondary : Colors.textSecondary}
                    />
                    <Text style={[
                      styles.infoText,
                      note.is_resolved && styles.textMuted
                    ]}>
                      {formatDate(note.created_at, 'dd-MM, HH:mm')}
                    </Text>
                  </View>
                </View>

                {/* Description */}
                <Text style={[
                  styles.descriptionText,
                  note.is_resolved && styles.textMuted
                ]} numberOfLines={2}>
                  {note.content}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {sortedNotes.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="inbox" size={64} color={Colors.iconMuted || Colors.textSecondary} />
            <Text style={styles.emptyText}>
              {searchQuery ? 'Geen meldingen gevonden voor deze zoekopdracht' : 'Geen meldingen gevonden'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Melding Details Popup */}
      <MeldingDetailsPopup
        visible={popupVisible}
        onClose={() => {
          setPopupVisible(false);
          setSelectedMelding(null);
        }}
        melding={selectedMelding}
        onResolve={handleResolve}
        onUnresolve={handleUnresolve}
        isResolving={isResolving}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  scrollContent: {
    padding: Layout.screenPaddingLarge,
    paddingBottom: Spacing['3xl'],
    ...Platform.select({
      web: {
        maxWidth: 1000,
        alignSelf: 'center',
        width: '100%',
      },
    }),
  },
  pageTitle: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing['2xl'],
  },

  // Stats Cards
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing['2xl'],
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FontSize['4xl'],
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },

  // Filters and Search Row
  filtersSearchRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: Colors.borderMedium || Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    overflow: 'hidden',
    minWidth: 180,
    height: 48,
    justifyContent: 'center',
    ...Platform.select({
      web: {
        minWidth: 200,
      },
      ios: {
        minWidth: 180,
      },
      android: {
        minWidth: 180,
      },
    }),
  },
  picker: {
    height: 48,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    backgroundColor: 'transparent',
    ...Platform.select({
      web: {
        outline: 'none',
        cursor: 'pointer',
      },
      ios: {
        // iOS has native styling
      },
      android: {
        marginLeft: Spacing.sm,
      },
    }),
  },
  pickerItem: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    height: 120,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderMedium || Colors.border,
    paddingHorizontal: Spacing.lg,
    height: 48,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  clearButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.sm,
  },

  // Melding Card
  meldingCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  meldingCardOpen: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  meldingCardResolved: {
    backgroundColor: Colors.backgroundSecondary,
    opacity: 0.75,
  },
  urgencyBadge: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    alignSelf: 'flex-start',
    borderBottomRightRadius: BorderRadius.md,
  },
  urgencyText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.5,
  },
  meldingContent: {
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  meldingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  residentName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  textMuted: {
    color: Colors.textMuted || Colors.textSecondary,
  },
  statusBadgeResolved: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    backgroundColor: '#d1fae5',
  },
  statusTextResolved: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: '#065f46',
  },
  infoSection: {
    flexDirection: 'row',
    gap: Spacing.xl,
    flexWrap: 'wrap',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  infoText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  descriptionText: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    lineHeight: 20,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['6xl'],
  },
  emptyText: {
    fontSize: FontSize.lg,
    color: Colors.textMuted || Colors.textSecondary,
    marginTop: Spacing.lg,
    textAlign: 'center',
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  loadingText: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
  },

  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
    padding: Spacing.xl,
  },
  errorText: {
    fontSize: FontSize.lg,
    color: Colors.error,
    textAlign: 'center',
  },
});
