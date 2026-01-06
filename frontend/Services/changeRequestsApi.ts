import { API_BASE_URL, API_ENDPOINTS } from '@/constants';
import type { ChangeRequest, CreateChangeRequestData } from '@/types/changeRequest';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Create a new change request
 */
export const createChangeRequest = async (
  data: CreateChangeRequestData
): Promise<ChangeRequest> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.changeRequests}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<ChangeRequest> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating change request:', error);
    throw error;
  }
};

/**
 * Fetch all change requests with optional filters
 */
export const fetchChangeRequests = async (filters?: {
  status?: string;
  resident_id?: number;
  urgency?: string;
}): Promise<ChangeRequest[]> => {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.resident_id) params.append('resident_id', filters.resident_id.toString());
    if (filters?.urgency) params.append('urgency', filters.urgency);

    const url = `${API_BASE_URL}${API_ENDPOINTS.changeRequests}${params.toString() ? '?' + params.toString() : ''}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<ChangeRequest[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching change requests:', error);
    throw error;
  }
};
