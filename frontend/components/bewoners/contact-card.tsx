import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { Contact } from '@/types';

interface ContactCardProps {
  contact: Contact;
  onCall: (phone: string) => void;
}

export function ContactCard({ contact, onCall }: ContactCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.icon}>
        <MaterialIcons name="person" size={20} color="#666666" />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.relation}>{contact.relation}</Text>
      </View>
      <TouchableOpacity
        style={styles.phoneButton}
        onPress={() => onCall(contact.phone)}
      >
        <MaterialIcons name="phone" size={20} color="#666666" />
        <Text style={styles.phoneText}>{contact.phone}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  relation: {
    fontSize: 14,
    color: '#666666',
  },
  phoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  phoneText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 6,
  },
});
