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
