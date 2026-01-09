import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Platform,
  ActionSheetIOS,
  Alert,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SearchBar } from '@/components';
import { KitchenLayout } from '@/components/kitchen';
import { PageHeader, LoadingState, ErrorState } from '@/components/ui';
import { fetchKitchenAllergyOverview } from '@/Services/allergiesApi';
import { Colors, FontSize, Spacing, BorderRadius, Layout, Shadows, FontWeight } from '@/constants';

const FLOOR_OPTIONS = [
  { label: 'Alle Verdiepingen', value: 0 },
  { label: 'Verdieping 1', value: 1 },
  { label: 'Verdieping 2', value: 2 },
  { label: 'Verdieping 3', value: 3 },
];

const ALLERGY_OPTIONS = [
  { label: 'Alle Allergieën', value: '' },
  { label: 'Gluten', value: 'Gluten' },
  { label: 'Lactose', value: 'Lactose' },
  { label: 'Pinda\'s', value: 'Pinda\'s' },
  { label: 'Schaaldieren', value: 'Schaaldieren' },
  { label: 'Soja', value: 'Soja' },
  { label: 'Eieren', value: 'Eieren' },
];

interface ResidentWithAllergies {
  resident_id: number;
  name: string;
  room_number: string | null;
  floor_id: number | null;
  allergies: Array<{
    allergy_id: number;
    symptom: string;
    severity: string;
    notes: string | null;
  }>;
  has_allergies: boolean;
}

