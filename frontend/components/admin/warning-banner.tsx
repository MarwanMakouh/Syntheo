import { StyleSheet, View, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/constants';

interface WarningBannerProps {
  message: string;
  badges?: string[];
}

export function WarningBanner({ message, badges = [] }: WarningBannerProps) {
  return (
    <View style={styles.banner}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="info" size={24} color="#F39C12" />
      </View>
      <View style={styles.content}>
        <Text style={styles.message}>{message}</Text>
        {badges.length > 0 && (
          <View style={styles.badgesContainer}>
            {badges.map((badge, index) => (
              <View key={index} style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    backgroundColor: '#FEF5E7',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#F39C12',
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  iconContainer: {
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: '#D68910',
    marginBottom: Spacing.sm,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  badge: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: '#D68910',
  },
  badgeText: {
    fontSize: FontSize.sm,
    color: '#D68910',
    fontWeight: FontWeight.medium,
  },
});
