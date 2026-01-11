// Medication Library API Service
import { API_BASE_URL, API_ENDPOINTS } from '@/constants';
import type { MedicationLibrary } from '@/types/medication';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Fetch all medications from the library
 */
export const fetchMedicationLibrary = async (): Promise<MedicationLibrary[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.medicationLibrary}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<MedicationLibrary[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching medication library:', error);
    throw error;
  }
};

/**
 * Fetch medications from the library filtered by category
 */
export const fetchMedicationLibraryByCategory = async (
  category: string
): Promise<MedicationLibrary[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.medicationLibrary}?category=${encodeURIComponent(category)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<MedicationLibrary[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error(`Error fetching medication library for category ${category}:`, error);
    throw error;
  }
};

/**
 * Search medications in the library by name or other fields
 */
export const searchMedicationLibrary = async (
  searchTerm: string
): Promise<MedicationLibrary[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.medicationLibrary}?search=${encodeURIComponent(searchTerm)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<MedicationLibrary[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error(`Error searching medication library for "${searchTerm}":`, error);
    throw error;
  }
};

/**
 * Fetch a specific medication by ID
 */
export const fetchMedicationLibraryById = async (
  medicationId: number
): Promise<MedicationLibrary> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.medicationLibraryById(medicationId)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<MedicationLibrary> = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error fetching medication ${medicationId}:`, error);
    throw error;
  }
};
