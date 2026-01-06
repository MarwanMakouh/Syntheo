import { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { AdminLayout } from '@/components/admin';
import { UsersTable } from '@/components/admin/users-table';
import { UsersFilters } from '@/components/admin/users-filters';
import { users } from '@/Services';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Layout } from '@/constants';
import type { User } from '@/types/user';

export default function DashboardGebruikersScreen() {
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter users based on filters
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;

      const isUserActive = user.is_active !== false; // Default to active if not specified
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'actief' && isUserActive) ||
        (statusFilter === 'inactief' && !isUserActive);

      const matchesSearch =
        searchQuery === '' ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [roleFilter, statusFilter, searchQuery]);

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
          onPress: () => {
            // TODO: Call API to delete user
            console.log('Delete user:', user.user_id);
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
});
