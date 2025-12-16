export interface MedicationLibrary {
  medication_id: number;
  name: string;
  category: string;
  generic_name?: string;
  dosage_form?: string;
  strength?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ResMedication {
  res_medication_id: number;
  medication_id: number;
  resident_id: number;
  is_active: boolean;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResSchedule {
  schedule_id: number;
  res_medication_id: number;
  dosage: string;
  instructions: string;
  time_of_day: string;
  day_of_week: string | null;
}

export interface MedicationRound {
  round_id: number;
  res_medication_id: number;
  schedule_id: number;
  resident_id?: number;
  scheduled_time?: string;
  given_at: string | null;
  given_by: number | null;
  status: string;
  notes: string | null;
}
