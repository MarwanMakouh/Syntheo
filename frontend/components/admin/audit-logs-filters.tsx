import { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors, FontSize, Spacing, BorderRadius, FontWeight, Shadows } from '@/constants';

interface AuditLogsFiltersProps {
  actionFilter: string;
  userFilter: string;
  dateFilter: string;
  onActionFilterChange: (value: string) => void;
  onUserFilterChange: (value: string) => void;
  onDateFilterChange: (value: string) => void;
}

const ACTION_OPTIONS = [
  { label: 'Alle acties', value: 'all' },
  { label: 'Toegevoegd', value: 'CREATE' },
  { label: 'Bewerkt', value: 'UPDATE' },
  { label: 'Verwijderd', value: 'DELETE' },
  { label: 'Goedgekeurd', value: 'APPROVE' },
  { label: 'Afgekeurd', value: 'REJECT' },
];

const USER_OPTIONS = [
  { label: 'Alle gebruikers', value: 'all' },
];

export function AuditLogsFilters({
  actionFilter,
  userFilter,
  dateFilter,
  onActionFilterChange,
  onUserFilterChange,
  onDateFilterChange,
}: AuditLogsFiltersProps) {
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);

  const selectedActionLabel = ACTION_OPTIONS.find(opt => opt.value === actionFilter)?.label || 'Alle acties';
  const selectedUserLabel = USER_OPTIONS.find(opt => opt.value === userFilter)?.label || 'Alle gebruikers';

  const handleActionSelect = (value: string) => {
    onActionFilterChange(value);
    setIsActionOpen(false);
  };

  const handleUserSelect = (value: string) => {
    onUserFilterChange(value);
    setIsUserOpen(false);
  };

  return (
    <View style={[styles.container, (isActionOpen || isUserOpen) && styles.containerOpen]}>
      {/* Action Filter Dropdown */}
      <View style={[styles.dropdownWrapper, isActionOpen && styles.dropdownWrapperOpen]}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => {
            setIsActionOpen(!isActionOpen);
            setIsUserOpen(false);
          }}
        >
          <Text style={styles.dropdownButtonText}>{selectedActionLabel}</Text>
          <MaterialIcons
            name={isActionOpen ? "arrow-drop-up" : "arrow-drop-down"}
            size={24}
            color={Colors.iconDefault}
          />
        </TouchableOpacity>

        {isActionOpen && (
          <View style={styles.dropdownList}>
            <ScrollView style={styles.scrollView}>
              {ACTION_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.dropdownItem,
                    actionFilter === option.value && styles.dropdownItemSelected,
                  ]}
                  onPress={() => handleActionSelect(option.value)}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      actionFilter === option.value && styles.dropdownItemTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {actionFilter === option.value && (
                    <MaterialIcons name="check" size={20} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* User Filter Dropdown */}
      <View style={[styles.dropdownWrapper, isUserOpen && styles.dropdownWrapperOpen]}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => {
            setIsUserOpen(!isUserOpen);
            setIsActionOpen(false);
          }}
        >
          <Text style={styles.dropdownButtonText}>{selectedUserLabel}</Text>
          <MaterialIcons
            name={isUserOpen ? "arrow-drop-up" : "arrow-drop-down"}
            size={24}
            color={Colors.iconDefault}
          />
        </TouchableOpacity>

        {isUserOpen && (
          <View style={styles.dropdownList}>
            <ScrollView style={styles.scrollView}>
              {USER_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.dropdownItem,
                    userFilter === option.value && styles.dropdownItemSelected,
                  ]}
                  onPress={() => handleUserSelect(option.value)}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      userFilter === option.value && styles.dropdownItemTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {userFilter === option.value && (
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
    minWidth: 180,
  },
  dateInput: {
    height: '100%',
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    outlineStyle: 'none',
  },
});
