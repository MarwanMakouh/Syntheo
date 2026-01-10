// Medication Rounds API Service
import { API_BASE_URL, API_ENDPOINTS } from '@/constants';
import type { MedicationRound } from '@/types/medication';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Fetch all medication rounds with optional filters
 */
export const fetchMedicationRounds = async (filters?: {
  resident_id?: number;
  status?: string;
  date_from?: string;
  date_to?: string;
}): Promise<MedicationRound[]> => {
  try {
    const params = new URLSearchParams();

    if (filters?.resident_id) params.append('resident_id', filters.resident_id.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.date_from) params.append('date_from', filters.date_from);
    if (filters?.date_to) params.append('date_to', filters.date_to);

    const url = `${API_BASE_URL}${API_ENDPOINTS.medicationRounds}${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<MedicationRound[]> = await response.json();
    const data = result.data || [];

    // Normalize status values from backend to Dutch for the frontend
    const statusMap: Record<string, string> = {
      given: 'Gegeven',
      missed: 'Gemist',
      refused: 'Geweigerd',
      delayed: 'Vertraagd',
      // already localized values passthrough
      Gegeven: 'Gegeven',
      Gemist: 'Gemist',
      Geweigerd: 'Geweigerd',
      Vertraagd: 'Vertraagd',
    };

    return data.map((r: MedicationRound) => ({
      ...r,
      status: statusMap[(r.status || '').toString()] || r.status,
    }));
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

/**
 * Bulk create medication rounds for a resident
 */
export const saveMedicationRoundsBulk = async (data: {
  resident_id: number;
  given_by: number;
  medications: Array<{
    schedule_id: number;
    res_medication_id: number;
    status: 'given' | 'missed' | 'refused' | 'delayed';
    notes?: string;
  }>;
}): Promise<MedicationRound[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/medication-rounds/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<MedicationRound[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error saving medication rounds (bulk):', error);
    throw error;
  }
};

/**
 * Get medication compliance statistics per dagdeel for a specific date
 */
export const fetchComplianceByDagdeel = async (date?: string): Promise<Array<{
  dagdeel: string;
  total: number;
  completed: number;
  percentage: number;
}>> => {
  try {
    const params = new URLSearchParams();
    if (date) params.append('date', date);

    const url = `${API_BASE_URL}/medication-rounds/compliance-by-dagdeel${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Array<{
      dagdeel: string;
      total: number;
      completed: number;
      percentage: number;
    }>> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching compliance by dagdeel:', error);
    throw error;
  }
};
