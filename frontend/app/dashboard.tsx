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
import { ResidentQuickViewPopup } from '@/components/resident-quick-view-popup';
import { MeldingDetailsPopup } from '@/components/melding-details-popup';
import { formatDate } from '@/utils/date';
import { fetchResidents, fetchResidentsWithMedicationForDagdeel } from '@/Services/residentsApi';
import { fetchNotes, resolveNote, unresolveNote, acknowledgeNote } from '@/Services/notesApi';
import { fetchRooms } from '@/Services/roomsApi';
import { fetchChangeRequests } from '@/Services/changeRequestsApi';
import { fetchMedicationRounds, fetchComplianceByDagdeel } from '@/Services/medicationRoundsApi';
import { fetchUsers } from '@/Services/usersApi';
import { useAuth } from '@/contexts/AuthContext';

// component state (loaded from API)

export default function DashboardScreen() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [residentModalVisible, setResidentModalVisible] = useState(false);
  const [selectedResident, setSelectedResident] = useState<any>(null);
  const [meldingModalVisible, setMeldingModalVisible] = useState(false);
  const [selectedMelding, setSelectedMelding] = useState<any>(null);
  const [isResolving, setIsResolving] = useState(false);

  const [residents, setResidents] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [changeRequests, setChangeRequests] = useState<any[]>([]);
  const [medicationRounds, setMedicationRounds] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [complianceByDagdeel, setComplianceByDagdeel] = useState<Array<{
    dagdeel: string;
    total: number;
    completed: number;
    percentage: number;
  }>>([]);


  // Calculate statistics from real data
  const stats = useMemo(() => {
    const urgentCount = notes.filter((n) => n.urgency === 'Hoog' && !n.is_resolved).length;
    const attentionCount = notes.filter((n) => n.urgency === 'Matig' && !n.is_resolved).length;
    const stableCount = notes.filter((n) => n.urgency === 'Laag' && !n.is_resolved).length;

    const pendingChanges = changeRequests.filter((cr) => cr.status === 'In behandeling').length;

    return {
      urgent: urgentCount,
      attention: attentionCount,
      stable: stableCount,
      pendingChanges,
    };
  }, [notes, changeRequests]);

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


  // Get urgent residents from data (one entry per resident, latest urgent note)
  const urgentResidents = useMemo(() => {
    // ONLY filter notes with urgency 'Hoog' (urgent), not resolved, and not acknowledged
    const urgentNotes = notes.filter((note) => {
      // Strict check: only 'Hoog' urgency, case-sensitive, not resolved, not acknowledged
      return note.urgency === 'Hoog' && !note.is_resolved && !note.is_acknowledged;
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
      if (note.urgency !== 'Hoog' || note.is_resolved || note.is_acknowledged) {
        return; // Skip this resident if note is not urgent, is resolved, or is acknowledged
      }

      const resident = residents.find((r) => r.resident_id === residentId);
      const room = rooms.find((r) => r.resident_id === residentId);
      // Count only URGENT unresolved unacknowledged notes for this resident
      const urgentResidentNotes = notes.filter(
        (n) => n.resident_id === residentId && n.urgency === 'Hoog' && !n.is_resolved && !n.is_acknowledged
      );

      result.push({
        id: residentId,
        room: room?.room_number || room?.room_id || '-',
        name: resident?.name || 'Onbekend',
        incident: `${note.category} - ${formatDate(note.created_at, 'dd-MM, HH:mm')}`,
        openNotes: urgentResidentNotes.length, // Show only count of urgent notes
        latestNoteId: note.note_id, // Add note_id for acknowledgment
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

      const [residentsData, notesData, roomsData, changeReqsData, roundsData, usersData, complianceData] = await Promise.all([
        fetchResidents(),
        fetchNotes(),
        fetchRooms(),
        fetchChangeRequests(),
        fetchMedicationRounds({ date_from: date, date_to: date }),
        fetchUsers(),
        fetchComplianceByDagdeel(date),
      ]);

      setResidents(residentsData || []);
      setNotes(notesData || []);
      setRooms(roomsData || []);
      setChangeRequests(changeReqsData || []);
      setMedicationRounds(roundsData || []);
      setUsers(usersData || []);
      setComplianceByDagdeel(complianceData || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };


  const handleNotePress = (note: any) => {
    const resident = residents.find((r) => r.resident_id === note.resident_id);
    const author = users.find((u) => u.user_id === note.author_id);

    setSelectedMelding({
      noteId: note.note_id,
      residentName: resident?.name || 'Onbekend',
      category: note.category,
      urgency: note.urgency,
      reportedBy: author?.name || 'Onbekend',
      timestamp: formatDate(note.created_at, 'dd-MM-yyyy, HH:mm'),
      description: note.content,
      status: note.is_resolved ? 'Afgehandeld' : 'Open',
      isResolved: note.is_resolved,
    });
    setMeldingModalVisible(true);
  };

  const handleResolve = async () => {
    if (!selectedMelding || !currentUser) return;

    try {
      setIsResolving(true);
      await resolveNote(selectedMelding.noteId, currentUser.user_id);
      setMeldingModalVisible(false);
      setSelectedMelding(null);
      await loadDashboardData();
    } catch (err) {
      console.error('Failed to resolve note:', err);
      alert('Kon melding niet afhandelen');
    } finally {
      setIsResolving(false);
    }
  };

  const handleUnresolve = async () => {
    if (!selectedMelding) return;

    try {
      setIsResolving(true);
      await unresolveNote(selectedMelding.noteId);
      setMeldingModalVisible(false);
      setSelectedMelding(null);
      await loadDashboardData();
    } catch (err) {
      console.error('Failed to unresolve note:', err);
      alert('Kon melding niet heropenen');
    } finally {
      setIsResolving(false);
    }
  };

  const handleAcknowledge = async (noteId: number) => {
    if (!currentUser) return;

    try {
      // Update localStorage (fast)
      await acknowledgeNote(noteId, currentUser.user_id);
      // Only reload notes, not all dashboard data (faster)
      const updatedNotes = await fetchNotes();
      setNotes(updatedNotes || []);
    } catch (err) {
      console.error('Failed to acknowledge note:', err);
      alert('Kon notitie niet als bekeken markeren');
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

        {/* Medication Compliance by Dagdeel */}
        <View style={styles.complianceCard}>
          <View style={styles.complianceHeader}>
            <MaterialIcons name="medical-services" size={28} color={Colors.primary} />
            <Text style={styles.complianceTitle}>Medicatie Compliance per Dagdeel</Text>
          </View>
          <View style={styles.dagdeelContainer}>
            {complianceByDagdeel.map((item) => (
              <View key={item.dagdeel} style={styles.dagdeelCard}>
                <Text style={styles.dagdeelTitle}>{item.dagdeel}</Text>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${item.percentage}%`,
                        backgroundColor:
                          item.percentage >= 80 ? Colors.success :
                          item.percentage >= 50 ? Colors.warningAlt :
                          Colors.error
                      }
                    ]}
                  />
                </View>
                <Text style={styles.dagdeelPercentage}>{item.percentage}%</Text>
                <Text style={styles.dagdeelSubtitle}>
                  {item.completed} van {item.total} bewoners
                </Text>
              </View>
            ))}
          </View>
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
                  <Text style={styles.residentIncident}>
                    {resident.incident}
                  </Text>
                  <Text style={styles.residentNotes}>
                    {resident.openNotes} open notities
                  </Text>
                </View>
                <View style={styles.residentActions}>
                  <TouchableOpacity
                    style={styles.acknowledgeButton}
                    onPress={() => handleAcknowledge(resident.latestNoteId)}
                  >
                    <MaterialIcons
                      name="visibility"
                      size={20}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
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
        onNotePress={handleNotePress}
      />

      {/* Melding Details Popup */}
      <MeldingDetailsPopup
        visible={meldingModalVisible}
        onClose={() => {
          setMeldingModalVisible(false);
          setSelectedMelding(null);
        }}
        melding={selectedMelding}
        onResolve={handleResolve}
        onUnresolve={handleUnresolve}
        isResolving={isResolving}
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

  // Compliance Card
  complianceCard: {
    backgroundColor: Colors.background,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing['2xl'],
    borderWidth: 1,
    borderColor: Colors.border,
  },
  complianceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  complianceTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginLeft: Spacing.md,
  },
  complianceContent: {
    alignItems: 'center',
  },
  compliancePercentage: {
    fontSize: FontSize['4xl'],
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  complianceSubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // Dagdeel Cards
  dagdeelContainer: {
    flexDirection: 'row',
    gap: Spacing.lg,
    ...Platform.select({
      default: {
        flexWrap: 'wrap',
      },
    }),
  },
  dagdeelCard: {
    flex: 1,
    minWidth: 140,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dagdeelTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressBar: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  dagdeelPercentage: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  dagdeelSubtitle: {
    fontSize: FontSize.sm,
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
  acknowledgeButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
