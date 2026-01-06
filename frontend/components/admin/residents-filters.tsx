import { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors, FontSize, Spacing, BorderRadius, FontWeight, Shadows } from '@/constants';

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

const ROOM_OPTIONS = [
  { label: 'Alle kamers', value: 'all' },
  { label: 'Verdieping 1', value: 'floor1' },
  { label: 'Verdieping 2', value: 'floor2' },
  { label: 'Verdieping 3', value: 'floor3' },
];

const ALLERGY_OPTIONS = [
  { label: 'Alle allergieën', value: 'all' },
  { label: 'Heeft allergieën', value: 'has' },
  { label: 'Geen allergieën', value: 'none' },
];

const SORT_OPTIONS = [
  { label: 'Naam (A-Z)', value: 'name_asc' },
  { label: 'Naam (Z-A)', value: 'name_desc' },
  { label: 'Leeftijd (Oud-Jong)', value: 'age_desc' },
  { label: 'Leeftijd (Jong-Oud)', value: 'age_asc' },
  { label: 'Kamer (Laag-Hoog)', value: 'room_asc' },
  { label: 'Kamer (Hoog-Laag)', value: 'room_desc' },
];

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
  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const [isAllergyOpen, setIsAllergyOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const selectedRoomLabel = ROOM_OPTIONS.find(opt => opt.value === roomFilter)?.label || 'Alle kamers';
  const selectedAllergyLabel = ALLERGY_OPTIONS.find(opt => opt.value === allergyFilter)?.label || 'Alle allergieën';
  const selectedSortLabel = SORT_OPTIONS.find(opt => opt.value === sortOrder)?.label || 'Naam (A-Z)';

  const handleRoomSelect = (value: string) => {
    onRoomFilterChange(value);
    setIsRoomOpen(false);
  };

  const handleAllergySelect = (value: string) => {
    onAllergyFilterChange(value);
    setIsAllergyOpen(false);
  };

  const handleSortSelect = (value: string) => {
    onSortOrderChange(value);
    setIsSortOpen(false);
  };

  return (
    <View style={[styles.container, (isRoomOpen || isAllergyOpen || isSortOpen) && styles.containerOpen]}>
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

      {/* Room Filter Dropdown */}
      <View style={[styles.dropdownWrapper, isRoomOpen && styles.dropdownWrapperOpen]}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => {
            setIsRoomOpen(!isRoomOpen);
            setIsAllergyOpen(false);
            setIsSortOpen(false);
          }}
        >
          <Text style={styles.dropdownButtonText}>{selectedRoomLabel}</Text>
          <MaterialIcons
            name={isRoomOpen ? "arrow-drop-up" : "arrow-drop-down"}
            size={24}
            color={Colors.iconDefault}
          />
        </TouchableOpacity>

        {isRoomOpen && (
          <View style={styles.dropdownList}>
            <ScrollView style={styles.scrollView}>
              {ROOM_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.dropdownItem,
                    roomFilter === option.value && styles.dropdownItemSelected,
                  ]}
                  onPress={() => handleRoomSelect(option.value)}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      roomFilter === option.value && styles.dropdownItemTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {roomFilter === option.value && (
                    <MaterialIcons name="check" size={20} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Allergy Filter Dropdown */}
      <View style={[styles.dropdownWrapper, isAllergyOpen && styles.dropdownWrapperOpen]}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => {
            setIsAllergyOpen(!isAllergyOpen);
            setIsRoomOpen(false);
            setIsSortOpen(false);
          }}
        >
          <Text style={styles.dropdownButtonText}>{selectedAllergyLabel}</Text>
          <MaterialIcons
            name={isAllergyOpen ? "arrow-drop-up" : "arrow-drop-down"}
            size={24}
            color={Colors.iconDefault}
          />
        </TouchableOpacity>

        {isAllergyOpen && (
          <View style={styles.dropdownList}>
            <ScrollView style={styles.scrollView}>
              {ALLERGY_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.dropdownItem,
                    allergyFilter === option.value && styles.dropdownItemSelected,
                  ]}
                  onPress={() => handleAllergySelect(option.value)}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      allergyFilter === option.value && styles.dropdownItemTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {allergyFilter === option.value && (
                    <MaterialIcons name="check" size={20} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Sort Order Dropdown */}
      <View style={[styles.dropdownWrapper, isSortOpen && styles.dropdownWrapperOpen]}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => {
            setIsSortOpen(!isSortOpen);
            setIsRoomOpen(false);
            setIsAllergyOpen(false);
          }}
        >
          <Text style={styles.dropdownButtonText}>{selectedSortLabel}</Text>
          <MaterialIcons
            name={isSortOpen ? "arrow-drop-up" : "arrow-drop-down"}
            size={24}
            color={Colors.iconDefault}
          />
        </TouchableOpacity>

        {isSortOpen && (
          <View style={styles.dropdownList}>
            <ScrollView style={styles.scrollView}>
              {SORT_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.dropdownItem,
                    sortOrder === option.value && styles.dropdownItemSelected,
                  ]}
                  onPress={() => handleSortSelect(option.value)}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      sortOrder === option.value && styles.dropdownItemTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {sortOrder === option.value && (
                    <MaterialIcons name="check" size={20} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
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
  dropdownWrapper: {
    position: 'relative',
    zIndex: 100,
    minWidth: 180,
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
});
