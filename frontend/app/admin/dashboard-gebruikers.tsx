import { useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { AdminLayout } from '@/components/admin';
import { UsersTable } from '@/components/admin/users-table';
import { UsersFilters } from '@/components/admin/users-filters';
import { fetchUsers, deleteUser } from '@/Services';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Layout } from '@/constants';
import type { User } from '@/types/user';

export default function DashboardGebruikersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch users from API
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      setError('Fout bij het laden van gebruikers');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on filters
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;

      // Status filter temporarily disabled since backend doesn't have is_active field yet
      const matchesStatus = statusFilter === 'all';

      const matchesSearch =
        searchQuery === '' ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [users, roleFilter, statusFilter, searchQuery]);

  const handleNewUser = () => {
    // TODO: Open modal to create new user
    Alert.alert('Nieuwe Gebruiker', 'Functionaliteit nog niet geïmplementeerd');
  };

  const handleEditUser = (user: User) => {
    // TODO: Open modal to edit user
    Alert.alert('Gebruiker Bewerken', `Bewerken: ${user.name}`);
  };

  const handleDeleteUser = (user: User) => {
    Alert.alert(
      'Gebruiker Verwijderen',
      `Weet je zeker dat je ${user.name} wilt verwijderen?`,
      [
        { text: 'Annuleren', style: 'cancel' },
        {
          text: 'Verwijderen',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUser(user.user_id);
              // Reload users after deletion
              loadUsers();
              Alert.alert('Succes', 'Gebruiker succesvol verwijderd');
            } catch (err) {
              Alert.alert('Fout', 'Kon gebruiker niet verwijderen');
              console.error('Error deleting user:', err);
            }
          },
        },
      ]
    );
  };

  return (
    <AdminLayout activeRoute="gebruikers">
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.pageTitle}>Gebruikersbeheer</Text>
            <TouchableOpacity style={styles.newButton} onPress={handleNewUser}>
              <MaterialIcons name="person-add" size={20} color={Colors.background} />
              <Text style={styles.newButtonText}>Nieuwe Gebruiker</Text>
            </TouchableOpacity>
          </View>

          {/* Loading State */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Gebruikers laden...</Text>
            </View>
          ) : error ? (
            /* Error State */
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={64} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadUsers}>
                <Text style={styles.retryButtonText}>Opnieuw proberen</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Filters */}
              <UsersFilters
                roleFilter={roleFilter}
                statusFilter={statusFilter}
                searchQuery={searchQuery}
                onRoleFilterChange={setRoleFilter}
                onStatusFilterChange={setStatusFilter}
                onSearchChange={setSearchQuery}
              />

              {/* Users Table */}
              <UsersTable
                users={filteredUsers}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
              />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
    flexWrap: 'wrap',
    gap: Spacing.lg,
  },
  pageTitle: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  newButtonText: {
    color: Colors.background,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
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
