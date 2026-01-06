import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { AllergyBadge } from './allergy-badge';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/constants';
import type { Resident } from '@/types/resident';

interface ResidentCardProps {
  resident: Resident;
  roomNumber?: string | null;
  age?: number;
  hasAllergies: boolean;
  onView: () => void;
  onInfo: () => void;
}

export function ResidentCard({
  resident,
  roomNumber,
  age,
  hasAllergies,
  onView,
  onInfo,
}: ResidentCardProps) {
  return (
    <View style={styles.card}>
      {/* Avatar */}
      <View style={styles.avatar}>
        <MaterialIcons name="person" size={48} color={Colors.background} />
      </View>

      {/* Name */}
      <Text style={styles.name}>{resident.name}</Text>

      {/* Info */}
      <Text style={styles.info}>
        {age ? `${age} jaar` : ''} · Kamer {roomNumber || '-'}
      </Text>

      {/* Allergy Badge */}
      <View style={styles.allergyContainer}>
        <AllergyBadge hasAllergies={hasAllergies} />
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.viewButton} onPress={onView}>
          <Text style={styles.viewButtonText}>Bekijken</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoButton} onPress={onInfo}>
          <MaterialIcons name="info" size={20} color={Colors.background} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  name: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  info: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  allergyContainer: {
    minHeight: 36,
    marginBottom: Spacing.md,
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    width: '100%',
  },
  viewButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  viewButtonText: {
    color: Colors.background,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  infoButton: {
    width: 44,
    height: 44,
    backgroundColor: '#95A5A6',
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
