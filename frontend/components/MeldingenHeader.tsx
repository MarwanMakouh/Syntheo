import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface MeldingenHeaderProps {
  onNewMelding?: () => void;
}

export function MeldingenHeader({ onNewMelding }: MeldingenHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.newButton} onPress={onNewMelding}>
        <MaterialIcons name="add" size={20} color="#FFFFFF" />
        <Text style={styles.newButtonText}>Nieuwe Melding</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5B47FB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  newButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
