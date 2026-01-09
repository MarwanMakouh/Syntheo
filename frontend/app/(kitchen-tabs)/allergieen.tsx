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
import { Picker } from '@react-native-picker/picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SearchBar } from '@/components';
import { KitchenLayout } from '@/components/kitchen';
import { PageHeader, LoadingState, ErrorState } from '@/components/ui';
import { fetchKitchenAllergyOverview } from '@/Services/allergiesApi';
import { Colors, FontSize, Spacing, BorderRadius, Layout, Shadows } from '@/constants';

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
  };

  const handleAllergyPress = () => {
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
          {Platform.OS === 'ios' ? (
            <TouchableOpacity
              style={styles.filterContainer}
              onPress={handleFloorPress}
            >
              <MaterialIcons name="filter-list" size={16} color="#666" />
              <Text style={styles.filterLabel}>Verdieping:</Text>
              <Text style={styles.filterValue}>{getFloorLabel()}</Text>
              <MaterialIcons name="arrow-drop-down" size={20} color="#666" />
            </TouchableOpacity>
          ) : (
            <View style={styles.filterContainer}>
              <MaterialIcons name="filter-list" size={16} color="#666" />
              <Text style={styles.filterLabel}>Verdieping:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedFloor}
                  onValueChange={(value) => setSelectedFloor(Number(value))}
                  style={styles.picker}
                >
                  {FLOOR_OPTIONS.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}

          {Platform.OS === 'ios' ? (
            <TouchableOpacity
              style={styles.filterContainer}
              onPress={handleAllergyPress}
            >
              <MaterialIcons name="filter-list" size={16} color="#666" />
              <Text style={styles.filterLabel}>Allergie:</Text>
              <Text style={styles.filterValue}>{getAllergyLabel()}</Text>
              <MaterialIcons name="arrow-drop-down" size={20} color="#666" />
            </TouchableOpacity>
          ) : (
            <View style={styles.filterContainer}>
              <MaterialIcons name="filter-list" size={16} color="#666" />
              <Text style={styles.filterLabel}>Allergie:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedAllergy}
                  onValueChange={(value) => setSelectedAllergy(value)}
                  style={styles.picker}
                >
                  {ALLERGY_OPTIONS.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
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
    fontWeight: '600',
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
    gap: Spacing.md,
    marginHorizontal: Layout.screenPadding,
    marginBottom: Spacing.md,
    ...Platform.select({
      web: {
        alignSelf: 'center',
      },
    }),
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingLeft: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        flex: 1,
        paddingRight: Spacing.md,
        paddingVertical: Spacing.md,
      },
      android: {
        flex: 1,
        paddingRight: 0,
        paddingVertical: 0,
      },
      web: {
        minWidth: 250,
        paddingRight: Spacing.md,
        paddingVertical: Spacing.sm,
      },
    }),
  },
  filterLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
    fontWeight: '500',
  },
  filterValue: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    marginLeft: Spacing.xs,
    fontWeight: '600',
    ...Platform.select({
      default: {
        flex: 1,
      },
      web: {
        minWidth: 150,
      },
    }),
  },
  pickerContainer: {
    ...Platform.select({
      default: {
        flex: 1,
      },
      web: {
        minWidth: 150,
        overflow: 'hidden',
        borderRadius: BorderRadius.lg,
      },
    }),
  },
  picker: {
    height: 40,
    ...Platform.select({
      web: {
        backgroundColor: 'transparent',
        border: 'none',
      },
    }),
  },
  titleSection: {
    marginHorizontal: Layout.screenPadding,
    marginBottom: Spacing.md,
    ...Platform.select({
      web: {
        alignSelf: 'center',
      },
    }),
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
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
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  roomNumber: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontWeight: '500',
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
    fontWeight: '700',
  },
  severityBadgeMobile: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  severityTextMobile: {
    fontSize: FontSize.sm,
    fontWeight: '600',
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
    fontWeight: '600',
  },
  notesSection: {
    marginTop: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
  },
  notesLabel: {
    fontSize: FontSize.sm,
    fontWeight: '700',
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
    backgroundColor: '#334155',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  tableHeaderText: {
    color: '#FFFFFF',
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    minHeight: 60,
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
    fontWeight: '700',
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
    fontWeight: '600',
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
    fontWeight: '600',
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