export default function AllergieenOverzichtScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFloor, setSelectedFloor] = useState<number>(0);
  const [selectedAllergy, setSelectedAllergy] = useState<string>('');
  const [residents, setResidents] = useState<ResidentWithAllergies[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [floorDropdownOpen, setFloorDropdownOpen] = useState(false);
  const [allergyDropdownOpen, setAllergyDropdownOpen] = useState(false);

  useEffect(() => {
    loadResidents();
  }, [selectedFloor, selectedAllergy, searchQuery]);

  const loadResidents = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: any = {};
      if (selectedFloor > 0) params.floor = selectedFloor;
      if (selectedAllergy) params.allergyType = selectedAllergy;
      if (searchQuery) params.search = searchQuery;

      const data = await fetchKitchenAllergyOverview(params);
      setResidents(data);
    } catch (err) {
      console.error('Failed to load residents:', err);
      setError('Kon bewoners niet laden. Probeer het opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  const handleFloorPress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Annuleren', ...FLOOR_OPTIONS.map((f) => f.label)],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex > 0) {
            setSelectedFloor(FLOOR_OPTIONS[buttonIndex - 1].value);
          }
        }
      );
    } else {
      setFloorDropdownOpen(!floorDropdownOpen);
      setAllergyDropdownOpen(false);
    }
  };

  const handleAllergyPress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Annuleren', ...ALLERGY_OPTIONS.map((a) => a.label)],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex > 0) {
            setSelectedAllergy(ALLERGY_OPTIONS[buttonIndex - 1].value);
          }
        }
      );
    } else {
      setAllergyDropdownOpen(!allergyDropdownOpen);
      setFloorDropdownOpen(false);
    }
  };

  const handleFloorSelect = (value: number) => {
    setSelectedFloor(value);
    setFloorDropdownOpen(false);
  };

  const handleAllergySelect = (value: string) => {
    setSelectedAllergy(value);
    setAllergyDropdownOpen(false);
  };

  const getFloorLabel = () => {
    const floor = FLOOR_OPTIONS.find((f) => f.value === selectedFloor);
    return floor ? floor.label : 'Alle Verdiepingen';
  };

  const getAllergyLabel = () => {
    const allergy = ALLERGY_OPTIONS.find((a) => a.value === selectedAllergy);
    return allergy ? allergy.label : 'Alle Allergieën';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'ernst':
        return Colors.error;
      case 'matig':
        return Colors.warning;
      default:
        return Colors.success;
    }
  };

  const getSeverityBackgroundColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'ernst':
        return Colors.dangerLight;
      case 'matig':
        return Colors.warningLight;
      default:
        return Colors.successLight;
    }
  };

  // Mobile Card Layout
  const renderMobileCard = ({ item }: { item: ResidentWithAllergies }) => (
    <View style={styles.mobileCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.residentName}>{item.name}</Text>
        <Text style={styles.roomNumber}>
          {item.room_number ? `Kamer ${item.room_number}` : 'Geen kamer'}
        </Text>
      </View>

      {!item.has_allergies ? (
        <View style={styles.noAllergyBadge}>
          <Text style={styles.noAllergyText}>Geen allergieën</Text>
        </View>
      ) : (
        <View style={styles.allergiesContainer}>
          {item.allergies.map((allergy) => (
            <View key={allergy.allergy_id} style={styles.allergyRowMobile}>
              <View
                style={[
                  styles.allergyBadgeMobile,
                  { backgroundColor: getSeverityColor(allergy.severity) },
                ]}
              >
                <Text style={styles.allergyTextMobile}>{allergy.symptom}</Text>
              </View>
              <View
                style={[
                  styles.severityBadgeMobile,
                  { backgroundColor: getSeverityBackgroundColor(allergy.severity) },
                ]}
              >
                <Text
                  style={[
                    styles.severityTextMobile,
                    { color: getSeverityColor(allergy.severity) },
                  ]}
                >
                  {allergy.severity}
                </Text>
              </View>
            </View>
          ))}
          {item.allergies.some((a) => a.notes) && (
            <View style={styles.notesSection}>
              <Text style={styles.notesLabel}>Extra Info:</Text>
              {item.allergies
                .filter((a) => a.notes)
                .map((allergy) => (
                  <Text key={allergy.allergy_id} style={styles.notesText}>
                    • {allergy.notes}
                  </Text>
                ))}
            </View>
          )}
        </View>
      )}
    </View>
  );

  // Desktop/Web Table Layout
  const renderTableLayout = () => (
    <View style={styles.tableContainer}>
      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, styles.colBewoner]}>Bewoner</Text>
        <Text style={[styles.tableHeaderText, styles.colKamer]}>Kamer</Text>
        <Text style={[styles.tableHeaderText, styles.colAllergieen]}>Allergieën</Text>
        <Text style={[styles.tableHeaderText, styles.colErnst]}>Ernst</Text>
        <Text style={[styles.tableHeaderText, styles.colExtraInfo]}>Extra Info</Text>
      </View>

      {/* Table Rows */}
      {residents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="person-off" size={48} color={Colors.iconMuted} />
          <Text style={styles.emptyText}>Geen bewoners gevonden</Text>
        </View>
      ) : (
        residents.map((resident) => (
          <View key={resident.resident_id} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.colBewoner, styles.boldText]}>
              {resident.name}
            </Text>
            <Text style={[styles.tableCell, styles.colKamer]}>
              {resident.room_number || '-'}
            </Text>
            <View style={[styles.tableCell, styles.colAllergieen]}>
              {resident.has_allergies ? (
                resident.allergies.map((allergy) => (
                  <View
                    key={allergy.allergy_id}
                    style={[
                      styles.allergyBadge,
                      { backgroundColor: getSeverityColor(allergy.severity) },
                    ]}
                  >
                    <Text style={styles.allergyText}>{allergy.symptom}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noAllergyText}>-</Text>
              )}
            </View>
            <View style={[styles.tableCell, styles.colErnst]}>
              {resident.has_allergies ? (
                resident.allergies.map((allergy) => (
                  <View
                    key={allergy.allergy_id}
                    style={[
                      styles.severityBadge,
                      { backgroundColor: getSeverityBackgroundColor(allergy.severity) },
                    ]}
                  >
                    <Text
                      style={[
                        styles.severityText,
                        { color: getSeverityColor(allergy.severity) },
                      ]}
                    >
                      {allergy.severity}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noAllergyText}>-</Text>
              )}
            </View>
            <View style={[styles.tableCell, styles.colExtraInfo]}>
              {resident.has_allergies &&
              resident.allergies.some((a) => a.notes) ? (
                resident.allergies
                  .filter((a) => a.notes)
                  .map((allergy) => (
                    <Text key={allergy.allergy_id} style={styles.extraInfoText}>
                      {allergy.notes}
                    </Text>
                  ))
              ) : (
                <Text style={styles.noAllergyText}>-</Text>
              )}
            </View>
          </View>
        ))
      )}
    </View>
  );

  if (loading) {
    return (
      <KitchenLayout activeRoute="allergieen">
        <LoadingState message="Allergieën laden..." />
      </KitchenLayout>
    );
  }

  if (error) {
    return (
      <KitchenLayout activeRoute="allergieen">
        <ErrorState message={error} onRetry={loadResidents} />
      </KitchenLayout>
    );
  }

  return (
    <KitchenLayout activeRoute="allergieen">
      <View style={styles.container}>
        <PageHeader title="Allergieën Overzicht" />
        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
      {/* Warning Banner */}
      <View style={styles.warningBanner}>
        <MaterialIcons name="warning" size={20} color="#DC2626" />
        <Text style={styles.warningText}>
          LET OP: Levengevaarlijk! Deze lijst bevat alle bewoners met allergieën. Controleer ALTIJD voordat u een hierold of serveerd.
        </Text>
      </View>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Zoek Bewoner"
          style={styles.searchContainer}
        />

        {/* Filters Container */}
        <View style={styles.filtersRow}>
          <View style={[styles.dropdownContainer, floorDropdownOpen && styles.dropdownContainerOpen]}>
            <Text style={styles.label}>Verdieping:</Text>
            <View style={styles.dropdownWrapper}>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={handleFloorPress}
                activeOpacity={0.7}
              >
                <Text style={styles.dropdownButtonText}>{getFloorLabel()}</Text>
                <MaterialIcons
                  name={floorDropdownOpen ? "arrow-drop-up" : "arrow-drop-down"}
                  size={24}
                  color={Colors.iconDefault}
                />
              </TouchableOpacity>

              {floorDropdownOpen && Platform.OS !== 'ios' && (
                <View style={[styles.dropdownList, Platform.OS === 'web' && styles.dropdownListWeb]}>
                  <ScrollView style={styles.scrollView} nestedScrollEnabled>
                    {FLOOR_OPTIONS.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.dropdownItem,
                          selectedFloor === option.value && styles.dropdownItemSelected,
                        ]}
                        onPress={() => handleFloorSelect(option.value)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            selectedFloor === option.value && styles.dropdownItemTextSelected,
                          ]}
                        >
                          {option.label}
                        </Text>
                        {selectedFloor === option.value && (
                          <MaterialIcons name="check" size={20} color={Colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>

          <View style={[styles.dropdownContainer, allergyDropdownOpen && styles.dropdownContainerOpen]}>
            <Text style={styles.label}>Allergie:</Text>
            <View style={styles.dropdownWrapper}>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={handleAllergyPress}
                activeOpacity={0.7}
              >
                <Text style={styles.dropdownButtonText}>{getAllergyLabel()}</Text>
                <MaterialIcons
                  name={allergyDropdownOpen ? "arrow-drop-up" : "arrow-drop-down"}
                  size={24}
                  color={Colors.iconDefault}
                />
              </TouchableOpacity>

              {allergyDropdownOpen && Platform.OS !== 'ios' && (
                <View style={[styles.dropdownList, Platform.OS === 'web' && styles.dropdownListWeb]}>
                  <ScrollView style={styles.scrollView} nestedScrollEnabled>
                    {ALLERGY_OPTIONS.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.dropdownItem,
                          selectedAllergy === option.value && styles.dropdownItemSelected,
                        ]}
                        onPress={() => handleAllergySelect(option.value)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            selectedAllergy === option.value && styles.dropdownItemTextSelected,
                          ]}
                        >
                          {option.label}
                        </Text>
                        {selectedAllergy === option.value && (
                          <MaterialIcons name="check" size={20} color={Colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Volledige Allergieën Lijst</Text>
          {Platform.OS !== 'web' && (
            <Text style={styles.subtitle}>
              {residents.length} bewoner{residents.length !== 1 ? 's' : ''} gevonden
            </Text>
          )}
        </View>

        {/* Content - Web Table or Mobile List */}
        {Platform.OS === 'web' ? (
          renderTableLayout()
        ) : (
          <FlatList
            data={residents}
            renderItem={renderMobileCard}
            keyExtractor={(item) => item.resident_id.toString()}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialIcons
                  name="person-off"
                  size={64}
                  color={Colors.iconMuted}
                />
                <Text style={styles.emptyText}>Geen bewoners gevonden</Text>
              </View>
            }
          />
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
    flex: 1,
  },
  scrollContent: {
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
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: Spacing.md,
    marginHorizontal: Layout.screenPadding,
    marginTop: Layout.screenPadding,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#FECACA',
    ...Platform.select({
      web: {
        alignSelf: 'center',
      },
    }),
  },
  warningText: {
    marginLeft: Spacing.sm,
    fontSize: FontSize.sm,
    color: '#DC2626',
    fontWeight: FontWeight.semibold,
    ...Platform.select({
      default: {
        flex: 1,
      },
      web: {
        flexShrink: 1,
      },
    }),
  },
  searchContainer: {
    margin: Layout.screenPadding,
    ...Platform.select({
      web: {
        alignSelf: 'center',
        minWidth: 600,
      },
    }),
  },
  filtersRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.md,
    zIndex: 100,
  },
  dropdownContainer: {
    flex: 1,
    position: 'relative',
  },
  dropdownContainerOpen: {
    ...(Platform.OS === 'web' ? { zIndex: 10000 } : { zIndex: 2000 }),
  },
  label: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  dropdownWrapper: {
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
  },
  dropdownButtonText: {
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  dropdownList: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    ...Shadows.dropdown,
    maxHeight: 200,
    ...(Platform.OS === 'web' ? { zIndex: 10001 } : { zIndex: 2001 }),
  },
  dropdownListWeb: {
    position: 'absolute' as any,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
  },
  scrollView: {
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  dropdownItemSelected: {
    backgroundColor: Colors.selectedBackground,
  },
  dropdownItemText: {
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  dropdownItemTextSelected: {
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  titleSection: {
    marginHorizontal: Layout.screenPadding,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  // Mobile Card Styles
  listContent: {
    paddingHorizontal: Layout.screenPadding,
    paddingBottom: Layout.screenPadding,
  },
  mobileCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  residentName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    flex: 1,
  },
  roomNumber: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  allergiesContainer: {
    gap: Spacing.sm,
  },
  allergyRowMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  allergyBadgeMobile: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    flex: 1,
  },
  allergyTextMobile: {
    color: '#FFFFFF',
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  severityBadgeMobile: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  severityTextMobile: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  noAllergyBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  noAllergyText: {
    color: '#065F46',
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  notesSection: {
    marginTop: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
  },
  notesLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  notesText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  // Desktop Table Styles
  tableContainer: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    minWidth: 1000,
    ...Shadows.card,
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
    ':hover': {
      backgroundColor: Colors.backgroundSecondary,
    },
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
  colAllergieen: {
    flex: 2,
    gap: Spacing.xs,
  },
  colErnst: {
    flex: 1.5,
    gap: Spacing.xs,
  },
  colExtraInfo: {
    flex: 2.5,
  },
  boldText: {
    fontWeight: FontWeight.bold,
  },
  allergyBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  allergyText: {
    color: '#FFFFFF',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  severityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  severityText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  extraInfoText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    marginTop: Spacing.md,
  },
  webTableWrapper: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: Layout.screenPadding,
    marginBottom: Layout.screenPadding,
  },
});
