// API Configuration
import { Platform } from 'react-native';

// Automatically select the correct API URL based on platform
// Web (computer browser): use localhost
// Mobile (phone/tablet): use local network IP address
const getApiBaseUrl = () => {
  // For web, use localhost
  if (Platform.OS === 'web') {
    return 'http://localhost:8000/api';
  } else {
    // Change this IP if your computer's IP changes on the network
    return 'http://10.2.88.244:8000/api';
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
  // Diets
  diets: '/diets',
  dietByResident: (residentId: number) => `/diets/resident/${residentId}`,
  dietById: (id: number) => `/diets/${id}`,

  // Allergies
  allergies: '/allergies',
  allergiesByResident: (residentId: number) => `/allergies/resident/${residentId}`,
  allergyById: (id: number) => `/allergies/${id}`,

  // Change Requests
  changeRequests: '/change-requests',
  changeRequestById: (id: number) => `/change-requests/${id}`,
  approveChangeRequest: (id: number) => `/change-requests/${id}/approve`,
  rejectChangeRequest: (id: number) => `/change-requests/${id}/reject`,

  // Announcements
  announcements: '/announcements',
  announcementById: (id: number) => `/announcements/${id}`,
  userAnnouncements: (userId: number) => `/announcements/user/${userId}`,

  // Rooms operations
  linkResident: (roomId: number) => `/rooms/${roomId}/link-resident`,
  unlinkResident: (roomId: number) => `/rooms/${roomId}/unlink-resident`,
  // Audit Logs
  auditLogs: '/audit-logs',
  auditLogById: (id: number) => `/audit-logs/${id}`,
  auditLogsByEntity: (type: string, id: number) => `/audit-logs/entity/${type}/${id}`,
};
