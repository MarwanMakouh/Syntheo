import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { RoleBadge } from './role-badge';
import { StatusBadge } from './status-badge';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/constants';
import type { User } from '@/types/user';

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, styles.nameColumn]}>Naam</Text>
          <Text style={[styles.headerCell, styles.emailColumn]}>Email</Text>
          <Text style={[styles.headerCell, styles.roleColumn]}>Rol</Text>
          <Text style={[styles.headerCell, styles.statusColumn]}>Status</Text>
          <Text style={[styles.headerCell, styles.dateColumn]}>Laatste login</Text>
          <Text style={[styles.headerCell, styles.actionsColumn]}>Acties</Text>
        </View>

        {/* Table Body */}
        {users.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="person-off" size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>Geen gebruikers gevonden</Text>
            <Text style={styles.emptySubtext}>
              Probeer je filters aan te passen of voeg een nieuwe gebruiker toe.
            </Text>
          </View>
        ) : (
          users.map((user) => (
          <View key={user.user_id} style={styles.row}>
            <Text style={[styles.cell, styles.nameColumn]} numberOfLines={1}>
              {user.name}
            </Text>
            <Text style={[styles.cell, styles.emailColumn]} numberOfLines={1}>
              {user.email}
            </Text>
            <View style={[styles.cell, styles.roleColumn]}>
              <RoleBadge role={user.role} />
            </View>
            <View style={[styles.cell, styles.statusColumn]}>
              <StatusBadge status="Actief" />
            </View>
            <Text style={[styles.cell, styles.dateColumn]} numberOfLines={1}>
              {formatDate(user.updated_at)}
            </Text>
            <View style={[styles.cell, styles.actionsColumn, styles.actionsCell]}>
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => onEdit(user)}
              >
                <MaterialIcons name="edit" size={18} color={Colors.background} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => onDelete(user)}
              >
                <MaterialIcons name="delete" size={18} color={Colors.background} />
              </TouchableOpacity>
            </View>
          </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  table: {
    width: '100%',
  },
  emptyState: {
    padding: Spacing['4xl'],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  emptyText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#1E4D2B',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: 'center',
  },
  headerCell: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.background,
    textTransform: 'uppercase',
  },
  cell: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    paddingRight: Spacing.sm,
  },
  nameColumn: {
    width: '18%',
  },
  emailColumn: {
    width: '22%',
  },
  roleColumn: {
    width: '15%',
  },
  statusColumn: {
    width: '12%',
  },
  dateColumn: {
    width: '18%',
  },
  actionsColumn: {
    width: '15%',
  },
  actionsCell: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#95A5A6',
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
  },
});
