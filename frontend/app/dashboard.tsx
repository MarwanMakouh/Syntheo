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
import { Colors, Spacing, BorderRadius, FontSize, FontWeight, Layout } from '@/constants';
import { StaffLayout } from '@/components';
import { AnnouncementCreatePopup } from '@/components/announcements/announcement-create-popup';
import { ResidentQuickViewPopup } from '@/components/resident-quick-view-popup';
import { formatDate } from '@/utils/date';
import { fetchResidents } from '@/Services/residentsApi';
import { fetchNotes } from '@/Services/notesApi';
import { fetchRooms } from '@/Services/roomsApi';
import { fetchChangeRequests } from '@/Services/changeRequestsApi';
import { fetchMedicationRounds } from '@/Services/medicationRoundsApi';
import { fetchUsers } from '@/Services/usersApi';
import { createAnnouncement } from '@/Services/announcementsApi';
import { useAuth } from '@/contexts/AuthContext';
import { useAnnouncements } from '@/contexts/AnnouncementsContext';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants';

// component state (loaded from API)

export default function DashboardScreen() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { refreshAnnouncements } = useAnnouncements();
  const [announcementModalVisible, setAnnouncementModalVisible] = useState(false);
  const [isSendingAnnouncement, setIsSendingAnnouncement] = useState(false);
  const [residentModalVisible, setResidentModalVisible] = useState(false);
  const [selectedResident, setSelectedResident] = useState<any>(null);

  const [residents, setResidents] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [changeRequests, setChangeRequests] = useState<any[]>([]);
  const [medicationRounds, setMedicationRounds] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  // Calculate statistics from real data
  const stats = useMemo(() => {
    const urgentCount = notes.filter((n) => n.urgency === 'Hoog' && !n.is_resolved).length;
    const attentionCount = notes.filter((n) => n.urgency === 'Matig' && !n.is_resolved).length;
    const stableCount = notes.filter((n) => n.urgency === 'Laag' && !n.is_resolved).length;

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
    // ONLY filter notes with urgency 'Hoog' (urgent) and not resolved
    const urgentNotes = notes.filter((note) => {
      // Strict check: only 'Hoog' urgency, case-sensitive
      return note.urgency === 'Hoog' && !note.is_resolved;
    });

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
      // Double-check that the note is still urgent before adding to result
      if (note.urgency !== 'Hoog' || note.is_resolved) {
        return; // Skip this resident if note is not urgent or is resolved
      }

      const resident = residents.find((r) => r.resident_id === residentId);
      const room = rooms.find((r) => r.resident_id === residentId);
      // Count only URGENT unresolved notes for this resident
      const urgentResidentNotes = notes.filter(
        (n) => n.resident_id === residentId && n.urgency === 'Hoog' && !n.is_resolved
      );

      result.push({
        id: residentId,
        room: room?.room_number || room?.room_id || '-',
        name: resident?.name || 'Onbekend',
        incident: `${note.category} - ${formatDate(note.created_at, 'dd-MM, HH:mm')}`,
        openNotes: urgentResidentNotes.length, // Show only count of urgent notes
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

      const [residentsData, notesData, roomsData, changeReqsData, roundsData, usersData] = await Promise.all([
        fetchResidents(),
        fetchNotes(),
        fetchRooms(),
        fetchChangeRequests(),
        fetchMedicationRounds({ date_from: date, date_to: date }),
        fetchUsers(),
      ]);

      setResidents(residentsData || []);
      setNotes(notesData || []);
      setRooms(roomsData || []);
      setChangeRequests(changeReqsData || []);
      setMedicationRounds(roundsData || []);
      setUsers(usersData || []);

      // Debug: Log users to see what roles exist
      console.log('Loaded users:', usersData);
      console.log('User roles:', usersData.map((u: any) => ({ name: u.name, role: u.role })));
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
    if (!currentUser?.user_id) {
      alert('Gebruiker niet ingelogd');
      return;
    }

    setIsSendingAnnouncement(true);

    try {
      // Check if users are loaded
      if (!users || users.length === 0) {
        alert('Geen gebruikers geladen! Herlaad de pagina en probeer opnieuw.');
        setIsSendingAnnouncement(false);
        return;
      }

      // Determine recipient_type and recipient_ids based on category
      let recipientType: 'all' | 'role' | 'floor' = 'all';
      let recipientIds: number[] = [];
      let floorId: number | null = null;

      console.log('=== DEBUG ANNOUNCEMENT ===');
      console.log('Category:', announcement.recipientCategory);
      console.log('Details:', announcement.recipientDetails);
      console.log('Total users:', users.length);
      console.log('All users:', users.map(u => ({ name: u.name, role: u.role, floor_id: u.floor_id })));

      if (announcement.recipientCategory === 'Iedereen') {
        recipientType = 'all';
        // All users get the announcement
        recipientIds = users.map(user => user.user_id);
        console.log('Iedereen selected - Recipients:', recipientIds);
      } else if (announcement.recipientCategory === 'Verdieping') {
        recipientType = 'floor';
        // Extract floor number from "Verdieping X" string
        const floorName = announcement.recipientDetails as string;
        const floorNumber = parseInt(floorName.replace(/\D/g, ''));
        floorId = floorNumber;
        console.log('Floor selected:', floorNumber);
        // Filter users by floor_id
        recipientIds = users
          .filter(user => user.floor_id === floorNumber)
          .map(user => user.user_id);
        console.log('Users on floor:', users.filter(user => user.floor_id === floorNumber));
        console.log('Recipient IDs:', recipientIds);
      } else if (announcement.recipientCategory === 'Afdeling') {
        recipientType = 'role';
        // Map department name to role(s) - flexible matching
        const department = announcement.recipientDetails as string;

        console.log('Department selected:', department);
        console.log('All user roles:', users.map(u => u.role));

        // Filter users by role using flexible matching
        const matchedUsers = users.filter(user => {
          const userRole = user.role.toLowerCase();

          if (department === 'Keuken') {
            // Match anything with "keuken" in the role name
            return userRole.includes('keuken');
          } else if (department === 'Verpleging') {
            // Match anything with "verpleeg" or "verpleger" in the role name
            return userRole.includes('verpleeg') || userRole.includes('verpleger') || userRole.includes('verpleegster');
          } else if (department === 'Administratie') {
            // Match anything with "admin" or "beheer" in the role name
            return userRole.includes('admin') || userRole.includes('beheer');
          }
          return false;
        });

        console.log('Matched users:', matchedUsers);
        recipientIds = matchedUsers.map(user => user.user_id);
        console.log('Recipient IDs:', recipientIds);
      } else if (announcement.recipientCategory === 'Individuele mensen') {
        recipientType = 'role'; // Use 'role' as default for individual selection
        // For now, we'll use names to match users (not ideal but works with current setup)
        const selectedNames = announcement.recipientDetails as string[];
        console.log('Individual people selected:', selectedNames);
        recipientIds = users
          .filter(user => selectedNames.includes(user.name))
          .map(user => user.user_id);
        console.log('Matched users:', users.filter(user => selectedNames.includes(user.name)));
        console.log('Recipient IDs:', recipientIds);
      }

      // Ensure we have at least one recipient
      if (recipientIds.length === 0) {
        console.error('No recipients found!');
        alert('Geen ontvangers gevonden voor deze selectie. Check de console voor details.');
        setIsSendingAnnouncement(false);
        return;
      }

      // Create the announcement via API
      await createAnnouncement({
        author_id: currentUser.user_id,
        title: announcement.title,
        message: announcement.message,
        recipient_type: recipientType,
        floor_id: floorId,
        recipient_ids: recipientIds,
      });

      // Refresh announcements to show the new one
      await refreshAnnouncements();

      // Show success message
      const recipientText = announcement.recipientDetails
        ? `${announcement.recipientCategory} (${Array.isArray(announcement.recipientDetails) ? announcement.recipientDetails.join(', ') : announcement.recipientDetails})`
        : announcement.recipientCategory;
      alert(`Aankondiging "${announcement.title}" succesvol verzonden naar ${recipientText} (${recipientIds.length} ${recipientIds.length === 1 ? 'ontvanger' : 'ontvangers'})`);

      // Close modal
      setAnnouncementModalVisible(false);
    } catch (error) {
      console.error('Error sending announcement:', error);
      alert('Fout bij het verzenden van aankondiging. Probeer opnieuw.');
    } finally {
      setIsSendingAnnouncement(false);
    }
  };

  const handleViewResident = (residentId: number) => {
    const resident = residents.find((r) => r.resident_id === residentId);
    if (resident) {
      setSelectedResident(resident);
      setResidentModalVisible(true);
    }
  };

  return (
    <StaffLayout activeRoute="dashboard">
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

      {/* Aankondiging Popup */}
      <AnnouncementCreatePopup
        visible={announcementModalVisible}
        onClose={() => setAnnouncementModalVisible(false)}
        onSend={handleSendAnnouncement}
        isLoading={isSendingAnnouncement}
      />

      {/* Resident Quick View Popup */}
      <ResidentQuickViewPopup
        visible={residentModalVisible}
        onClose={() => {
          setResidentModalVisible(false);
          setSelectedResident(null);
        }}
        resident={selectedResident}
        roomNumber={selectedResident ? rooms.find((r) => r.resident_id === selectedResident.resident_id)?.room_number : undefined}
        urgentNotes={selectedResident ? notes.filter((n) => n.resident_id === selectedResident.resident_id && n.urgency === 'Hoog' && !n.is_resolved) : []}
      />
    </StaffLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: Layout.screenPaddingLarge,
    paddingBottom: Spacing['3xl'],
    ...Platform.select({
      web: {
        maxWidth: 1400,
        alignSelf: 'center',
        width: '100%',
      },
    }),
  },
  pageTitle: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing['2xl'],
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
    fontSize: FontSize['4xl'],
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.xs,
  },
  statusLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
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
    fontSize: FontSize.md,
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
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  actionSubtitle: {
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
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.semibold,
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
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  residentIncident: {
    fontSize: FontSize.md,
    color: Colors.error,
    marginBottom: Spacing.xs,
  },
  residentNotes: {
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
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
});
