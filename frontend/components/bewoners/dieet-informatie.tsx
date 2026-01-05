import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { DieetBewerkenModal } from './dieet-bewerken-modal';
import type { Diet, Allergy } from '@/types';
import { fetchDietByResident, fetchAllergiesByResident } from '@/Services';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants';

interface DieetInformatieProps {
  residentId: number;
  currentUserId?: number;
  onSaveChanges?: (data: any) => void;
}

export function DieetInformatie({ residentId, currentUserId = 1, onSaveChanges }: DieetInformatieProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [diet, setDiet] = useState<Diet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDietData();
  }, [residentId]);

  const loadDietData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [fetchedDiet, fetchedAllergies] = await Promise.all([
        fetchDietByResident(residentId),
        fetchAllergiesByResident(residentId),
      ]);

      setDiet(fetchedDiet);
      setAllergies(fetchedAllergies);
    } catch (err) {
      console.error('Error loading diet data:', err);
      setError('Kon dieetinformatie niet laden');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = (data: any) => {
    if (onSaveChanges) {
      onSaveChanges(data);
    }
    // Reload data after saving
    loadDietData();
  };

  // Wrap single diet in array for backward compatibility
  const dietsArray = diet ? [diet] : [];

  // Prepare initial data for modal
  const allLikes: string[] = [];
  const allDislikes: string[] = [];
  dietsArray.forEach(d => {
    if (d.preferences?.likes) {
      allLikes.push(...d.preferences.likes);
    }
    if (d.preferences?.dislikes) {
      allDislikes.push(...d.preferences.dislikes);
    }
  });

  const initialData = {
    allergies: allergies.map(a => a.symptom).join(', '),
    dietTypes: dietsArray.map(d => d.diet_type).join(', '),
    likes: allLikes.join(', '),
    dislikes: allDislikes.join(', '),
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Dieetinformatie laden...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <MaterialIcons name="error-outline" size={48} color={Colors.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadDietData}>
          <Text style={styles.retryButtonText}>Opnieuw proberen</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
      {dietsArray.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dieettype</Text>

          <View style={styles.dietTypesContainer}>
            {dietsArray.map((d) => (
              <View
                key={d.diet_id}
                style={styles.dietTypeButton}
              >
                <Text style={styles.dietTypeText}>
                  {d.diet_type}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Voorkeuren */}
      {(() => {
        // Collect all preferences from all diets
        const preferenceLikes: string[] = [];
        const preferenceDislikes: string[] = [];

        dietsArray.forEach(d => {
          if (d.preferences?.likes) {
            preferenceLikes.push(...d.preferences.likes);
          }
          if (d.preferences?.dislikes) {
            preferenceDislikes.push(...d.preferences.dislikes);
          }
        });

        if (preferenceLikes.length > 0 || preferenceDislikes.length > 0) {
          return (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Voorkeuren</Text>

              <View style={styles.preferencesContainer}>
                <View style={styles.preferenceColumn}>
                  <Text style={styles.preferenceLabel}>Houdt van</Text>
                  {preferenceLikes.length > 0 ? (
                    preferenceLikes.map((item, index) => (
                      <Text key={index} style={styles.preferenceItem}>{item}</Text>
                    ))
                  ) : (
                    <Text style={styles.emptyPreference}>-</Text>
                  )}
                </View>

                <View style={styles.preferenceColumn}>
                  <Text style={styles.preferenceLabel}>Houdt niet van</Text>
                  {preferenceDislikes.length > 0 ? (
                    preferenceDislikes.map((item, index) => (
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
        residentId={residentId}
        currentUserId={currentUserId}
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['3xl'],
  },
  loadingText: {
    marginTop: Spacing.lg,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  errorText: {
    marginTop: Spacing.lg,
    fontSize: FontSize.md,
    color: Colors.error,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: Spacing.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
  },
  retryButtonText: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
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
