import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Shadows, BorderRadius, FontSize, FontWeight } from '@/constants';
import { NavigationBar } from '@/components';
import { AnnouncementCreateModal } from '@/components/announcement-create-modal';
import { formatDate } from '@/utils/date';

// TODO: Replace with API calls
const residents: any[] = [];
const notes: any[] = [];
const rooms: any[] = [];
const changeRequests: any[] = [];
const medicationRounds: any[] = [];
const resSchedules: any[] = [];

export default function DashboardScreen() {
  const router = useRouter();
  const [announcementModalVisible, setAnnouncementModalVisible] = useState(false);

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
        textColor: Colors.statsUrgent,
      },
      {
        id: 2,
        number: stats.attention.toString(),
        label: 'Aandacht',
        textColor: Colors.statsAttention,
      },
      {
        id: 3,
        number: stats.stable.toString(),
        label: 'Stabiel',
        textColor: Colors.statsStable,
      },
      {
        id: 4,
        number: `${stats.compliance}%`,
        label: 'Med. Naleving',
        textColor: Colors.statsCompliance,
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
    if (actionTitle === 'Wijzigingsverzoeken') {
      router.push('/wijzigingsverzoeken');
    } else if (actionTitle === 'Aankondiging Maken') {
      setAnnouncementModalVisible(true);
    } else if (actionTitle === 'Kamerbeheer') {
      router.push('/kamerbeheer');
    }
  };

  const handleSendAnnouncement = (announcement: {
    title: string;
    message: string;
    recipients: string;
  }) => {
    console.log('Aankondiging verzonden:', announcement);
    // TODO: Implement API call to send announcement
    alert(`Aankondiging "${announcement.title}" verzonden naar ${announcement.recipients}`);
  };

  const handleViewResident = (residentId: number) => {
    router.push(`/(tabs)/bewoners/${residentId}`);
  };

  return (
    <View style={styles.container}>
      <NavigationBar />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.pageTitle}>Overzicht</Text>

        {/* Status Cards */}
        <View style={styles.statusCardsContainer}>
          {dynamicStatusCards.map((card) => (
            <View key={card.id} style={styles.statusCard}>
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
        <View style={styles.actionCardsGrid}>
          {actionCards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={styles.actionCard}
              onPress={() => handleActionPress(card.title)}
              activeOpacity={0.7}
            >
              <View style={styles.actionCardContent}>
                <MaterialIcons
                  name={card.icon as any}
                  size={40}
                  color={card.color}
                />
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
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Aankondiging Modal */}
      <AnnouncementCreateModal
        visible={announcementModalVisible}
        onClose={() => setAnnouncementModalVisible(false)}
        onSend={handleSendAnnouncement}
      />
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
        maxWidth: 1400,
        marginHorizontal: 'auto',
        width: '100%',
      },
    }),
  },
  pageTitle: {
    ...Typography.h1,
    fontSize: FontSize['3xl'],
    color: Colors.textPrimary,
    marginBottom: Spacing['2xl'],
    fontWeight: FontWeight.semibold,
  },

  // Status Cards
  statusCardsContainer: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing['2xl'],
    ...Platform.select({
      default: {
        flexWrap: 'wrap',
      },
    }),
  },
  statusCard: {
    flex: 1,
    minWidth: 160,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusNumber: {
    ...Typography.h1,
    fontSize: FontSize['4xl'],
    marginBottom: Spacing.xs,
  },
  statusLabel: {
    ...Typography.body,
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },

  // Alert Banner
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warningAlt,
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
  actionCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.lg,
    marginBottom: Spacing['2xl'],
  },
  actionCard: {
    flex: 1,
    minWidth: 280,
    backgroundColor: Colors.background,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionCardContent: {
    alignItems: 'flex-start',
  },
  actionTitle: {
    ...Typography.h3,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  actionSubtitle: {
    ...Typography.body,
    fontSize: FontSize.md,
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
    fontSize: FontSize['2xl'],
    color: Colors.textPrimary,
  },
  residentCard: {
    backgroundColor: Colors.background,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  residentInfo: {
    marginBottom: Spacing.md,
  },
  residentName: {
    ...Typography.h3,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  residentIncident: {
    ...Typography.body,
    fontSize: FontSize.md,
    color: Colors.error,
    marginBottom: Spacing.xs,
  },
  residentNotes: {
    ...Typography.body,
    fontSize: FontSize.md,
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
    ...Typography.buttonMedium,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
});
