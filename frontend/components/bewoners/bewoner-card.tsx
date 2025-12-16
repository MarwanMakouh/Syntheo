import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { Resident } from '@/types';
import { calculateAge } from '@/utils';

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
          <MaterialIcons name="cake" size={16} color="#666666" />
          <Text style={styles.infoText}>{age} jaar</Text>
        </View>
        {roomNumber && (
          <View style={styles.infoRow}>
            <MaterialIcons name="door-front" size={16} color="#666666" />
            <Text style={styles.infoText}>Kamer {roomNumber}</Text>
          </View>
        )}
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#cccccc" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e0e0',
  },
  cardContent: {
    flex: 1,
    marginLeft: 16,
  },
  residentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 6,
  },
});
