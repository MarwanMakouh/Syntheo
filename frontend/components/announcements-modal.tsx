import { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants';
import { useAnnouncements } from '@/contexts/AnnouncementsContext';
import { AnnouncementListItem } from './announcement-list-item';

interface AnnouncementsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AnnouncementsModal({ visible, onClose }: AnnouncementsModalProps) {
  const { announcements, isLoading, refreshAnnouncements } = useAnnouncements();

  // Refresh announcements when modal opens
  useEffect(() => {
    if (visible) {
      refreshAnnouncements();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Aankondigingen</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        {isLoading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Laden...</Text>
          </View>
        ) : announcements.length === 0 ? (
          <View style={styles.centerContent}>
            <MaterialIcons name="notifications-none" size={64} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>Geen aankondigingen</Text>
            <Text style={styles.emptySubtext}>
              Je hebt momenteel geen aankondigingen
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {announcements.map((announcement) => (
              <AnnouncementListItem
                key={announcement.announcement_id}
                announcement={announcement}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing['2xl'],
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
  },
  loadingText: {
    marginTop: Spacing.lg,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  emptyText: {
    marginTop: Spacing.lg,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  emptySubtext: {
    marginTop: Spacing.sm,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing['2xl'],
    gap: Spacing.lg,
  },
});
