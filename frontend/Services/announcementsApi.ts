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
export const fetchUserAnnouncements = async (userId: number): Promise<Announcement[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/announcements/user/${userId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Announcement[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error(`Error fetching announcements for user ${userId}:`, error);
    throw error;
  }
};
