import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants';
import { AnnouncementWithRecipient } from '@/Services/announcementsApi';
import { useAnnouncements } from '@/contexts/AnnouncementsContext';
import { useAuth } from '@/contexts/AuthContext';

interface AnnouncementListItemProps {
  announcement: AnnouncementWithRecipient;
}

export function AnnouncementListItem({ announcement }: AnnouncementListItemProps) {
  const { markAsRead } = useAnnouncements();
  const { currentUser } = useAuth();
  const [expanded, setExpanded] = useState(false);

  // Find current user's recipient record to check read status
  const userRecipient = announcement.recipients.find(
    recipient => recipient.user_id === currentUser?.user_id
  );
  const isRead = userRecipient?.is_read || false;

  // Format timestamp
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // Less than a week
      return date.toLocaleDateString('nl-NL', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  };

  const handlePress = () => {
    // Mark as read if unread
    if (!isRead) {
      markAsRead(announcement.announcement_id);
    }
    // Toggle expanded state
    setExpanded(!expanded);
  };

  // Truncate message for preview
  const messagePreview = expanded
    ? announcement.message
    : announcement.message.length > 100
      ? announcement.message.substring(0, 100) + '...'
      : announcement.message;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isRead ? styles.containerRead : styles.containerUnread,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Unread indicator dot */}
      {!isRead && <View style={styles.unreadDot} />}

      {/* Content */}
      <View style={styles.content}>
        {/* Title and timestamp */}
        <View style={styles.headerRow}>
          <Text
            style={[
              styles.title,
              !isRead && styles.titleUnread,
            ]}
            numberOfLines={1}
          >
            {announcement.title}
          </Text>
          <Text style={styles.timestamp}>{formatDate(announcement.created_at)}</Text>
        </View>

        {/* Message */}
        <Text
          style={[
            styles.message,
            !isRead && styles.messageUnread,
          ]}
          numberOfLines={expanded ? undefined : 3}
        >
          {messagePreview}
        </Text>

        {/* Expand/collapse indicator */}
        {announcement.message.length > 100 && (
          <Text style={styles.expandText}>
            {expanded ? 'Toon minder' : 'Toon meer'}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    position: 'relative',
  },
  containerRead: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  containerUnread: {
    backgroundColor: Colors.backgroundSecondary,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  unreadDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
    paddingRight: Spacing.lg, // Space for unread dot
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  title: {
    flex: 1,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  titleUnread: {
    fontWeight: FontWeight.bold,
  },
  timestamp: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    flexShrink: 0,
  },
  message: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  messageUnread: {
    color: Colors.textPrimary,
  },
  expandText: {
    marginTop: Spacing.sm,
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
  },
});
