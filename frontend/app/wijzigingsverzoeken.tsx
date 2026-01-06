import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius, FontSize, FontWeight } from '@/constants';
import { NavigationBar } from '@/components';
import { formatDate } from '@/utils/date';
import { fetchChangeRequests } from '@/Services/changeRequestsApi';
import { fetchResidents } from '@/Services/residentsApi';
import { mapUrgencyFromBackend } from '@/Services/noteMapper';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants';

// component state (loaded from API)

export default function WijzigingsverzookenScreen() {
  const router = useRouter();
  const [changeRequestsData, setChangeRequestsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [residents, setResidents] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    loadChangeRequests();
  }, []);

  const loadChangeRequests = async () => {
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

      setChangeRequestsData(data || []);
      setResidents(residentsData || []);
      setUsers(usersData || []);
    } catch (err) {
      console.error('Failed to load change requests:', err);
      setError('Kan wijzigingsverzoeken niet laden');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestPress = (requestId: number) => {
    router.push(`/wijzigingsverzoek-detail?id=${requestId}`);
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

  const translateFieldName = (fieldName: string): string => {
    const translations: Record<string, string> = {
      'diet_type': 'Dieet',
      'medication_dosage': 'Medicatie',
      'contact_phone': 'Contact',
      'medication': 'Medicatie',
      'allergy': 'Allergie',
    };
    return translations[fieldName] || fieldName;
  };

  // Sort requests: pending first, then by date
  const sortedRequests = [...changeRequestsData].sort((a, b) => {
    // Pending requests first
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    // Then by date (newest first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <NavigationBar />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Laden...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <NavigationBar />
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NavigationBar />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.pageTitle}>Wijzigingsverzoeken</Text>

          {/* Requests List */}
          {sortedRequests.map((request) => {
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
            const resident = residents.find((r) => r.resident_id === request.resident_id);
            const requester = users.find((u) => u.user_id === request.requester_id);
            const fields = request.changeFields || request.change_fields || [];
            const changesText = fields.map(f => translateFieldName(f.field_name)).join(', ');

            return (
              <TouchableOpacity
                key={request.request_id}
                style={[
                  styles.requestCard,
                  request.status === 'pending' && styles.requestCardPending,
                  request.status !== 'pending' && styles.requestCardProcessed,
                ]}
                onPress={() => handleRequestPress(request.request_id)}
                activeOpacity={0.7}
              >
                {/* Urgency Badge */}
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

                {/* Request Content */}
                <View style={styles.requestContent}>
                  {/* Header Row */}
                  <View style={styles.requestHeader}>
                    <Text style={[
                      styles.residentName,
                      request.status !== 'pending' && styles.textProcessed
                    ]}>
                      {resident?.name || 'Onbekend'}
                    </Text>
                    <View style={styles.headerRight}>
                      {request.status !== 'pending' && (
                        <View style={[
                          styles.statusBadge,
                          request.status === 'approved' && styles.statusBadgeApproved,
                          request.status === 'rejected' && styles.statusBadgeRejected,
                        ]}>
                          <Text style={[
                            styles.statusText,
                            request.status === 'approved' && styles.statusTextApproved,
                            request.status === 'rejected' && styles.statusTextRejected,
                          ]}>
                            {mapStatus(request.status)}
                          </Text>
                        </View>
                      )}
                      <MaterialIcons
                        name="chevron-right"
                        size={24}
                        color={request.status !== 'pending' ? Colors.iconMuted : Colors.textSecondary}
                      />
                    </View>
                  </View>

                  {/* Info Row */}
                  <View style={styles.infoSection}>
                    <View style={styles.infoItem}>
                      <MaterialIcons
                        name="person"
                        size={16}
                        color={request.status !== 'pending' ? Colors.iconMuted : Colors.textSecondary}
                      />
                      <Text style={[
                        styles.infoText,
                        request.status !== 'pending' && styles.textProcessed
                      ]}>
                        Door: {requester?.name || 'Onbekend'}
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <MaterialIcons
                        name="access-time"
                        size={16}
                        color={request.status !== 'pending' ? Colors.iconMuted : Colors.textSecondary}
                      />
                      <Text style={[
                        styles.infoText,
                        request.status !== 'pending' && styles.textProcessed
                      ]}>
                        {formatDate(request.created_at, 'dd-MM, HH:mm')}
                      </Text>
                    </View>
                  </View>

                  {/* Changes Summary */}
                  <View style={styles.changesRow}>
                    <Text style={[
                      styles.changesLabel,
                      request.status !== 'pending' && styles.textProcessed
                    ]}>
                      Wijzigingen:
                    </Text>
                    <Text style={[
                      styles.changesText,
                      request.status !== 'pending' && styles.textProcessed
                    ]} numberOfLines={1}>
                      {changesText || 'Geen details'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          {changeRequestsData.length === 0 && (
            <View style={styles.emptyState}>
              <MaterialIcons name="inbox" size={64} color={Colors.iconMuted} />
              <Text style={styles.emptyText}>Geen wijzigingsverzoeken</Text>
            </View>
          )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundTertiary,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingTop: Platform.OS === 'web' ? Spacing['2xl'] : 0,
    paddingBottom: Spacing['3xl'],
    ...Platform.select({
      web: {
        maxWidth: 1000,
        marginHorizontal: 'auto',
        width: '100%',
      },
    }),
  },

  // Header
  pageTitle: {
    ...Typography.h1,
    fontSize: FontSize['3xl'],
    color: Colors.textPrimary,
    marginBottom: Spacing['2xl'],
    fontWeight: FontWeight.semibold,
  },

  // Request Card
  requestCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  requestCardPending: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  requestCardProcessed: {
    backgroundColor: Colors.backgroundSecondary,
    opacity: 0.75,
  },
  urgencyBadge: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    alignSelf: 'flex-start',
    borderBottomRightRadius: BorderRadius.md,
  },
  urgencyText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.5,
  },
  requestContent: {
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  residentName: {
    ...Typography.h3,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
  },
  textProcessed: {
    color: Colors.textMuted,
  },
  statusBadge: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  statusBadgeApproved: {
    backgroundColor: '#d1fae5',
  },
  statusBadgeRejected: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  statusTextApproved: {
    color: '#065f46',
  },
  statusTextRejected: {
    color: '#991b1b',
  },

  // Info Section
  infoSection: {
    flexDirection: 'row',
    gap: Spacing.xl,
    flexWrap: 'wrap',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  infoText: {
    ...Typography.body,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },

  // Changes
  changesRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  changesLabel: {
    ...Typography.label,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  changesText: {
    ...Typography.body,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    flex: 1,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['6xl'],
  },
  emptyText: {
    ...Typography.body,
    fontSize: FontSize.lg,
    color: Colors.textMuted,
    marginTop: Spacing.lg,
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  loadingText: {
    ...Typography.body,
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
  },

  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
    padding: Spacing.xl,
  },
  errorText: {
    ...Typography.body,
    fontSize: FontSize.lg,
    color: Colors.error,
    textAlign: 'center',
  },
});
