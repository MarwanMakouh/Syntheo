// Users API Service
import { API_BASE_URL } from '@/constants';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface User {
  user_id: number;
  name: string;
  email: string;
  role: string;
  floor_id: number | null;
}

/**
 * Fetch all users
 */
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<User[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Fetch a specific user by ID
 */
export const fetchUserById = async (userId: number): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<User> = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
};
