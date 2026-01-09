import { useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { AdminLayout } from '@/components/admin';
import { RoleGuard } from '@/components';
import { StatsCard } from '@/components/admin/stats-card';
import { fetchResidents } from '@/Services/residentsApi';
import { fetchUsers } from '@/Services';
import { fetchChangeRequests, approveChangeRequest, rejectChangeRequest } from '@/Services/changeRequestsApi';
import type { ChangeRequest } from '@/types/changeRequest';
import type { Resident } from '@/types/resident';
import type { User } from '@/types/user';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Layout } from '@/constants';

export default function DashboardWijzigingsverzoekenScreen() {
  const router = useRouter();
  const [requests, setRequests] = useState<ChangeRequest[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [reqData, residentsData, usersData] = await Promise.all([
        fetchChangeRequests(),
        fetchResidents(),
        fetchUsers(),
      ]);
      console.log('Loaded change requests:', reqData.map(r => ({ id: r.request_id, status: r.status })));
      setRequests(reqData);
      setResidents(residentsData);
      setUsers(usersData);
    } catch (err) {
      console.error('Error loading change requests:', err);
      setError('Fout bij het laden van wijzigingsverzoeken');
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter(r => r.status === 'pending').length;
    const approved = requests.filter(r => r.status === 'approved').length;
    const rejected = requests.filter(r => r.status === 'rejected').length;
    return { total, pending, approved, rejected };
  }, [requests]);

  const filteredRequests = useMemo(() => {
    let filtered = requests;

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(r => r.status === selectedStatus);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r => {
        const residentName = getResidentName(r.resident_id).toLowerCase();
        const requestId = r.request_id.toString();
        return residentName.includes(query) || requestId.includes(query);
      });
    }

    return filtered;
  }, [requests, searchQuery, selectedStatus]);

  const handleView = (requestId: number) => {
    const req = requests.find(r => r.request_id === requestId);
    if (!req) return;
    router.push(`/(tabs)/bewoners/${req.resident_id}` as any);
  };

  const handleApprove = async (requestId: number) => {
    try {
      // quick API call; reviewer id omitted (server may accept default)
      await approveChangeRequest(requestId, users[0]?.user_id ?? 0);
      await loadData();
      Alert.alert('Succes', 'Wijzigingsverzoek goedgekeurd');
    } catch (err) {
      console.error('Error approving change request:', err);
      Alert.alert('Fout', 'Kon wijzigingsverzoek niet goedkeuren');
    }
  };

  const handleReject = async (requestId: number) => {
    try {
      await rejectChangeRequest(requestId, users[0]?.user_id ?? 0);
      await loadData();
      Alert.alert('Succes', 'Wijzigingsverzoek afgewezen');
    } catch (err) {
      console.error('Error rejecting change request:', err);
      Alert.alert('Fout', 'Kon wijzigingsverzoek niet afwijzen');
    }
  };

  const getResidentName = (residentId?: number) => {
    return residents.find(r => r.resident_id === residentId)?.name || 'Onbekend';
  };

  return (
    <RoleGuard allowedRoles={['Beheerder']}>
      <AdminLayout activeRoute="wijzigingsverzoeken">
        <ScrollView style={styles.container}>
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <MaterialIcons name="edit" size={32} color={Colors.primary} />
                <Text style={styles.pageTitle}>Wijzigingsverzoeken</Text>
              </View>
              <Text style={styles.breadcrumb}>Home / Wijzigingsverzoeken</Text>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Wijzigingsverzoeken laden...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={64} color={Colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : (
              <>
                <View style={styles.filterSection}>
                  <View style={styles.searchContainer}>
                    <MaterialIcons name="search" size={24} color={Colors.textSecondary} />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Zoeken op naam of verzoek #..."
                      placeholderTextColor={Colors.textSecondary}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                    {searchQuery ? (
                      <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <MaterialIcons name="close" size={24} color={Colors.textSecondary} />
                      </TouchableOpacity>
                    ) : null}
                  </View>

                  <View style={styles.statusFilters}>
                    <TouchableOpacity
                      style={[styles.statusButton, selectedStatus === 'all' && styles.statusButtonActive]}
                      onPress={() => setSelectedStatus('all')}
                    >
                      <Text style={[styles.statusButtonText, selectedStatus === 'all' && styles.statusButtonTextActive]}>
                        Alles ({stats.total})
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.statusButton, selectedStatus === 'pending' && styles.statusButtonActive]}
                      onPress={() => setSelectedStatus('pending')}
                    >
                      <Text style={[styles.statusButtonText, selectedStatus === 'pending' && styles.statusButtonTextActive]}>
                        In afwachting ({stats.pending})
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.statusButton, selectedStatus === 'approved' && styles.statusButtonActive]}
                      onPress={() => setSelectedStatus('approved')}
                    >
                      <Text style={[styles.statusButtonText, selectedStatus === 'approved' && styles.statusButtonTextActive]}>
                        Goedgekeurd ({stats.approved})
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.statusButton, selectedStatus === 'rejected' && styles.statusButtonActive]}
                      onPress={() => setSelectedStatus('rejected')}
                    >
                      <Text style={[styles.statusButtonText, selectedStatus === 'rejected' && styles.statusButtonTextActive]}>
                        Afgewezen ({stats.rejected})
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.list}>
                  {filteredRequests.length === 0 ? (
                    <View style={styles.emptyState}>
                      <MaterialIcons name="edit-off" size={64} color={Colors.textSecondary} />
                      <Text style={styles.emptyText}>
                        {searchQuery || selectedStatus !== 'all' ? 'Geen overeenkomstige verzoeken gevonden' : 'Geen wijzigingsverzoeken gevonden'}
                      </Text>
                    </View>
                  ) : (
                    filteredRequests.map((r) => (
                      <View key={r.request_id} style={styles.requestCard}>
                        <View style={styles.requestHeader}>
                          <Text style={styles.requestTitle}>Verzoek #{r.request_id} — {getResidentName(r.resident_id)}</Text>
                          <View style={styles.requestMetaRow}>
                            <Text style={[
                              r.urgency && r.urgency.toString().toLowerCase().includes('hoog') ? styles.urgencyHighText : r.urgency && (r.urgency.toString().toLowerCase().includes('matig') || r.urgency.toString().toLowerCase().includes('medium')) ? styles.urgencyMediumText : styles.urgencyLowText,
                              { fontSize: FontSize.sm, fontWeight: FontWeight.semibold }
                            ]}>
                              {r.urgency === 'high' ? 'Hoog' : r.urgency === 'medium' ? 'Matig' : r.urgency === 'low' ? 'Laag' : r.urgency}
                            </Text>
                            <Text style={styles.requestMetaSeparator}>•</Text>
                            <View style={[
                              styles.statusBadge,
                              r.status === 'approved' ? styles.statusApproved : r.status === 'rejected' ? styles.statusRejected : styles.statusPending,
                            ]}>
                              <Text style={styles.statusBadgeText}>
                                {r.status === 'approved' ? 'Goedgekeurd' : r.status === 'rejected' ? 'Afgewezen' : 'In afwachting'}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View style={styles.requestBody}>
                          {r.changeFields?.map((f) => (
                            <View key={f.field_id} style={styles.fieldRow}>
                              <Text style={styles.fieldName}>{f.field_name}</Text>
                              <Text style={styles.fieldOld}>Oud: {f.old ?? '—'}</Text>
                              <Text style={styles.fieldNew}>Nieuw: {f.new}</Text>
                            </View>
                          ))}
                        </View>
                        <View style={styles.requestActions}>
                          <TouchableOpacity style={styles.viewButton} onPress={() => handleView(r.request_id)}>
                            <Text style={styles.viewButtonText}>Bekijk</Text>
                          </TouchableOpacity>
                          {r.status === 'pending' && (
                            <>
                              <TouchableOpacity style={styles.approveButton} onPress={() => handleApprove(r.request_id)}>
                                <Text style={styles.approveButtonText}>Goedkeuren</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(r.request_id)}>
                                <Text style={styles.rejectButtonText}>Afwijzen</Text>
                              </TouchableOpacity>
                            </>
                          )}
                        </View>
                      </View>
                    ))
                  )}
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </AdminLayout>
    </RoleGuard>
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
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing['2xl'],
    flexWrap: 'wrap',
  },
  filterSection: {
    marginBottom: Spacing['2xl'],
    gap: Spacing.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  statusFilters: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  statusButton: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  statusButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  statusButtonTextActive: {
    color: Colors.background,
  },
  list: {
    gap: Spacing.lg,
  },
  metaRight: {
    alignItems: 'flex-end',
  },
  requestMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  requestMetaSeparator: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginHorizontal: Spacing.xs,
  },
  requestUrgency: { fontSize: FontSize.xs, color: Colors.textSecondary, marginBottom: Spacing.xs },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  statusBadgeText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.background,
  },
  statusApproved: {
    backgroundColor: '#2ECC71',
  },
  statusRejected: {
    backgroundColor: '#E74C3C',
  },
  statusPending: {
    backgroundColor: '#F1C40F',
  },
  urgencyBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
  },
  urgencyText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.background,
  },
  urgencyHigh: {
    backgroundColor: '#E74C3C',
  },
  urgencyMedium: {
    backgroundColor: '#F39C12',
  },
  urgencyLow: {
    backgroundColor: '#27AE60',
  },
  urgencyHighText: {
    color: '#E74C3C',
  },
  urgencyMediumText: {
    color: '#F39C12',
  },
  urgencyLowText: {
    color: '#27AE60',
  },
  requestCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  requestHeader: { marginBottom: Spacing.sm },
  requestTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  requestMeta: { fontSize: FontSize.sm, color: Colors.textSecondary },
  requestBody: { marginTop: Spacing.sm, marginBottom: Spacing.sm },
  fieldRow: { marginBottom: Spacing.xs },
  fieldName: { fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  fieldOld: { color: Colors.textSecondary },
  fieldNew: { color: Colors.textPrimary },
  requestActions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  viewButton: { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.sm },
  viewButtonText: { color: Colors.primary },
  approveButton: { backgroundColor: '#2ECC71', paddingVertical: Spacing.xs, paddingHorizontal: Spacing.sm, borderRadius: BorderRadius.sm },
  approveButtonText: { color: Colors.background },
  rejectButton: { backgroundColor: '#E74C3C', paddingVertical: Spacing.xs, paddingHorizontal: Spacing.sm, borderRadius: BorderRadius.sm },
  rejectButtonText: { color: Colors.background },
  emptyState: { alignItems: 'center', justifyContent: 'center', minHeight: 200 },
  emptyText: { marginTop: Spacing.lg, color: Colors.textSecondary },
  loadingContainer: { alignItems: 'center', justifyContent: 'center', padding: Spacing['4xl'], minHeight: 200 },
  loadingText: { marginTop: Spacing.lg, color: Colors.textSecondary },
  errorContainer: { alignItems: 'center', justifyContent: 'center', padding: Spacing['4xl'], minHeight: 200 },
  errorText: { marginTop: Spacing.lg, fontSize: FontSize.lg, color: Colors.error, textAlign: 'center' },
});
