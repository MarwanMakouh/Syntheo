import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight, Layout } from '@/constants';
import { StaffLayout } from '@/components';
import { AnnouncementCreatePopup } from '@/components/announcements/announcement-create-popup';
import { fetchUsers } from '@/Services/usersApi';
import {
  createAnnouncement,
  fetchAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
  type Announcement
} from '@/Services/announcementsApi';
import { useAuth } from '@/contexts/AuthContext';
import { useAnnouncements } from '@/contexts/AnnouncementsContext';
import { formatDate } from '@/utils/date';

export default function AankondigingenScreen() {
  const { currentUser } = useAuth();
  const { refreshAnnouncements } = useAnnouncements();
  const [announcementModalVisible, setAnnouncementModalVisible] = useState(false);
  const [isSendingAnnouncement, setIsSendingAnnouncement] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, announcementsData] = await Promise.all([
        fetchUsers(),
        fetchAnnouncements(),
      ]);
      setUsers(usersData || []);
      setAnnouncements(announcementsData || []);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendAnnouncement = async (announcement: {
    title: string;
    message: string;
    recipientCategory: string;
    recipientDetails?: string | string[];
  }) => {
    if (!currentUser?.user_id) {
      alert('Gebruiker niet ingelogd');
      return;
    }

    setIsSendingAnnouncement(true);

    try {
      // Check if users are loaded
      if (!users || users.length === 0) {
        alert('Geen gebruikers geladen! Herlaad de pagina en probeer opnieuw.');
        setIsSendingAnnouncement(false);
        return;
      }

      // Determine recipient_type and recipient_ids based on category
      let recipientType: 'all' | 'role' | 'floor' = 'all';
      let recipientIds: number[] = [];
      let floorId: number | null = null;

      console.log('=== DEBUG ANNOUNCEMENT ===');
      console.log('Category:', announcement.recipientCategory);
      console.log('Details:', announcement.recipientDetails);
      console.log('Total users:', users.length);
      console.log('All users:', users.map(u => ({ name: u.name, role: u.role, floor_id: u.floor_id })));

      if (announcement.recipientCategory === 'Iedereen') {
        recipientType = 'all';
        // All users get the announcement
        recipientIds = users.map(user => user.user_id);
        console.log('Iedereen selected - Recipients:', recipientIds);
      } else if (announcement.recipientCategory === 'Verdieping') {
        recipientType = 'floor';
        // Extract floor number from "Verdieping X" string
        const floorName = announcement.recipientDetails as string;
        const floorNumber = parseInt(floorName.replace(/\D/g, ''));
        floorId = floorNumber;
        console.log('Floor selected:', floorNumber);
        // Filter users by floor_id
        recipientIds = users
          .filter(user => user.floor_id === floorNumber)
          .map(user => user.user_id);
        console.log('Users on floor:', users.filter(user => user.floor_id === floorNumber));
        console.log('Recipient IDs:', recipientIds);
      } else if (announcement.recipientCategory === 'Afdeling') {
        recipientType = 'role';
        // Map department name to role(s) - flexible matching
        const department = announcement.recipientDetails as string;

        console.log('Department selected:', department);
        console.log('All user roles:', users.map(u => u.role));

        // Filter users by role using flexible matching
        const matchedUsers = users.filter(user => {
          const userRole = user.role.toLowerCase();

          if (department === 'Keuken') {
            // Match anything with "keuken" in the role name
            return userRole.includes('keuken');
          } else if (department === 'Verpleging') {
            // Match anything with "verpleeg" or "verpleger" in the role name
            return userRole.includes('verpleeg') || userRole.includes('verpleger') || userRole.includes('verpleegster');
          } else if (department === 'Administratie') {
            // Match anything with "admin" or "beheer" in the role name
            return userRole.includes('admin') || userRole.includes('beheer');
          }
          return false;
        });

        console.log('Matched users:', matchedUsers);
        recipientIds = matchedUsers.map(user => user.user_id);
        console.log('Recipient IDs:', recipientIds);
      } else if (announcement.recipientCategory === 'Individuele mensen') {
        recipientType = 'role'; // Use 'role' as default for individual selection
        // For now, we'll use names to match users (not ideal but works with current setup)
        const selectedNames = announcement.recipientDetails as string[];
        console.log('Individual people selected:', selectedNames);
        recipientIds = users
          .filter(user => selectedNames.includes(user.name))
          .map(user => user.user_id);
        console.log('Matched users:', users.filter(user => selectedNames.includes(user.name)));
        console.log('Recipient IDs:', recipientIds);
      }

      // Ensure we have at least one recipient
      if (recipientIds.length === 0) {
        console.error('No recipients found!');
        alert('Geen ontvangers gevonden voor deze selectie. Check de console voor details.');
        setIsSendingAnnouncement(false);
        return;
      }

      // Create the announcement via API
      await createAnnouncement({
        author_id: currentUser.user_id,
        title: announcement.title,
        message: announcement.message,
        recipient_type: recipientType,
        floor_id: floorId,
        recipient_ids: recipientIds,
      });

      // Refresh announcements to show the new one
      await refreshAnnouncements();
      await loadData();

      // Show success message
      const recipientText = announcement.recipientDetails
        ? `${announcement.recipientCategory} (${Array.isArray(announcement.recipientDetails) ? announcement.recipientDetails.join(', ') : announcement.recipientDetails})`
        : announcement.recipientCategory;
      alert(`Aankondiging "${announcement.title}" succesvol verzonden naar ${recipientText} (${recipientIds.length} ${recipientIds.length === 1 ? 'ontvanger' : 'ontvangers'})`);

      // Close modal
      setAnnouncementModalVisible(false);
    } catch (error) {
      console.error('Error sending announcement:', error);
      alert('Fout bij het verzenden van aankondiging. Probeer opnieuw.');
    } finally {
      setIsSendingAnnouncement(false);
    }
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setAnnouncementModalVisible(true);
  };

  const handleDeleteAnnouncement = (announcement: Announcement) => {
    setAnnouncementToDelete(announcement);
    setDeleteConfirmVisible(true);
  };

  const confirmDeleteAnnouncement = async () => {
    if (!announcementToDelete) return;

    try {
      await deleteAnnouncement(announcementToDelete.announcement_id);
      await loadData();
      await refreshAnnouncements();
      alert('Aankondiging succesvol verwijderd');
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Fout bij het verwijderen van aankondiging');
    } finally {
      setDeleteConfirmVisible(false);
      setAnnouncementToDelete(null);
    }
  };

  const getAuthorName = (authorId: number) => {
    return users.find((u) => u.user_id === authorId)?.name || 'Onbekend';
  };

  if (loading) {
    return (
      <StaffLayout activeRoute="aankondigingen">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Aankondigingen laden...</Text>
        </View>
      </StaffLayout>
    );
  }

  return (
    <StaffLayout activeRoute="aankondigingen">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Aankondigingen</Text>
          <Text style={styles.pageSubtitle}>
            Maak en verstuur aankondigingen naar personeel
          </Text>
        </View>

        {/* Create Announcement Card */}
        <TouchableOpacity
          style={styles.createCard}
          onPress={() => {
            setSelectedAnnouncement(null);
            setAnnouncementModalVisible(true);
          }}
          activeOpacity={0.7}
        >
          <View style={styles.createCardIcon}>
            <MaterialIcons name="campaign" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.createCardTitle}>Nieuwe Aankondiging Maken</Text>
          <Text style={styles.createCardSubtitle}>
            Verstuur een bericht naar personeel
          </Text>
          <View style={styles.createCardButton}>
            <Text style={styles.createCardButtonText}>Aankondiging Maken</Text>
            <MaterialIcons name="arrow-forward" size={20} color={Colors.textOnPrimary} />
          </View>
        </TouchableOpacity>

        {/* Info Cards */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Mogelijkheden</Text>
          <View style={styles.infoCardsGrid}>
            <View style={styles.infoCard}>
              <MaterialIcons name="people" size={32} color={Colors.primary} />
              <Text style={styles.infoCardTitle}>Iedereen</Text>
              <Text style={styles.infoCardText}>
                Verstuur naar alle medewerkers tegelijk
              </Text>
            </View>
            <View style={styles.infoCard}>
              <MaterialIcons name="business" size={32} color={Colors.primary} />
              <Text style={styles.infoCardTitle}>Per Afdeling</Text>
              <Text style={styles.infoCardText}>
                Richt je op specifieke afdelingen
              </Text>
            </View>
            <View style={styles.infoCard}>
              <MaterialIcons name="layers" size={32} color={Colors.primary} />
              <Text style={styles.infoCardTitle}>Per Verdieping</Text>
              <Text style={styles.infoCardText}>
                Communiceer met een specifieke verdieping
              </Text>
            </View>
            <View style={styles.infoCard}>
              <MaterialIcons name="person" size={32} color={Colors.primary} />
              <Text style={styles.infoCardTitle}>Individueel</Text>
              <Text style={styles.infoCardText}>
                Selecteer specifieke medewerkers
              </Text>
            </View>
          </View>
        </View>

        {/* Announcements List */}
        {announcements.length > 0 && (
          <View style={styles.listSection}>
            <Text style={styles.sectionTitle}>Bestaande Aankondigingen</Text>
            {announcements
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map((announcement) => (
              <View key={announcement.announcement_id} style={styles.announcementCard}>
                <View style={styles.announcementHeader}>
                  <View style={styles.announcementInfo}>
                    <Text style={styles.announcementTitle}>{announcement.title}</Text>
                    <Text style={styles.announcementMeta}>
                      {getAuthorName(announcement.author_id)} • {formatDate(announcement.created_at, 'dd-MM-yyyy, HH:mm')}
                    </Text>
                  </View>
                  <View style={styles.announcementActions}>
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={() => handleEditAnnouncement(announcement)}
                    >
                      <MaterialIcons name="edit" size={20} color={Colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={() => handleDeleteAnnouncement(announcement)}
                    >
                      <MaterialIcons name="delete" size={20} color={Colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.announcementMessage}>{announcement.message}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Aankondiging Popup */}
      <AnnouncementCreatePopup
        visible={announcementModalVisible}
        onClose={() => {
          setAnnouncementModalVisible(false);
          setSelectedAnnouncement(null);
        }}
        onSend={handleSendAnnouncement}
        isLoading={isSendingAnnouncement}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteConfirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteConfirmVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setDeleteConfirmVisible(false)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <MaterialIcons name="warning" size={48} color={Colors.error} />
              <Text style={styles.modalTitle}>Aankondiging Verwijderen</Text>
            </View>
            <Text style={styles.modalMessage}>
              Weet je zeker dat je de aankondiging "{announcementToDelete?.title}" wilt verwijderen?
              Dit kan niet ongedaan worden gemaakt.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setDeleteConfirmVisible(false)}
              >
                <Text style={styles.modalCancelText}>Annuleren</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={confirmDeleteAnnouncement}
              >
                <Text style={styles.modalConfirmText}>Verwijderen</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </StaffLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: Layout.screenPaddingLarge,
    paddingBottom: Spacing['3xl'],
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
  pageTitle: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  pageSubtitle: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
  },

  // Create Card
  createCard: {
    backgroundColor: Colors.background,
    padding: Spacing['2xl'],
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  createCardIcon: {
    marginBottom: Spacing.lg,
  },
  createCardTitle: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  createCardSubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  createCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  createCardButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textOnPrimary,
  },

  // Info Section
  infoSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  infoCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.lg,
  },
  infoCard: {
    flex: 1,
    minWidth: 240,
    backgroundColor: Colors.background,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'flex-start',
  },
  infoCardTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  infoCardText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },

  // Loading State
  loadingContainer: {
    padding: Layout.screenPaddingLarge,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
  },
  loadingText: {
    marginTop: Spacing.lg,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },

  // Announcements List
  listSection: {
    marginBottom: Spacing['2xl'],
  },
  announcementCard: {
    backgroundColor: Colors.background,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  announcementInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  announcementTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  announcementMeta: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  announcementMessage: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  announcementActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.backgroundSecondary,
  },

  // Delete Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing['2xl'],
    width: '90%',
    maxWidth: 400,
    ...Platform.select({
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      default: {
        elevation: 8,
      },
    }),
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  modalMessage: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing['2xl'],
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.border,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.error,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textOnPrimary,
  },
});
