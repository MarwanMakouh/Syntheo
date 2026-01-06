import { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { AdminLayout } from '@/components/admin';
import { AuditLogsFilters } from '@/components/admin/audit-logs-filters';
import { AuditLogsTable, type AuditLog } from '@/components/admin/audit-logs-table';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Layout } from '@/constants';

// Dummy audit logs data
const auditLogs: AuditLog[] = [
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
];

export default function DashboardAuditLogsScreen() {
  const [actionFilter, setActionFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // Filter audit logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      // Action filter
      const matchesAction = actionFilter === 'all' || log.action === actionFilter;

      // User filter (for now just "all" - can be enhanced with user dropdown)
      const matchesUser = userFilter === 'all';

      // Date filter (basic - matches start of timestamp)
      const matchesDate = dateFilter === '' || log.timestamp.startsWith(dateFilter);

      return matchesAction && matchesUser && matchesDate;
    });
  }, [actionFilter, userFilter, dateFilter]);

  const handleExport = () => {
    Alert.alert('Exporteren', 'Audit logs exporteren naar CSV of Excel');
  };

  return (
    <AdminLayout activeRoute="audit-logs">
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.titleContainer}>
                <MaterialIcons name="history" size={32} color={Colors.primary} />
                <Text style={styles.pageTitle}>Audit Trail</Text>
              </View>
              <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
                <MaterialIcons name="download" size={20} color={Colors.background} />
                <Text style={styles.exportButtonText}>Exporteren</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.breadcrumb}>Home / Audit Trail</Text>
          </View>

          {/* Filters */}
          <AuditLogsFilters
            actionFilter={actionFilter}
            userFilter={userFilter}
            dateFilter={dateFilter}
            onActionFilterChange={setActionFilter}
            onUserFilterChange={setUserFilter}
            onDateFilterChange={setDateFilter}
          />

          {/* Audit Logs Table */}
          <AuditLogsTable logs={filteredLogs} />
        </View>
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  content: {
    padding: Layout.screenPaddingLarge,
    ...Platform.select({
      web: {
        maxWidth: 1400,
        alignSelf: 'center',
        width: '100%',
      },
    }),
  },
  header: {
    marginBottom: Spacing['2xl'],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  pageTitle: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  breadcrumb: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  exportButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.background,
  },
});
