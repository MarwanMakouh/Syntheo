import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  fetchUserAnnouncements,
  markAnnouncementAsRead as markAsReadApi,
  AnnouncementWithRecipient
} from '@/Services/announcementsApi';
import { useAuth } from './AuthContext';

interface AnnouncementsContextType {
  announcements: AnnouncementWithRecipient[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  markAsRead: (announcementId: number) => Promise<void>;
  refreshAnnouncements: () => Promise<void>;
}

const AnnouncementsContext = createContext<AnnouncementsContextType | undefined>(undefined);

export const AnnouncementsProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser, isLoading: authLoading } = useAuth();
  const [announcements, setAnnouncements] = useState<AnnouncementWithRecipient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate unread count from announcements
  const unreadCount = announcements.filter(announcement => {
    const userRecipient = announcement.recipients.find(
      recipient => recipient.user_id === currentUser?.user_id
    );
    return userRecipient && !userRecipient.is_read;
  }).length;

  // Fetch announcements for current user
  const fetchData = async () => {
    if (!currentUser?.user_id) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const data = await fetchUserAnnouncements(currentUser.user_id);
      setAnnouncements(data);
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch announcements');
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

  return (
    <AnnouncementsContext.Provider
      value={{
        announcements,
        unreadCount,
        isLoading,
        error,
        markAsRead,
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
