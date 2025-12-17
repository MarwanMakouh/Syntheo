import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { DieetBewerkenModal } from './dieet-bewerken-modal';
import type { Diet, Allergy } from '@/types';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants';

interface DieetInformatieProps {
  allergies: Allergy[];
  diets: Diet[];
  onSaveChanges?: (data: any) => void;
}

export function DieetInformatie({ allergies, diets, onSaveChanges }: DieetInformatieProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  const handleSaveChanges = (data: any) => {
    if (onSaveChanges) {
      onSaveChanges(data);
    }
  };

  // Prepare initial data for modal
  const allLikes: string[] = [];
  const allDislikes: string[] = [];
  diets.forEach(diet => {
    if (diet.preferences?.likes) {
      allLikes.push(...diet.preferences.likes);
    }
    if (diet.preferences?.dislikes) {
      allDislikes.push(...diet.preferences.dislikes);
    }
  });

  const initialData = {
    allergies: allergies.map(a => a.symptom).join(', '),
    dietTypes: diets.map(d => d.diet_type).join(', '),
    likes: allLikes.join(', '),
    dislikes: allDislikes.join(', '),
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Edit Button */}
        <TouchableOpacity style={styles.editButton} onPress={() => setShowEditModal(true)}>
          <MaterialIcons name="edit" size={20} color={Colors.textOnPrimary} />
          <Text style={styles.editButtonText}>Dieetinformatie Bewerken</Text>
        </TouchableOpacity>

      {/* Allergieën */}
      {allergies.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="warning" size={20} color={Colors.error} />
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
              <View
                key={diet.diet_id}
                style={styles.dietTypeButton}
              >
                <Text style={styles.dietTypeText}>
                  {diet.diet_type}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Voorkeuren */}
      {(() => {
        // Collect all preferences from all diets
        const allLikes: string[] = [];
        const allDislikes: string[] = [];

        diets.forEach(diet => {
          if (diet.preferences?.likes) {
            allLikes.push(...diet.preferences.likes);
          }
          if (diet.preferences?.dislikes) {
            allDislikes.push(...diet.preferences.dislikes);
          }
        });

        if (allLikes.length > 0 || allDislikes.length > 0) {
          return (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Voorkeuren</Text>

              <View style={styles.preferencesContainer}>
                <View style={styles.preferenceColumn}>
                  <Text style={styles.preferenceLabel}>Houdt van</Text>
                  {allLikes.length > 0 ? (
                    allLikes.map((item, index) => (
                      <Text key={index} style={styles.preferenceItem}>{item}</Text>
                    ))
                  ) : (
                    <Text style={styles.emptyPreference}>-</Text>
                  )}
                </View>

                <View style={styles.preferenceColumn}>
                  <Text style={styles.preferenceLabel}>Houdt niet van</Text>
                  {allDislikes.length > 0 ? (
                    allDislikes.map((item, index) => (
                      <Text key={index} style={styles.preferenceItem}>{item}</Text>
                    ))
                  ) : (
                    <Text style={styles.emptyPreference}>-</Text>
                  )}
                </View>
              </View>
            </View>
          );
        }
        return null;
      })()}
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
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.xl,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.success,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing['2xl'],
    borderRadius: BorderRadius.md,
    marginBottom: Spacing['3xl'],
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    marginLeft: Spacing.md,
  },
  section: {
    marginBottom: Spacing['3xl'],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginLeft: Spacing.md,
  },
  allergyCard: {
    backgroundColor: Colors.alertBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  allergySymptom: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.errorDark,
    marginBottom: Spacing.xs,
  },
  allergyNotes: {
    fontSize: FontSize.sm,
    color: Colors.errorDark,
  },
  dietTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  dietTypeButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.alertBorder,
    backgroundColor: Colors.background,
  },
  dietTypeText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.error,
  },
  preferencesContainer: {
    flexDirection: 'row',
    gap: 60,
  },
  preferenceColumn: {
    flex: 1,
  },
  preferenceLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  preferenceItem: {
    fontSize: FontSize.md,
    color: Colors.textBody,
    marginBottom: Spacing.md,
  },
  emptyPreference: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
});
