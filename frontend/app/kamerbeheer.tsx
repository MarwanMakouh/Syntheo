import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius, FontSize, FontWeight } from '@/constants';
import { NavigationBar } from '@/components';
import { DisconnectConfirmationModal } from '@/components/disconnect-confirmation-modal';
import { AssignResidentModal } from '@/components/assign-resident-modal';
// TODO: Replace with API calls
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

  // Filter rooms by selected floor
  const filteredRooms = selectedFloor
    ? rooms.filter((room) => room.floor_id === selectedFloor)
    : rooms;

  // Sort rooms by room number
  const sortedRooms = [...filteredRooms].sort((a, b) => a.room_id - b.room_id);

  // Get unassigned and assigned residents
  const { unassignedResidents, assignedResidents } = useMemo(() => {
    const assignedResidentIds = rooms
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
        const room = rooms.find((r) => r.resident_id === resident.resident_id);
        return {
          resident_id: resident.resident_id,
          name: resident.name,
          currentRoom: room?.room_id,
        };
      });

    return { unassignedResidents: unassigned, assignedResidents: assigned };
  }, []);

  const handleDisconnect = (roomId: number, residentName: string, roomNumber: number) => {
    setSelectedDisconnect({ roomId, residentName, roomNumber });
    setDisconnectModalVisible(true);
  };

  const handleConfirmDisconnect = () => {
    if (selectedDisconnect) {
      console.log('Disconnecting resident from room:', selectedDisconnect.roomId);
      // TODO: Implement actual disconnect functionality with backend
      alert(`${selectedDisconnect.residentName} is losgekoppeld van Kamer ${selectedDisconnect.roomNumber}`);
    }
    setDisconnectModalVisible(false);
    setSelectedDisconnect(null);
  };

  const handleCancelDisconnect = () => {
    setDisconnectModalVisible(false);
    setSelectedDisconnect(null);
  };

  const handleAssignResident = (roomId: number) => {
    setSelectedRoomForAssign(roomId);
    setAssignModalVisible(true);
  };

  const handleConfirmAssign = (residentId: number) => {
    if (selectedRoomForAssign) {
      const resident = residents.find((r) => r.resident_id === residentId);
      console.log('Assigning resident', residentId, 'to room', selectedRoomForAssign);
      // TODO: Implement actual assign functionality with backend
      alert(`${resident?.name} is toegewezen aan Kamer ${selectedRoomForAssign}`);
    }
    setAssignModalVisible(false);
    setSelectedRoomForAssign(null);
  };

  const handleCancelAssign = () => {
    setAssignModalVisible(false);
    setSelectedRoomForAssign(null);
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
                      <Text style={styles.roomNumber}>Kamer {room.room_id}</Text>
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
                        onPress={() => handleDisconnect(room.room_id, resident.name, room.room_id)}
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
                        onPress={() => handleAssignResident(room.room_id)}
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
        />
      )}

      {/* Assign Resident Modal */}
      {selectedRoomForAssign && (
        <AssignResidentModal
          visible={assignModalVisible}
          roomNumber={selectedRoomForAssign}
          unassignedResidents={unassignedResidents}
          assignedResidents={assignedResidents}
          onCancel={handleCancelAssign}
          onAssign={handleConfirmAssign}
        />
      )}
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
        maxWidth: 1400,
        marginHorizontal: 'auto',
        width: '100%',
      },
    }),
  },

  // Header
  header: {
    marginBottom: Spacing['2xl'],
  },
  headerTextContainer: {
    flex: 1,
  },
  pageTitle: {
    ...Typography.h1,
    fontSize: FontSize['3xl'],
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  pageSubtitle: {
    ...Typography.body,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },

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
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  warningText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },

  // Filter
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing['2xl'],
  },
  filterButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterButtonActive: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  filterButtonText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  filterButtonTextActive: {
    color: Colors.textOnPrimary,
  },

  // Rooms Grid
  roomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.lg,
  },
  roomCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    padding: Spacing.lg,
    minWidth: 280,
    ...Platform.select({
      web: {
        width: 'calc(33.333% - 16px)',
      },
      default: {
        width: '100%',
      },
    }),
  },
  roomCardOccupied: {
    borderColor: '#dc2626',
  },
  roomCardEmpty: {
    borderColor: '#10b981',
  },

  // Room Header
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  roomTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  roomNumber: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },

  // Status Badge
  statusBadge: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  statusBadgeOccupied: {
    backgroundColor: '#fee2e2',
  },
  statusBadgeEmpty: {
    backgroundColor: '#d1fae5',
  },
  statusBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  statusBadgeTextOccupied: {
    color: '#991b1b',
  },
  statusBadgeTextEmpty: {
    color: '#065f46',
  },

  // Resident
  residentName: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
    marginBottom: Spacing.lg,
  },

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
  },
  disconnectButtonText: {
    fontSize: FontSize.sm,
    color: Colors.error,
    fontWeight: FontWeight.medium,
  },

  // Empty Room
  emptyRoomText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginBottom: Spacing.lg,
  },

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
  },
  assignButtonText: {
    fontSize: FontSize.sm,
    color: Colors.success,
    fontWeight: FontWeight.medium,
  },
});
