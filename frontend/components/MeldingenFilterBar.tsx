import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const urgentieOptions = ['Urgentie', 'Urgent', 'Aandacht', 'Stabiel'];
const categorieOptions = ['Categorieën', 'Val', 'Medicatie', 'Gedrag', 'Verzorging', 'Technisch', 'Overig'];
const statusOptions = ['Statussen', 'Open', 'Behandeling', 'Afgehandeld'];

export function MeldingenFilterBar() {
  const [urgentieOpen, setUrgentieOpen] = useState(false);
  const [categorieOpen, setCategorieOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const [selectedUrgentie, setSelectedUrgentie] = useState('Urgentie');
  const [selectedCategorie, setSelectedCategorie] = useState('Categorieën');
  const [selectedStatus, setSelectedStatus] = useState('Statussen');

  const FilterDropdown = ({
    isOpen,
    setIsOpen,
    selected,
    setSelected,
    options
  }: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    selected: string;
    setSelected: (value: string) => void;
    options: string[];
  }) => (
    <View style={styles.dropdownWrapper}>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.filterText}>{selected}</Text>
        <MaterialIcons name="arrow-drop-down" size={20} color="#000000" />
      </TouchableOpacity>

      {isOpen && (
        <Modal
          visible={isOpen}
          transparent
          onRequestClose={() => setIsOpen(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setIsOpen(false)}
          >
            <View style={styles.dropdown}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.dropdownItem,
                    index === options.length - 1 && styles.dropdownItemLast,
                  ]}
                  onPress={() => {
                    setSelected(option);
                    setIsOpen(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );

  return (
    <View style={styles.filtersContainer}>
      <View style={styles.filtersRow}>
        <FilterDropdown
          isOpen={urgentieOpen}
          setIsOpen={setUrgentieOpen}
          selected={selectedUrgentie}
          setSelected={setSelectedUrgentie}
          options={urgentieOptions}
        />
        <FilterDropdown
          isOpen={categorieOpen}
          setIsOpen={setCategorieOpen}
          selected={selectedCategorie}
          setSelected={setSelectedCategorie}
          options={categorieOptions}
        />
        <FilterDropdown
          isOpen={statusOpen}
          setIsOpen={setStatusOpen}
          selected={selectedStatus}
          setSelected={setSelectedStatus}
          options={statusOptions}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 1000,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dropdownWrapper: {
    flex: 1,
    position: 'relative',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
  },
  filterText: {
    fontSize: 14,
    color: '#000000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  dropdown: {
    position: 'absolute',
    top: 150,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  dropdownItemLast: {
    borderBottomWidth: 0,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#000000',
  },
});
