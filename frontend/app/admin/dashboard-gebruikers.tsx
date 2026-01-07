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
import { AdminLayout, UserFormModal, ConfirmationModal } from '@/components/admin';
import { UsersTable } from '@/components/admin/users-table';
import { UsersFilters } from '@/components/admin/users-filters';
import { fetchUsers, deleteUser, createUser, updateUser } from '@/Services';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Layout } from '@/constants';
import type { User } from '@/types/user';

export default function DashboardGebruikersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    setEditingUser(null);
    setShowUserModal(true);
  };

  const handleSubmitUser = async (userData: {
    name: string;
    email: string;
    password?: string;
    role: string;
  }) => {
    try {
      setIsCreating(true);
      console.log('Submitting user data:', userData);

      if (editingUser) {
        // Update existing user
        console.log('Updating user:', editingUser.user_id);
        const result = await updateUser(editingUser.user_id, { ...userData, floor_id: 1 } as any);
        console.log('Update result:', result);
        Alert.alert('Succes', 'Personeelslid succesvol bijgewerkt');
      } else {
        // Create new user
        console.log('Creating new user');
        const result = await createUser({ ...userData, password: userData.password!, floor_id: 1 } as any);
        console.log('Create result:', result);
        Alert.alert('Succes', 'Personeelslid succesvol toegevoegd');
      }

      setShowUserModal(false);
      setEditingUser(null);
      // Reload users list
      await loadUsers();
    } catch (err: any) {
      console.error('Error saving user - Full error:', err);
      console.error('Error message:', err.message);
      console.error('Error details:', JSON.stringify(err));
      Alert.alert('Fout', `${editingUser ? 'Kon personeelslid niet bijwerken' : 'Kon personeelslid niet toevoegen'}: ${err.message || 'Onbekende fout'}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      setIsDeleting(true);
      await deleteUser(userToDelete.user_id);
      // Reload users after deletion
      await loadUsers();
      setShowDeleteModal(false);
      setUserToDelete(null);
      Alert.alert('Succes', 'Personeelslid succesvol verwijderd');
    } catch (err) {
      console.error('Error deleting user:', err);
      Alert.alert('Fout', 'Kon personeelslid niet verwijderen');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout activeRoute="gebruikers">
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.pageTitle}>Personeelsbeheer</Text>
            <TouchableOpacity style={styles.newButton} onPress={handleNewUser}>
              <MaterialIcons name="person-add" size={20} color={Colors.background} />
              <Text style={styles.newButtonText}>Nieuw Personeelslid</Text>
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

      {/* User Form Modal */}
      <UserFormModal
        visible={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setEditingUser(null);
        }}
        onSubmit={handleSubmitUser}
        isLoading={isCreating}
        user={editingUser || undefined}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        visible={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setUserToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Personeelslid Verwijderen"
        message={`Weet je zeker dat je ${userToDelete?.name} wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.`}
        confirmText="Verwijderen"
        cancelText="Annuleren"
        isLoading={isDeleting}
        type="danger"
      />
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    ...Platform.select({
      web: {
        overflow: 'visible',
      },
    }),
  },
  content: {
    padding: Layout.screenPaddingLarge,
    ...Platform.select({
      web: {
        maxWidth: 1400,
        alignSelf: 'center',
        width: '100%',
        overflow: 'visible',
      },
    }),
    overflow: 'visible',
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
