import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight, LineHeight, Shadows } from '@/constants';

interface MeldingCardProps {
  residentName: string;
  description: string;
  timeAgo: string;
  urgency: 'Hoog' | 'Matig' | 'Laag';
  status: 'open' | 'in_behandeling' | 'afgehandeld';
  onPress?: () => void;
}

export function MeldingCard({
  residentName,
  description,
  timeAgo,
  urgency,
  status,
  onPress,
}: MeldingCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return Colors.error;
      case 'in_behandeling':
        return Colors.warning;
      case 'afgehandeld':
        return Colors.success;
      default:
        return Colors.textTertiary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Open';
      case 'in_behandeling':
        return 'Behandeling';
      case 'afgehandeld':
        return 'Afgehandeld';
      default:
        return status;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Hoog':
        return Colors.error;
      case 'Matig':
        return Colors.warning;
      case 'Laag':
        return Colors.textTertiary;
      default:
        return Colors.textTertiary;
    }
  };

  return (
    <TouchableOpacity style={styles.meldingCard} onPress={onPress} activeOpacity={0.7}>
      {/* Left colored indicator */}
      <View
        style={[
          styles.statusIndicator,
          { backgroundColor: getUrgencyColor(urgency) }
        ]}
      />

      <View style={styles.meldingContent}>
        {/* Top row with name and urgency dot */}
        <View style={styles.meldingInfo}>
          <View style={styles.urgencyDot}>
            {urgency === 'Hoog' && (
              <View style={styles.urgencyDotRed} />
            )}
            {urgency === 'Matig' && (
              <View style={styles.urgencyDotOrange} />
            )}
          </View>
          <Text style={styles.meldingName}>{residentName}</Text>
        </View>

        {/* Description */}
        <Text style={styles.meldingDescription}>{description}</Text>

        {/* Bottom row with time and status */}
        <View style={styles.meldingFooter}>
          <Text style={styles.meldingTime}>{timeAgo}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(status) }
            ]}
          >
            <Text style={styles.statusBadgeText}>
              {getStatusText(status)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  meldingCard: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
    ...Shadows.card,
  },
  statusIndicator: {
    width: 6,
  },
  meldingContent: {
    flex: 1,
    padding: Spacing.xl,
  },
  meldingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  urgencyDot: {
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  urgencyDotRed: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
  urgencyDotOrange: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.warning,
  },
  meldingName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    flex: 1,
  },
  meldingDescription: {
    fontSize: FontSize.md,
    color: Colors.textBody,
    lineHeight: LineHeight.relaxed,
    marginBottom: Spacing.lg,
  },
  meldingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.md,
  },
  meldingTime: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
  },
  statusBadgeText: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
});
