import React, { useMemo } from 'react';
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
import { Colors, Spacing, Typography, Shadows, BorderRadius } from '@/constants';
import { NavigationBar } from '@/components';
import {
  residents,
  notes,
  rooms,
  changeRequests,
  medicationRounds,
  resSchedules,
} from '@/Services/API';
import { formatDate } from '@/utils/date';

export default function DashboardScreen() {
  const router = useRouter();

  // Calculate statistics from real data
  const stats = useMemo(() => {
    const urgentCount = notes.filter((n) => n.urgency === 'Hoog' && !n.is_resolved).length;
    const attentionCount = notes.filter((n) => n.urgency === 'Matig' && !n.is_resolved).length;
    const stableCount = notes.filter((n) => n.urgency === 'Laag' || n.is_resolved).length;

    // Calculate medication compliance
    const totalScheduled = medicationRounds.length;
    const givenMeds = medicationRounds.filter((mr) => mr.status === 'Gegeven').length;
    const compliance = totalScheduled > 0 ? Math.round((givenMeds / totalScheduled) * 100) : 0;

    const pendingChanges = changeRequests.filter((cr) => cr.status === 'In behandeling').length;

    return {
      urgent: urgentCount,
      attention: attentionCount,
      stable: stableCount,
      compliance,
      pendingChanges,
    };
  }, []);

  // Dynamic status cards with real data
  const dynamicStatusCards = useMemo(
    () => [
      {
        id: 1,
        number: stats.urgent.toString(),
        label: 'Urgent',
        backgroundColor: '#FEE2E2',
        textColor: '#DC2626',
      },
      {
        id: 2,
        number: stats.attention.toString(),
        label: 'Aandacht',
        backgroundColor: '#FFF4E6',
        textColor: '#D97706',
      },
      {
        id: 3,
        number: stats.stable.toString(),
        label: 'Stabiel',
        backgroundColor: '#D1FAE5',
        textColor: '#10B981',
      },
      {
        id: 4,
        number: `${stats.compliance}%`,
        label: 'Med. Naleving',
        backgroundColor: '#D1FAE5',
        textColor: '#10B981',
      },
    ],
    [stats]
  );

  // Dynamic action cards with real data
  const actionCards = useMemo(
    () => [
      {
        id: 1,
        title: 'Wijzigingsverzoeken',
        subtitle: `${stats.pendingChanges} in afwachting`,
        icon: 'description',
        color: Colors.primary,
      },
      {
        id: 2,
        title: 'Aankondiging Maken',
        subtitle: 'Bericht sturen naar personeel',
        icon: 'campaign',
        color: Colors.primary,
      },
      {
        id: 3,
        title: 'Kamerbeheer',
        subtitle: 'Bewoners toewijzen',
        icon: 'meeting-room',
        color: Colors.primary,
      },
    ],
    [stats.pendingChanges]
  );

  // Get urgent residents from data
  const urgentResidents = useMemo(() => {
    const urgentNotes = notes.filter((note) => note.urgency === 'Hoog' && !note.is_resolved);

    return urgentNotes.map((note) => {
      const resident = residents.find((r) => r.resident_id === note.resident_id);
      const room = rooms.find((r) => r.resident_id === note.resident_id);
      const residentNotes = notes.filter(
        (n) => n.resident_id === note.resident_id && !n.is_resolved
      );

      return {
        id: note.resident_id,
        room: room?.room_id || 0,
        name: resident?.name || 'Onbekend',
        incident: `${note.category} - ${formatDate(note.created_at, 'dd-MM, HH:mm')}`,
        openNotes: residentNotes.length,
      };
    });
  }, []);

  const handleActionPress = (actionTitle: string) => {
    console.log(`Action pressed: ${actionTitle}`);
  };

  const handleViewResident = (residentId: number) => {
    router.push(`/(tabs)/bewoners/${residentId}`);
  };

  const handleViewNotes = (residentId: number) => {
    router.push(`/(tabs)/bewoners/${residentId}`);
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
          <Text style={styles.pageTitle}>Overzicht</Text>

        {/* Status Cards */}
        <View style={styles.statusCardsContainer}>
          {dynamicStatusCards.map((card) => (
            <View
              key={card.id}
              style={[
                styles.statusCard,
                { backgroundColor: card.backgroundColor },
              ]}
            >
              <Text style={[styles.statusNumber, { color: card.textColor }]}>
                {card.number}
              </Text>
              <Text style={[styles.statusLabel, { color: card.textColor }]}>
                {card.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Alert Banner */}
        {stats.pendingChanges > 0 && (
          <View style={styles.alertBanner}>
            <MaterialIcons
              name="warning"
              size={24}
              color={Colors.warningAlt}
              style={styles.alertIcon}
            />
            <Text style={styles.alertText}>
              {stats.pendingChanges} nieuwe wijzigingsverzoeken in afwachting
            </Text>
          </View>
        )}

        {/* Action Cards */}
        <View style={styles.actionCardsContainer}>
          {actionCards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={styles.actionCard}
              onPress={() => handleActionPress(card.title)}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={card.icon as any}
                size={32}
                color={card.color}
                style={styles.actionIcon}
              />
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>{card.title}</Text>
                <Text style={styles.actionSubtitle}>{card.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Urgent Residents */}
        {urgentResidents.length > 0 && (
          <View style={styles.urgentSection}>
            <View style={styles.urgentHeader}>
              <View style={styles.urgentHeaderLeft}>
                <View style={styles.urgentIndicator} />
                <Text style={styles.urgentTitle}>Urgente Bewoners</Text>
              </View>
            </View>

            {urgentResidents.map((resident) => (
              <View key={resident.id} style={styles.residentCard}>
                <View style={styles.residentInfo}>
                  <Text style={styles.residentName}>
                    Kamer {resident.room} - {resident.name}
                  </Text>
                  <Text style={styles.residentIncident}>{resident.incident}</Text>
                  <Text style={styles.residentNotes}>
                    {resident.openNotes} open notities
                  </Text>
                </View>
                <View style={styles.residentActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleViewResident(resident.id)}
                  >
                    <Text style={styles.actionButtonText}>Bekijk</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleViewNotes(resident.id)}
                  >
                    <Text style={styles.actionButtonText}>Bekijk Notities</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
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
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing['3xl'],
    ...Platform.select({
      web: {
        maxWidth: 1200,
        marginHorizontal: 'auto',
        width: '100%',
      },
    }),
  },
  pageTitle: {
    ...Typography.h1,
    color: Colors.textPrimary,
    marginBottom: Spacing.xl,
  },

  // Status Cards
  statusCardsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
    ...Platform.select({
      default: {
        flexWrap: 'wrap',
      },
    }),
  },
  statusCard: {
    flex: 1,
    minWidth: 150,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.card,
  },
  statusNumber: {
    ...Typography.h1,
    fontSize: 36,
    marginBottom: Spacing.xs,
  },
  statusLabel: {
    ...Typography.body,
    fontSize: 14,
    fontWeight: '500',
  },

  // Alert Banner
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.urgencyMediumBg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
  },
  alertIcon: {
    marginRight: Spacing.md,
  },
  alertText: {
    ...Typography.body,
    color: Colors.textPrimary,
    flex: 1,
  },

  // Action Cards
  actionCardsContainer: {
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Platform.select({
      web: {
        flexDirection: 'row',
      },
    }),
  },
  actionCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.card,
  },
  actionIcon: {
    marginRight: Spacing.md,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    ...Typography.h3,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  actionSubtitle: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
  },

  // Urgent Residents
  urgentSection: {
    marginBottom: Spacing.xl,
  },
  urgentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  urgentHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  urgentIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.error,
    marginRight: Spacing.sm,
  },
  urgentTitle: {
    ...Typography.h2,
    fontSize: 20,
    color: Colors.textPrimary,
  },
  residentCard: {
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.card,
    marginBottom: Spacing.md,
  },
  residentInfo: {
    marginBottom: Spacing.md,
  },
  residentName: {
    ...Typography.h3,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  residentIncident: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.error,
    marginBottom: Spacing.xs,
  },
  residentNotes: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  residentActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  actionButtonText: {
    ...Typography.button,
    fontSize: 14,
    color: Colors.textPrimary,
  },
});
