import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

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
        return '#EF4444';
      case 'in_behandeling':
        return '#F97316';
      case 'afgehandeld':
        return '#10B981';
      default:
        return '#6B7280';
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
        return '#EF4444';
      case 'Matig':
        return '#F97316';
      case 'Laag':
        return '#6B7280';
      default:
        return '#6B7280';
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statusIndicator: {
    width: 6,
  },
  meldingContent: {
    flex: 1,
    padding: 16,
  },
  meldingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
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
    backgroundColor: '#EF4444',
  },
  urgencyDotOrange: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F97316',
  },
  meldingName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  meldingDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  meldingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  meldingTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
