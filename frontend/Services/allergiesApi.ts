import { API_BASE_URL, API_ENDPOINTS } from '@/constants';
import type { Allergy } from '@/types/diet';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Fetch allergies for a specific resident
 */
export const fetchAllergiesByResident = async (residentId: number): Promise<Allergy[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.allergiesByResident(residentId)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Allergy[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error(`Error fetching allergies for resident ${residentId}:`, error);
    throw error;
  }
};

/**
 * Fetch kitchen staff allergy overview
 * Filters: floor, allergyType, search
 */
export const fetchKitchenAllergyOverview = async (params?: {
  floor?: number;
  allergyType?: string;
  search?: string;
}): Promise<any[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.floor) queryParams.append('floor', params.floor.toString());
    if (params?.allergyType) queryParams.append('allergyType', params.allergyType);
    if (params?.search) queryParams.append('search', params.search);

    const url = `${API_BASE_URL}/allergies/kitchen-overview${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<any[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching kitchen allergy overview:', error);
    throw error;
  }
};

/**
 * Create a new allergy
 * NOTE: This should typically go through change requests
 */
export const createAllergy = async (allergyData: {
  resident_id: number;
  symptom: string;
  severity: 'Hoog' | 'Matig' | 'Laag';
  notes?: string;
}): Promise<Allergy> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.allergies}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(allergyData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Allergy> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating allergy:', error);
    throw error;
  }
};
