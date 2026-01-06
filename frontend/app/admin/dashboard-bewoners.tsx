import { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { AdminLayout } from '@/components/admin';
import { ResidentCard } from '@/components/admin/resident-card';
import { ResidentsFilters } from '@/components/admin/residents-filters';
import { residents, rooms, allergies } from '@/Services';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Layout } from '@/constants';
import type { Resident } from '@/types/resident';

export default function DashboardBewonersScreen() {
  const router = useRouter();
  const [roomFilter, setRoomFilter] = useState('all');
  const [allergyFilter, setAllergyFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('name_asc');
  const [searchQuery, setSearchQuery] = useState('');

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

  // Get room for resident
  const getRoomForResident = (residentId: number) => {
    return rooms.find((r) => r.resident_id === residentId);
  };

  // Check if resident has allergies
  const hasAllergies = (residentId: number) => {
    return allergies.some((a) => a.resident_id === residentId);
  };

  // Filter and sort residents
  const filteredResidents = useMemo(() => {
    let filtered = residents.filter((resident) => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        resident.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Room filter
      const room = getRoomForResident(resident.resident_id);
      let matchesRoom = true;
      if (roomFilter !== 'all' && room) {
        const floorNumber = Math.floor(room.room_id / 100);
        matchesRoom = roomFilter === `floor${floorNumber}`;
      }

      // Allergy filter
      const residentHasAllergies = hasAllergies(resident.resident_id);
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
          const roomA = getRoomForResident(a.resident_id);
          const roomB = getRoomForResident(b.resident_id);
          return (roomA?.room_id || 0) - (roomB?.room_id || 0);
        }
        case 'room_desc': {
          const roomA = getRoomForResident(a.resident_id);
          const roomB = getRoomForResident(b.resident_id);
          return (roomB?.room_id || 0) - (roomA?.room_id || 0);
        }
        default:
          return 0;
      }
    });

    return filtered;
  }, [roomFilter, allergyFilter, sortOrder, searchQuery]);

  const handleNewResident = () => {
    Alert.alert('Nieuwe Bewoner', 'Functionaliteit nog niet geïmplementeerd');
  };

  const handleViewResident = (resident: Resident) => {
    router.push(`/(tabs)/bewoners/${resident.resident_id}` as any);
  };

  const handleResidentInfo = (resident: Resident) => {
    Alert.alert('Bewoner Info', `Details voor ${resident.name}`);
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
                const room = getRoomForResident(resident.resident_id);
                return (
                  <View key={resident.resident_id} style={styles.cardWrapper}>
                    <ResidentCard
                      resident={resident}
                      roomNumber={room?.room_id.toString()}
                      age={calculateAge(resident.date_of_birth)}
                      hasAllergies={hasAllergies(resident.resident_id)}
                      onView={() => handleViewResident(resident)}
                      onInfo={() => handleResidentInfo(resident)}
                    />
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
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
});
