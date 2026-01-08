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
import { useAnnouncements, NotificationItem } from '@/contexts/AnnouncementsContext';
import { AnnouncementWithRecipient } from '@/Services/announcementsApi';
import { AnnouncementDetailOverlay } from './announcement-detail-overlay';

interface AnnouncementsDropdownProps {
  visible: boolean;
  onClose: () => void;
  anchorPosition?: { x: number; y: number };
}

export function AnnouncementsDropdown({ visible, onClose, anchorPosition }: AnnouncementsDropdownProps) {
  const { visibleNotifications, isLoading, dismissNotification } = useAnnouncements();
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

  // Get urgency color
  const getUrgencyColor = (urgency: string): string => {
    switch (urgency) {
      case 'Hoog':
        return '#E74C3C';
      case 'Matig':
        return '#F39C12';
      case 'Laag':
        return '#3498DB';
      default:
        return '#3498DB';
    }
  };

  // Get type icon
  const getTypeIcon = (type: 'announcement' | 'note'): string => {
    return type === 'announcement' ? 'campaign' : 'description';
  };

  // Get type label
  const getTypeLabel = (notification: NotificationItem): string => {
    if (notification.type === 'announcement') {
      const ann = notification.originalData as AnnouncementWithRecipient;
      if (ann.recipient_type === 'all') return 'Algemeen';
      if (ann.recipient_type === 'floor') return `Verdieping ${ann.floor_id}`;
      return 'Specifiek';
    }
    return notification.category || 'Melding';
  };

  const handleNotificationPress = (notification: NotificationItem) => {
    // Only open detail for announcements
    if (notification.type === 'announcement') {
      setSelectedAnnouncement(notification.originalData as AnnouncementWithRecipient);
    }
  };

  const handleCloseDetail = () => {
    setSelectedAnnouncement(null);
  };

  const handleDismiss = (e: any, notificationId: string) => {
    e.stopPropagation(); // Prevent opening the detail view
    dismissNotification(notificationId);
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
            ) : visibleNotifications.length === 0 ? (
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
                {visibleNotifications.slice(0, 20).map((notification) => {
                  const urgencyColor = getUrgencyColor(notification.urgency);
                  const typeIcon = getTypeIcon(notification.type);
                  const typeLabel = getTypeLabel(notification);

                  return (
                    <TouchableOpacity
                      key={notification.id}
                      style={[styles.announcementItem, !notification.isRead && styles.announcementItemUnread]}
                      onPress={() => handleNotificationPress(notification)}
                      activeOpacity={0.7}
                    >
                      {/* Type icon */}
                      <View style={styles.typeIconContainer}>
                        <MaterialIcons name={typeIcon as any} size={20} color={urgencyColor} />
                      </View>

                      {/* Content */}
                      <View style={styles.announcementContent}>
                        <View style={styles.announcementHeader}>
                          <Text style={[styles.announcementTitle, !notification.isRead && styles.announcementTitleUnread]}>
                            {notification.title}
                          </Text>
                          <View style={styles.announcementHeaderRight}>
                            <Text style={styles.timeAgo}>
                              {formatTimeAgo(notification.created_at)}
                            </Text>
                            <TouchableOpacity
                              onPress={(e) => handleDismiss(e, notification.id)}
                              style={styles.dismissButton}
                              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                              <MaterialIcons name="close" size={18} color={Colors.textSecondary} />
                            </TouchableOpacity>
                          </View>
                        </View>

                        <Text style={styles.announcementMessage} numberOfLines={2}>
                          {notification.message}
                        </Text>

                        <View style={styles.announcementFooter}>
                          <View style={styles.footerLeft}>
                            <View style={[styles.typeBadge, notification.type === 'note' && styles.typeBadgeNote]}>
                              <Text style={styles.typeBadgeText}>
                                {notification.type === 'announcement' ? 'Aankondiging' : 'Melding'}
                              </Text>
                            </View>
                            <Text style={styles.categoryLabel}>
                              {typeLabel}
                            </Text>
                          </View>
                          <Text style={[styles.urgencyLabel, { color: urgencyColor }]}>
                            {notification.urgency}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
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
  typeIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
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
  announcementHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexShrink: 0,
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
  },
  dismissButton: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.sm,
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
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  typeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primary,
  },
  typeBadgeNote: {
    backgroundColor: '#F39C12',
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: FontWeight.semibold,
    color: Colors.background,
  },
  categoryLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  urgencyLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
});
