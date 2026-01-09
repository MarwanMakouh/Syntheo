import { useState, useMemo, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { AdminLayout } from '@/components/admin';
import { AnnouncementCreateModal } from '@/components/announcements/announcement-create-modal';
import { fetchAnnouncements, Announcement, createAnnouncement } from '@/Services/announcementsApi';
import { fetchUsers } from '@/Services/usersApi';
import type { User } from '@/types/user';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Layout } from '@/constants';

function AnnouncementCard({ announcement, authorName }: { announcement: Announcement; authorName: string }) {
  const created = new Date(announcement.created_at);
  const isRecent = Date.now() - created.getTime() < 1000 * 60 * 60 * 24; // 24h

  return (
    <View style={styles.announcementCard}>
      <View style={styles.announcementHeaderRow}>
        <View style={styles.announcementHeader}>
          <Text style={styles.announcementTitle}>{announcement.title}</Text>
          <Text style={styles.announcementMeta}>{authorName} • {created.toLocaleString()}</Text>
        </View>
        {isRecent && (
          <View style={styles.recentPill}>
            <Text style={styles.recentPillText}>Nieuw</Text>
          </View>
        )}
      </View>
      <Text style={styles.announcementMessage}>{announcement.message}</Text>
    </View>
  );
}

export default function DashboardAnnouncementsScreen() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [modalVisible, setModalVisible] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [annData, usersData] = await Promise.all([fetchAnnouncements(), fetchUsers()]);
      setAnnouncements(annData || []);
      setUsers(usersData || []);
    } catch (err) {
      console.error('Error loading announcements:', err);
      setError('Fout bij het laden van aankondigingen');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (payload: { title: string; message: string; recipientCategory: any; recipientDetails?: any }) => {
    try {
      setIsCreating(true);
      // Map modal payload to API shape; author_id will be taken as first user for now
      const apiPayload = {
        author_id: users[0]?.user_id ?? 0,
        title: payload.title,
        message: payload.message,
        recipient_type: 'all',
        recipient_ids: [],
      } as any;

      await createAnnouncement(apiPayload);
      setModalVisible(false);
      await loadData();
    } catch (err) {
      console.error('Error creating announcement:', err);
      setError('Kon aankondiging niet aanmaken');
    } finally {
      setIsCreating(false);
    }
  };

  const getAuthorName = (authorId: number) => users.find(u => u.user_id === authorId)?.name || 'Onbekend';

  const stats = useMemo(() => ({ total: announcements.length }), [announcements]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = announcements.filter(a => {
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.message.toLowerCase().includes(q) ||
        getAuthorName(a.author_id).toLowerCase().includes(q)
      );
    });

    return list.sort((a, b) => {
      const ta = new Date(a.created_at).getTime();
      const tb = new Date(b.created_at).getTime();
      return sort === 'newest' ? tb - ta : ta - tb;
    });
  }, [announcements, searchQuery, sort, users]);

  return (
    <RoleGuard allowedRoles={['Beheerder']}>
      <AdminLayout activeRoute="announcements">
        <ScrollView style={styles.container}>
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <MaterialIcons name="campaign" size={32} color={Colors.primary} />
                <Text style={styles.pageTitle}>Aankondigingen</Text>
              </View>
              <Text style={styles.breadcrumb}>Home / Aankondigingen</Text>
            </View>

            <View style={styles.toolbar}>
              <View style={styles.searchBox}>
                <MaterialIcons name="search" size={18} color={Colors.textSecondary} />
                <TextInput
                  placeholder="Zoek titel, tekst of auteur"
                  placeholderTextColor={Colors.textSecondary}
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <View style={styles.toolbarRight}>
                <View style={styles.segmented}>
                  <TouchableOpacity
                    style={[styles.segmentButton, sort === 'newest' ? styles.segmentButtonActive : null]}
                    onPress={() => setSort('newest')}
                    accessibilityLabel="Sorteer op nieuwste"
                  >
                    <MaterialIcons name="arrow-upward" size={16} color={sort === 'newest' ? Colors.background : Colors.textSecondary} />
                    <Text style={[styles.segmentText, sort === 'newest' ? styles.segmentTextActive : null]}>Nieuwst</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.segmentButton, sort === 'oldest' ? styles.segmentButtonActive : null]}
                    onPress={() => setSort('oldest')}
                    accessibilityLabel="Sorteer op oudste"
                  >
                    <MaterialIcons name="arrow-downward" size={16} color={sort === 'oldest' ? Colors.background : Colors.textSecondary} />
                    <Text style={[styles.segmentText, sort === 'oldest' ? styles.segmentTextActive : null]}>Oudst</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.newButton} onPress={() => setModalVisible(true)}>
                  <MaterialIcons name="add" size={20} color={Colors.background} />
                  <Text style={styles.newButtonText}>Nieuwe</Text>
                </TouchableOpacity>
              </View>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Aankondigingen laden...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={64} color={Colors.error} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadData}>
                  <Text style={styles.retryButtonText}>Opnieuw proberen</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Totaal</Text>
                    <Text style={styles.statValue}>{stats.total}</Text>
                  </View>
                </View>

                {filtered.length === 0 ? (
                  <View style={styles.emptyStateEnhanced}>
                    <MaterialIcons name="campaign" size={96} color={Colors.textSecondary} />
                    <Text style={styles.emptyTitle}>Er zijn nog geen aankondigingen</Text>
                    <Text style={styles.emptyText}>Maak een nieuwe aankondiging om iedereen te informeren.</Text>
                    <TouchableOpacity style={styles.newButtonLarge} onPress={() => setModalVisible(true)}>
                      <MaterialIcons name="add" size={20} color={Colors.background} />
                      <Text style={styles.newButtonText}>Nieuwe aankondiging</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.list}>
                    {filtered.map(a => (
                      <AnnouncementCard key={a.announcement_id} announcement={a} authorName={getAuthorName(a.author_id)} />
                    ))}
                  </View>
                )}
              </>
            )}
          </View>
        </ScrollView>

        <AnnouncementCreateModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSend={handleCreate}
          isLoading={isCreating}
        />
      </AdminLayout>
    </RoleGuard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundSecondary },
  content: { padding: Layout.screenPaddingLarge },
  header: { marginBottom: Spacing['2xl'] },
  titleContainer: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xs },
  pageTitle: { fontSize: FontSize['3xl'], fontWeight: FontWeight.bold, color: Colors.textPrimary },
  breadcrumb: { fontSize: FontSize.sm, color: Colors.textSecondary },

  toolbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.lg, gap: Spacing.lg },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.background, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border },
  searchInput: { flex: 1, marginLeft: Spacing.sm, color: Colors.textPrimary, height: 36, fontSize: FontSize.md },
  toolbarRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginLeft: Spacing.sm },
  sortButton: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.sm, backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border },
  sortButtonActive: { backgroundColor: Colors.primary },
  sortButtonText: { color: Colors.textSecondary, marginLeft: Spacing.xs },
  sortButtonTextActive: { color: Colors.background },
  segmented: { flexDirection: 'row', backgroundColor: Colors.background, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  segmentButton: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, minWidth: 80, justifyContent: 'center' },
  segmentButtonActive: { backgroundColor: Colors.primary },
  segmentText: { color: Colors.textSecondary, fontSize: FontSize.sm },
  segmentTextActive: { color: Colors.background, fontWeight: FontWeight.semibold },
  newButton: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, backgroundColor: Colors.primary, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.md },
  newButtonText: { color: Colors.background, fontWeight: FontWeight.semibold },
  newButtonLarge: { marginTop: Spacing.lg, flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, backgroundColor: Colors.primary, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg },

  loadingContainer: { alignItems: 'center', justifyContent: 'center', padding: Spacing['4xl'], minHeight: 200 },
  loadingText: { marginTop: Spacing.lg, color: Colors.textSecondary },
  errorContainer: { alignItems: 'center', justifyContent: 'center', padding: Spacing['4xl'], minHeight: 200 },
  errorText: { marginTop: Spacing.lg, fontSize: FontSize.lg, color: Colors.error, textAlign: 'center' },
  retryButton: { backgroundColor: Colors.primary, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, borderRadius: BorderRadius.md },
  retryButtonText: { color: Colors.background },

  statsContainer: { flexDirection: 'row', gap: Spacing.lg, marginBottom: Spacing['2xl'] },
  statCard: { backgroundColor: Colors.background, borderRadius: BorderRadius.lg, padding: Spacing.lg, minWidth: 140 },
  statLabel: { color: Colors.textSecondary },
  statValue: { fontSize: FontSize['2xl'], fontWeight: FontWeight.bold, color: Colors.textPrimary },

  emptyState: { alignItems: 'center', justifyContent: 'center', minHeight: 200 },
  emptyStateEnhanced: { alignItems: 'center', justifyContent: 'center', minHeight: 260, backgroundColor: Colors.background, borderRadius: BorderRadius.lg, padding: Spacing['3xl'], borderWidth: 1, borderColor: Colors.border },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.semibold, color: Colors.textPrimary, marginTop: Spacing.md },
  emptyText: { marginTop: Spacing.sm, color: Colors.textSecondary },

  list: { gap: Spacing.lg },
  announcementCard: { backgroundColor: Colors.background, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  announcementHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  announcementHeader: { marginBottom: Spacing.sm, flex: 1 },
  announcementTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  announcementMeta: { fontSize: FontSize.sm, color: Colors.textSecondary },
  announcementMessage: { marginTop: Spacing.sm, color: Colors.textPrimary },
  recentPill: { backgroundColor: '#FFD700', paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, borderRadius: BorderRadius.md, marginLeft: Spacing.sm },
  recentPillText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
});
