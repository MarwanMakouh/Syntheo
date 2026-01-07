import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius, FontSize, FontWeight } from '@/constants';
import { NavigationBar } from '@/components';
import { formatDate } from '@/utils/date';
import { fetchChangeRequests, approveChangeRequest, rejectChangeRequest } from '@/Services/changeRequestsApi';
import { useAuth } from '@/contexts/AuthContext';
import { fetchResidents } from '@/Services/residentsApi';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants';
import { mapUrgencyFromBackend } from '@/Services/noteMapper';

export default function WijzigingsverzoekDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [request, setRequest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [residents, setResidents] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const { currentUser } = useAuth();

  const requestId = Number(id);

  useEffect(() => {
    loadChangeRequest();
  }, [id]);

  const mapUrgency = (u: string) => mapUrgencyFromBackend(u || '');
  const mapStatus = (s: string) => {
    switch (s) {
      case 'approved':
        return 'Goedgekeurd';
      case 'rejected':
        return 'Afgekeurd';
      case 'pending':
      default:
        return 'In behandeling';
    }
  };

  const loadChangeRequest = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [data, residentsData] = await Promise.all([
        fetchChangeRequests(),
        fetchResidents(),
      ]);

      // fetch users list
      let usersData: any[] = [];
      try {
        const resp = await fetch(`${API_BASE_URL}${API_ENDPOINTS.users}`);
        if (resp.ok) {
          const json = await resp.json();
          usersData = json.data || [];
        } else {
          console.error('Failed to fetch users, status:', resp.status);
        }
      } catch (e) {
        console.error('Failed to fetch users:', e);
      }

      const foundRequest = (data || []).find((r) => r.request_id === requestId);
      if (foundRequest) {
        setRequest(foundRequest);
      } else {
        setError('Wijzigingsverzoek niet gevonden');
      }

      setResidents(residentsData || []);
      setUsers(usersData || []);
    } catch (err) {
      console.error('Failed to load change request:', err);
      setError('Kan wijzigingsverzoek niet laden');
    } finally {
      setIsLoading(false);
    }
  };

  const fields = request?.changeFields || [];
  const resident = request ? residents.find((r) => r.resident_id === request.resident_id) : null;
  const requester = request ? users.find((u) => u.user_id === request.requester_id) : null;
  const reviewer = request?.reviewer_id
    ? users.find((u) => u.user_id === request.reviewer_id)
    : null;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <NavigationBar />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Laden...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleApprove = () => {
    (async () => {
      try {
        setIsApproving(true);
        const reviewerId = currentUser?.user_id || 1;
        await approveChangeRequest(requestId, reviewerId);
        alert('Wijzigingsverzoek goedgekeurd');
        // Navigate back to the list and force a full reload on web so the list refreshes
        try {
          if (Platform.OS === 'web' && typeof window !== 'undefined') {
            await router.push('/wijzigingsverzoeken');
            setTimeout(() => window.location.reload(), 250);
          } else {
            router.back();
          }
        } catch (e) {
          // fallback
          router.back();
        }
      } catch (e) {
        console.error('Failed to approve request:', e);
        alert('Kon verzoek niet goedkeuren');
      } finally {
        setIsApproving(false);
      }
    })();
  };

  const handleReject = () => {
    (async () => {
      try {
        setIsRejecting(true);
        const reviewerId = currentUser?.user_id || 1;
        await rejectChangeRequest(requestId, reviewerId);
        alert('Wijzigingsverzoek afgekeurd');
        // Navigate back to the list and force a full reload on web so the list refreshes
        try {
          if (Platform.OS === 'web' && typeof window !== 'undefined') {
            await router.push('/wijzigingsverzoeken');
            setTimeout(() => window.location.reload(), 250);
          } else {
            router.back();
          }
        } catch (e) {
          router.back();
        }
      } catch (e) {
        console.error('Failed to reject request:', e);
        alert('Kon verzoek niet afkeuren');
      } finally {
        setIsRejecting(false);
      }
    })();
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Hoog':
        return Colors.urgencyHigh;
      case 'Matig':
        return Colors.urgencyMedium;
      case 'Laag':
        return Colors.urgencyLow;
      default:
        return Colors.textSecondary;
    }
  };

  const getUrgencyBgColor = (urgency: string) => {
    switch (urgency) {
      case 'Hoog':
        return Colors.urgencyHighBg;
      case 'Matig':
        return Colors.urgencyMediumBg;
      case 'Laag':
        return Colors.urgencyLowBg;
      default:
        return Colors.backgroundSecondary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Goedgekeurd':
        return Colors.success;
      case 'Afgekeurd':
        return Colors.error;
      case 'In behandeling':
        return Colors.warning;
      default:
        return Colors.textSecondary;
    }
  };

  const translateFieldName = (fieldName: string): string => {
    const translations: Record<string, string> = {
      'diet_type': 'Dieet',
      'medication_dosage': 'Medicatie Dosering',
      'contact_phone': 'Contactpersoon Telefoon',
      'medication': 'Medicatie',
      'allergy': 'Allergie',
    };
    return translations[fieldName] || fieldName;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <NavigationBar />
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Text style={styles.pageTitle}>Wijzigingsverzoek</Text>
              <View
                style={[
                  styles.urgencyBadge,
                  { backgroundColor: getUrgencyBgColor(mapUrgency(request.urgency)) }
                ]}
              >
                <Text
                  style={[
                    styles.urgencyText,
                    { color: getUrgencyColor(mapUrgency(request.urgency)) }
                  ]}
                >
                  {mapUrgency(request.urgency).toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.residentName}>{resident?.name || 'Onbekende bewoner'}</Text>
              <Text style={styles.dateText}>
                Aangevraagd op {formatDate(request.created_at, 'dd-MM, HH:mm')}
              </Text>
            </View>
          </View>

          {/* Aanvrager Info */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="person" size={24} color={Colors.primary} />
              <Text style={styles.cardTitle}>Aanvrager</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Naam:</Text>
                <Text style={styles.infoValue}>{requester?.name || 'Onbekend'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Rol:</Text>
                <Text style={styles.infoValue}>{requester?.role || '-'}</Text>
              </View>
            </View>
          </View>

          {/* Wijzigingen */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="edit" size={24} color={Colors.primary} />
              <Text style={styles.cardTitle}>Voorgestelde Wijzigingen</Text>
            </View>
            <View style={styles.cardContent}>
              {fields && fields.length > 0 ? (
                fields.map((field) => (
                  <View key={field.field_id} style={styles.changeItem}>
                    <Text style={styles.fieldName}>{translateFieldName(field.field_name)}</Text>
                    <View style={styles.changeRow}>
                      <View style={styles.changeBox}>
                        <Text style={styles.changeLabel}>Oud</Text>
                        <Text style={styles.oldValue}>{field.old || '-'}</Text>
                      </View>
                      <MaterialIcons name="arrow-forward" size={20} color={Colors.textSecondary} />
                      <View style={styles.changeBox}>
                        <Text style={styles.changeLabel}>Nieuw</Text>
                        <Text style={styles.newValue}>{field.new}</Text>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>Geen wijzigingen gevonden</Text>
              )}
            </View>
          </View>

          {/* Status */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="info" size={24} color={Colors.primary} />
              <Text style={styles.cardTitle}>Status</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Huidige status:</Text>
                <Text style={[styles.statusText, { color: getStatusColor(mapStatus(request.status)) }]}>
                  {mapStatus(request.status)}
                </Text>
              </View>
              {request.reviewed_at && (
                <>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Behandeld op:</Text>
                    <Text style={styles.infoValue}>
                      {formatDate(request.reviewed_at, 'dd-MM, HH:mm')}
                    </Text>
                  </View>
                  {reviewer && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Behandeld door:</Text>
                      <Text style={styles.infoValue}>{reviewer.name}</Text>
                    </View>
                  )}
                </>
              )}
            </View>
          </View>

          {/* Action Buttons - Only show for pending requests */}
          {request.status === 'pending' && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.button, styles.rejectButton]}
                onPress={handleReject}
                activeOpacity={0.7}
                disabled={isRejecting || isApproving}
              >
                {isRejecting ? (
                  <ActivityIndicator size="small" color={Colors.textOnPrimary} />
                ) : (
                  <MaterialIcons name="close" size={20} color={Colors.textOnPrimary} />
                )}
                <Text style={styles.buttonText}>Afkeuren</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.approveButton]}
                onPress={handleApprove}
                activeOpacity={0.7}
                disabled={isRejecting || isApproving}
              >
                {isApproving ? (
                  <ActivityIndicator size="small" color={Colors.textOnPrimary} />
                ) : (
                  <MaterialIcons name="check" size={20} color={Colors.textOnPrimary} />
                )}
                <Text style={styles.buttonText}>Goedkeuren</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundTertiary,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundTertiary,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingTop: Spacing['2xl'],
    paddingBottom: Spacing['3xl'],
    ...Platform.select({
      web: {
        maxWidth: 900,
        marginHorizontal: 'auto',
        width: '100%',
      },
    }),
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    ...Typography.body,
    fontSize: FontSize.lg,
    color: Colors.error,
  },

  // Header
  header: {
    marginBottom: Spacing['2xl'],
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  pageTitle: {
    ...Typography.h1,
    fontSize: FontSize['3xl'],
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
  },
  urgencyBadge: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  urgencyText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.5,
  },
  headerInfo: {
    gap: Spacing.xs,
  },
  residentName: {
    ...Typography.h2,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
  },
  dateText: {
    ...Typography.body,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },

  // Cards
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.xl,
    backgroundColor: Colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  cardTitle: {
    ...Typography.h3,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
  },
  cardContent: {
    padding: Spacing.xl,
    gap: Spacing.lg,
  },

  // Info Rows
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.md,
  },
  infoLabel: {
    ...Typography.body,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  infoValue: {
    ...Typography.body,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
  },
  statusText: {
    ...Typography.body,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },

  // Changes
  changeItem: {
    gap: Spacing.md,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  fieldName: {
    ...Typography.label,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    justifyContent: 'space-between',
  },
  changeBox: {
    flex: 1,
    padding: Spacing.lg,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  changeLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: FontWeight.semibold,
  },
  oldValue: {
    ...Typography.body,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  newValue: {
    ...Typography.body,
    fontSize: FontSize.md,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginTop: Spacing.xl,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
  },
  approveButton: {
    backgroundColor: Colors.success,
  },
  rejectButton: {
    backgroundColor: Colors.error,
  },
  buttonText: {
    ...Typography.buttonMedium,
    fontSize: FontSize.lg,
    color: Colors.textOnPrimary,
    fontWeight: FontWeight.semibold,
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  loadingText: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: Spacing.lg,
  },
});
