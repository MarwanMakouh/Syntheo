import { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants';

interface MeldingenFilterDropdownProps {
  onFilterChange?: (filters: { urgentie: string; status: string }) => void;
}

export function MeldingenFilterDropdown({ onFilterChange }: MeldingenFilterDropdownProps) {
  const [urgentieFilter, setUrgentieFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleUrgentieChange = (value: string) => {
    setUrgentieFilter(value);
    if (onFilterChange) {
      onFilterChange({ urgentie: value, status: statusFilter });
    }
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    if (onFilterChange) {
      onFilterChange({ urgentie: urgentieFilter, status: value });
    }
  };

  return (
    <View style={styles.container}>
      {/* Urgentie Filter */}
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={urgentieFilter}
          onValueChange={handleUrgentieChange}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label="Alle urgentie" value="all" />
          <Picker.Item label="Urgent" value="Hoog" />
          <Picker.Item label="Aandacht" value="Matig" />
          <Picker.Item label="Stabiel" value="Laag" />
        </Picker>
      </View>

      {/* Status Filter */}
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={statusFilter}
          onValueChange={handleStatusChange}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label="Alle statussen" value="all" />
          <Picker.Item label="Open" value="open" />
          <Picker.Item label="Behandeling" value="in_behandeling" />
          <Picker.Item label="Afgehandeld" value="afgehandeld" />
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: Colors.borderMedium,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    overflow: 'hidden',
    minWidth: 180,
    height: 48,
    justifyContent: 'center',
    ...Platform.select({
      web: {
        minWidth: 200,
      },
      ios: {
        minWidth: 180,
      },
      android: {
        minWidth: 180,
      },
    }),
  },
  picker: {
    height: 48,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    backgroundColor: 'transparent',
    ...Platform.select({
      web: {
        outline: 'none',
        cursor: 'pointer',
      },
      ios: {
        // iOS has native styling
      },
      android: {
        marginLeft: Spacing.sm,
      },
    }),
  },
  pickerItem: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    height: 120,
  },
});
