import { API_BASE_URL, API_ENDPOINTS } from '@/constants';
import type { ChangeRequest, CreateChangeRequestData, ChangeField } from '@/types/changeRequest';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Normalize various status values (English / Dutch / capitalized variants)
function normalizeStatus(raw?: string): 'pending' | 'approved' | 'rejected' {
  const s = (raw ?? '').toString().toLowerCase().trim();
  if (!s) return 'pending';
  // Approved variants
  if (['approved', 'goedgekeurd', 'goedkeurd'].includes(s)) return 'approved';
  // Rejected variants
  if (['rejected', 'afgewezen'].includes(s)) return 'rejected';
  // Pending / waiting variants
  if (['pending', 'in afwachting', 'in_afwachting', 'inafwachting', 'open'].includes(s)) return 'pending';
  // Fallback: try to detect keywords
  if (s.includes('goed')) return 'approved';
  if (s.includes('afge')) return 'rejected';
  return 'pending';
}

// Transform snake_case API response to camelCase for frontend
function transformChangeRequest(data: any): ChangeRequest {
  return {
    ...data,
    status: normalizeStatus(data.status),
    changeFields: data.change_fields || data.changeFields || [],
  } as ChangeRequest;
}

function transformChangeRequests(data: any[]): ChangeRequest[] {
  return data.map(transformChangeRequest);
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

    const result: ApiResponse<any> = await response.json();
    return transformChangeRequest(result.data);
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

    const result: ApiResponse<any[]> = await response.json();
    return transformChangeRequests(result.data || []);
  } catch (error) {
    console.error('Error fetching change requests:', error);
    throw error;
  }
};

/**
 * Approve a change request
 */
export const approveChangeRequest = async (
  requestId: number,
  reviewerId: number
): Promise<ChangeRequest> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.approveChangeRequest(requestId)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ reviewer_id: reviewerId }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<any> = await response.json();
    return transformChangeRequest(result.data);
  } catch (error) {
    console.error(`Error approving change request ${requestId}:`, error);
    throw error;
  }
};

/**
 * Reject a change request
 */
export const rejectChangeRequest = async (
  requestId: number,
  reviewerId: number
): Promise<ChangeRequest> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.rejectChangeRequest(requestId)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ reviewer_id: reviewerId }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<any> = await response.json();
    return transformChangeRequest(result.data);
  } catch (error) {
    console.error(`Error rejecting change request ${requestId}:`, error);
    throw error;
  }
};
