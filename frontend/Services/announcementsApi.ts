// Announcements API Service
import { API_BASE_URL } from '@/constants';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Announcement {
  announcement_id: number;
  author_id: number;
  title: string;
  message: string;
  recipient_type: 'all' | 'role' | 'floor';
  floor_id: number | null;
  created_at: string;
}

export interface AnnouncementRecipient {
  recipient_id: number;
  announcement_id: number;
  user_id: number;
  is_read: boolean;
  read_at: string | null;
}

export interface AnnouncementWithRecipient {
  announcement_id: number;
  author_id: number;
  title: string;
  message: string;
  recipient_type: 'all' | 'role' | 'floor';
  floor_id: number | null;
  created_at: string;
  recipients: AnnouncementRecipient[];
}

export interface CreateAnnouncementData {
  author_id: number;
  title: string;
  message: string;
  recipient_type: 'all' | 'role' | 'floor';
  floor_id?: number | null;
  recipient_ids: number[];
}

/**
 * Create a new announcement
 */
export const createAnnouncement = async (
  data: CreateAnnouncementData
): Promise<Announcement> => {
  try {
    const response = await fetch(`${API_BASE_URL}/announcements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Announcement> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
};

/**
 * Fetch all announcements
 */
export const fetchAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/announcements`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Announcement[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching announcements:', error);
    throw error;
  }
};

/**
 * Fetch announcements for a specific user
 */
export const fetchUserAnnouncements = async (userId: number): Promise<AnnouncementWithRecipient[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/announcements/user/${userId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<AnnouncementWithRecipient[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error(`Error fetching announcements for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Mark an announcement as read for a specific user
 */
export const markAnnouncementAsRead = async (
  announcementId: number,
  userId: number
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/announcements/${announcementId}/mark-read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error marking announcement ${announcementId} as read:`, error);
    throw error;
  }
};

/**
 * Update an existing announcement
 */
export const updateAnnouncement = async (
  announcementId: number,
  data: Partial<CreateAnnouncementData>
): Promise<Announcement> => {
  try {
    const response = await fetch(`${API_BASE_URL}/announcements/${announcementId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Announcement> = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error updating announcement ${announcementId}:`, error);
    throw error;
  }
};

/**
 * Delete an announcement
 */
export const deleteAnnouncement = async (announcementId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/announcements/${announcementId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error deleting announcement ${announcementId}:`, error);
    throw error;
  }
};
