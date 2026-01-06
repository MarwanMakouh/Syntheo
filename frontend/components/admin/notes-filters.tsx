import { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors, FontSize, Spacing, BorderRadius, FontWeight, Shadows } from '@/constants';

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

const URGENCY_OPTIONS = [
  { label: 'Alle urgentie', value: 'all' },
  { label: 'Hoog', value: 'Hoog' },
  { label: 'Matig', value: 'Matig' },
  { label: 'Laag', value: 'Laag' },
];

const CATEGORY_OPTIONS = [
  { label: 'Alle categorieën', value: 'all' },
  { label: 'Gezondheid', value: 'Gezondheid' },
  { label: 'Medicatie', value: 'Medicatie' },
  { label: 'Val', value: 'Val' },
  { label: 'Gedrag', value: 'Gedrag' },
  { label: 'Voeding', value: 'Voeding' },
  { label: 'Familie', value: 'Familie' },
];

const STATUS_OPTIONS = [
  { label: 'Alle statussen', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'In behandeling', value: 'in_progress' },
  { label: 'Afgehandeld', value: 'resolved' },
];

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
  const [isUrgencyOpen, setIsUrgencyOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const selectedUrgencyLabel = URGENCY_OPTIONS.find(opt => opt.value === urgencyFilter)?.label || 'Alle urgentie';
  const selectedCategoryLabel = CATEGORY_OPTIONS.find(opt => opt.value === categoryFilter)?.label || 'Alle categorieën';
  const selectedStatusLabel = STATUS_OPTIONS.find(opt => opt.value === statusFilter)?.label || 'Alle statussen';

  const handleUrgencySelect = (value: string) => {
    onUrgencyFilterChange(value);
    setIsUrgencyOpen(false);
  };

  const handleCategorySelect = (value: string) => {
    onCategoryFilterChange(value);
    setIsCategoryOpen(false);
  };

  const handleStatusSelect = (value: string) => {
    onStatusFilterChange(value);
    setIsStatusOpen(false);
  };

  const closeAllDropdowns = () => {
    setIsUrgencyOpen(false);
    setIsCategoryOpen(false);
    setIsStatusOpen(false);
  };

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

      {/* Filters Row */}
      <View style={[styles.filtersRow, (isUrgencyOpen || isCategoryOpen || isStatusOpen) && styles.filtersRowOpen]}>
        {/* Urgency Filter Dropdown */}
        <View style={[styles.dropdownWrapper, isUrgencyOpen && styles.dropdownWrapperOpen]}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => {
              setIsUrgencyOpen(!isUrgencyOpen);
              setIsCategoryOpen(false);
              setIsStatusOpen(false);
            }}
          >
            <Text style={styles.dropdownButtonText}>{selectedUrgencyLabel}</Text>
            <MaterialIcons
              name={isUrgencyOpen ? "arrow-drop-up" : "arrow-drop-down"}
              size={24}
              color={Colors.iconDefault}
            />
          </TouchableOpacity>

          {isUrgencyOpen && (
            <View style={styles.dropdownList}>
              <ScrollView style={styles.scrollView}>
                {URGENCY_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.dropdownItem,
                      urgencyFilter === option.value && styles.dropdownItemSelected,
                    ]}
                    onPress={() => handleUrgencySelect(option.value)}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        urgencyFilter === option.value && styles.dropdownItemTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {urgencyFilter === option.value && (
                      <MaterialIcons name="check" size={20} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Category Filter Dropdown */}
        <View style={[styles.dropdownWrapper, isCategoryOpen && styles.dropdownWrapperOpen]}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => {
              setIsCategoryOpen(!isCategoryOpen);
              setIsUrgencyOpen(false);
              setIsStatusOpen(false);
            }}
          >
            <Text style={styles.dropdownButtonText}>{selectedCategoryLabel}</Text>
            <MaterialIcons
              name={isCategoryOpen ? "arrow-drop-up" : "arrow-drop-down"}
              size={24}
              color={Colors.iconDefault}
            />
          </TouchableOpacity>

          {isCategoryOpen && (
            <View style={styles.dropdownList}>
              <ScrollView style={styles.scrollView}>
                {CATEGORY_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.dropdownItem,
                      categoryFilter === option.value && styles.dropdownItemSelected,
                    ]}
                    onPress={() => handleCategorySelect(option.value)}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        categoryFilter === option.value && styles.dropdownItemTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {categoryFilter === option.value && (
                      <MaterialIcons name="check" size={20} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Status Filter Dropdown */}
        <View style={[styles.dropdownWrapper, isStatusOpen && styles.dropdownWrapperOpen]}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => {
              setIsStatusOpen(!isStatusOpen);
              setIsUrgencyOpen(false);
              setIsCategoryOpen(false);
            }}
          >
            <Text style={styles.dropdownButtonText}>{selectedStatusLabel}</Text>
            <MaterialIcons
              name={isStatusOpen ? "arrow-drop-up" : "arrow-drop-down"}
              size={24}
              color={Colors.iconDefault}
            />
          </TouchableOpacity>

          {isStatusOpen && (
            <View style={styles.dropdownList}>
              <ScrollView style={styles.scrollView}>
                {STATUS_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.dropdownItem,
                      statusFilter === option.value && styles.dropdownItemSelected,
                    ]}
                    onPress={() => handleStatusSelect(option.value)}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        statusFilter === option.value && styles.dropdownItemTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {statusFilter === option.value && (
                      <MaterialIcons name="check" size={20} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
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
    alignItems: 'center',
    flexWrap: 'wrap',
    zIndex: 100,
  },
  filtersRowOpen: {
    zIndex: 10000,
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
    height: 50,
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
  dateContainer: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    minWidth: 150,
  },
  dateInput: {
    height: '100%',
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    outlineStyle: 'none',
  },
});
