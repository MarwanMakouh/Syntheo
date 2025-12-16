import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface DagdeelDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const DAGDEEL_OPTIONS = ['Ochtend', 'Middag', 'Avond', 'Nacht'];

export function DagdeelDropdown({ value, onChange }: DagdeelDropdownProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {DAGDEEL_OPTIONS.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.option,
            value === option && styles.optionSelected,
          ]}
          onPress={() => onChange(option)}
        >
          <Text
            style={[
              styles.optionText,
              value === option && styles.optionTextSelected,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
  },
  option: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  optionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  optionTextSelected: {
    color: '#ffffff',
  },
});
