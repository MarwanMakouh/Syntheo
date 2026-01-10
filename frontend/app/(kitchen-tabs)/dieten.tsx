import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SearchBar } from '@/components';
import { KitchenLayout } from '@/components/kitchen';
import { PageHeader, LoadingState, ErrorState } from '@/components/ui';
import { fetchKitchenDietOverview } from '@/Services/dietsApi';
import { Colors, FontSize, Spacing, BorderRadius, Layout, Shadows, FontWeight } from '@/constants';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDiets();
  }, [searchQuery]);

  const loadDiets = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: any = {};
      if (searchQuery) params.search = searchQuery;

      const data = await fetchKitchenDietOverview(params);
      setDietGroups(data);
    } catch (err) {
      console.error('Failed to load diets:', err);
      setError('Kon diëten niet laden. Probeer het opnieuw.');
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
        return Colors.error;
      case 'Zoutarm Dieet':
        return Colors.primary;
      case 'Vegetarisch':
        return Colors.success;
      case 'Zachte Voeding':
        return Colors.secondary;
      default:
        return Colors.primary;
    }
  };

  if (loading) {
    return (
      <KitchenLayout activeRoute="dieten">
        <LoadingState message="Diëten laden..." />
      </KitchenLayout>
    );
  }

  if (error) {
    return (
      <KitchenLayout activeRoute="dieten">
        <ErrorState message={error} onRetry={loadDiets} />
      </KitchenLayout>
    );
  }

  return (
    <KitchenLayout activeRoute="dieten">
      <View style={styles.container}>
        <PageHeader title="Diëten & Voorkeuren" />
        <ScrollView style={styles.content}>
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
      {dietGroups.length === 0 ? (
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
                <Text style={styles.dietTitle}>{group.diet_type}</Text>
              </View>
              <View style={styles.dietHeaderRight}>
                <Text style={styles.countBadge}>{group.count}</Text>
                <MaterialIcons
                  name={expandedSections.has(group.diet_type) ? 'expand-less' : 'expand-more'}
                  size={24}
                  color={Colors.textSecondary}
                />
              </View>
            </TouchableOpacity>

              {/* Expanded Content */}
              {expandedSections.has(group.diet_type) && (
                <>
                  {Platform.OS === 'web' ? (
                    <View style={styles.tableContainer}>
                      {/* Table Header */}
                      <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderText, styles.colBewoner]}>Bewoner</Text>
                        <Text style={[styles.tableHeaderText, styles.colKamer]}>Kamer</Text>
                        <Text style={[styles.tableHeaderText, styles.colOpmerkingen]}>Opmerkingen</Text>
                      </View>

                      {/* Table Rows */}
                      {group.residents.map((resident) => (
                        <View key={resident.resident_id} style={styles.tableRow}>
                          <Text style={[styles.tableCell, styles.colBewoner, styles.boldText]}>
                            {resident.name}
                          </Text>
                          <Text style={[styles.tableCell, styles.colKamer]}>
                            {resident.room_number || '-'}
                          </Text>
                          <View style={[styles.tableCell, styles.colOpmerkingen]}>
                            {resident.description && (
                              <Text style={styles.descriptionText}>{resident.description}</Text>
                            )}

                            {resident.preferences && (
                              <View style={styles.preferencesSection}>
                                {resident.preferences.likes && resident.preferences.likes.length > 0 && (
                                  <View style={styles.preferenceGroup}>
                                    <View style={styles.preferenceHeader}>
                                      <MaterialIcons name="thumb-up" size={12} color="#10B981" />
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
                                      <MaterialIcons name="thumb-down" size={12} color="#EF4444" />
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
                        </View>
                      ))}
                    </View>
                  ) : (
                    <View style={styles.mobileCardsContainer}>
                      {group.residents.map((resident) => (
                        <View key={resident.resident_id} style={styles.residentCard}>
                          <View style={styles.residentCardHeader}>
                            <Text style={styles.residentCardName}>{resident.name}</Text>
                            <View style={styles.residentCardRoom}>
                              <MaterialIcons name="room" size={14} color={Colors.textSecondary} />
                              <Text style={styles.residentCardRoomText}>
                                {resident.room_number || 'Geen kamer'}
                              </Text>
                            </View>
                          </View>

                          {resident.description && (
                            <View style={styles.residentCardSection}>
                              <View style={styles.sectionHeader}>
                                <MaterialIcons name="info-outline" size={16} color={Colors.primary} />
                                <Text style={styles.sectionHeaderText}>Beschrijving</Text>
                              </View>
                              <Text style={styles.residentCardDescription}>{resident.description}</Text>
                            </View>
                          )}

                          {resident.preferences && (
                            <View style={styles.residentCardSection}>
                              <View style={styles.sectionHeader}>
                                <MaterialIcons name="restaurant" size={16} color={Colors.primary} />
                                <Text style={styles.sectionHeaderText}>Voorkeuren</Text>
                              </View>

                              {resident.preferences.likes && resident.preferences.likes.length > 0 && (
                                <View style={styles.preferenceGroupMobile}>
                                  <View style={styles.preferenceHeaderMobile}>
                                    <MaterialIcons name="thumb-up" size={14} color="#10B981" />
                                    <Text style={styles.preferenceLabelMobile}>Houdt van</Text>
                                  </View>
                                  <View style={styles.preferenceItemsMobile}>
                                    {resident.preferences.likes.map((item, index) => (
                                      <View key={index} style={styles.preferenceChipMobile}>
                                        <Text style={styles.preferenceChipTextMobile}>{item}</Text>
                                      </View>
                                    ))}
                                  </View>
                                </View>
                              )}

                              {resident.preferences.dislikes && resident.preferences.dislikes.length > 0 && (
                                <View style={styles.preferenceGroupMobile}>
                                  <View style={styles.preferenceHeaderMobile}>
                                    <MaterialIcons name="thumb-down" size={14} color="#EF4444" />
                                    <Text style={styles.preferenceLabelMobile}>Houdt niet van</Text>
                                  </View>
                                  <View style={styles.preferenceItemsMobile}>
                                    {resident.preferences.dislikes.map((item, index) => (
                                      <View key={index} style={[styles.preferenceChipMobile, styles.dislikeChipMobile]}>
                                        <Text style={styles.preferenceChipTextMobile}>{item}</Text>
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
              </>
            )}
          </View>
        ))
      )}
        </ScrollView>
      </View>
    </KitchenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  content: {
    padding: Spacing['2xl'],
    maxWidth: Layout.webContentMaxWidth,
    width: '100%',
    alignSelf: 'center',
    ...Platform.select({
      web: {
        paddingTop: Spacing['3xl'],
      },
    }),
  },
  searchSection: {
    marginBottom: Spacing.lg,
  },
  searchLabel: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  searchBar: {
    marginBottom: 0,
  },
  dietCard: {
    backgroundColor: Colors.background,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadows.card,
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
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    flex: 1,
  },
  dietHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  countBadge: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  tableContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#047857',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  tableHeaderText: {
    color: '#FFFFFF',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    minHeight: 60,
    backgroundColor: Colors.background,
  },
  tableCell: {
    justifyContent: 'center',
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  colBewoner: {
    flex: 2,
  },
  colKamer: {
    flex: 1,
    textAlign: 'center',
  },
  colOpmerkingen: {
    flex: 4,
  },
  boldText: {
    fontWeight: FontWeight.bold,
  },
  descriptionText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.xs,
  },
  preferencesSection: {
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  preferenceGroup: {
    gap: 4,
  },
  preferenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  preferenceLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
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
    fontWeight: FontWeight.medium,
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
  // Mobile Card Styles
  mobileCardsContainer: {
    padding: Spacing.md,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  residentCard: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  residentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  residentCardName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    flex: 1,
  },
  residentCardRoom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  residentCardRoomText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  residentCardSection: {
    gap: Spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  sectionHeaderText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  residentCardDescription: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  preferenceGroupMobile: {
    marginTop: Spacing.xs,
  },
  preferenceHeaderMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  preferenceLabelMobile: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  preferenceItemsMobile: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  preferenceChipMobile: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  dislikeChipMobile: {
    backgroundColor: '#FEE2E2',
  },
  preferenceChipTextMobile: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
  },
});
