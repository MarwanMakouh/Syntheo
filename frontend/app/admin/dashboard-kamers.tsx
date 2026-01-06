import { useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { AdminLayout } from '@/components/admin';
import { RoomCard } from '@/components/admin/room-card';
import { WarningBanner } from '@/components/admin/warning-banner';
import { residents, rooms, notes } from '@/Services';
import { Colors, FontSize, FontWeight, Spacing, Layout } from '@/constants';

export default function DashboardKamersScreen() {
  // Get residents without rooms
  const residentsWithoutRooms = useMemo(() => {
    const assignedResidentIds = rooms
      .filter((r) => r.resident_id !== null)
      .map((r) => r.resident_id);

    return residents.filter((r) => !assignedResidentIds.includes(r.resident_id));
  }, []);

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
    Alert.alert('Bewoner Toewijzen', `Wijs een bewoner toe aan kamer ${roomId}`);
  };

  const handleUnlinkResident = (roomId: number, residentName?: string) => {
    Alert.alert(
      'Bewoner Loskoppelen',
      `Weet je zeker dat je ${residentName} wilt loskoppelen van kamer ${roomId}?`,
      [
        { text: 'Annuleren', style: 'cancel' },
        {
          text: 'Loskoppelen',
          style: 'destructive',
          onPress: () => {
            console.log('Unlink resident from room:', roomId);
          },
        },
      ]
    );
  };

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
        </View>
      </ScrollView>
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
});
