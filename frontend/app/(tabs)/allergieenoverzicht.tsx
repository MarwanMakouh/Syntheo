import { useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  ActionSheetIOS,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SearchBar } from '@/components';
import { fetchKitchenAllergyOverview } from '@/Services/allergiesApi';
import { Colors, FontSize, Spacing, BorderRadius, Layout } from '@/constants';

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

  // Fetch residents
  useEffect(() => {
    loadResidents();
  }, [selectedFloor, selectedAllergy, searchQuery]);

  const loadResidents = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedFloor > 0) params.floor = selectedFloor;
      if (selectedAllergy) params.allergyType = selectedAllergy;
      if (searchQuery) params.search = searchQuery;

      const data = await fetchKitchenAllergyOverview(params);
      setResidents(data);
    } catch (error) {
      console.error('Failed to load residents:', error);
      Alert.alert('Fout', 'Kon bewoners niet laden');
    } finally {
      setLoading(false);
    }
  };

  // Handle floor selection for iOS
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

  // Handle allergy selection for iOS
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
        return '#EF4444';
      case 'matig':
        return '#F97316';
      default:
        return '#10B981';
    }
  };

  const renderResidentCard = ({ item }: { item: ResidentWithAllergies }) => (
    <View style={styles.card}>
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
            <View key={allergy.allergy_id} style={styles.allergyRow}>
              <View
                style={[
                  styles.allergyBadge,
                  { backgroundColor: getSeverityColor(allergy.severity) },
                ]}
              >
                <Text style={styles.allergyText}>{allergy.symptom}</Text>
              </View>
              <View
                style={[
                  styles.severityBadge,
                  { backgroundColor: getSeverityColor(allergy.severity) + '20' },
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

  return (
    <View style={styles.container}>
      {/* Warning Banner */}
      <View style={styles.warningBanner}>
        <MaterialIcons name="warning" size={20} color="#DC2626" />
        <Text style={styles.warningText}>
          LET OP: Levengevaarlijk! Deze lijst bevat alle bewoners met allergieën.
          Controleer ALTIJD voordat u een hierold of serveerd.
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
        {/* Floor Filter */}
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

        {/* Allergy Filter */}
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

      {/* Title and Count */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>Volledige Allergieën Lijst</Text>
        <Text style={styles.subtitle}>Alle bewoners met allergieën</Text>
      </View>

      {/* Results count */}
      <Text style={styles.resultCount}>
        {residents.length} bewoner{residents.length !== 1 ? 's' : ''} gevonden
      </Text>

      {/* Residents List */}
      <FlatList
        data={residents}
        renderItem={renderResidentCard}
        keyExtractor={(item) => item.resident_id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons
              name="person-off"
              size={64}
              color={Colors.iconMuted}
            />
            <Text style={styles.emptyText}>
              {loading ? 'Bewoners laden...' : 'Geen bewoners gevonden'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
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
  },
  warningText: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: FontSize.sm,
    color: '#DC2626',
    fontWeight: '600',
  },
  searchContainer: {
    margin: Layout.screenPadding,
    ...Platform.select({
      web: {
        maxWidth: 600,
        alignSelf: 'center',
        width: '100%',
      },
    }),
  },
  filtersRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginHorizontal: Layout.screenPadding,
    marginBottom: Spacing.md,
  },
  filterContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingLeft: Spacing.md,
    paddingRight: Platform.OS === 'ios' ? Spacing.md : 0,
    paddingVertical: Platform.OS === 'ios' ? Spacing.md : 0,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
    fontWeight: '500',
  },
  filterValue: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    marginLeft: Spacing.xs,
    fontWeight: '600',
  },
  pickerContainer: {
    flex: 1,
  },
  picker: {
    height: 40,
  },
  titleSection: {
    marginHorizontal: Layout.screenPadding,
    marginBottom: Spacing.sm,
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
  resultCount: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginHorizontal: Layout.screenPadding,
    marginBottom: Spacing.md,
  },
  listContent: {
    paddingHorizontal: Layout.screenPadding,
    paddingBottom: Layout.screenPadding,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
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
  allergyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  allergyBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    flex: 1,
  },
  allergyText: {
    color: '#FFFFFF',
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  severityBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  severityText: {
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: FontSize.lg,
    color: Colors.textMuted,
    marginTop: Layout.screenPadding,
  },
});
