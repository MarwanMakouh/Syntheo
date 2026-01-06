import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius, FontSize, FontWeight } from '@/constants';
import { NavigationBar } from '@/components';
import { DisconnectConfirmationModal } from '@/components/disconnect-confirmation-modal';
import { AssignResidentModal } from '@/components/assign-resident-modal';
// backend callen
const rooms: any[] = [];
const residents: any[] = [];
const floors: any[] = [];

interface SelectedDisconnect {
  roomId: number;
  residentName: string;
  roomNumber: number;
}

export default function KamerBeheerScreen() {
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [disconnectModalVisible, setDisconnectModalVisible] = useState(false);
  const [selectedDisconnect, setSelectedDisconnect] = useState<SelectedDisconnect | null>(null);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedRoomForAssign, setSelectedRoomForAssign] = useState<number | null>(null);
  const [selectedRoomNumberForAssign, setSelectedRoomNumberForAssign] = useState<number | null>(null);
  const [roomsData, setRoomsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchRooms();
      setRoomsData(data);
    } catch (err) {
      console.error('Failed to load rooms:', err);
      setError('Kan kamers niet laden');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter rooms by selected floor
  const filteredRooms = selectedFloor
    ? roomsData.filter((room) => room.floor_id === selectedFloor)
    : roomsData;

  // Sort rooms by room number
  const sortedRooms = [...filteredRooms].sort((a, b) => a.room_id - b.room_id);

  // Get unassigned and assigned residents
  const { unassignedResidents, assignedResidents } = useMemo(() => {
    const assignedResidentIds = roomsData
      .filter((room) => room.resident_id !== null)
      .map((room) => room.resident_id);

    const unassigned = residents
      .filter((resident) => !assignedResidentIds.includes(resident.resident_id))
      .map((resident) => ({
        resident_id: resident.resident_id,
        name: resident.name,
      }));

    const assigned = residents
      .filter((resident) => assignedResidentIds.includes(resident.resident_id))
      .map((resident) => {
        const room = roomsData.find((r) => r.resident_id === resident.resident_id);
        return {
          resident_id: resident.resident_id,
          name: resident.name,
          currentRoom: room?.room_id,
        };
      });

    return { unassignedResidents: unassigned, assignedResidents: assigned };
  }, [roomsData]);

  const handleDisconnect = (roomId: number, residentName: string, roomNumber: number) => {
    setSelectedDisconnect({ roomId, residentName, roomNumber });
    setDisconnectModalVisible(true);
  };

  const handleConfirmDisconnect = async () => {
    if (selectedDisconnect) {
      try {
        setIsProcessing(true);
        await unlinkResidentFromRoom(selectedDisconnect.roomId);
        alert(`${selectedDisconnect.residentName} is succesvol losgekoppeld van Kamer ${selectedDisconnect.roomNumber}`);

        // Refresh rooms list
        await loadRooms();
      } catch (error) {
        console.error('Error disconnecting resident:', error);
        alert('Fout bij loskoppelen van bewoner. Probeer opnieuw.');
      } finally {
        setIsProcessing(false);
      }
    }
    setDisconnectModalVisible(false);
    setSelectedDisconnect(null);
  };

  const handleCancelDisconnect = () => {
    setDisconnectModalVisible(false);
    setSelectedDisconnect(null);
  };

  const handleAssignResident = (roomId: number, roomNumber: number) => {
    setSelectedRoomForAssign(roomId);
    setSelectedRoomNumberForAssign(roomNumber);
    setAssignModalVisible(true);
  };

  const handleConfirmAssign = async (residentId: number) => {
    if (selectedRoomForAssign) {
      try {
        setIsProcessing(true);
        await linkResidentToRoom(selectedRoomForAssign, residentId);
        const resident = residents.find((r) => r.resident_id === residentId);
        alert(`${resident?.name} is succesvol toegewezen aan Kamer ${selectedRoomForAssign}`);

        // Refresh rooms list
        await loadRooms();
      } catch (error) {
        console.error('Error assigning resident:', error);
        alert('Fout bij toewijzen van bewoner. Probeer opnieuw.');
      } finally {
        setIsProcessing(false);
      }
    }
    setAssignModalVisible(false);
    setSelectedRoomForAssign(null);
    setSelectedRoomNumberForAssign(null);
  };

  const handleCancelAssign = () => {
    setAssignModalVisible(false);
    setSelectedRoomForAssign(null);
    setSelectedRoomNumberForAssign(null);
  };

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

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <NavigationBar />
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadRooms}>
            <Text style={styles.retryButtonText}>Opnieuw proberen</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
            <View style={styles.headerTextContainer}>
              <Text style={styles.pageTitle}>Kamerbeheer</Text>
              <Text style={styles.pageSubtitle}>Beheer kamertoewijzingen van bewoners</Text>
            </View>
          </View>

          {/* Unassigned Residents Warning */}
          {unassignedResidents.length > 0 && (
            <View style={styles.warningBanner}>
              <MaterialIcons name="warning" size={24} color={Colors.warning} />
              <View style={styles.warningContent}>
                <Text style={styles.warningTitle}>
                  {unassignedResidents.length} bewoner{unassignedResidents.length > 1 ? 's' : ''} zonder kamertoewijzing
                </Text>
                <Text style={styles.warningText}>
                  {unassignedResidents.map((r) => r.name).join(', ')}
                </Text>
              </View>
            </View>
          )}

          {/* Floor Filter */}
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFloor === null && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFloor(null)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFloor === null && styles.filterButtonTextActive,
                ]}
              >
                Alle verdiepingen
              </Text>
            </TouchableOpacity>
            {floors.map((floor) => (
              <TouchableOpacity
                key={floor.floor_id}
                style={[
                  styles.filterButton,
                  selectedFloor === floor.floor_id && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedFloor(floor.floor_id)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedFloor === floor.floor_id && styles.filterButtonTextActive,
                  ]}
                >
                  Verdieping {floor.floor_id}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Rooms Grid */}
          <View style={styles.roomsGrid}>
            {sortedRooms.map((room) => {
              const resident = residents.find((r) => r.resident_id === room.resident_id);
              const isOccupied = room.resident_id !== null;

              return (
                <View
                  key={room.room_id}
                  style={[
                    styles.roomCard,
                    isOccupied ? styles.roomCardOccupied : styles.roomCardEmpty,
                  ]}
                >
                  {/* Room Header */}
                  <View style={styles.roomHeader}>
                    <View style={styles.roomTitleContainer}>
                      <MaterialIcons
                        name="meeting-room"
                        size={20}
                        color={isOccupied ? '#dc2626' : '#10b981'}
                      />
                      <Text style={styles.roomNumber}>Kamer {room.room_number}</Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        isOccupied ? styles.statusBadgeOccupied : styles.statusBadgeEmpty,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          isOccupied ? styles.statusBadgeTextOccupied : styles.statusBadgeTextEmpty,
                        ]}
                      >
                        {isOccupied ? 'Bezet' : 'Vrij'}
                      </Text>
                    </View>
                  </View>

                  {/* Resident Name */}
                  {isOccupied && resident && (
                    <>
                      <Text style={styles.residentName}>{resident.name}</Text>

                      {/* Disconnect Button */}
                      <TouchableOpacity
                        style={styles.disconnectButton}
                        onPress={() => handleDisconnect(room.room_id, resident.name, parseInt(room.room_number))}
                      >
                        <MaterialIcons name="link-off" size={16} color={Colors.error} />
                        <Text style={styles.disconnectButtonText}>Loskoppelen</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {/* Empty state with Assign Button */}
                  {!isOccupied && (
                    <>
                      <Text style={styles.emptyRoomText}>Geen bewoner toegewezen</Text>
                      <TouchableOpacity
                        style={styles.assignButton}
                        onPress={() => handleAssignResident(room.room_id, parseInt(room.room_number))}
                      >
                        <MaterialIcons name="person-add" size={16} color={Colors.success} />
                        <Text style={styles.assignButtonText}>Bewoner Toewijzen</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Disconnect Confirmation Modal */}
      {selectedDisconnect && (
        <DisconnectConfirmationModal
          visible={disconnectModalVisible}
          residentName={selectedDisconnect.residentName}
          roomNumber={selectedDisconnect.roomNumber}
          onCancel={handleCancelDisconnect}
          onConfirm={handleConfirmDisconnect}
          isProcessing={isProcessing}
        />
      )}

      {/* Assign Resident Modal */}
      {selectedRoomForAssign && selectedRoomNumberForAssign && (
        <AssignResidentModal
          visible={assignModalVisible}
          roomNumber={selectedRoomNumberForAssign}
          unassignedResidents={unassignedResidents}
          assignedResidents={assignedResidents}
          onCancel={handleCancelAssign}
          onAssign={handleConfirmAssign}
          isProcessing={isProcessing}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundTertiary,
  } as ViewStyle,
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundTertiary,
  } as ViewStyle,
  scrollContent: {
    padding: Spacing.xl,
    paddingTop: Spacing['2xl'],
    paddingBottom: Spacing['3xl'],
    ...Platform.select({
      web: {
        maxWidth: 1400,
        marginHorizontal: 'auto',
        width: '100%',
      },
    }),
  } as ViewStyle,

  // Header
  header: {
    marginBottom: Spacing['2xl'],
  } as ViewStyle,
  headerTextContainer: {
    flex: 1,
  } as ViewStyle,
  pageTitle: {
    ...Typography.h1,
    fontSize: FontSize['3xl'],
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.xs,
  } as TextStyle,
  pageSubtitle: {
    ...Typography.body,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  } as TextStyle,

  // Warning Banner
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: '#fff9e6',
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#ffd966',
    marginBottom: Spacing.xl,
  } as ViewStyle,
  warningContent: {
    flex: 1,
  } as ViewStyle,
  warningTitle: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.xs,
  } as TextStyle,
  warningText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  } as TextStyle,

  // Filter
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing['2xl'],
  } as ViewStyle,
  filterButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  } as ViewStyle,
  filterButtonActive: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  } as ViewStyle,
  filterButtonText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  } as TextStyle,
  filterButtonTextActive: {
    color: Colors.textOnPrimary,
  } as TextStyle,

  // Rooms Grid
  roomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.lg,
  } as ViewStyle,
  roomCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    padding: Spacing.lg,
    minWidth: 280,
    ...Platform.select({
      web: {
        width: 'calc(33.333% - 16px)' as any,
      },
      default: {
        width: '100%',
      },
    }),
  } as ViewStyle,
  roomCardOccupied: {
    borderColor: '#dc2626',
  } as ViewStyle,
  roomCardEmpty: {
    borderColor: '#10b981',
  } as ViewStyle,

  // Room Header
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  } as ViewStyle,
  roomTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  } as ViewStyle,
  roomNumber: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  } as TextStyle,

  // Status Badge
  statusBadge: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
  } as ViewStyle,
  statusBadgeOccupied: {
    backgroundColor: '#fee2e2',
  } as ViewStyle,
  statusBadgeEmpty: {
    backgroundColor: '#d1fae5',
  } as ViewStyle,
  statusBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  } as TextStyle,
  statusBadgeTextOccupied: {
    color: '#991b1b',
  } as TextStyle,
  statusBadgeTextEmpty: {
    color: '#065f46',
  } as TextStyle,

  // Resident
  residentName: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
    marginBottom: Spacing.lg,
  } as TextStyle,

  // Disconnect Button
  disconnectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
  } as ViewStyle,
  disconnectButtonText: {
    fontSize: FontSize.sm,
    color: Colors.error,
    fontWeight: FontWeight.medium,
  } as TextStyle,

  // Empty Room
  emptyRoomText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginBottom: Spacing.lg,
  } as TextStyle,

  // Assign Button
  assignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
  } as ViewStyle,
  assignButtonText: {
    fontSize: FontSize.sm,
    color: Colors.success,
    fontWeight: FontWeight.medium,
  } as TextStyle,
});
