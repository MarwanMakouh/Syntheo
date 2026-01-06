import { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors, FontSize, Spacing, BorderRadius, FontWeight, Shadows } from '@/constants';

interface UsersFiltersProps {
  roleFilter: string;
  statusFilter: string;
  searchQuery: string;
  onRoleFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

const ROLE_OPTIONS = [
  { label: 'Alle rollen', value: 'all' },
  { label: 'Verpleegster', value: 'Verpleegster' },
  { label: 'Hoofdverpleegster', value: 'Hoofdverpleegster' },
  { label: 'Beheerder', value: 'Beheerder' },
  { label: 'Keukenpersoneel', value: 'Keukenpersoneel' },
];

const STATUS_OPTIONS = [
  { label: 'Alle statussen', value: 'all' },
  { label: 'Actief', value: 'actief' },
  { label: 'Inactief', value: 'inactief' },
];

export function UsersFilters({
  roleFilter,
  statusFilter,
  searchQuery,
  onRoleFilterChange,
  onStatusFilterChange,
  onSearchChange,
}: UsersFiltersProps) {
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const selectedRoleLabel = ROLE_OPTIONS.find(opt => opt.value === roleFilter)?.label || 'Alle rollen';
  const selectedStatusLabel = STATUS_OPTIONS.find(opt => opt.value === statusFilter)?.label || 'Alle statussen';

  const handleRoleSelect = (value: string) => {
    onRoleFilterChange(value);
    setIsRoleOpen(false);
  };

  const handleStatusSelect = (value: string) => {
    onStatusFilterChange(value);
    setIsStatusOpen(false);
  };

  return (
    <View style={[styles.container, (isRoleOpen || isStatusOpen) && styles.containerOpen]}>
      {/* Role Filter Dropdown */}
      <View style={[styles.dropdownWrapper, isRoleOpen && styles.dropdownWrapperOpen]}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => {
            setIsRoleOpen(!isRoleOpen);
            setIsStatusOpen(false);
          }}
        >
          <Text style={styles.dropdownButtonText}>{selectedRoleLabel}</Text>
          <MaterialIcons
            name={isRoleOpen ? "arrow-drop-up" : "arrow-drop-down"}
            size={24}
            color={Colors.iconDefault}
          />
        </TouchableOpacity>

        {isRoleOpen && (
          <View style={styles.dropdownList}>
            <ScrollView style={styles.scrollView}>
              {ROLE_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.dropdownItem,
                    roleFilter === option.value && styles.dropdownItemSelected,
                  ]}
                  onPress={() => handleRoleSelect(option.value)}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      roleFilter === option.value && styles.dropdownItemTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {roleFilter === option.value && (
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
            setIsRoleOpen(false);
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
          placeholder="Zoek personeel..."
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
