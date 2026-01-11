// Resident Medication Schedules API Service
import { API_BASE_URL, API_ENDPOINTS } from '@/constants';
import type { ResSchedule, CreateScheduleData } from '@/types/medication';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Fetch all schedules for a specific resident medication
 */
export const fetchSchedulesByResMedication = async (
  resMedicationId: number
): Promise<ResSchedule[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.resSchedulesByResMedication(resMedicationId)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<ResSchedule[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error(`Error fetching schedules for medication ${resMedicationId}:`, error);
    throw error;
  }
};

/**
 * Create a new medication schedule
 */
export const createResSchedule = async (
  scheduleData: CreateScheduleData
): Promise<ResSchedule> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.resSchedules}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(scheduleData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<ResSchedule> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating resident schedule:', error);
    throw error;
  }
};

/**
 * Update an existing medication schedule
 */
export const updateResSchedule = async (
  scheduleId: number,
  scheduleData: Partial<ResSchedule>
): Promise<ResSchedule> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.resScheduleById(scheduleId)}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(scheduleData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<ResSchedule> = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error updating schedule ${scheduleId}:`, error);
    throw error;
  }
};

/**
 * Delete a medication schedule
 */
export const deleteResSchedule = async (scheduleId: number): Promise<void> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.resScheduleById(scheduleId)}`,
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
    console.error(`Error deleting schedule ${scheduleId}:`, error);
    throw error;
  }
};
