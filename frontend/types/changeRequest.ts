export interface ChangeRequest {
  request_id: number;
  resident_id: number;
  requester_id: number;
  reviewer_id: number | null;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  reviewed_at: string | null;
  changeFields?: ChangeField[];
}

export interface ChangeField {
  field_id: number;
  request_id: number;
  field_name: string;
  old: string | null;
  new: string;
}

export interface CreateChangeRequestData {
  resident_id: number;
  requester_id: number;
  urgency: 'low' | 'medium' | 'high';
  fields: Array<{
    field_name: string;
    old: string | null;
    new: string;
  }>;
}
