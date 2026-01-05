// API Configuration
import { Platform } from 'react-native';

// Automatically select the correct API URL based on platform
// Web (computer browser): use localhost
// Mobile (phone/tablet): use local network IP address
const getApiBaseUrl = () => {
  if (Platform.OS === 'web') {
    // For web/computer, use localhost
    return 'http://localhost:8000/api';
  } else {
    // For mobile devices, use your computer's local IP address
    return 'http://192.168.1.26:8000/api';
  }
};

export const API_BASE_URL = getApiBaseUrl();

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

  // Rooms
  rooms: '/rooms',
  roomById: (id: number) => `/rooms/${id}`,
};
