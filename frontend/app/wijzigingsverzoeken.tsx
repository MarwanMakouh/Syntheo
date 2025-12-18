import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius, FontSize, FontWeight } from '@/constants';
import { NavigationBar } from '@/components';
import {
  changeRequests,
  changeFields,
  residents,
  users,
} from '@/Services/API';
import { formatDate } from '@/utils/date';

export default function WijzigingsverzookenScreen() {
  const router = useRouter();

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
  const sortedRequests = [...changeRequests].sort((a, b) => {
    // Pending requests first
    if (a.status === 'In behandeling' && b.status !== 'In behandeling') return -1;
    if (a.status !== 'In behandeling' && b.status === 'In behandeling') return 1;
    // Then by date (newest first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <NavigationBar />
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Text style={styles.pageTitle}>Wijzigingsverzoeken</Text>

          {/* Requests List */}
          {sortedRequests.map((request) => {
            const resident = residents.find((r) => r.resident_id === request.resident_id);
            const requester = users.find((u) => u.user_id === request.requester_id);
            const fields = changeFields.filter((f) => f.request_id === request.request_id);
            const changesText = fields.map(f => translateFieldName(f.field_name)).join(', ');

            return (
              <TouchableOpacity
                key={request.request_id}
                style={[
                  styles.requestCard,
                  request.status === 'In behandeling' && styles.requestCardPending,
                  request.status !== 'In behandeling' && styles.requestCardProcessed,
                ]}
                onPress={() => handleRequestPress(request.request_id)}
                activeOpacity={0.7}
              >
                {/* Urgency Badge */}
                <View
                  style={[
                    styles.urgencyBadge,
                    { backgroundColor: getUrgencyBgColor(request.urgency) }
                  ]}
                >
                  <Text
                    style={[
                      styles.urgencyText,
                      { color: getUrgencyColor(request.urgency) }
                    ]}
                  >
                    {request.urgency.toUpperCase()}
                  </Text>
                </View>

                {/* Request Content */}
                <View style={styles.requestContent}>
                  {/* Header Row */}
                  <View style={styles.requestHeader}>
                    <Text style={[
                      styles.residentName,
                      request.status !== 'In behandeling' && styles.textProcessed
                    ]}>
                      {resident?.name || 'Onbekend'}
                    </Text>
                    <View style={styles.headerRight}>
                      {request.status !== 'In behandeling' && (
                        <View style={[
                          styles.statusBadge,
                          request.status === 'Goedgekeurd' && styles.statusBadgeApproved,
                          request.status === 'Afgekeurd' && styles.statusBadgeRejected,
                        ]}>
                          <Text style={[
                            styles.statusText,
                            request.status === 'Goedgekeurd' && styles.statusTextApproved,
                            request.status === 'Afgekeurd' && styles.statusTextRejected,
                          ]}>
                            {request.status}
                          </Text>
                        </View>
                      )}
                      <MaterialIcons
                        name="chevron-right"
                        size={24}
                        color={request.status !== 'In behandeling' ? Colors.iconMuted : Colors.textSecondary}
                      />
                    </View>
                  </View>

                  {/* Info Row */}
                  <View style={styles.infoSection}>
                    <View style={styles.infoItem}>
                      <MaterialIcons
                        name="person"
                        size={16}
                        color={request.status !== 'In behandeling' ? Colors.iconMuted : Colors.textSecondary}
                      />
                      <Text style={[
                        styles.infoText,
                        request.status !== 'In behandeling' && styles.textProcessed
                      ]}>
                        Door: {requester?.name || 'Onbekend'}
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <MaterialIcons
                        name="access-time"
                        size={16}
                        color={request.status !== 'In behandeling' ? Colors.iconMuted : Colors.textSecondary}
                      />
                      <Text style={[
                        styles.infoText,
                        request.status !== 'In behandeling' && styles.textProcessed
                      ]}>
                        {formatDate(request.created_at, 'dd-MM, HH:mm')}
                      </Text>
                    </View>
                  </View>

                  {/* Changes Summary */}
                  <View style={styles.changesRow}>
                    <Text style={[
                      styles.changesLabel,
                      request.status !== 'In behandeling' && styles.textProcessed
                    ]}>
                      Wijzigingen:
                    </Text>
                    <Text style={[
                      styles.changesText,
                      request.status !== 'In behandeling' && styles.textProcessed
                    ]} numberOfLines={1}>
                      {changesText || 'Geen details'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          {changeRequests.length === 0 && (
            <View style={styles.emptyState}>
              <MaterialIcons name="inbox" size={64} color={Colors.iconMuted} />
              <Text style={styles.emptyText}>Geen wijzigingsverzoeken</Text>
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
});
