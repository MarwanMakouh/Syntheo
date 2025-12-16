import { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
  ActionSheetIOS,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
  residents,
  rooms,
  users,
  getResidentsByFloor,
} from '@/Services/API';

// Simuleer ingelogde user (Jan Janssen)
const CURRENT_USER = users[0]; // Jan Janssen, floor_id: 1

const FLOOR_OPTIONS = [
  { label: 'Verdieping 1', value: 1 },
  { label: 'Verdieping 2', value: 2 },
  { label: 'Verdieping 3', value: 3 },
];

export default function BewonersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFloor, setSelectedFloor] = useState(CURRENT_USER.floor_id);

  // Bereken leeftijd
  const calculateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Haal kamer nummer op
  const getRoomNumber = (residentId: number) => {
    const room = rooms.find(r => r.resident_id === residentId);
    return room ? room.room_id : null;
  };

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

  const renderResidentCard = ({ item }: { item: any }) => {
    const age = calculateAge(item.date_of_birth);
    const roomNumber = getRoomNumber(item.resident_id);

    return (
      <TouchableOpacity style={styles.card}>
        <Image
          source={{ uri: item.photo_url }}
          style={styles.avatar}
        />
        <View style={styles.cardContent}>
          <Text style={styles.residentName}>{item.name}</Text>
          <View style={styles.infoRow}>
            <MaterialIcons name="cake" size={16} color="#666666" />
            <Text style={styles.infoText}>{age} jaar</Text>
          </View>
          {roomNumber && (
            <View style={styles.infoRow}>
              <MaterialIcons name="door-front" size={16} color="#666666" />
              <Text style={styles.infoText}>Kamer {roomNumber}</Text>
            </View>
          )}
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#cccccc" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#666666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Zoek bewoner op naam..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialIcons name="clear" size={20} color="#666666" />
          </TouchableOpacity>
        )}
      </View>

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
        renderItem={renderResidentCard}
        keyExtractor={(item) => item.resident_id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="person-off" size={64} color="#cccccc" />
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
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    ...Platform.select({
      web: {
        maxWidth: 600,
        alignSelf: 'center',
        width: '100%',
      },
    }),
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    outlineStyle: 'none',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 8,
    paddingLeft: 12,
    paddingRight: Platform.OS === 'ios' ? 12 : 0,
    paddingVertical: Platform.OS === 'ios' ? 14 : 0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    ...Platform.select({
      web: {
        maxWidth: 600,
        alignSelf: 'center',
        width: '100%',
      },
    }),
  },
  filterLabel: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
    fontWeight: '500',
  },
  filterValue: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    marginLeft: 8,
    fontWeight: '600',
  },
  pickerContainer: {
    flex: 1,
  },
  picker: {
    height: 50,
  },
  resultCount: {
    fontSize: 14,
    color: '#666666',
    marginHorizontal: 16,
    marginBottom: 8,
    ...Platform.select({
      web: {
        maxWidth: 600,
        alignSelf: 'center',
        width: '100%',
      },
    }),
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    ...Platform.select({
      web: {
        maxWidth: 600,
        alignSelf: 'center',
        width: '100%',
      },
    }),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e0e0',
  },
  cardContent: {
    flex: 1,
    marginLeft: 16,
  },
  residentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
    marginTop: 16,
  },
});
