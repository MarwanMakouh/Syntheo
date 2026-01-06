import { StyleSheet, View, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/constants';

interface AllergyBadgeProps {
  hasAllergies: boolean;
}

export function AllergyBadge({ hasAllergies }: AllergyBadgeProps) {
  if (!hasAllergies) return null;

  return (
    <View style={styles.badge}>
      <MaterialIcons name="warning" size={16} color="#E74C3C" />
      <Text style={styles.text}>Heeft allergieën</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: '#E74C3C',
    backgroundColor: Colors.background,
  },
  text: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: '#E74C3C',
  },
});
