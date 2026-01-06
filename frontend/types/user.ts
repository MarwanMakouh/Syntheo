export type UserRole = 'Verpleegster' | 'Hoofdverpleegster' | 'Beheerder' | 'Keukenpersoneel';

export interface User {
  user_id: number;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  floor_id: number;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface RoleOption {
  id: UserRole;
  title: string;
  description: string;
  icon: string;
}
