import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight, Shadows } from '@/constants';

interface MeldingenFilterDropdownProps {
  onFilterChange?: (filters: { urgentie: string; status: string }) => void;
}

const URGENTIE_OPTIONS = [
  { label: 'Alle urgentie', value: 'all' },
  { label: 'Urgent', value: 'Hoog' },
  { label: 'Aandacht', value: 'Matig' },
  { label: 'Stabiel', value: 'Laag' },
];

const STATUS_OPTIONS = [
  { label: 'Alle statussen', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'Behandeling', value: 'in_behandeling' },
  { label: 'Afgehandeld', value: 'afgehandeld' },
];

export function MeldingenFilterDropdown({ onFilterChange }: MeldingenFilterDropdownProps) {
  const [urgentieFilter, setUrgentieFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [urgentieOpen, setUrgentieOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const handleUrgentieChange = (value: string) => {
    setUrgentieFilter(value);
    setUrgentieOpen(false);
    if (onFilterChange) {
      onFilterChange({ urgentie: value, status: statusFilter });
    }
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setStatusOpen(false);
    if (onFilterChange) {
      onFilterChange({ urgentie: urgentieFilter, status: value });
    }
  };

  const getUrgentieLabel = () => {
    return URGENTIE_OPTIONS.find(opt => opt.value === urgentieFilter)?.label || 'Alle urgentie';
  };

  const getStatusLabel = () => {
    return STATUS_OPTIONS.find(opt => opt.value === statusFilter)?.label || 'Alle statussen';
  };

  return (
    <View style={styles.container}>
      {/* Urgentie Filter */}
      <View style={[styles.dropdownContainer, urgentieOpen && styles.dropdownContainerOpen]}>
        <Text style={styles.label}>Urgentie:</Text>
        <View style={styles.dropdownWrapper}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => {
              setUrgentieOpen(!urgentieOpen);
              setStatusOpen(false);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.dropdownButtonText}>{getUrgentieLabel()}</Text>
            <MaterialIcons
              name={urgentieOpen ? "arrow-drop-up" : "arrow-drop-down"}
              size={24}
              color={Colors.iconDefault}
            />
          </TouchableOpacity>

          {urgentieOpen && (
            <View style={[styles.dropdownList, Platform.OS === 'web' && styles.dropdownListWeb]}>
              <ScrollView style={styles.scrollView} nestedScrollEnabled>
                {URGENTIE_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.dropdownItem,
                      urgentieFilter === option.value && styles.dropdownItemSelected,
                    ]}
                    onPress={() => handleUrgentieChange(option.value)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        urgentieFilter === option.value && styles.dropdownItemTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {urgentieFilter === option.value && (
                      <MaterialIcons name="check" size={20} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View>

      {/* Status Filter */}
      <View style={[styles.dropdownContainer, statusOpen && styles.dropdownContainerOpen]}>
        <Text style={styles.label}>Status:</Text>
        <View style={styles.dropdownWrapper}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => {
              setStatusOpen(!statusOpen);
              setUrgentieOpen(false);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.dropdownButtonText}>{getStatusLabel()}</Text>
            <MaterialIcons
              name={statusOpen ? "arrow-drop-up" : "arrow-drop-down"}
              size={24}
              color={Colors.iconDefault}
            />
          </TouchableOpacity>

          {statusOpen && (
            <View style={[styles.dropdownList, Platform.OS === 'web' && styles.dropdownListWeb]}>
              <ScrollView style={styles.scrollView} nestedScrollEnabled>
                {STATUS_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.dropdownItem,
                      statusFilter === option.value && styles.dropdownItemSelected,
                    ]}
                    onPress={() => handleStatusChange(option.value)}
                    activeOpacity={0.7}
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.xl,
    alignItems: 'center',
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    position: 'relative',
  },
  dropdownContainerOpen: {
    ...(Platform.OS === 'web' ? { zIndex: 10000 } : { zIndex: 2000 }),
  },
  label: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  dropdownWrapper: {
    minWidth: 200,
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
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
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    ...Shadows.dropdown,
    maxHeight: 200,
    zIndex: 10001,
    elevation: 10,
  },
  dropdownListWeb: {
    position: 'absolute' as any,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: 10001,
  },
  scrollView: {
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
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
