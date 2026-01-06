import { StyleSheet, View, TextInput, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors, FontSize, Spacing, BorderRadius } from '@/constants';

interface UsersFiltersProps {
  roleFilter: string;
  statusFilter: string;
  searchQuery: string;
  onRoleFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export function UsersFilters({
  roleFilter,
  statusFilter,
  searchQuery,
  onRoleFilterChange,
  onStatusFilterChange,
  onSearchChange,
}: UsersFiltersProps) {
  return (
    <View style={styles.container}>
      {/* Role Filter */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={roleFilter}
          onValueChange={onRoleFilterChange}
          style={styles.picker}
        >
          <Picker.Item label="Alle rollen" value="all" />
          <Picker.Item label="Beheerder" value="Beheerder" />
          <Picker.Item label="Hoofdverpleegster" value="Hoofdverpleegster" />
          <Picker.Item label="Verpleegster" value="Verpleegster" />
          <Picker.Item label="Keukenpersoneel" value="Keukenpersoneel" />
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
          <Picker.Item label="Actief" value="actief" />
          <Picker.Item label="Inactief" value="inactief" />
        </Picker>
      </View>

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
          placeholder="Zoek gebruiker..."
          placeholderTextColor={Colors.textSecondary}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
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
  pickerContainer: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 50,
    justifyContent: 'center',
    ...Platform.select({
      web: {
        minWidth: 200,
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
  searchContainer: {
    flex: 1,
    minWidth: 300,
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
});
