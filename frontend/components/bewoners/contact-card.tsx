import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { Contact } from '@/types';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants';

interface ContactCardProps {
  contact: Contact;
  onCall: (phone: string) => void;
}

export function ContactCard({ contact, onCall }: ContactCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.icon}>
        <MaterialIcons name="person" size={20} color={Colors.iconDefault} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.relation}>{contact.relation}</Text>
      </View>
      <TouchableOpacity
        style={styles.phoneButton}
        onPress={() => onCall(contact.phone)}
      >
        <MaterialIcons name="phone" size={20} color={Colors.iconDefault} />
        <Text style={styles.phoneText}>{contact.phone}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  relation: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  phoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
  },
  phoneText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
});
