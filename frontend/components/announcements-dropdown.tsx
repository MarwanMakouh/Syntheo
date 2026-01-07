import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants';
import { useAnnouncements } from '@/contexts/AnnouncementsContext';
import { useAuth } from '@/contexts/AuthContext';
import { AnnouncementWithRecipient } from '@/Services/announcementsApi';
import { AnnouncementDetailOverlay } from './announcement-detail-overlay';

interface AnnouncementsDropdownProps {
  visible: boolean;
  onClose: () => void;
  anchorPosition?: { x: number; y: number };
}

export function AnnouncementsDropdown({ visible, onClose, anchorPosition }: AnnouncementsDropdownProps) {
  const { announcements, isLoading } = useAnnouncements();
  const { currentUser } = useAuth();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementWithRecipient | null>(null);

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min geleden`;
    } else if (diffInMinutes < 1440) { // Less than 24 hours
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} uur geleden`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} dag${days > 1 ? 'en' : ''} geleden`;
    }
  };

  // Get urgency label based on message content (simple heuristic)
  const getUrgencyLabel = (title: string, message: string): string => {
    const content = (title + ' ' + message).toLowerCase();
    if (content.includes('urgent') || content.includes('dringend') || content.includes('spoedig')) {
      return 'Hoog';
    } else if (content.includes('belangrijk') || content.includes('aandacht')) {
      return 'Matig';
    }
    return 'Algemeen';
  };

  // Get urgency color
  const getUrgencyColor = (urgency: string): string => {
    switch (urgency) {
      case 'Hoog':
        return '#E74C3C';
      case 'Matig':
        return '#F39C12';
      default:
        return '#3498DB';
    }
  };

  const handleAnnouncementPress = (announcement: AnnouncementWithRecipient) => {
    setSelectedAnnouncement(announcement);
  };

  const handleCloseDetail = () => {
    setSelectedAnnouncement(null);
  };

  if (!visible) return null;

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <Pressable style={styles.overlay} onPress={onClose}>
          <View style={[styles.dropdown, anchorPosition && { top: anchorPosition.y, right: 20 }]}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Recente Meldingen</Text>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <MaterialIcons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Content */}
            {isLoading ? (
              <View style={styles.centerContent}>
                <Text style={styles.loadingText}>Laden...</Text>
              </View>
            ) : announcements.length === 0 ? (
              <View style={styles.centerContent}>
                <MaterialIcons name="notifications-none" size={48} color={Colors.textSecondary} />
                <Text style={styles.emptyText}>Geen meldingen</Text>
              </View>
            ) : (
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {announcements.slice(0, 10).map((announcement) => {
                  const userRecipient = announcement.recipients.find(
                    recipient => recipient.user_id === currentUser?.user_id
                  );
                  const isRead = userRecipient?.is_read || false;
                  const urgency = getUrgencyLabel(announcement.title, announcement.message);
                  const urgencyColor = getUrgencyColor(urgency);

                  return (
                    <TouchableOpacity
                      key={announcement.announcement_id}
                      style={[styles.announcementItem, !isRead && styles.announcementItemUnread]}
                      onPress={() => handleAnnouncementPress(announcement)}
                      activeOpacity={0.7}
                    >
                      {/* Unread indicator dot */}
                      <View style={[styles.urgencyDot, { backgroundColor: urgencyColor }]} />

                      {/* Content */}
                      <View style={styles.announcementContent}>
                        <View style={styles.announcementHeader}>
                          <Text style={[styles.announcementTitle, !isRead && styles.announcementTitleUnread]}>
                            {announcement.title}
                          </Text>
                          <Text style={styles.timeAgo}>
                            {formatTimeAgo(announcement.created_at)}
                          </Text>
                        </View>

                        <Text style={styles.announcementMessage} numberOfLines={2}>
                          {announcement.message}
                        </Text>

                        <View style={styles.announcementFooter}>
                          <Text style={styles.categoryLabel}>
                            {announcement.recipient_type === 'all' ? 'Algemeen' :
                             announcement.recipient_type === 'floor' ? `Verdieping ${announcement.floor_id}` :
                             'Specifiek'}
                          </Text>
                          <Text style={[styles.urgencyLabel, { color: urgencyColor }]}>
                            {urgency}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            {/* Footer */}
            {announcements.length > 0 && (
              <TouchableOpacity style={styles.footer} onPress={onClose}>
                <Text style={styles.footerText}>Bekijk alle meldingen</Text>
                <MaterialIcons name="arrow-forward" size={18} color={Colors.success} />
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Modal>

      {/* Detail Overlay */}
      {selectedAnnouncement && (
        <AnnouncementDetailOverlay
          visible={!!selectedAnnouncement}
          announcement={selectedAnnouncement}
          onClose={handleCloseDetail}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  dropdown: {
    position: 'absolute',
    top: 80,
    right: 20,
    width: 400,
    maxHeight: 600,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  centerContent: {
    padding: Spacing['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  announcementItem: {
    flexDirection: 'row',
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  announcementItemUnread: {
    backgroundColor: Colors.backgroundSecondary,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  urgencyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.md,
    marginTop: 6,
    flexShrink: 0,
  },
  announcementContent: {
    flex: 1,
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  announcementTitle: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
    marginRight: Spacing.sm,
  },
  announcementTitleUnread: {
    fontWeight: FontWeight.bold,
  },
  timeAgo: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    flexShrink: 0,
  },
  announcementMessage: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  announcementFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  urgencyLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  footerText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.success,
    marginRight: Spacing.xs,
  },
});
