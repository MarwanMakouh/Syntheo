import { StyleSheet, View, TextInput, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors, FontSize, Spacing, BorderRadius } from '@/constants';

interface ResidentsFiltersProps {
  roomFilter: string;
  allergyFilter: string;
  sortOrder: string;
  searchQuery: string;
  onRoomFilterChange: (value: string) => void;
  onAllergyFilterChange: (value: string) => void;
  onSortOrderChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export function ResidentsFilters({
  roomFilter,
  allergyFilter,
  sortOrder,
  searchQuery,
  onRoomFilterChange,
  onAllergyFilterChange,
  onSortOrderChange,
  onSearchChange,
}: ResidentsFiltersProps) {
  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <MaterialIcons
          name="search"
          size={20}
          color={Colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Zoek bewoner..."
          placeholderTextColor={Colors.textSecondary}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>

      {/* Room Filter */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={roomFilter}
          onValueChange={onRoomFilterChange}
          style={styles.picker}
        >
          <Picker.Item label="Alle kamers" value="all" />
          <Picker.Item label="Verdieping 1" value="floor1" />
          <Picker.Item label="Verdieping 2" value="floor2" />
          <Picker.Item label="Verdieping 3" value="floor3" />
        </Picker>
      </View>

      {/* Allergy Filter */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={allergyFilter}
          onValueChange={onAllergyFilterChange}
          style={styles.picker}
        >
          <Picker.Item label="Alle allergieën" value="all" />
          <Picker.Item label="Heeft allergieën" value="has" />
          <Picker.Item label="Geen allergieën" value="none" />
        </Picker>
      </View>

      {/* Sort Order */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={sortOrder}
          onValueChange={onSortOrderChange}
          style={styles.picker}
        >
          <Picker.Item label="Naam (A-Z)" value="name_asc" />
          <Picker.Item label="Naam (Z-A)" value="name_desc" />
          <Picker.Item label="Leeftijd (Oud-Jong)" value="age_desc" />
          <Picker.Item label="Leeftijd (Jong-Oud)" value="age_asc" />
          <Picker.Item label="Kamer (Laag-Hoog)" value="room_asc" />
          <Picker.Item label="Kamer (Hoog-Laag)" value="room_desc" />
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
    flexWrap: 'wrap',
    alignItems: 'stretch',
  },
  searchContainer: {
    flex: 1,
    minWidth: 250,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    outlineStyle: 'none',
  },
  pickerContainer: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 50,
    justifyContent: 'center',
    ...Platform.select({
      web: {
        minWidth: 180,
        flex: 0,
      },
      default: {
        flex: 1,
        minWidth: 150,
      },
    }),
  },
  picker: {
    height: 50,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    ...Platform.select({
      web: {
        width: '100%',
      },
    }),
  },
});
