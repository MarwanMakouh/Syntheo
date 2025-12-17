import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { Resident } from '@/types';
import { calculateAge } from '@/utils';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants';

interface BewonerCardProps {
  resident: Resident;
  roomNumber: number | null;
  onPress: () => void;
}

export function BewonerCard({ resident, roomNumber, onPress }: BewonerCardProps) {
  const age = calculateAge(resident.date_of_birth);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: resident.photo_url }}
        style={styles.avatar}
      />
      <View style={styles.cardContent}>
        <Text style={styles.residentName}>{resident.name}</Text>
        <View style={styles.infoRow}>
          <MaterialIcons name="cake" size={16} color={Colors.iconDefault} />
          <Text style={styles.infoText}>{age} jaar</Text>
        </View>
        {roomNumber && (
          <View style={styles.infoRow}>
            <MaterialIcons name="door-front" size={16} color={Colors.iconDefault} />
            <Text style={styles.infoText}>Kamer {roomNumber}</Text>
          </View>
        )}
      </View>
      <MaterialIcons name="chevron-right" size={24} color={Colors.iconMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.border,
  },
  cardContent: {
    flex: 1,
    marginLeft: Spacing.xl,
  },
  residentName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  infoText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
});
