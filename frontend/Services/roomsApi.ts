// Rooms API Service
import { API_BASE_URL, API_ENDPOINTS } from '@/constants';
import type { Room } from '@/types/resident';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Fetch all rooms from the backend
 */
export const fetchRooms = async (): Promise<Room[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.rooms}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Room[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
};

/**
 * Fetch a specific room by ID
 */
export const fetchRoomById = async (id: number): Promise<Room> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.roomById(id)}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Room> = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error fetching room ${id}:`, error);
    throw error;
  }
};

/**
 * Fetch room by resident ID
 */
export const fetchRoomByResidentId = async (residentId: number): Promise<Room | null> => {
  try {
    const rooms = await fetchRooms();
    const room = rooms.find(r => r.resident_id === residentId);
    return room || null;
  } catch (error) {
    console.error(`Error fetching room for resident ${residentId}:`, error);
    throw error;
  }
};
