import { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { fetchMedicationLibrary } from '@/Services/medicationLibraryApi';
import type { MedicationLibrary } from '@/types/medication';
import { Colors, FontSize, Spacing, BorderRadius, FontWeight } from '@/constants';

interface Props {
  selectedMedicationId: number | null;
  onSelect: (medicationId: number) => void;
}

export function MedicationSelector({ selectedMedicationId, onSelect }: Props) {
  const [medications, setMedications] = useState<MedicationLibrary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadMedications = async () => {
      try {
        setLoading(true);
        const data = await fetchMedicationLibrary();
        setMedications(data);
      } catch (error) {
        console.error('Failed to load medications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMedications();
  }, []);

  // Filter medications by search query
  const filteredMedications = useMemo(() => {
    if (!searchQuery.trim()) {
      return medications;
    }

    const query = searchQuery.toLowerCase();
    return medications.filter(med =>
      med.name.toLowerCase().includes(query) ||
      med.category.toLowerCase().includes(query)
    );
  }, [medications, searchQuery]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Medicatie laden...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color={Colors.iconMuted} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Zoek medicatie..."
          placeholderTextColor={Colors.textMuted}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialIcons name="close" size={20} color={Colors.iconDefault} />
          </TouchableOpacity>
        )}
      </View>

      {/* Results count */}
      <Text style={styles.resultCount}>
        {filteredMedications.length} medicati
        {filteredMedications.length !== 1 ? 'es' : 'e'} gevonden
      </Text>

      {/* Medication List */}
      <ScrollView style={styles.listContainer} nestedScrollEnabled>
        {filteredMedications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="medication" size={48} color={Colors.iconMuted} />
            <Text style={styles.emptyText}>Geen medicatie gevonden</Text>
          </View>
        ) : (
          filteredMedications.map((medication) => (
            <TouchableOpacity
              key={medication.medication_id}
              style={[
                styles.medicationCard,
                selectedMedicationId === medication.medication_id && styles.medicationCardSelected,
              ]}
              onPress={() => onSelect(medication.medication_id)}
              activeOpacity={0.7}
            >
              <View style={styles.medicationCardContent}>
                <View style={styles.medicationCardLeft}>
                  <Text style={styles.medicationName}>{medication.name}</Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{medication.category}</Text>
                  </View>
                </View>
                {selectedMedicationId === medication.medication_id && (
                  <MaterialIcons name="check-circle" size={24} color={Colors.primary} />
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['3xl'],
  },
  loadingText: {
    marginTop: Spacing.lg,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  resultCount: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  listContainer: {
    flex: 1,
    maxHeight: 400,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['3xl'],
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    marginTop: Spacing.lg,
  },
  medicationCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  medicationCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.selectedBackground,
  },
  medicationCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medicationCardLeft: {
    flex: 1,
  },
  medicationName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  categoryBadge: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.background,
  },
});
