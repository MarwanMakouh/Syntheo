import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants';
import { AnnouncementWithRecipient } from '@/Services/announcementsApi';
import { useAnnouncements } from '@/contexts/AnnouncementsContext';
import { useAuth } from '@/contexts/AuthContext';

interface AnnouncementDetailOverlayProps {
  visible: boolean;
  announcement: AnnouncementWithRecipient;
  onClose: () => void;
}

export function AnnouncementDetailOverlay({
  visible,
  announcement,
  onClose,
}: AnnouncementDetailOverlayProps) {
  const { markAsRead } = useAnnouncements();
  const { currentUser } = useAuth();

  // Mark as read when opened
  useEffect(() => {
    if (visible && currentUser) {
      const userRecipient = announcement.recipients.find(
        recipient => recipient.user_id === currentUser.user_id
      );
      if (userRecipient && !userRecipient.is_read) {
        markAsRead(announcement.announcement_id);
      }
    }
  }, [visible, announcement.announcement_id, currentUser]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get recipient type label
  const getRecipientTypeLabel = () => {
    switch (announcement.recipient_type) {
      case 'all':
        return 'Iedereen';
      case 'floor':
        return `Verdieping ${announcement.floor_id}`;
      case 'role':
        return 'Specifieke rol';
      default:
        return 'Onbekend';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <MaterialIcons name="campaign" size={24} color={Colors.primary} />
              <Text style={styles.headerTitle}>Aankondiging</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Title */}
            <Text style={styles.title}>{announcement.title}</Text>

            {/* Meta info */}
            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <MaterialIcons name="schedule" size={16} color={Colors.textSecondary} />
                <Text style={styles.metaText}>{formatDate(announcement.created_at)}</Text>
              </View>
              <View style={styles.metaItem}>
                <MaterialIcons name="people" size={16} color={Colors.textSecondary} />
                <Text style={styles.metaText}>{getRecipientTypeLabel()}</Text>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Message */}
            <Text style={styles.message}>{announcement.message}</Text>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.closeFooterButton} onPress={onClose}>
              <Text style={styles.closeFooterButtonText}>Sluiten</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  container: {
    width: '100%',
    maxWidth: 600,
    maxHeight: '80%',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.backgroundSecondary,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing['2xl'],
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    lineHeight: 32,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.lg,
  },
  message: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  footer: {
    padding: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  closeFooterButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  closeFooterButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textOnPrimary,
  },
});
