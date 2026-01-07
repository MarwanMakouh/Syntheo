import { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors, FontSize, Spacing, BorderRadius, FontWeight, Shadows } from '@/constants';

interface RoomsFiltersProps {
  floorFilter: string;
  searchQuery: string;
  onFloorFilterChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

const FLOOR_OPTIONS = [
  { label: 'Alle verdiepingen', value: 'all' },
  { label: 'Verdieping 1', value: '1' },
  { label: 'Verdieping 2', value: '2' },
  { label: 'Verdieping 3', value: '3' },
  { label: 'Verdieping 4', value: '4' },
];

export function RoomsFilters({
  floorFilter,
  searchQuery,
  onFloorFilterChange,
  onSearchChange,
}: RoomsFiltersProps) {
  const [isFloorOpen, setIsFloorOpen] = useState(false);

  const selectedFloorLabel = FLOOR_OPTIONS.find(opt => opt.value === floorFilter)?.label || 'Alle verdiepingen';

  const handleFloorSelect = (value: string) => {
    onFloorFilterChange(value);
    setIsFloorOpen(false);
  };

  return (
    <View style={[styles.container, isFloorOpen && styles.containerOpen]}>
      {/* Floor Filter Dropdown */}
      <View style={[styles.dropdownWrapper, isFloorOpen && styles.dropdownWrapperOpen]}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setIsFloorOpen(!isFloorOpen)}
        >
          <Text style={styles.dropdownButtonText}>{selectedFloorLabel}</Text>
          <MaterialIcons
            name={isFloorOpen ? "arrow-drop-up" : "arrow-drop-down"}
            size={24}
            color={Colors.iconDefault}
          />
        </TouchableOpacity>

        {isFloorOpen && (
          <View style={styles.dropdownList}>
            <ScrollView style={styles.scrollView}>
              {FLOOR_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.dropdownItem,
                    floorFilter === option.value && styles.dropdownItemSelected,
                  ]}
                  onPress={() => handleFloorSelect(option.value)}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      floorFilter === option.value && styles.dropdownItemTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {floorFilter === option.value && (
                    <MaterialIcons name="check" size={20} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
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
          placeholder="Zoek kamernummer..."
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
    alignItems: 'center',
    zIndex: 100,
  },
  containerOpen: {
    zIndex: 10000,
  },
  dropdownWrapper: {
    position: 'relative',
    zIndex: 100,
    minWidth: 200,
  },
  dropdownWrapperOpen: {
    zIndex: 10000,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderMedium,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
  },
  dropdownButtonText: {
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  dropdownList: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderMedium,
    borderRadius: BorderRadius.md,
    ...Shadows.dropdown,
    maxHeight: 300,
    zIndex: 10001,
  },
  scrollView: {
    maxHeight: 300,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  dropdownItemSelected: {
    backgroundColor: Colors.selectedBackground,
  },
  dropdownItemText: {
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  dropdownItemTextSelected: {
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
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
