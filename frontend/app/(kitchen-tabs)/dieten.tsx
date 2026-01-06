import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SearchBar } from '@/components';
import { fetchKitchenDietOverview } from '@/Services/dietsApi';
import { Colors, FontSize, Spacing, BorderRadius, Layout } from '@/constants';

interface DietGroup {
  diet_type: string;
  count: number;
  residents: Array<{
    resident_id: number;
    name: string;
    room_number: string | null;
    description: string;
    preferences: {
      likes?: string[];
      dislikes?: string[];
    } | null;
  }>;
}

export default function DietenScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dietGroups, setDietGroups] = useState<DietGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadDiets();
  }, [searchQuery]);

  const loadDiets = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchQuery) params.search = searchQuery;

      const data = await fetchKitchenDietOverview(params);
      setDietGroups(data);
    } catch (error) {
      console.error('Failed to load diets:', error);
      Alert.alert('Fout', 'Kon diëten niet laden');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (dietType: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(dietType)) {
      newExpanded.delete(dietType);
    } else {
      newExpanded.add(dietType);
    }
    setExpandedSections(newExpanded);
  };

  const getDietIcon = (dietType: string): keyof typeof MaterialIcons.glyphMap => {
    switch (dietType) {
      case 'Diabetisch Dieet':
        return 'favorite';
      case 'Zoutarm Dieet':
        return 'opacity';
      case 'Vegetarisch':
        return 'eco';
      case 'Zachte Voeding':
        return 'restaurant';
      default:
        return 'restaurant-menu';
    }
  };

  const getDietIconColor = (dietType: string): string => {
    switch (dietType) {
      case 'Diabetisch Dieet':
        return '#EC4899';
      case 'Zoutarm Dieet':
        return '#60A5FA';
      case 'Vegetarisch':
        return '#34D399';
      case 'Zachte Voeding':
        return '#A78BFA';
      default:
        return Colors.primary;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons name="restaurant-menu" size={32} color={Colors.primary} />
        <View style={styles.headerText}>
          <Text style={styles.title}>Diëten & Voorkeuren</Text>
          <Text style={styles.subtitle}>Overzicht van alle speciale diëten en voorkeuren</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <Text style={styles.searchLabel}>Zoek Bewoner</Text>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Zoek op naam..."
          style={styles.searchBar}
        />
      </View>

      {/* Diet Groups */}
      {loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Diëten laden...</Text>
        </View>
      ) : dietGroups.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="restaurant-menu" size={64} color={Colors.iconMuted} />
          <Text style={styles.emptyText}>Geen diëten gevonden</Text>
        </View>
      ) : (
        dietGroups.map((group) => (
          <View key={group.diet_type} style={styles.dietCard}>
            <TouchableOpacity
              style={styles.dietHeader}
              onPress={() => toggleSection(group.diet_type)}
              activeOpacity={0.7}
            >
              <View style={styles.dietHeaderLeft}>
                <View
                  style={[
                    styles.dietIconContainer,
                    { backgroundColor: getDietIconColor(group.diet_type) + '20' },
                  ]}
                >
                  <MaterialIcons
                    name={getDietIcon(group.diet_type)}
                    size={24}
                    color={getDietIconColor(group.diet_type)}
                  />
                </View>
                <Text style={styles.dietTitle}>
                  {group.diet_type} ({group.count} bewoner{group.count !== 1 ? 's' : ''})
                </Text>
              </View>
              <MaterialIcons
                name={expandedSections.has(group.diet_type) ? 'expand-less' : 'expand-more'}
                size={24}
                color={Colors.textSecondary}
              />
            </TouchableOpacity>

            {/* Expanded Content */}
            {expandedSections.has(group.diet_type) && (
              <View style={styles.residentsList}>
                {group.residents.map((resident) => (
                  <View key={resident.resident_id} style={styles.residentCard}>
                    <View style={styles.residentHeader}>
                      <Text style={styles.residentName}>{resident.name}</Text>
                      <Text style={styles.residentRoom}>
                        {resident.room_number ? `Kamer ${resident.room_number}` : 'Geen kamer'}
                      </Text>
                    </View>

                    {resident.description && (
                      <View style={styles.descriptionSection}>
                        <MaterialIcons name="info-outline" size={16} color={Colors.textSecondary} />
                        <Text style={styles.descriptionText}>{resident.description}</Text>
                      </View>
                    )}

                    {resident.preferences && (
                      <View style={styles.preferencesSection}>
                        {resident.preferences.likes && resident.preferences.likes.length > 0 && (
                          <View style={styles.preferenceGroup}>
                            <View style={styles.preferenceHeader}>
                              <MaterialIcons name="thumb-up" size={14} color="#10B981" />
                              <Text style={styles.preferenceLabel}>Houdt van:</Text>
                            </View>
                            <View style={styles.preferenceItems}>
                              {resident.preferences.likes.map((item, index) => (
                                <View key={index} style={styles.preferenceChip}>
                                  <Text style={styles.preferenceChipText}>{item}</Text>
                                </View>
                              ))}
                            </View>
                          </View>
                        )}

                        {resident.preferences.dislikes && resident.preferences.dislikes.length > 0 && (
                          <View style={styles.preferenceGroup}>
                            <View style={styles.preferenceHeader}>
                              <MaterialIcons name="thumb-down" size={14} color="#EF4444" />
                              <Text style={styles.preferenceLabel}>Houdt niet van:</Text>
                            </View>
                            <View style={styles.preferenceItems}>
                              {resident.preferences.dislikes.map((item, index) => (
                                <View key={index} style={[styles.preferenceChip, styles.dislikeChip]}>
                                  <Text style={styles.preferenceChipText}>{item}</Text>
                                </View>
                              ))}
                            </View>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.screenPadding,
    gap: Spacing.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  searchSection: {
    padding: Layout.screenPadding,
    paddingTop: 0,
  },
  searchLabel: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  searchBar: {
    marginBottom: 0,
  },
  dietCard: {
    backgroundColor: Colors.background,
    marginHorizontal: Layout.screenPadding,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  dietHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  dietHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.md,
  },
  dietIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dietTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  residentsList: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  residentCard: {
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  residentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  residentName: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  residentRoom: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  descriptionSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
    paddingTop: Spacing.xs,
  },
  descriptionText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  preferencesSection: {
    gap: Spacing.sm,
    paddingTop: Spacing.xs,
  },
  preferenceGroup: {
    gap: Spacing.xs,
  },
  preferenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  preferenceLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  preferenceItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  preferenceChip: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  dislikeChip: {
    backgroundColor: '#FEE2E2',
  },
  preferenceChipText: {
    fontSize: FontSize.xs,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    marginTop: Spacing.md,
  },
});
