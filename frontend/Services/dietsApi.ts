import { API_BASE_URL, API_ENDPOINTS } from '@/constants';
import type { Diet } from '@/types/diet';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Fetch kitchen staff diet overview grouped by diet type
 * Filters: search
 */
export const fetchKitchenDietOverview = async (params?: {
  search?: string;
}): Promise<any[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);

    const url = `${API_BASE_URL}/diets/kitchen-overview${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<any[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching kitchen diet overview:', error);
    throw error;
  }
};

/**
 * Fetch diet information for a specific resident
 */
export const fetchDietByResident = async (residentId: number): Promise<Diet | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.dietByResident(residentId)}`
    );

    if (response.status === 404) {
      return null; // No diet found for this resident
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<any> = await response.json();
    const data = result.data;

    // Some backends return a single object, others return an array
    if (Array.isArray(data)) {
      return data.length > 0 ? data[0] : null;
    }

    return data || null;
  } catch (error) {
    console.error(`Error fetching diet for resident ${residentId}:`, error);
    throw error;
  }
};

/**
 * Create or update diet for a resident
 * NOTE: This should typically go through change requests
 */
export const createOrUpdateDiet = async (dietData: {
  resident_id: number;
  diet_type: string;
  description?: string;
  preferences?: {
    likes?: string[];
    dislikes?: string[];
  };
}): Promise<Diet> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.diets}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(dietData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Diet> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating/updating diet:', error);
    throw error;
  }
};
