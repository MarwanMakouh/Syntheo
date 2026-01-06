import React, { useMemo, useState, useEffect } from 'react';
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
import { fetchResidents } from '@/Services/residentsApi';
import { fetchNotes } from '@/Services/notesApi';
import { fetchRooms } from '@/Services/roomsApi';
import { fetchChangeRequests } from '@/Services/changeRequestsApi';
import { fetchMedicationRounds } from '@/Services/medicationRoundsApi';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants';

// component state (loaded from API)

export default function DashboardScreen() {
  const router = useRouter();
  const [announcementModalVisible, setAnnouncementModalVisible] = useState(false);
  const [isSendingAnnouncement, setIsSendingAnnouncement] = useState(false);

  const [residents, setResidents] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [changeRequests, setChangeRequests] = useState<any[]>([]);
  const [medicationRounds, setMedicationRounds] = useState<any[]>([]);

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
  }, [notes, medicationRounds, changeRequests]);

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

  // Get urgent residents from data (one entry per resident, latest urgent note)
  const urgentResidents = useMemo(() => {
    const urgentNotes = notes.filter((note) => note.urgency === 'Hoog' && !note.is_resolved);

    // Group by resident_id and pick latest note per resident
    const byResident = new Map<number, any>();
    urgentNotes.forEach((note) => {
      const existing = byResident.get(note.resident_id);
      if (!existing) {
        byResident.set(note.resident_id, note);
      } else {
        if (new Date(note.created_at) > new Date(existing.created_at)) {
          byResident.set(note.resident_id, note);
        }
      }
    });

    const result: Array<any> = [];
    byResident.forEach((note, residentId) => {
      const resident = residents.find((r) => r.resident_id === residentId);
      const room = rooms.find((r) => r.resident_id === residentId);
      const residentNotes = notes.filter((n) => n.resident_id === residentId && !n.is_resolved);

      result.push({
        id: residentId,
        room: room?.room_number || room?.room_id || '-',
        name: resident?.name || 'Onbekend',
        incident: `${note.category} - ${formatDate(note.created_at, 'dd-MM, HH:mm')}`,
        openNotes: residentNotes.length,
      });
    });

    // sort by newest incident
    return result.sort((a, b) => new Date(b.incident.split(' - ')[1]).getTime() - new Date(a.incident.split(' - ')[1]).getTime());
  }, [notes, residents, rooms]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const today = new Date();
      const date = today.toISOString().split('T')[0];

      const [residentsData, notesData, roomsData, changeReqsData, roundsData] = await Promise.all([
        fetchResidents(),
        fetchNotes(),
        fetchRooms(),
        fetchChangeRequests(),
        fetchMedicationRounds({ date_from: date, date_to: date }),
      ]);

      setResidents(residentsData || []);
      setNotes(notesData || []);
      setRooms(roomsData || []);
      setChangeRequests(changeReqsData || []);
      setMedicationRounds(roundsData || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

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

  const handleSendAnnouncement = async (announcement: {
    title: string;
    message: string;
    recipientCategory: string;
    recipientDetails?: string | string[];
  }) => {
    console.log('Aankondiging verzonden:', announcement);
    // TODO: Implement API call to send announcement
    const recipientText = announcement.recipientDetails 
      ? `${announcement.recipientCategory} (${Array.isArray(announcement.recipientDetails) ? announcement.recipientDetails.join(', ') : announcement.recipientDetails})`
      : announcement.recipientCategory;
    alert(`Aankondiging "${announcement.title}" verzonden naar ${recipientText}`);
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
        isLoading={isSendingAnnouncement}
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
