import { API_BASE_URL, API_ENDPOINTS } from '@/constants/apiConfig';
import type { User } from '@/types/user';

/**
 * Fetch all users from the API
 */
export const fetchUsers = async (): Promise<User[]> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    const url = `${API_BASE_URL}${API_ENDPOINTS.users}`;
    console.log('🔵 Fetching users from:', url);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    });

    clearTimeout(timeoutId);
    console.log('✅ Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Users API response:', result);

    // Backend returns {success: true, data: [...]}
    // Extract the data array
    return result.data || [];
  } catch (error: any) {
    clearTimeout(timeoutId);
    const errorMsg = error?.name === 'AbortError' 
      ? 'Request timeout - backend server niet bereikbaar' 
      : error?.message || 'Onbekende fout bij laden van gebruikers';
    console.error('❌ Error fetching users:', errorMsg);
    throw new Error(errorMsg);
  }
};

/**
 * Fetch a single user by ID
 */
export const fetchUserById = async (userId: number): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.userById(userId)}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
};

/**
 * Create a new user
 */
export const createUser = async (userData: Omit<User, 'user_id' | 'created_at' | 'updated_at'>): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.users}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Update an existing user
 */
export const updateUser = async (userId: number, userData: Partial<User>): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.userById(userId)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
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
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
};
