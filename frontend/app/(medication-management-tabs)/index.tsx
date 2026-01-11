import { useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  ActionSheetIOS,
  ScrollView,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { StaffLayout } from '@/components/staff';
import { AdminLayout } from '@/components/admin';
import { PageHeader, LoadingState } from '@/components/ui';
import { BewonerCard } from '@/components';
import { fetchResidents } from '@/Services/residentsApi';
import { useAuth } from '@/contexts/AuthContext';
import { Colors, FontSize, Spacing, BorderRadius, Layout, FontWeight, Shadows } from '@/constants';

const DEFAULT_FLOOR_ID = 1;

const FLOOR_OPTIONS = [
  { label: 'Verdieping 1', value: 1 },
  { label: 'Verdieping 2', value: 2 },
  { label: 'Verdieping 3', value: 3 },
];

export default function MedicationManagementIndexScreen() {
  const router = useRouter();
  const { currentUser } = useAuth();

  const [selectedFloor, setSelectedFloor] = useState<number>(DEFAULT_FLOOR_ID);
  const [floorDropdownOpen, setFloorDropdownOpen] = useState(false);
  const [allResidents, setAllResidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Determine which layout to use based on role
  const isAdmin = currentUser?.role === 'Beheerder';
  const LayoutComponent = isAdmin ? AdminLayout : StaffLayout;

  // Fetch residents from API
  useEffect(() => {
    const loadResidents = async () => {
      try {
        setLoading(true);
        const data = await fetchResidents();
        setAllResidents(data);
      } catch (error) {
        console.error('Failed to load residents:', error);
      } finally {
        setLoading(false);
      }
    };

    loadResidents();
  }, []);

  // Filter residents by floor
  const filteredResidents = useMemo(() => {
    return allResidents.filter(resident => {
      return resident.room && resident.room.floor_id === selectedFloor;
    });
  }, [allResidents, selectedFloor]);

  const handleFloorSelect = (floorValue: number) => {
    setSelectedFloor(floorValue);
    setFloorDropdownOpen(false);
  };

  // Handle floor selection for iOS
  const handleFloorPress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Annuleren', ...FLOOR_OPTIONS.map(f => f.label)],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex > 0) {
            setSelectedFloor(Number(FLOOR_OPTIONS[buttonIndex - 1].value));
          }
        }
      );
    } else {
      setFloorDropdownOpen(!floorDropdownOpen);
    }
  };

  const getFloorLabel = () => {
    const floor = FLOOR_OPTIONS.find(f => f.value === selectedFloor);
    return floor ? floor.label : 'Verdieping 1';
  };

  if (loading) {
    return (
      <LayoutComponent activeRoute="medicatie-beheer">
        <LoadingState message="Bewoners laden..." />
      </LayoutComponent>
    );
  }

  return (
    <LayoutComponent activeRoute="medicatie-beheer">
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <PageHeader title="Medicatie Beheer" />

          <Text style={styles.subtitle}>
            Selecteer een bewoner om medicatie toe te voegen of te beheren
          </Text>

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

          {/* Results count */}
          <Text style={styles.resultCount}>
            {filteredResidents.length} bewoner
            {filteredResidents.length !== 1 ? 's' : ''} gevonden
          </Text>

          {/* Residents List */}
          {filteredResidents.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons
                name="person-off"
                size={64}
                color={Colors.iconMuted}
              />
              <Text style={styles.emptyText}>Geen bewoners gevonden</Text>
            </View>
          ) : (
            <View style={styles.listContent}>
              {filteredResidents.map((item) => (
                <BewonerCard
                  key={item.resident_id}
                  resident={item}
                  roomNumber={item.room?.room_number ?? null}
                  onPress={() =>
                    router.push(`/(medication-management-tabs)/${item.resident_id}` as any)
                  }
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </LayoutComponent>
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
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    marginTop: -Spacing.md,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    position: 'relative',
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  dropdownContainerOpen: {
    ...(Platform.OS === 'web' ? { zIndex: 10000 } : { zIndex: 2000 }),
  },
  label: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  dropdownWrapper: {
    flex: 1,
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
    zIndex: 1,
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
  resultCount: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  listContent: {
    gap: Spacing.md,
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
