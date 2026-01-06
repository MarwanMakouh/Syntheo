import { useMemo, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { AdminLayout, ConfirmationModal, AssignResidentModal } from '@/components/admin';
import { RoomCard } from '@/components/admin/room-card';
import { WarningBanner } from '@/components/admin/warning-banner';
import { fetchRooms, linkResidentToRoom, unlinkResidentFromRoom } from '@/Services/roomsApi';
import { fetchResidents } from '@/Services/residentsApi';
import { fetchNotes } from '@/Services/notesApi';
import type { Room } from '@/types/resident';
import type { Resident } from '@/types/resident';
import type { Note } from '@/types/note';
import { Colors, FontSize, FontWeight, Spacing, Layout, BorderRadius } from '@/constants';

export default function DashboardKamersScreen() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUnlinkModal, setShowUnlinkModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedResidentId, setSelectedResidentId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load data from API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [roomsData, residentsData, notesData] = await Promise.all([
        fetchRooms(),
        fetchResidents(),
        fetchNotes(),
      ]);
      setRooms(roomsData);
      setResidents(residentsData);
      setNotes(notesData);
    } catch (err) {
      setError('Fout bij het laden van gegevens');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get residents without rooms
  const residentsWithoutRooms = useMemo(() => {
    const assignedResidentIds = rooms
      .filter((r) => r.resident_id !== null)
      .map((r) => r.resident_id);

    return residents.filter((r) => !assignedResidentIds.includes(r.resident_id));
  }, [rooms, residents]);

  // Get resident status based on notes
  const getResidentStatus = (residentId: number): 'Stabiel' | 'Aandacht' | 'Urgent' => {
    const residentNotes = notes.filter(
      (n) => n.resident_id === residentId && !n.is_resolved
    );

    const hasUrgent = residentNotes.some((n) => n.urgency === 'Hoog');
    const hasAttention = residentNotes.some((n) => n.urgency === 'Matig');

    if (hasUrgent) return 'Urgent';
    if (hasAttention) return 'Aandacht';
    return 'Stabiel';
  };

  // Get resident name by ID
  const getResidentName = (residentId: number | null) => {
    if (!residentId) return undefined;
    return residents.find((r) => r.resident_id === residentId)?.name;
  };

  const handleAssignResident = (roomId: number) => {
    const room = rooms.find(r => r.room_id === roomId);
    if (!room) return;

    setSelectedRoom(room);
    setShowAssignModal(true);
  };

  const handleSelectResident = (residentId: number) => {
    setSelectedResidentId(residentId);
  };

  const confirmAssignResident = async () => {
    if (!selectedRoom || !selectedResidentId) return;

    try {
      setIsProcessing(true);
      await linkResidentToRoom(selectedRoom.room_id, selectedResidentId);
      await loadData();
      setShowAssignModal(false);
      setSelectedRoom(null);
      setSelectedResidentId(null);
      Alert.alert('Succes', 'Bewoner succesvol toegewezen aan kamer');
    } catch (err) {
      console.error('Error linking resident to room:', err);
      Alert.alert('Fout', 'Kon bewoner niet toewijzen aan kamer');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnlinkResident = (roomId: number, residentName?: string) => {
    const room = rooms.find(r => r.room_id === roomId);
    if (!room) return;

    setSelectedRoom(room);
    setShowUnlinkModal(true);
  };

  const confirmUnlinkResident = async () => {
    if (!selectedRoom) return;

    try {
      setIsProcessing(true);
      await unlinkResidentFromRoom(selectedRoom.room_id);
      await loadData();
      setShowUnlinkModal(false);
      setSelectedRoom(null);
      Alert.alert('Succes', 'Bewoner succesvol losgekoppeld van kamer');
    } catch (err) {
      console.error('Error unlinking resident from room:', err);
      Alert.alert('Fout', 'Kon bewoner niet loskoppelen van kamer');
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedResidentName = selectedRoom?.resident_id
    ? getResidentName(selectedRoom.resident_id)
    : undefined;

  return (
    <AdminLayout activeRoute="kamers">
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.pageTitle}>Kamerbeheer</Text>
            <Text style={styles.pageSubtitle}>
              Beheer kamertoewijzingen van bewoners
            </Text>
          </View>

          {/* Loading State */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Kamers laden...</Text>
            </View>
          ) : error ? (
            /* Error State */
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={64} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadData}>
                <Text style={styles.retryButtonText}>Opnieuw proberen</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Warning Banner */}
              {residentsWithoutRooms.length > 0 && (
                <WarningBanner
                  message={`${residentsWithoutRooms.length} bewoner${
                    residentsWithoutRooms.length > 1 ? 's' : ''
                  } zonder kamertoewijzing`}
                  badges={residentsWithoutRooms.map((r) => r.name)}
                />
              )}

              {/* Rooms Grid */}
              <View style={styles.grid}>
                {rooms.map((room) => {
                  const isOccupied = room.resident_id !== null;
                  const residentName = getResidentName(room.resident_id);
                  const residentStatus = room.resident_id
                    ? getResidentStatus(room.resident_id)
                    : undefined;

                  return (
                    <View key={room.room_id} style={styles.cardWrapper}>
                      <RoomCard
                        roomNumber={room.room_id.toString()}
                        isOccupied={isOccupied}
                        residentName={residentName}
                        residentStatus={residentStatus}
                        onAssign={() => handleAssignResident(room.room_id)}
                        onUnlink={() => handleUnlinkResident(room.room_id, residentName)}
                      />
                    </View>
                  );
                })}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Unlink Confirmation Modal */}
      <ConfirmationModal
        visible={showUnlinkModal}
        onClose={() => {
          setShowUnlinkModal(false);
          setSelectedRoom(null);
        }}
        onConfirm={confirmUnlinkResident}
        title="Bewoner Loskoppelen"
        message={`Weet je zeker dat je ${selectedResidentName} wilt loskoppelen van kamer ${selectedRoom?.room_id}? Deze actie kan later ongedaan worden gemaakt.`}
        confirmText="Loskoppelen"
        cancelText="Annuleren"
        isLoading={isProcessing}
        type="warning"
      />

      {/* Assign Resident Modal */}
      <AssignResidentModal
        visible={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setSelectedRoom(null);
          setSelectedResidentId(null);
        }}
        onConfirm={confirmAssignResident}
        roomNumber={selectedRoom?.room_id.toString() || ''}
        availableResidents={residentsWithoutRooms}
        selectedResidentId={selectedResidentId}
        onSelectResident={handleSelectResident}
        isLoading={isProcessing}
      />
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  content: {
    padding: Layout.screenPaddingLarge,
    ...Platform.select({
      web: {
        maxWidth: 1400,
        alignSelf: 'center',
        width: '100%',
      },
    }),
  },
  header: {
    marginBottom: Spacing['2xl'],
  },
  pageTitle: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  pageSubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.md,
  },
  cardWrapper: {
    width: Platform.OS === 'web' ? '33.333%' : '100%',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['4xl'],
    minHeight: 400,
  },
  loadingText: {
    marginTop: Spacing.lg,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['4xl'],
    minHeight: 400,
  },
  errorText: {
    marginTop: Spacing.lg,
    fontSize: FontSize.lg,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
  },
  retryButtonText: {
    color: Colors.background,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
});
