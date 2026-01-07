import { useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { AdminLayout, ResidentFormModal, ConfirmationModal, ResidentDetailsModal } from '@/components/admin';
import { ResidentCard } from '@/components/admin/resident-card';
import { ResidentsFilters } from '@/components/admin/residents-filters';
import { fetchResidents, createResident, updateResident, deleteResident } from '@/Services/residentsApi';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Layout } from '@/constants';
import type { Resident } from '@/types/resident';

export default function DashboardBewonersScreen() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roomFilter, setRoomFilter] = useState('all');
  const [allergyFilter, setAllergyFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('name_asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [showResidentModal, setShowResidentModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [residentToDelete, setResidentToDelete] = useState<Resident | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [viewingResident, setViewingResident] = useState<Resident | null>(null);

  // Fetch residents from API
  useEffect(() => {
    loadResidents();
  }, []);

  const loadResidents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchResidents();
      setResidents(data);
    } catch (err) {
      setError('Fout bij het laden van bewoners');
      console.error('Error loading residents:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Get room for resident (from resident data)
  const getRoomForResident = (resident: Resident) => {
    return resident.room ? { room_id: parseInt(resident.room.room_number), resident_id: resident.resident_id } : null;
  };

  // Check if resident has allergies (from resident data)
  const hasAllergies = (resident: Resident) => {
    return resident.allergies && resident.allergies.length > 0;
  };

  // Filter and sort residents
  const filteredResidents = useMemo(() => {
    let filtered = residents.filter((resident) => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        resident.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Room filter
      const room = getRoomForResident(resident);
      let matchesRoom = true;
      if (roomFilter !== 'all' && room) {
        const floorNumber = Math.floor(room.room_id / 100);
        matchesRoom = roomFilter === `floor${floorNumber}`;
      }

      // Allergy filter
      const residentHasAllergies = hasAllergies(resident);
      const matchesAllergy =
        allergyFilter === 'all' ||
        (allergyFilter === 'has' && residentHasAllergies) ||
        (allergyFilter === 'none' && !residentHasAllergies);

      return matchesSearch && matchesRoom && matchesAllergy;
    });

    // Sort residents
    filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'age_asc':
          return calculateAge(a.date_of_birth) - calculateAge(b.date_of_birth);
        case 'age_desc':
          return calculateAge(b.date_of_birth) - calculateAge(a.date_of_birth);
        case 'room_asc': {
          const roomA = getRoomForResident(a);
          const roomB = getRoomForResident(b);
          return (roomA?.room_id || 0) - (roomB?.room_id || 0);
        }
        case 'room_desc': {
          const roomA = getRoomForResident(a);
          const roomB = getRoomForResident(b);
          return (roomB?.room_id || 0) - (roomA?.room_id || 0);
        }
        default:
          return 0;
      }
    });

    return filtered;
  }, [residents, roomFilter, allergyFilter, sortOrder, searchQuery]);

  const handleNewResident = () => {
    setEditingResident(null);
    setShowResidentModal(true);
  };

  const handleSubmitResident = async (residentData: {
    name: string;
    date_of_birth: string;
    photo_url?: string;
  }) => {
    try {
      setIsCreating(true);

      if (editingResident) {
        // Update existing resident
        await updateResident(editingResident.resident_id, residentData);
        Alert.alert('Succes', 'Bewoner succesvol bijgewerkt');
      } else {
        // Create new resident
        await createResident(residentData);
        Alert.alert('Succes', 'Bewoner succesvol toegevoegd');
      }

      setShowResidentModal(false);
      setEditingResident(null);
      // Reload residents list
      loadResidents();
    } catch (err) {
      Alert.alert('Fout', editingResident ? 'Kon bewoner niet bijwerken' : 'Kon bewoner niet toevoegen');
      console.error('Error saving resident:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditResident = (resident: Resident) => {
    setEditingResident(resident);
    setShowResidentModal(true);
  };

  const handleDeleteResident = (resident: Resident) => {
    setResidentToDelete(resident);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!residentToDelete) return;

    try {
      setIsDeleting(true);
      await deleteResident(residentToDelete.resident_id);
      // Reload residents after deletion
      await loadResidents();
      setShowDeleteModal(false);
      setResidentToDelete(null);
      Alert.alert('Succes', 'Bewoner succesvol verwijderd');
    } catch (err) {
      console.error('Error deleting resident:', err);
      Alert.alert('Fout', 'Kon bewoner niet verwijderen');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewResident = (resident: Resident) => {
    setViewingResident(resident);
    setShowDetailsModal(true);
  };


  return (
    <AdminLayout activeRoute="bewoners">
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.pageTitle}>Bewoners Beheren</Text>
            <TouchableOpacity style={styles.newButton} onPress={handleNewResident}>
              <MaterialIcons name="add" size={20} color={Colors.background} />
              <Text style={styles.newButtonText}>Nieuwe Bewoner</Text>
            </TouchableOpacity>
          </View>

          {/* Loading State */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Bewoners laden...</Text>
            </View>
          ) : error ? (
            /* Error State */
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={64} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadResidents}>
                <Text style={styles.retryButtonText}>Opnieuw proberen</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Filters */}
              <ResidentsFilters
                roomFilter={roomFilter}
                allergyFilter={allergyFilter}
                sortOrder={sortOrder}
                searchQuery={searchQuery}
                onRoomFilterChange={setRoomFilter}
                onAllergyFilterChange={setAllergyFilter}
                onSortOrderChange={setSortOrder}
                onSearchChange={setSearchQuery}
              />

              {/* Residents Grid */}
              {filteredResidents.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="person-off" size={64} color={Colors.textSecondary} />
              <Text style={styles.emptyText}>Geen bewoners gevonden</Text>
              <Text style={styles.emptySubtext}>
                Probeer je filters aan te passen of voeg een nieuwe bewoner toe.
              </Text>
            </View>
              ) : (
                <View style={styles.grid}>
                  {filteredResidents.map((resident) => {
                    const room = getRoomForResident(resident);
                    return (
                      <View key={resident.resident_id} style={styles.cardWrapper}>
                        <ResidentCard
                          resident={resident}
                          roomNumber={room?.room_id.toString()}
                          age={calculateAge(resident.date_of_birth)}
                          hasAllergies={hasAllergies(resident)}
                          onView={() => handleViewResident(resident)}
                          onEdit={() => handleEditResident(resident)}
                          onDelete={() => handleDeleteResident(resident)}
                        />
                      </View>
                    );
                  })}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* Resident Form Modal */}
      <ResidentFormModal
        visible={showResidentModal}
        onClose={() => {
          setShowResidentModal(false);
          setEditingResident(null);
        }}
        onSubmit={handleSubmitResident}
        isLoading={isCreating}
        resident={editingResident || undefined}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        visible={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setResidentToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Bewoner Verwijderen"
        message={`Weet je zeker dat je ${residentToDelete?.name} wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.`}
        confirmText="Verwijderen"
        cancelText="Annuleren"
        isLoading={isDeleting}
        type="danger"
      />

      {/* Resident Details Modal */}
      <ResidentDetailsModal
        visible={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setViewingResident(null);
        }}
        resident={viewingResident}
        roomNumber={viewingResident ? getRoomForResident(viewingResident)?.room_id.toString() : undefined}
        age={viewingResident ? calculateAge(viewingResident.date_of_birth) : undefined}
      />
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    ...Platform.select({
      web: {
        overflow: 'visible',
      },
    }),
  },
  content: {
    padding: Layout.screenPaddingLarge,
    ...Platform.select({
      web: {
        maxWidth: 1400,
        alignSelf: 'center',
        width: '100%',
        overflow: 'visible',
      },
    }),
    overflow: 'visible',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
    flexWrap: 'wrap',
    gap: Spacing.lg,
  },
  pageTitle: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  newButtonText: {
    color: Colors.background,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.md,
  },
  cardWrapper: {
    width: Platform.OS === 'web' ? '33.333%' : '100%',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
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
