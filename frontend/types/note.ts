export interface Note {
  note_id: number;
  resident_id: number;
  author_id: number;
  category: string;
  urgency: 'Hoog' | 'Matig' | 'Laag';
  content: string;
  is_resolved: boolean;
  created_at: string;
  resolved_at: string | null;
  resolved_by: number | null;
}
