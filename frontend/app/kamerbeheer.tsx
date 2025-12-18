import React, { useState } from 'react';
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
import { rooms, residents, floors } from '@/Services/API';

export default function KamerBeheerScreen() {
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);

  // Filter rooms by selected floor
  const filteredRooms = selectedFloor
    ? rooms.filter((room) => room.floor_id === selectedFloor)
    : rooms;

  // Sort rooms by room number
  const sortedRooms = [...filteredRooms].sort((a, b) => a.room_id - b.room_id);

  const handleDisconnect = (roomId: number) => {
    console.log('Disconnect resident from room:', roomId);
    // TODO: Implement disconnect functionality
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
                <View key={room.room_id} style={styles.roomCard}>
                  {/* Room Header */}
                  <View style={styles.roomHeader}>
                    <View style={styles.roomTitleContainer}>
                      <MaterialIcons name="meeting-room" size={20} color={Colors.success} />
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
                        {isOccupied ? 'Bezet' : 'Leeg'}
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
                        onPress={() => handleDisconnect(room.room_id)}
                      >
                        <MaterialIcons name="link-off" size={16} color={Colors.error} />
                        <Text style={styles.disconnectButtonText}>Loskoppelen</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {/* Empty state */}
                  {!isOccupied && (
                    <Text style={styles.emptyRoomText}>Geen bewoner toegewezen</Text>
                  )}
                </View>
              );
            })}
          </View>
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
    borderColor: Colors.success,
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
    backgroundColor: '#d1fae5',
  },
  statusBadgeEmpty: {
    backgroundColor: Colors.backgroundMuted,
  },
  statusBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  statusBadgeTextOccupied: {
    color: '#065f46',
  },
  statusBadgeTextEmpty: {
    color: Colors.textSecondary,
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
  },
});
