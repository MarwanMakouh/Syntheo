import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface MeldingenFilterDropdownProps {
  onFilterChange?: (filterType: string, value: string) => void;
}

const FILTER_OPTIONS = [
  { label: 'Alle meldingen', value: 'all', type: 'reset' },
  { label: '---', value: 'divider1', type: 'divider' },
  { label: 'Urgent', value: 'urgent', type: 'urgentie' },
  { label: 'Aandacht', value: 'aandacht', type: 'urgentie' },
  { label: 'Stabiel', value: 'stabiel', type: 'urgentie' },
  { label: '---', value: 'divider2', type: 'divider' },
  { label: 'Val', value: 'val', type: 'categorie' },
  { label: 'Medicatie', value: 'medicatie', type: 'categorie' },
  { label: 'Gedrag', value: 'gedrag', type: 'categorie' },
  { label: 'Verzorging', value: 'verzorging', type: 'categorie' },
  { label: 'Technisch', value: 'technisch', type: 'categorie' },
  { label: 'Overig', value: 'overig', type: 'categorie' },
  { label: '---', value: 'divider3', type: 'divider' },
  { label: 'Open', value: 'open', type: 'status' },
  { label: 'Behandeling', value: 'behandeling', type: 'status' },
  { label: 'Afgehandeld', value: 'afgehandeld', type: 'status' },
];

export function MeldingenFilterDropdown({ onFilterChange }: MeldingenFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Alle meldingen');

  const handleSelect = (option: typeof FILTER_OPTIONS[0]) => {
    if (option.type === 'divider') return;

    setSelectedFilter(option.label);
    setIsOpen(false);

    if (onFilterChange) {
      onFilterChange(option.type, option.value);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.dropdownWrapper}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setIsOpen(!isOpen)}
        >
          <Text style={styles.dropdownButtonText}>Filters</Text>
          <MaterialIcons
            name={isOpen ? "arrow-drop-up" : "arrow-drop-down"}
            size={24}
            color="#666666"
          />
        </TouchableOpacity>

        {isOpen && (
          <View style={styles.dropdownList}>
            <ScrollView style={styles.scrollView}>
              {FILTER_OPTIONS.map((option, index) => {
                if (option.type === 'divider') {
                  return (
                    <View key={option.value} style={styles.divider} />
                  );
                }

                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.dropdownItem,
                      selectedFilter === option.label && styles.dropdownItemSelected,
                    ]}
                    onPress={() => handleSelect(option)}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        selectedFilter === option.label && styles.dropdownItemTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {selectedFilter === option.label && (
                      <MaterialIcons name="check" size={20} color="#5B47FB" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dropdownWrapper: {
    position: 'relative',
    zIndex: 1000,
    maxWidth: 200,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#000000',
  },
  dropdownList: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: 500,
    zIndex: 1001,
    minWidth: 250,
  },
  scrollView: {
    maxHeight: 500,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemSelected: {
    backgroundColor: '#F5F5FF',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#000000',
  },
  dropdownItemTextSelected: {
    fontWeight: '600',
    color: '#5B47FB',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
});
