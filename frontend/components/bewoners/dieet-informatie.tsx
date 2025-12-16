import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { DieetBewerkenModal } from './dieet-bewerken-modal';
import type { Diet, Allergy } from '@/types';

interface DieetInformatieProps {
  allergies: Allergy[];
  diets: Diet[];
  onSaveChanges?: (data: any) => void;
}

export function DieetInformatie({ allergies, diets, onSaveChanges }: DieetInformatieProps) {
  const [selectedDietType, setSelectedDietType] = useState(diets[0]?.diet_type || '');
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (diets.length > 0 && !selectedDietType) {
      setSelectedDietType(diets[0].diet_type);
    }
  }, [diets, selectedDietType]);

  const selectedDiet = diets.find(d => d.diet_type === selectedDietType);

  const handleSaveChanges = (data: any) => {
    if (onSaveChanges) {
      onSaveChanges(data);
    }
  };

  // Prepare initial data for modal
  const initialData = {
    allergies: allergies.map(a => a.symptom).join(', '),
    dietTypes: diets.map(d => d.diet_type).join(', '),
    likes: selectedDiet?.preferences?.likes?.join(', ') || '',
    dislikes: selectedDiet?.preferences?.dislikes?.join(', ') || '',
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Edit Button */}
        <TouchableOpacity style={styles.editButton} onPress={() => setShowEditModal(true)}>
          <MaterialIcons name="edit" size={20} color="#FFFFFF" />
          <Text style={styles.editButtonText}>Dieetinformatie Bewerken</Text>
        </TouchableOpacity>

      {/* Allergieën */}
      {allergies.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="warning" size={20} color="#EF4444" />
            <Text style={styles.sectionTitle}>Allergieën</Text>
          </View>

          {allergies.map((allergy) => (
            <View key={allergy.allergy_id} style={styles.allergyCard}>
              <Text style={styles.allergySymptom}>{allergy.symptom}</Text>
              {allergy.notes && (
                <Text style={styles.allergyNotes}>{allergy.notes}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Dieettype */}
      {diets.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dieettype</Text>

          <View style={styles.dietTypesContainer}>
            {diets.map((diet) => (
              <TouchableOpacity
                key={diet.diet_id}
                style={[
                  styles.dietTypeButton,
                  selectedDietType === diet.diet_type && styles.dietTypeButtonActive,
                ]}
                onPress={() => setSelectedDietType(diet.diet_type)}
              >
                <Text
                  style={[
                    styles.dietTypeText,
                    selectedDietType === diet.diet_type && styles.dietTypeTextActive,
                  ]}
                >
                  {diet.diet_type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Voorkeuren */}
      {selectedDiet?.preferences && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voorkeuren</Text>

          <View style={styles.preferencesContainer}>
            <View style={styles.preferenceColumn}>
              <Text style={styles.preferenceLabel}>Houdt van</Text>
              {selectedDiet.preferences.likes?.map((item, index) => (
                <Text key={index} style={styles.preferenceItem}>{item}</Text>
              ))}
            </View>

            <View style={styles.preferenceColumn}>
              <Text style={styles.preferenceLabel}>Houdt niet van</Text>
              {selectedDiet.preferences.dislikes?.map((item, index) => (
                <Text key={index} style={styles.preferenceItem}>{item}</Text>
              ))}
            </View>
          </View>
        </View>
      )}
    </ScrollView>

      <DieetBewerkenModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveChanges}
        initialData={initialData}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 8,
  },
  allergyCard: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  allergySymptom: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
    marginBottom: 4,
  },
  allergyNotes: {
    fontSize: 13,
    color: '#DC2626',
  },
  dietTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dietTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FFFFFF',
  },
  dietTypeButtonActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  dietTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EF4444',
  },
  dietTypeTextActive: {
    fontWeight: '700',
  },
  preferencesContainer: {
    flexDirection: 'row',
    gap: 40,
  },
  preferenceColumn: {
    flex: 1,
  },
  preferenceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  preferenceItem: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
});
