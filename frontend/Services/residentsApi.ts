// Residents API Service
import { API_BASE_URL, API_ENDPOINTS } from '@/constants';
import type { Resident } from '@/types/resident';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Fetch all residents from the backend
 */
export const fetchResidents = async (): Promise<Resident[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.residents}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Resident[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching residents:', error);
    throw error;
  }
};

/**
 * Fetch a specific resident by ID
 */
export const fetchResidentById = async (id: number): Promise<Resident> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.residentById(id)}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Resident> = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error fetching resident ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new resident
 */
export const createResident = async (residentData: {
  name: string;
  date_of_birth: string;
  photo_url?: string;
  allergies?: Array<{ symptom: string; severity?: string }>;
}): Promise<Resident> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.residents}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(residentData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Resident> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating resident:', error);
    throw error;
  }
};

/**
 * Update an existing resident
 */
export const updateResident = async (
  residentId: number,
  residentData: Partial<Resident>
): Promise<Resident> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.residentById(residentId)}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(residentData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Resident> = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error updating resident ${residentId}:`, error);
    throw error;
  }
};

/**
 * Delete a resident
 */
export const deleteResident = async (residentId: number): Promise<void> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.residentById(residentId)}`,
      {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error deleting resident ${residentId}:`, error);
    throw error;
  }
};

/**
 * Fetch residents with medications for a specific dagdeel
 */
export const fetchResidentsWithMedicationForDagdeel = async (dagdeel: string): Promise<any[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/residents/medication-dagdeel?dagdeel=${encodeURIComponent(dagdeel)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<any[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error(`Error fetching residents with medication for dagdeel ${dagdeel}:`, error);
    throw error;
  }
};
