export interface Resident {
  resident_id: number;
  name: string;
  date_of_birth: string;
  photo_url: string;
  created_at: string;
  updated_at: string;
}

export interface Room {
  room_id: number;
  floor_id: number;
  resident_id: number | null;
  room_number: string;
}
