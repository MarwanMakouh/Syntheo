// API Configuration
export const API_BASE_URL = 'http://localhost:8000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Notes
  notes: '/notes',
  noteById: (id: number) => `/notes/${id}`,
  notesByResident: (residentId: number) => `/notes/resident/${residentId}`,
  resolveNote: (id: number) => `/notes/${id}/resolve`,
  unresolveNote: (id: number) => `/notes/${id}/unresolve`,

  // Residents
  residents: '/residents',
  residentById: (id: number) => `/residents/${id}`,

  // Users
  users: '/users',
  userById: (id: number) => `/users/${id}`,

  // Medication Rounds
  medicationRounds: '/medication-rounds',
  medicationRoundById: (id: number) => `/medication-rounds/${id}`,

  // Resident Medications
  resMedications: '/res-medications',
  resMedicationsByResident: (residentId: number) => `/res-medications/resident/${residentId}`,
};
