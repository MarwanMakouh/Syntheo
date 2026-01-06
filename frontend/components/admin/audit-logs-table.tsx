import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { ActionBadge } from './action-badge';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/constants';

export interface AuditLog {
  id: number;
  timestamp: string;
  user_name: string;
  action: string;
  entity_type: string;
  details: string;
}

interface AuditLogsTableProps {
  logs: AuditLog[];
}

export function AuditLogsTable({ logs }: AuditLogsTableProps) {
  return (
    <View style={styles.tableContainer}>
      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.timestampColumn]}>Tijdstip</Text>
        <Text style={[styles.headerCell, styles.userColumn]}>Gebruiker</Text>
        <Text style={[styles.headerCell, styles.actionColumn]}>Actie</Text>
        <Text style={[styles.headerCell, styles.typeColumn]}>Type</Text>
        <Text style={[styles.headerCell, styles.detailsColumn]}>Details</Text>
      </View>

      {/* Table Body */}
      <ScrollView style={styles.tableBody}>
        {logs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Geen audit logs gevonden</Text>
            <Text style={styles.emptySubtext}>
              Probeer je filters aan te passen
            </Text>
          </View>
        ) : (
          logs.map((log) => (
            <View key={log.id} style={styles.tableRow}>
              <Text style={[styles.cell, styles.timestampColumn]}>{log.timestamp}</Text>
              <Text style={[styles.cell, styles.userColumn]}>{log.user_name}</Text>
              <View style={[styles.cell, styles.actionColumn]}>
                <ActionBadge action={log.action} />
              </View>
              <Text style={[styles.cell, styles.typeColumn]}>{log.entity_type}</Text>
              <Text style={[styles.cell, styles.detailsColumn]}>{log.details}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tableContainer: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundSecondary,
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  headerCell: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  tableBody: {
    maxHeight: 600,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  cell: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  timestampColumn: {
    width: '18%',
  },
  userColumn: {
    width: '20%',
  },
  actionColumn: {
    width: '15%',
  },
  typeColumn: {
    width: '17%',
  },
  detailsColumn: {
    width: '30%',
  },
  emptyState: {
    padding: Spacing['4xl'],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  emptyText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
