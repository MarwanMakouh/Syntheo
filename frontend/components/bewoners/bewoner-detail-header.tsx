import { StyleSheet, View, Text } from 'react-native';
import type { Resident } from '@/types';
import { getInitials } from '@/utils';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants';

interface BewonerDetailHeaderProps {
  resident: Resident;
  roomNumber: string | null;
  floorNumber: number | null;
}

export function BewonerDetailHeader({ resident, roomNumber, floorNumber }: BewonerDetailHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitials(resident.name)}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{resident.name}</Text>
        <Text style={styles.details}>
          Kamer {roomNumber} · Verdieping {floorNumber}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing['2xl'],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  info: {
    marginLeft: Spacing.xl,
    flex: 1,
  },
  name: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  details: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
});
