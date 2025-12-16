export interface Diet {
  diet_id: number;
  diet_type: string;
  resident_id: number;
  description: string;
  created_at: string;
  preferences?: {
    likes?: string[];
    dislikes?: string[];
  };
}

export interface Allergy {
  allergy_id: number;
  resident_id: number;
  symptom: string;
  severity: 'Hoog' | 'Matig' | 'Laag';
  notes?: string;
  created_at: string;
}
