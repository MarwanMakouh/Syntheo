import { StyleSheet, View, TextInput, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors, FontSize, Spacing, BorderRadius } from '@/constants';

interface NotesFiltersProps {
  urgencyFilter: string;
  categoryFilter: string;
  statusFilter: string;
  dateFilter: string;
  searchQuery: string;
  onUrgencyFilterChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onDateFilterChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export function NotesFilters({
  urgencyFilter,
  categoryFilter,
  statusFilter,
  dateFilter,
  searchQuery,
  onUrgencyFilterChange,
  onCategoryFilterChange,
  onStatusFilterChange,
  onDateFilterChange,
  onSearchChange,
}: NotesFiltersProps) {
  return (
    <>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons
          name="search"
          size={20}
          color={Colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Zoek op bewoner, beschrijving of auteur..."
          placeholderTextColor={Colors.textSecondary}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>

      {/* Filter Row */}
      <View style={styles.filtersRow}>
        {/* Urgency Filter */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={urgencyFilter}
            onValueChange={onUrgencyFilterChange}
            style={styles.picker}
          >
            <Picker.Item label="Alle urgentie" value="all" />
            <Picker.Item label="Hoog" value="Hoog" />
            <Picker.Item label="Matig" value="Matig" />
            <Picker.Item label="Laag" value="Laag" />
          </Picker>
        </View>

        {/* Category Filter */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={categoryFilter}
            onValueChange={onCategoryFilterChange}
            style={styles.picker}
          >
            <Picker.Item label="Alle categorieën" value="all" />
            <Picker.Item label="Gezondheid" value="Gezondheid" />
            <Picker.Item label="Medicatie" value="Medicatie" />
            <Picker.Item label="Val" value="Val" />
            <Picker.Item label="Gedrag" value="Gedrag" />
            <Picker.Item label="Voeding" value="Voeding" />
            <Picker.Item label="Familie" value="Familie" />
          </Picker>
        </View>

        {/* Status Filter */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={statusFilter}
            onValueChange={onStatusFilterChange}
            style={styles.picker}
          >
            <Picker.Item label="Alle statussen" value="all" />
            <Picker.Item label="Open" value="open" />
            <Picker.Item label="In behandeling" value="in_progress" />
            <Picker.Item label="Afgehandeld" value="resolved" />
          </Picker>
        </View>

        {/* Date Filter */}
        <View style={styles.dateContainer}>
          <TextInput
            style={styles.dateInput}
            placeholder="dd-mm-jjjj"
            placeholderTextColor={Colors.textSecondary}
            value={dateFilter}
            onChangeText={onDateFilterChange}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 50,
    marginBottom: Spacing.lg,
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
  filtersRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
    flexWrap: 'wrap',
    alignItems: 'stretch',
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
  dateContainer: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    ...Platform.select({
      web: {
        minWidth: 150,
        flex: 0,
      },
      default: {
        flex: 1,
        minWidth: 120,
      },
    }),
  },
  dateInput: {
    height: '100%',
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    outlineStyle: 'none',
  },
});
