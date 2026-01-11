// Resident Medications API Service
import { API_BASE_URL, API_ENDPOINTS } from '@/constants';
import type { ResMedication } from '@/types/medication';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Fetch all medications for a specific resident
 * This includes the medication details and schedules
 */
export const fetchResMedicationsByResident = async (residentId: number): Promise<any[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.resMedicationsByResident(residentId)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<any[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error(`Error fetching medications for resident ${residentId}:`, error);
    throw error;
  }
};

/**
 * Create a new resident medication
 */
export const createResMedication = async (medicationData: {
  medication_id: number;
  resident_id: number;
  is_active?: boolean;
  end_date?: string | null;
}): Promise<ResMedication> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.resMedications}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(medicationData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<ResMedication> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating resident medication:', error);
    throw error;
  }
};

/**
 * Update an existing resident medication
 */
export const updateResMedication = async (
  resMedicationId: number,
  medicationData: Partial<ResMedication>
): Promise<ResMedication> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/res-medications/${resMedicationId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(medicationData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<ResMedication> = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error updating resident medication ${resMedicationId}:`, error);
    throw error;
  }
};

/**
 * Deactivate a resident medication
 */
export const deactivateResMedication = async (resMedicationId: number): Promise<ResMedication> => {
  const url = `${API_BASE_URL}/res-medications/${resMedicationId}/deactivate`;
  console.log('[deactivateResMedication] Starting...', { resMedicationId, url });
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('[deactivateResMedication] Response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.log('[deactivateResMedication] Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<ResMedication> = await response.json();
    console.log('[deactivateResMedication] Success:', result);
    return result.data;
  } catch (error) {
    console.error(`[deactivateResMedication] Error:`, error);
    throw error;
  }
};

/**
 * Activate a resident medication
 */
export const activateResMedication = async (resMedicationId: number): Promise<ResMedication> => {
  const url = `${API_BASE_URL}/res-medications/${resMedicationId}/activate`;
  console.log('[activateResMedication] Starting...', { resMedicationId, url });
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('[activateResMedication] Response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.log('[activateResMedication] Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<ResMedication> = await response.json();
    console.log('[activateResMedication] Success:', result);
    return result.data;
  } catch (error) {
    console.error(`[activateResMedication] Error:`, error);
    throw error;
  }
};
