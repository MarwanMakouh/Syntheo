// Audit Logs API Service
// NOTE: This is a placeholder implementation using mock data
// Replace with actual API calls when backend endpoint is available

import type { AuditLog } from '@/components/admin/audit-logs-table';

// Mock data - will be replaced with API call
const mockAuditLogs: AuditLog[] = [
  {
    id: 1,
    timestamp: '06-01-2026 14:32',
    user_name: 'Admin Gebruiker',
    action: 'CREATE',
    entity_type: 'Bewoner',
    details: 'Nieuwe bewoner toegevoegd: Jan Pieters',
  },
  {
    id: 2,
    timestamp: '06-01-2026 13:15',
    user_name: 'Verpleger A',
    action: 'UPDATE',
    entity_type: 'Melding',
    details: 'Melding status bijgewerkt naar afgehandeld',
  },
  {
    id: 3,
    timestamp: '06-01-2026 11:45',
    user_name: 'Admin Gebruiker',
    action: 'APPROVE',
    entity_type: 'Gebruiker',
    details: 'Nieuwe verpleger goedgekeurd: Maria Van Den Berg',
  },
  {
    id: 4,
    timestamp: '06-01-2026 10:22',
    user_name: 'Verzorger B',
    action: 'UPDATE',
    entity_type: 'Bewoner',
    details: 'Dieetplan aangepast voor bewoner',
  },
  {
    id: 5,
    timestamp: '06-01-2026 09:18',
    user_name: 'Admin Gebruiker',
    action: 'DELETE',
    entity_type: 'Gebruiker',
    details: 'Gebruiker account verwijderd: Oud Personeel',
  },
  {
    id: 6,
    timestamp: '05-01-2026 16:55',
    user_name: 'Verpleger C',
    action: 'CREATE',
    entity_type: 'Melding',
    details: 'Nieuwe melding aangemaakt voor bewoner',
  },
  {
    id: 7,
    timestamp: '05-01-2026 15:30',
    user_name: 'Admin Gebruiker',
    action: 'REJECT',
    entity_type: 'Gebruiker',
    details: 'Nieuwe gebruiker aanvraag afgekeurd',
  },
  {
    id: 8,
    timestamp: '05-01-2026 14:12',
    user_name: 'Verzorger A',
    action: 'UPDATE',
    entity_type: 'Kamer',
    details: 'Kamer 201 schoonmaakstatus bijgewerkt',
  },
  {
    id: 9,
    timestamp: '05-01-2026 12:45',
    user_name: 'Hoofdverpleegster',
    action: 'CREATE',
    entity_type: 'Medicatie',
    details: 'Nieuwe medicatie toegevoegd aan bewoner',
  },
  {
    id: 10,
    timestamp: '05-01-2026 11:20',
    user_name: 'Verpleger B',
    action: 'UPDATE',
    entity_type: 'Bewoner',
    details: 'Contactinformatie bijgewerkt voor familie',
  },
];

/**
 * Fetch all audit logs
 *
 * TODO: Replace with actual API call when backend endpoint is available:
 * const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auditLogs}`);
 * return await response.json();
 */
export const fetchAuditLogs = async (): Promise<AuditLog[]> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return mock data
    return mockAuditLogs;
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
};
