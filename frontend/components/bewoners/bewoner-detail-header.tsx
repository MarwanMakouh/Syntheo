import { StyleSheet, View, Text } from 'react-native';
import type { Resident } from '@/types';
import { getInitials } from '@/utils';

interface BewonerDetailHeaderProps {
  resident: Resident;
  roomNumber: number | null;
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
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#666666',
  },
  info: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: '#666666',
  },
});
