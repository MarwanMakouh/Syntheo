import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StaffLayout } from '@/components/staff';
import { AdminLayout } from '@/components/admin';
import { PageHeader, LoadingState } from '@/components/ui';
import { MedicationManagementCard } from '@/components/medication/MedicationManagementCard';
import { AddMedicationModal } from '@/components/medication/AddMedicationModal';
import { useAuth } from '@/contexts/AuthContext';
import { fetchResidentById } from '@/Services/residentsApi';
import { fetchResMedicationsByResident, deactivateResMedication, activateResMedication } from '@/Services/resMedicationsApi';
import { Colors, FontSize, Spacing, BorderRadius, Layout, FontWeight, Shadows } from '@/constants';
import { Platform } from 'react-native';
import { API_BASE_URL } from '@/constants/apiConfig';

export default function MedicationManagementScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const residentId = Number(id);
  const { currentUser } = useAuth();

  const [resident, setResident] = useState<any>(null);
  const [medications, setMedications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Determine which layout to use based on role
  const isAdmin = currentUser?.role === 'Beheerder';
  const LayoutComponent = isAdmin ? AdminLayout : StaffLayout;

  useEffect(() => {
    loadData();
  }, [residentId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [residentData, medicationsData] = await Promise.all([
        fetchResidentById(residentId),
        fetchResMedicationsByResident(residentId),
      ]);
      setResident(residentData);
      setMedications(medicationsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      Alert.alert('Fout', 'Kan gegevens niet laden. Probeer het opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (resMedicationId: number, activate: boolean) => {
    console.log('[handleStatusChange] Starting...', { resMedicationId, activate });
    try {
      if (activate) {
        console.log('[handleStatusChange] Calling activateResMedication...');
        await activateResMedication(resMedicationId);
      } else {
        console.log('[handleStatusChange] Calling deactivateResMedication...');
        await deactivateResMedication(resMedicationId);
      }

      console.log('[handleStatusChange] API call successful, refreshing data...');
      // Refresh the list
      await loadData();

      console.log('[handleStatusChange] Data refreshed, showing alert...');
      // Show success message after data refresh
      setTimeout(() => {
        Alert.alert(
          'Succes',
          `Medicatie is succesvol ${activate ? 'geactiveerd' : 'gedeactiveerd'}`
        );
      }, 100);
    } catch (error) {
      console.error('[handleStatusChange] Error:', error);
      Alert.alert('Fout', 'Kan medicatiestatus niet wijzigen. Probeer het opnieuw.');
    }
  };

  const handleAddSuccess = () => {
    setShowAddModal(false);
    loadData();
  };

  const handleDelete = async (resMedicationId: number) => {
    console.log('[handleDelete] Starting...', { resMedicationId });
    console.log('[handleDelete] URL:', `${API_BASE_URL}/res-medications/${resMedicationId}`);
    try {
      const response = await fetch(
        `${API_BASE_URL}/res-medications/${resMedicationId}`,
        {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      console.log('[handleDelete] Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('[handleDelete] Delete successful, refreshing data...');
      // Refresh the list
      await loadData();

      console.log('[handleDelete] Data refreshed, showing alert...');
      // Show success message after data refresh
      setTimeout(() => {
        Alert.alert('Succes', 'Medicatie is succesvol verwijderd');
      }, 100);
    } catch (error) {
      console.error('[handleDelete] Error:', error);
      Alert.alert('Fout', 'Kan medicatie niet verwijderen. Probeer het opnieuw.');
    }
  };

  if (loading) {
    return (
      <LayoutComponent activeRoute="medicatie-beheer">
        <LoadingState message="Gegevens laden..." />
      </LayoutComponent>
    );
  }

  if (!resident) {
    return (
      <LayoutComponent activeRoute="medicatie-beheer">
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={64} color={Colors.error} />
          <Text style={styles.errorText}>Bewoner niet gevonden</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Terug</Text>
          </TouchableOpacity>
        </View>
      </LayoutComponent>
    );
  }

  const activeMedications = medications.filter(m => m.is_active);
  const inactiveMedications = medications.filter(m => !m.is_active);

  return (
    <LayoutComponent activeRoute="medicatie-beheer">
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButtonHeader}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={24} color={Colors.primary} />
            <Text style={styles.backButtonHeaderText}>Terug naar lijst</Text>
          </TouchableOpacity>

          {/* Page Header */}
          <PageHeader title={`Medicatie Beheer - ${resident.name}`} />

          {/* Patient Info Card */}
          <View style={styles.patientCard}>
            <View style={styles.patientCardHeader}>
              <MaterialIcons name="person" size={40} color={Colors.primary} />
              <View style={styles.patientInfo}>
                <Text style={styles.patientName}>{resident.name}</Text>
                <View style={styles.patientDetails}>
                  <View style={styles.patientDetail}>
                    <MaterialIcons name="cake" size={16} color={Colors.textSecondary} />
                    <Text style={styles.patientDetailText}>
                      {new Date().getFullYear() - new Date(resident.date_of_birth).getFullYear()} jaar
                    </Text>
                  </View>
                  {resident.room && (
                    <View style={styles.patientDetail}>
                      <MaterialIcons name="door-front" size={16} color={Colors.textSecondary} />
                      <Text style={styles.patientDetailText}>
                        Kamer {resident.room.room_number}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Add Medication Button */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="add-circle" size={24} color={Colors.background} />
            <Text style={styles.addButtonText}>Nieuwe Medicatie Toevoegen</Text>
          </TouchableOpacity>

          {/* Active Medications Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Actieve Medicaties ({activeMedications.length})
              </Text>
            </View>
            {activeMedications.length === 0 ? (
              <View style={styles.emptyContainer}>
                <MaterialIcons name="medication" size={48} color={Colors.iconMuted} />
                <Text style={styles.emptyText}>Geen actieve medicaties</Text>
                <Text style={styles.emptySubtext}>
                  Klik op 'Nieuwe Medicatie Toevoegen' om te beginnen
                </Text>
              </View>
            ) : (
              activeMedications.map((medication) => (
                <MedicationManagementCard
                  key={medication.res_medication_id}
                  resMedication={medication}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))
            )}
          </View>

          {/* Inactive Medications Section */}
          {inactiveMedications.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  Inactieve Medicaties ({inactiveMedications.length})
                </Text>
              </View>
              {inactiveMedications.map((medication) => (
                <MedicationManagementCard
                  key={medication.res_medication_id}
                  resMedication={medication}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Medication Modal */}
      <AddMedicationModal
        visible={showAddModal}
        residentId={residentId}
        residentName={resident.name}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
      />
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
  backButtonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  backButtonHeaderText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.primary,
  },
  patientCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  patientCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  patientDetails: {
    flexDirection: 'row',
    gap: Spacing.lg,
    flexWrap: 'wrap',
  },
  patientDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  patientDetailText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
    ...Shadows.button,
  },
  addButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.background,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['3xl'],
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.medium,
    color: Colors.textMuted,
    marginTop: Spacing.md,
  },
  emptySubtext: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['3xl'],
  },
  errorText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.error,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  backButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.background,
  },
});
