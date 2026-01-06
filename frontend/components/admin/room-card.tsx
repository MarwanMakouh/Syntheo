import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { RoomStatusBadge } from './room-status-badge';
import { ResidentStatusBadge } from './resident-status-badge';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/constants';

interface RoomCardProps {
  roomNumber: string;
  isOccupied: boolean;
  residentName?: string;
  residentStatus?: 'Stabiel' | 'Aandacht' | 'Urgent';
  onAssign?: () => void;
  onUnlink?: () => void;
}

export function RoomCard({
  roomNumber,
  isOccupied,
  residentName,
  residentStatus,
  onAssign,
  onUnlink,
}: RoomCardProps) {
  return (
    <View style={[styles.card, isOccupied && styles.cardOccupied]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.roomInfo}>
          <MaterialIcons name="meeting-room" size={20} color={Colors.success} />
          <Text style={styles.roomNumber}>Kamer {roomNumber}</Text>
        </View>
        <RoomStatusBadge isOccupied={isOccupied} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {isOccupied ? (
          <>
            <Text style={styles.residentName}>{residentName}</Text>
            {residentStatus && (
              <View style={styles.statusContainer}>
                <ResidentStatusBadge status={residentStatus} />
              </View>
            )}
            <TouchableOpacity style={styles.unlinkButton} onPress={onUnlink}>
              <MaterialIcons name="person-remove" size={18} color="#E74C3C" />
              <Text style={styles.unlinkButtonText}>Loskoppelen</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.emptyText}>Geen bewoner toegewezen</Text>
            <TouchableOpacity style={styles.assignButton} onPress={onAssign}>
              <MaterialIcons name="person-add" size={18} color={Colors.background} />
              <Text style={styles.assignButtonText}>Bewoner Toewijzen</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  cardOccupied: {
    borderColor: '#27AE60',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  roomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  roomNumber: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  content: {
    gap: Spacing.md,
  },
  residentName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  statusContainer: {
    marginVertical: Spacing.xs,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  assignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.success,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  assignButtonText: {
    color: Colors.background,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  unlinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.background,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: '#E74C3C',
  },
  unlinkButtonText: {
    color: '#E74C3C',
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
});
