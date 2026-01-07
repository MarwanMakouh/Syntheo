import { useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { AdminLayout } from '@/components/admin';
import { AuditLogsFilters } from '@/components/admin/audit-logs-filters';
import { AuditLogsTable, type AuditLog } from '@/components/admin/audit-logs-table';
import { fetchAuditLogs } from '@/Services/auditLogsApi';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Layout } from '@/constants';

export default function DashboardAuditLogsScreen() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionFilter, setActionFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [totalPages, setTotalPages] = useState(1);

  // Load data from API
  useEffect(() => {
    loadData();
  }, [actionFilter, userFilter, dateFilter, page, perPage]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const opts: any = { page, per_page: perPage };
      if (actionFilter && actionFilter !== 'all') opts.action = actionFilter;
      if (userFilter && userFilter !== 'all') opts.user_id = userFilter;
      if (dateFilter) opts.date_from = dateFilter; // simple

      const { items, meta } = await fetchAuditLogs(opts);
      setAuditLogs(items);
      setTotalPages(meta.last_page ?? 1);
    } catch (err) {
      setError('Fout bij het laden van audit logs');
      console.error('Error loading audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter audit logs
  const filteredLogs = auditLogs; // server-side filtering applied

  return (
    <AdminLayout activeRoute="audit-logs">
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <MaterialIcons name="history" size={32} color={Colors.primary} />
              <Text style={styles.pageTitle}>Audit Trail</Text>
            </View>
            <Text style={styles.breadcrumb}>Home / Audit Trail</Text>
          </View>

          {/* Loading State */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Audit logs laden...</Text>
            </View>
          ) : error ? (
            /* Error State */
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={64} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadData}>
                <Text style={styles.retryButtonText}>Opnieuw proberen</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
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

              {/* Pagination controls */}
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16, gap: 8 }}>
                <TouchableOpacity
                  onPress={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  style={{ padding: 8, backgroundColor: page <= 1 ? '#eee' : Colors.primary, borderRadius: 6 }}
                >
                  <Text style={{ color: page <= 1 ? Colors.textSecondary : Colors.background }}>Vorige</Text>
                </TouchableOpacity>

                <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 }}>
                  <Text style={{ color: Colors.textPrimary }}>{`Pagina ${page} / ${totalPages}`}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  style={{ padding: 8, backgroundColor: page >= totalPages ? '#eee' : Colors.primary, borderRadius: 6 }}
                >
                  <Text style={{ color: page >= totalPages ? Colors.textSecondary : Colors.background }}>Volgende</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xs,
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['4xl'],
    minHeight: 400,
  },
  loadingText: {
    marginTop: Spacing.lg,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['4xl'],
    minHeight: 400,
  },
  errorText: {
    marginTop: Spacing.lg,
    fontSize: FontSize.lg,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
  },
  retryButtonText: {
    color: Colors.background,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
});
