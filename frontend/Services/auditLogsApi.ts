// Audit Logs API Service
// NOTE: This is a placeholder implementation using mock data
// Replace with actual API calls when backend endpoint is available

import type { AuditLog } from '@/components/admin/audit-logs-table';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants/apiConfig';

const mapBackendToFrontend = (item: any): AuditLog => {
  const id = item.id;
  const timestamp = item.created_at ?? item.timestamp ?? '';
  const user_name = item.user?.name ?? item.user_name ?? (item.user_id ? `#${item.user_id}` : 'Systeem');

  // entity_type: prefer the human-friendly display name from backend
  let entity_type = item.entity_type ?? item.auditable_type ?? '';
  // If it's still a fully qualified class name, extract the basename
  if (entity_type && entity_type.includes('\\')) {
    entity_type = entity_type.split('\\').pop() ?? entity_type;
  }

  // details: prefer a readable message, fall back to JSON of new_values
  let details = item.details ?? '';
  if (!details) {
    if (item.new_values) {
      try {
        details = JSON.stringify(item.new_values);
      } catch (e) {
        details = String(item.new_values);
      }
    } else if (item.old_values) {
      try {
        details = JSON.stringify(item.old_values);
      } catch (e) {
        details = String(item.old_values);
      }
    } else {
      details = `${item.action ?? ''} ${entity_type ?? ''}`.trim();
    }
  }

  return {
    id,
    timestamp,
    user_name,
    action: (item.action ?? '').toString().toUpperCase(),
    entity_type,
    details,
  };
};

export interface FetchAuditLogsOptions {
  page?: number;
  per_page?: number;
  action?: string;
  user_id?: number | string;
  entity_type?: string;
  entity_id?: number | string;
  date_from?: string;
  date_to?: string;
}

export const fetchAuditLogs = async (opts: FetchAuditLogsOptions = {}): Promise<{ items: AuditLog[]; meta: any }> => {
  try {
    const params = new URLSearchParams();
    if (opts.page) params.append('page', String(opts.page));
    if (opts.per_page) params.append('per_page', String(opts.per_page));
    if (opts.action) params.append('action', String(opts.action));
    if (opts.user_id) params.append('user_id', String(opts.user_id));
    if (opts.entity_type) params.append('auditable_type', String(opts.entity_type));
    if (opts.entity_id) params.append('auditable_id', String(opts.entity_id));
    if (opts.date_from) params.append('date_from', String(opts.date_from));
    if (opts.date_to) params.append('date_to', String(opts.date_to));

    const url = `${API_BASE_URL}${API_ENDPOINTS.auditLogs}${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const json = await res.json();

    // Detect paginated response
    const rawItems = Array.isArray(json) ? json : json.data ?? json.data?.data ?? json.data ?? [];

    const items = rawItems.map(mapBackendToFrontend);

    // meta from paginator
    const meta = {
      current_page: json.current_page ?? json.meta?.current_page ?? 1,
      last_page: json.last_page ?? json.meta?.last_page ?? 1,
      per_page: json.per_page ?? json.meta?.per_page ?? opts.per_page ?? 25,
      total: json.total ?? json.meta?.total ?? items.length,
    };

    return { items, meta };
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
};
