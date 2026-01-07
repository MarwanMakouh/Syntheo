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
import { fetchUsers, User } from '@/Services/usersApi';

interface AnnouncementCreateModalProps {
  visible: boolean;
  onClose: () => void;
  onSend: (announcement: {
    title: string;
    message: string;
    recipientCategory: RecipientCategory;
    recipientDetails?: string | string[];
  }) => void | Promise<void>;
  isLoading?: boolean;
}

type RecipientCategory = 'Verdieping' | 'Individuele mensen' | 'Iedereen' | 'Afdeling';

const RECIPIENT_CATEGORIES: RecipientCategory[] = [
  'Iedereen',
  'Verdieping',
  'Afdeling',
  'Individuele mensen',
];

const FLOORS = ['Verdieping 1', 'Verdieping 2', 'Verdieping 3', 'Verdieping 4'];

const DEPARTMENTS = ['Keuken', 'Admin', 'Verplegers'];

export function AnnouncementCreateModal({
  visible,
  onClose,
  onSend,
  isLoading = false,
}: AnnouncementCreateModalProps) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<RecipientCategory>('Iedereen');
  const [selectedDetails, setSelectedDetails] = useState<string>('');
  const [selectedIndividuals, setSelectedIndividuals] = useState<string[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showDetailsDropdown, setShowDetailsDropdown] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Load users when modal becomes visible
  useEffect(() => {
    if (visible && users.length === 0) {
      loadUsers();
    }
  }, [visible]);

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Get individual user names from the loaded users
  const INDIVIDUALS = users.map(user => user.name);

  const handleCategoryChange = (category: RecipientCategory) => {
    setSelectedCategory(category);
    setSelectedDetails('');
    setSelectedIndividuals([]);
    setShowCategoryDropdown(false);
  };

  const handleDetailsChange = (details: string) => {
    setSelectedDetails(details);
    setShowDetailsDropdown(false);
  };

  const handleIndividualToggle = (person: string) => {
    setSelectedIndividuals((prev) =>
      prev.includes(person)
        ? prev.filter((p) => p !== person)
        : [...prev, person]
    );
  };

  const handleSelectAllIndividuals = () => {
    if (selectedIndividuals.length === INDIVIDUALS.length) {
      setSelectedIndividuals([]);
    } else {
      setSelectedIndividuals([...INDIVIDUALS]);
    }
  };

  const getDetailsOptions = (): string[] => {
    switch (selectedCategory) {
      case 'Verdieping':
        return FLOORS;
      case 'Afdeling':
        return DEPARTMENTS;
      case 'Individuele mensen':
        return INDIVIDUALS;
      default:
        return [];
    }
  };

  const needsDetailsSelection = selectedCategory !== 'Iedereen';

  const handleSend = async () => {
    if (title.trim().length === 0) {
      alert('Vul een titel in');
      return;
    }

    if (message.trim().length === 0) {
      alert('Vul een bericht in');
      return;
    }

    if (needsDetailsSelection) {
      if (selectedCategory === 'Individuele mensen') {
        if (selectedIndividuals.length === 0) {
          alert('Selecteer minimaal één persoon');
          return;
        }
      } else if (!selectedDetails) {
        alert(`Selecteer een ${selectedCategory.toLowerCase()}`);
        return;
      }
    }

    await onSend({
      title: title.trim(),
      message: message.trim(),
      recipientCategory: selectedCategory,
      recipientDetails: selectedCategory === 'Individuele mensen'
        ? selectedIndividuals
        : selectedDetails || undefined,
    });

    // Only reset if not loading (onSend might have failed)
    if (!isLoading) {
      // Reset form
      setTitle('');
      setMessage('');
      setSelectedCategory('Iedereen');
      setSelectedDetails('');
      setSelectedIndividuals([]);
    }
  };

  const handleClose = () => {
    // Reset form
    setTitle('');
    setMessage('');
    setSelectedCategory('Iedereen');
    setSelectedDetails('');
    setSelectedIndividuals([]);
    setShowCategoryDropdown(false);
    setShowDetailsDropdown(false);
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
          {/* Titel */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Titel</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Aankondiging titel"
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          {/* Bericht */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Bericht</Text>
            <TextInput
              style={styles.textArea}
              value={message}
              onChangeText={setMessage}
              placeholder="Voer uw bericht in..."
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />
          </View>

          {/* Ontvangers Categorie */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Ontvangers Type</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownText}>{selectedCategory}</Text>
              <Ionicons
                name={showCategoryDropdown ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={Colors.textSecondary}
              />
            </TouchableOpacity>
            {showCategoryDropdown && (
              <View style={styles.dropdownMenu}>
                {RECIPIENT_CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.dropdownItem,
                      selectedCategory === category && styles.dropdownItemSelected,
                    ]}
                    onPress={() => handleCategoryChange(category)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        selectedCategory === category && styles.dropdownItemTextSelected,
                      ]}
                    >
                      {category}
                    </Text>
                    {selectedCategory === category && (
                      <Ionicons name="checkmark" size={20} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Details Dropdown - alleen tonen als niet "Iedereen" */}
          {needsDetailsSelection && selectedCategory !== 'Individuele mensen' && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Selecteer {selectedCategory}
              </Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowDetailsDropdown(!showDetailsDropdown)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dropdownText, !selectedDetails && styles.placeholderText]}>
                  {selectedDetails || `Kies ${selectedCategory.toLowerCase()}...`}
                </Text>
                <Ionicons
                  name={showDetailsDropdown ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
              {showDetailsDropdown && (
                <View style={styles.dropdownMenu}>
                  {getDetailsOptions().map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.dropdownItem,
                        selectedDetails === option && styles.dropdownItemSelected,
                      ]}
                      onPress={() => handleDetailsChange(option)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          selectedDetails === option && styles.dropdownItemTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                      {selectedDetails === option && (
                        <Ionicons name="checkmark" size={20} color={Colors.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Multi-select voor Individuele mensen */}
          {selectedCategory === 'Individuele mensen' && (
            <View style={styles.fieldContainer}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>
                  Selecteer Personen ({selectedIndividuals.length} geselecteerd)
                </Text>
                <TouchableOpacity
                  onPress={handleSelectAllIndividuals}
                  style={styles.selectAllButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.selectAllText}>
                    {selectedIndividuals.length === INDIVIDUALS.length
                      ? 'Deselecteer alles'
                      : 'Selecteer alles'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.checkboxContainer}>
                {INDIVIDUALS.map((person) => {
                  const isSelected = selectedIndividuals.includes(person);
                  return (
                    <TouchableOpacity
                      key={person}
                      style={[
                        styles.checkboxItem,
                        isSelected && styles.checkboxItemSelected,
                      ]}
                      onPress={() => handleIndividualToggle(person)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.checkbox}>
                        {isSelected && (
                          <Ionicons name="checkmark" size={18} color={Colors.primary} />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.checkboxLabel,
                          isSelected && styles.checkboxLabelSelected,
                        ]}
                      >
                        {person}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleClose}
          >
            <Text style={styles.cancelButtonText}>Annuleer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.textOnPrimary} />
            ) : (
              <Text style={styles.sendButtonText}>Verzend</Text>
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
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
    marginBottom: Spacing['3xl'],
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
  },
  textArea: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
    minHeight: 150,
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
    backgroundColor: Colors.background,
  },
  dropdownText: {
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
  },
  placeholderText: {
    color: Colors.textMuted,
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
    backgroundColor: Colors.backgroundSecondary,
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
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  selectAllButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  selectAllText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  checkboxContainer: {
    gap: Spacing.sm,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  checkboxItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.backgroundSecondary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginRight: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxLabel: {
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
  },
  checkboxLabelSelected: {
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
  sendButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    backgroundColor: Colors.success,
  },
  sendButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textOnPrimary,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
});
