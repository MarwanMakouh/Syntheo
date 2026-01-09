import { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, ScrollView, Platform } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors, FontSize, Spacing, BorderRadius, FontWeight, Shadows } from '@/constants';

interface AuditLogsFiltersProps {
  actionFilter: string;
  typeFilter: string;
  dateFilter: string;
  onActionFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
  onDateFilterChange: (value: string) => void;
}

const ACTION_OPTIONS = [
  { label: 'Alle acties', value: 'all' },
  { label: 'Toegevoegd', value: 'toegevoegd' },
  { label: 'Bewerkt', value: 'bewerkt' },
  { label: 'Verwijderd', value: 'verwijderd' },
  { label: 'Goedgekeurd', value: 'goedgekeurd' },
  { label: 'Afgekeurd', value: 'afgekeurd' },
];

const TYPE_OPTIONS = [
  { label: 'Alle types', value: 'all' },
  { label: 'Bewoner', value: 'Bewoner' },
  { label: 'Wijzigingsverzoek', value: 'Wijzigingsverzoek' },
  { label: 'Notitie', value: 'Notitie' },
  { label: 'Medicatie', value: 'Medicatie' },
  { label: 'Melding', value: 'Melding' },
  { label: 'Gebruiker', value: 'Gebruiker' },
  { label: 'Medicatie Ronde', value: 'Medicatie Ronde' },
];

export function AuditLogsFilters({
  actionFilter,
  typeFilter,
  dateFilter,
  onActionFilterChange,
  onTypeFilterChange,
  onDateFilterChange,
}: AuditLogsFiltersProps) {
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);

  const selectedActionLabel = ACTION_OPTIONS.find(opt => opt.value === actionFilter)?.label || 'Alle acties';
  const selectedTypeLabel = TYPE_OPTIONS.find(opt => opt.value === typeFilter)?.label || 'Alle types';

  const handleActionSelect = (value: string) => {
    onActionFilterChange(value);
    setIsActionOpen(false);
  };

  const handleTypeSelect = (value: string) => {
    onTypeFilterChange(value);
    setIsTypeOpen(false);
  };

  return (
    <View style={[styles.container, (isActionOpen || isTypeOpen) && styles.containerOpen]}>
      {/* Action Filter Dropdown */}
      <View style={[styles.dropdownWrapper, isActionOpen && styles.dropdownWrapperOpen]}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => {
            setIsActionOpen(!isActionOpen);
            setIsTypeOpen(false);
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

      {/* Type Filter Dropdown */}
      <View style={[styles.dropdownWrapper, isTypeOpen && styles.dropdownWrapperOpen]}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => {
            setIsTypeOpen(!isTypeOpen);
            setIsActionOpen(false);
          }}
        >
          <Text style={styles.dropdownButtonText}>{selectedTypeLabel}</Text>
          <MaterialIcons
            name={isTypeOpen ? "arrow-drop-up" : "arrow-drop-down"}
            size={24}
            color={Colors.iconDefault}
          />
        </TouchableOpacity>

        {isTypeOpen && (
          <View style={styles.dropdownList}>
            <ScrollView style={styles.scrollView}>
              {TYPE_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.dropdownItem,
                    typeFilter === option.value && styles.dropdownItemSelected,
                  ]}
                  onPress={() => handleTypeSelect(option.value)}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      typeFilter === option.value && styles.dropdownItemTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {typeFilter === option.value && (
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
        <MaterialIcons
          name="calendar-today"
          size={20}
          color={Colors.textSecondary}
          style={styles.dateIcon}
        />
        {Platform.OS === 'web' ? (
          <input
            type="date"
            style={{
              flex: 1,
              height: '100%',
              fontSize: `${FontSize.lg}px`,
              color: Colors.textPrimary,
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontWeight: '400',
              cursor: 'pointer',
            }}
            value={dateFilter}
            onChange={(e: any) => onDateFilterChange(e.target.value)}
            placeholder="Selecteer datum"
          />
        ) : (
          <TextInput
            style={styles.dateInput}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={Colors.textSecondary}
            value={dateFilter}
            onChangeText={onDateFilterChange}
          />
        )}
        {dateFilter && (
          <TouchableOpacity onPress={() => onDateFilterChange('')} style={styles.clearButton}>
            <MaterialIcons name="close" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    minWidth: 220,
  },
  dateIcon: {
    marginRight: Spacing.sm,
  },
  dateInput: {
    flex: 1,
    height: '100%',
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    outlineStyle: 'none',
  },
  clearButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});
