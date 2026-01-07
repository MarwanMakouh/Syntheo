// Users API Service
import { API_BASE_URL, API_ENDPOINTS } from '@/constants';

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
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.users}`);

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
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.userById(userId)}`);

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

/**
 * Create a new user
 */
export const createUser = async (data: any): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.users}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<User> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Update an existing user
 */
export const updateUser = async (userId: number, data: any): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.userById(userId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<User> = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    throw error;
  }
};

/**
 * Delete a user
 */
export const deleteUser = async (userId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.userById(userId)}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
};
