import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  fetchUserAnnouncements,
  markAnnouncementAsRead as markAsReadApi,
  AnnouncementWithRecipient
} from '@/Services/announcementsApi';
import { fetchNotes } from '@/Services/notesApi';
import type { Note } from '@/types/note';
import { useAuth } from './AuthContext';

// Combined notification type
export type NotificationItem = {
  id: string; // Unique identifier combining type and id
  type: 'announcement' | 'note';
  title: string;
  message: string;
  created_at: string;
  urgency: 'Hoog' | 'Matig' | 'Laag' | 'Algemeen';
  isRead: boolean;
  category?: string;
  residentId?: number;
  originalData: AnnouncementWithRecipient | Note;
};

interface AnnouncementsContextType {
  announcements: AnnouncementWithRecipient[];
  notes: Note[];
  notifications: NotificationItem[];
  visibleNotifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  markAsRead: (announcementId: number) => Promise<void>;
  dismissNotification: (notificationId: string) => void;
  refreshAnnouncements: () => Promise<void>;
}

const AnnouncementsContext = createContext<AnnouncementsContextType | undefined>(undefined);

export const AnnouncementsProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser, isLoading: authLoading } = useAuth();
  const [announcements, setAnnouncements] = useState<AnnouncementWithRecipient[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert announcements to notification items
  const announcementNotifications: NotificationItem[] = announcements.map(announcement => {
    const userRecipient = announcement.recipients.find(
      recipient => recipient.user_id === currentUser?.user_id
    );

    // Determine urgency from content
    const content = (announcement.title + ' ' + announcement.message).toLowerCase();
    let urgency: 'Hoog' | 'Matig' | 'Laag' | 'Algemeen' = 'Algemeen';
    if (content.includes('urgent') || content.includes('dringend') || content.includes('spoedig')) {
      urgency = 'Hoog';
    } else if (content.includes('belangrijk') || content.includes('aandacht')) {
      urgency = 'Matig';
    }

    return {
      id: `announcement-${announcement.announcement_id}`,
      type: 'announcement' as const,
      title: announcement.title,
      message: announcement.message,
      created_at: announcement.created_at,
      urgency,
      isRead: userRecipient?.is_read || false,
      originalData: announcement,
    };
  });

  // Convert notes to notification items (only unresolved notes)
  const noteNotifications: NotificationItem[] = notes
    .filter(note => !note.is_resolved)
    .map(note => ({
      id: `note-${note.note_id}`,
      type: 'note' as const,
      title: note.category,
      message: note.content,
      created_at: note.created_at,
      urgency: note.urgency,
      isRead: false, // Notes don't have read status for now
      category: note.category,
      residentId: note.resident_id,
      originalData: note,
    }));

  // Combine and sort by date (newest first)
  const notifications = [...announcementNotifications, ...noteNotifications]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Filter out dismissed notifications
  const visibleNotifications = notifications.filter(
    notification => !dismissedIds.has(notification.id)
  );

  // Calculate unread count from visible notifications only
  const unreadCount = visibleNotifications.filter(notification => !notification.isRead).length;

  // Fetch announcements and notes
  const fetchData = async () => {
    if (!currentUser?.user_id) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const [announcementsData, notesData] = await Promise.all([
        fetchUserAnnouncements(currentUser.user_id),
        fetchNotes()
      ]);
      setAnnouncements(announcementsData);
      setNotes(notesData);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setIsLoading(false);
    }
  };

  // Load announcements on mount
  useEffect(() => {
    if (!authLoading && currentUser) {
      fetchData();
    } else if (!authLoading && !currentUser) {
      setIsLoading(false);
    }
  }, [currentUser, authLoading]);

  // Mark announcement as read
  const markAsRead = async (announcementId: number) => {
    if (!currentUser?.user_id) return;

    try {
      // Optimistic update - update local state immediately
      setAnnouncements(prevAnnouncements =>
        prevAnnouncements.map(announcement => {
          if (announcement.announcement_id === announcementId) {
            return {
              ...announcement,
              recipients: announcement.recipients.map(recipient => {
                if (recipient.user_id === currentUser.user_id) {
                  return {
                    ...recipient,
                    is_read: true,
                    read_at: new Date().toISOString(),
                  };
                }
                return recipient;
              }),
            };
          }
          return announcement;
        })
      );

      // Call API to persist the change
      await markAsReadApi(announcementId, currentUser.user_id);
    } catch (err) {
      console.error('Error marking announcement as read:', err);
      // Revert optimistic update on error by refreshing
      await refreshAnnouncements();
    }
  };

  // Manually refresh announcements
  const refreshAnnouncements = async () => {
    setIsLoading(true);
    await fetchData();
  };

  // Dismiss notification (remove from popup temporarily)
  const dismissNotification = (notificationId: string) => {
    setDismissedIds(prev => {
      const newSet = new Set(prev);
      newSet.add(notificationId);
      return newSet;
    });
  };

  return (
    <AnnouncementsContext.Provider
      value={{
        announcements,
        notes,
        notifications,
        visibleNotifications,
        unreadCount,
        isLoading,
        error,
        markAsRead,
        dismissNotification,
        refreshAnnouncements,
      }}
    >
      {children}
    </AnnouncementsContext.Provider>
  );
};

export const useAnnouncements = () => {
  const ctx = useContext(AnnouncementsContext);
  if (!ctx) throw new Error('useAnnouncements must be used within AnnouncementsProvider');
  return ctx;
};

export default AnnouncementsContext;
