import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants';
import { fetchUsers, User } from '@/Services/usersApi';

interface AnnouncementCreatePopupProps {
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
const DEPARTMENTS = ['Verpleging', 'Administratie', 'Keuken'];

export function AnnouncementCreatePopup({
  visible,
  onClose,
  onSend,
  isLoading = false,
}: AnnouncementCreatePopupProps) {
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
      handleClose();
    }
  };

  const handleClose = () => {
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
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.popup} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <MaterialIcons name="campaign" size={24} color={Colors.primary} />
              <Text style={styles.title}>Aankondiging Maken</Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Ontvangers Categorie */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Ontvangers Type</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                <Text style={styles.dropdownText}>{selectedCategory}</Text>
                <Ionicons
                  name={showCategoryDropdown ? 'chevron-up' : 'chevron-down'}
                  size={18}
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
                        <Ionicons name="checkmark" size={18} color={Colors.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Details Dropdown */}
            {needsDetailsSelection && selectedCategory !== 'Individuele mensen' && (
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Selecteer {selectedCategory}</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowDetailsDropdown(!showDetailsDropdown)}
                >
                  <Text style={[styles.dropdownText, !selectedDetails && styles.placeholderText]}>
                    {selectedDetails || `Kies ${selectedCategory.toLowerCase()}...`}
                  </Text>
                  <Ionicons
                    name={showDetailsDropdown ? 'chevron-up' : 'chevron-down'}
                    size={18}
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
                          <Ionicons name="checkmark" size={18} color={Colors.primary} />
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
                    Personen ({selectedIndividuals.length})
                  </Text>
                  <TouchableOpacity
                    onPress={handleSelectAllIndividuals}
                    style={styles.selectAllButton}
                  >
                    <Text style={styles.selectAllText}>
                      {selectedIndividuals.length === INDIVIDUALS.length
                        ? 'Deselecteer alles'
                        : 'Selecteer alles'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.checkboxScroll} nestedScrollEnabled>
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
                        >
                          <View style={styles.checkbox}>
                            {isSelected && (
                              <Ionicons name="checkmark" size={16} color={Colors.primary} />
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
                </ScrollView>
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
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
                <>
                  <MaterialIcons name="send" size={18} color={Colors.textOnPrimary} />
                  <Text style={styles.sendButtonText}>Verzend</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  popup: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    width: '100%',
    maxWidth: 600,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
  },
  fieldContainer: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
  },
  textArea: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
    minHeight: 100,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
  },
  dropdownText: {
    fontSize: FontSize.md,
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
    maxHeight: 200,
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
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dropdownItemSelected: {
    backgroundColor: Colors.selectedBackground,
  },
  dropdownItemText: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  dropdownItemTextSelected: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  selectAllButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  selectAllText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  checkboxScroll: {
    maxHeight: 200,
  },
  checkboxContainer: {
    gap: Spacing.xs,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  checkboxItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.selectedBackground,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginRight: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxLabel: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  checkboxLabelSelected: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  footer: {
    flexDirection: 'row',
    padding: Spacing.xl,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
  },
  cancelButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  sendButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.success,
  },
  sendButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textOnPrimary,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
});
