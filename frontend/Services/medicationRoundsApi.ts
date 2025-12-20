// Medication Rounds API Service
import { API_BASE_URL, API_ENDPOINTS } from '@/constants';
import type { MedicationRound } from '@/types/medication';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Fetch all medication rounds
 */
export const fetchMedicationRounds = async (): Promise<MedicationRound[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.medicationRounds}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<MedicationRound[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching medication rounds:', error);
    throw error;
  }
};

/**
 * Fetch a specific medication round by ID
 */
export const fetchMedicationRoundById = async (id: number): Promise<MedicationRound> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.medicationRoundById(id)}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<MedicationRound> = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error fetching medication round ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new medication round
 */
export const createMedicationRound = async (roundData: {
  res_medication_id: number;
  schedule_id: number;
  status: string;
  notes?: string;
  given_by?: number;
  given_at?: string;
}): Promise<MedicationRound> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.medicationRounds}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(roundData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<MedicationRound> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating medication round:', error);
    throw error;
  }
};

/**
 * Update an existing medication round
 */
export const updateMedicationRound = async (
  roundId: number,
  roundData: Partial<MedicationRound>
): Promise<MedicationRound> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.medicationRoundById(roundId)}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(roundData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<MedicationRound> = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error updating medication round ${roundId}:`, error);
    throw error;
  }
};

/**
 * Delete a medication round
 */
export const deleteMedicationRound = async (roundId: number): Promise<void> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.medicationRoundById(roundId)}`,
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
    console.error(`Error deleting medication round ${roundId}:`, error);
    throw error;
  }
};
