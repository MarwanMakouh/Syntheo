import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants';
import type { UserRole, User } from '@/types/user';

interface UserFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (userData: {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    floor_id?: number | null;
  }) => void | Promise<void>;
  isLoading?: boolean;
  user?: User; // If provided, modal is in edit mode
}

const USER_ROLES: { value: UserRole; label: string }[] = [
  { value: 'Verpleegster', label: 'Verpleegster' },
  { value: 'Hoofdverpleegster', label: 'Hoofdverpleegster' },
  { value: 'Beheerder', label: 'Beheerder' },
  { value: 'Keukenpersoneel', label: 'Keukenpersoneel' },
];

export function UserFormModal({
  visible,
  onClose,
  onSubmit,
  isLoading = false,
  user,
}: UserFormModalProps) {
  const isEditMode = !!user;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Verpleegster');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [floors, setFloors] = useState<Array<{ floor_id: number; name?: string }>>([]);
  const [selectedFloorId, setSelectedFloorId] = useState<number | null>(null);
  const [showFloorDropdown, setShowFloorDropdown] = useState(false);

  // Load user data when modal opens in edit mode
  useEffect(() => {
    if (user && visible) {
      setName(user.name);
      setEmail(user.email);
      setPassword('');
      setSelectedRole(user.role);
      setSelectedFloorId(user.floor_id ?? null);
    }
  }, [user, visible]);

  useEffect(() => {
    // fetch floors for dropdown
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/floors`);
        if (res.ok) {
          const json = await res.json();
          // API returns { data: [...] } or array
          const list = Array.isArray(json) ? json : (json.data || []);
          setFloors(list || []);
        }
      } catch (e) {
        console.error('Failed to fetch floors:', e);
      }
    })();
  }, []);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setShowRoleDropdown(false);
  };

  const handleSubmit = async () => {
    // Validation
    if (name.trim().length === 0) {
      alert('Vul een naam in');
      return;
    }

    if (email.trim().length === 0) {
      alert('Vul een e-mailadres in');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      alert('Vul een geldig e-mailadres in');
      return;
    }

    // Password is required for new users, optional for edit
    if (!isEditMode) {
      if (password.trim().length === 0) {
        alert('Vul een wachtwoord in');
        return;
      }

      if (password.trim().length < 6) {
        alert('Wachtwoord moet minimaal 6 tekens bevatten');
        return;
      }
    } else if (password.trim().length > 0 && password.trim().length < 6) {
      alert('Wachtwoord moet minimaal 6 tekens bevatten');
      return;
    }

    // If role requires floor, validate selection
    const roleNeedsFloor = selectedRole === 'Verpleegster' || selectedRole === 'Hoofdverpleegster';
    if (roleNeedsFloor && (!selectedFloorId || selectedFloorId <= 0)) {
      alert('Kies een verdieping voor dit personeelslid');
      return;
    }

    const userData: any = {
      name: name.trim(),
      email: email.trim(),
      role: selectedRole,
      floor_id: selectedFloorId ?? null,
    };

    // Only include password if it's provided
    if (password.trim().length > 0) {
      userData.password = password.trim();
    }

    await onSubmit(userData);

    // Only reset if not loading (onSubmit might have failed)
    if (!isLoading) {
      resetForm();
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setSelectedRole('Verpleegster');
    setSelectedFloorId(null);
  };

  const handleClose = () => {
    resetForm();
    setShowRoleDropdown(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {isEditMode ? 'Personeelslid Bewerken' : 'Nieuw Personeelslid'}
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={28} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Naam */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Naam *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Volledige naam"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="words"
            />
          </View>

          {/* Email */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>E-mailadres *</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="email@voorbeeld.nl"
              placeholderTextColor={Colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Wachtwoord {isEditMode ? '(optioneel)' : '*'}
            </Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder={isEditMode ? 'Laat leeg om niet te wijzigen' : 'Minimaal 6 tekens'}
              placeholderTextColor={Colors.textMuted}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Role Dropdown */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Functie *</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowRoleDropdown(!showRoleDropdown)}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownText}>{selectedRole}</Text>
              <Ionicons
                name={showRoleDropdown ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={Colors.textSecondary}
              />
            </TouchableOpacity>
            {showRoleDropdown && (
              <View style={styles.dropdownMenu}>
                {USER_ROLES.map((role) => (
                  <TouchableOpacity
                    key={role.value}
                    style={[
                      styles.dropdownItem,
                      selectedRole === role.value && styles.dropdownItemSelected,
                    ]}
                    onPress={() => handleRoleChange(role.value)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        selectedRole === role.value && styles.dropdownItemTextSelected,
                      ]}
                    >
                      {role.label}
                    </Text>
                    {selectedRole === role.value && (
                      <Ionicons name="check" size={20} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Floor Dropdown - only for nurses/head nurses */}
          {(selectedRole === 'Verpleegster' || selectedRole === 'Hoofdverpleegster') && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Verdieping *</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowFloorDropdown(!showFloorDropdown)}
                activeOpacity={0.7}
              >
                <Text style={styles.dropdownText}>{
                  selectedFloorId ? (floors.find(f => f.floor_id === selectedFloorId)?.name || `Verdieping ${selectedFloorId}`) : 'Selecteer verdieping'
                }</Text>
                <Ionicons
                  name={showFloorDropdown ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
              {showFloorDropdown && (
                <View style={styles.dropdownMenu}>
                  {floors.map((floor) => (
                    <TouchableOpacity
                      key={floor.floor_id}
                      style={[
                        styles.dropdownItem,
                        selectedFloorId === floor.floor_id && styles.dropdownItemSelected,
                      ]}
                      onPress={() => { setSelectedFloorId(floor.floor_id); setShowFloorDropdown(false); }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          selectedFloorId === floor.floor_id && styles.dropdownItemTextSelected,
                        ]}
                      >
                        {floor.name ?? `Verdieping ${floor.floor_id}`}
                      </Text>
                      {selectedFloorId === floor.floor_id && (
                        <Ionicons name="check" size={20} color={Colors.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}

        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleClose}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Annuleer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.textOnPrimary} />
            ) : (
              <Text style={styles.submitButtonText}>
                {isEditMode ? 'Opslaan' : 'Toevoegen'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing['2xl'],
  },
  fieldContainer: {
    marginBottom: Spacing['2xl'],
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    backgroundColor: '#EEEEEE',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: '#EEEEEE',
  },
  dropdownText: {
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
  },
  dropdownMenu: {
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dropdownItemSelected: {
    backgroundColor: Colors.selectedBackground,
  },
  dropdownItemText: {
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
  },
  dropdownItemTextSelected: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  actionContainer: {
    flexDirection: 'row',
    padding: Spacing['2xl'],
    paddingBottom: Platform.OS === 'ios' ? 40 : Spacing['2xl'],
    gap: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    backgroundColor: '#E5E5E5',
  },
  cancelButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    backgroundColor: Colors.success,
  },
  submitButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textOnPrimary,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
});
