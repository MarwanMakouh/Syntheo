import { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  ActionSheetIOS,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SearchBar, BewonerCard } from '@/components';
import { users, getResidentsByFloor, getRoomNumber } from '@/Services';
import { Colors, FontSize, Spacing, BorderRadius, Layout } from '@/constants';

// Simuleer ingelogde user (Jan Janssen)
const CURRENT_USER = users[0]; // Jan Janssen, floor_id: 1

const FLOOR_OPTIONS = [
  { label: 'Verdieping 1', value: 1 },
  { label: 'Verdieping 2', value: 2 },
  { label: 'Verdieping 3', value: 3 },
];

export default function BewonersScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFloor, setSelectedFloor] = useState(CURRENT_USER.floor_id);

  // Filter bewoners
  const filteredResidents = useMemo(() => {
    let filtered = getResidentsByFloor(selectedFloor);

    if (searchQuery.trim()) {
      filtered = filtered.filter(resident =>
        resident.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [selectedFloor, searchQuery]);

  // Handle floor selection for iOS
  const handleFloorPress = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Annuleren', ...FLOOR_OPTIONS.map(f => f.label)],
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex > 0) {
          setSelectedFloor(FLOOR_OPTIONS[buttonIndex - 1].value);
        }
      }
    );
  };

  const getFloorLabel = () => {
    const floor = FLOOR_OPTIONS.find(f => f.value === selectedFloor);
    return floor ? floor.label : 'Verdieping 1';
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Zoek bewoner op naam..."
        style={styles.searchContainer}
      />

      {/* Floor Filter */}
      {Platform.OS === 'ios' ? (
        <TouchableOpacity style={styles.filterContainer} onPress={handleFloorPress}>
          <MaterialIcons name="filter-list" size={20} color="#666666" />
          <Text style={styles.filterLabel}>Verdieping:</Text>
          <Text style={styles.filterValue}>{getFloorLabel()}</Text>
          <MaterialIcons name="arrow-drop-down" size={24} color="#666666" />
        </TouchableOpacity>
      ) : (
        <View style={styles.filterContainer}>
          <MaterialIcons name="filter-list" size={20} color="#666666" />
          <Text style={styles.filterLabel}>Verdieping:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedFloor}
              onValueChange={(value) => setSelectedFloor(value)}
              style={styles.picker}
            >
              <Picker.Item label="Verdieping 1" value={1} />
              <Picker.Item label="Verdieping 2" value={2} />
              <Picker.Item label="Verdieping 3" value={3} />
            </Picker>
          </View>
        </View>
      )}

      {/* Results count */}
      <Text style={styles.resultCount}>
        {filteredResidents.length} bewoner{filteredResidents.length !== 1 ? 's' : ''} gevonden
      </Text>

      {/* Residents List */}
      <FlatList
        data={filteredResidents}
        renderItem={({ item }) => (
          <BewonerCard
            resident={item}
            roomNumber={getRoomNumber(item.resident_id)}
            onPress={() => router.push(`/(tabs)/bewoners/${item.resident_id}` as any)}
          />
        )}
        keyExtractor={(item) => item.resident_id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="person-off" size={64} color={Colors.iconMuted} />
            <Text style={styles.emptyText}>Geen bewoners gevonden</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  searchContainer: {
    margin: Layout.screenPadding,
    ...Platform.select({
      web: {
        maxWidth: 600,
        alignSelf: 'center',
        width: '100%',
      },
    }),
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    marginHorizontal: Layout.screenPadding,
    marginBottom: Spacing.md,
    paddingLeft: Spacing.lg,
    paddingRight: Platform.OS === 'ios' ? Spacing.lg : 0,
    paddingVertical: Platform.OS === 'ios' ? Spacing.lg : 0,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Platform.select({
      web: {
        maxWidth: 600,
        alignSelf: 'center',
        width: '100%',
      },
    }),
  },
  filterLabel: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginLeft: Spacing.md,
    fontWeight: '500',
  },
  filterValue: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginLeft: Spacing.md,
    fontWeight: '600',
  },
  pickerContainer: {
    flex: 1,
  },
  picker: {
    height: 50,
  },
  resultCount: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginHorizontal: Layout.screenPadding,
    marginBottom: Spacing.md,
    ...Platform.select({
      web: {
        maxWidth: 600,
        alignSelf: 'center',
        width: '100%',
      },
    }),
  },
  listContent: {
    paddingHorizontal: Layout.screenPadding,
    paddingBottom: Layout.screenPadding,
    ...Platform.select({
      web: {
        maxWidth: 600,
        alignSelf: 'center',
        width: '100%',
      },
    }),
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: FontSize.lg,
    color: Colors.textMuted,
    marginTop: Layout.screenPadding,
  },
});
