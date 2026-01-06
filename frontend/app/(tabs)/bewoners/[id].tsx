import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
  ContactCard,
  BewonerDetailHeader,
  BewonerTabs,
  MeldingCard,
  NieuweMeldingModal,
  MedicatieSchema,
  MedicatieHistoriek,
  DieetInformatie,
  type TabType,
} from '@/components';
import { formatDate } from '@/utils';
import {
  getResidentById,
  getContactsForResident,
  getMedicationForResident,
  medicationRounds,
  rooms,
  users,
} from '@/Services';
import { fetchNotesByResident, createNote } from '@/Services/notesApi';
import { fetchResMedicationsByResident } from '@/Services/resMedicationsApi';
import { createChangeRequest } from '@/Services/changeRequestsApi';
import type { Note } from '@/types/note';
import type { CreateChangeRequestData } from '@/types/changeRequest';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Layout } from '@/constants';

export default function BewonerInfoScreen() {
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('Info');
  const [showNewNoteModal, setShowNewNoteModal] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [medications, setMedications] = useState<any[]>([]);
  const [loadingMedications, setLoadingMedications] = useState(false);
  const [currentUserId] = useState(1); // TODO: Get from auth context

  const resident = getResidentById(Number(id));
  const roomData = rooms.find(r => r.resident_id === Number(id));
  const contacts = getContactsForResident(Number(id));
  const allergies = getAllergiesForResident(Number(id));
  const residentDiets = diets.filter(d => d.resident_id === Number(id));
  const medications = getMedicationForResident(Number(id));

  // Load notes from backend when component mounts or when switching to Meldingen tab
  useEffect(() => {
    if (activeTab === 'Meldingen') {
      loadNotes();
    }
  }, [activeTab]);

  // Load medications from backend when component mounts or when switching to Medicatie tab
  useEffect(() => {
    if (activeTab === 'Medicatie') {
      loadMedications();
    }
  }, [activeTab]);

  const loadNotes = async () => {
    try {
      setLoadingNotes(true);
      const fetchedNotes = await fetchNotesByResident(Number(id));
      setNotes(fetchedNotes);
    } catch (error) {
      console.error('Failed to load notes:', error);
      Alert.alert('Fout', 'Kon meldingen niet laden. Controleer of de backend server draait.');
    } finally {
      setLoadingNotes(false);
    }
  };

  const loadMedications = async () => {
    try {
      setLoadingMedications(true);
      const fetchedMedications = await fetchResMedicationsByResident(Number(id));
      setMedications(fetchedMedications);
    } catch (error) {
      console.error('Failed to load medications:', error);
      Alert.alert('Fout', 'Kon medicatie niet laden. Controleer of de backend server draait.');
    } finally {
      setLoadingMedications(false);
    }
  };

  // Generate 7-day history
  const generateHistoriek = () => {
    const historiek = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      // Check medication rounds for this date
      const dayRounds = medicationRounds.filter(round =>
        round.scheduled_time?.startsWith(dateString) &&
        round.status === 'Gegeven'
      );

      const ochtend = dayRounds.some(round => {
        if (!round.scheduled_time) return false;
        const hour = parseInt(round.scheduled_time.split('T')[1].split(':')[0]);
        return hour >= 6 && hour < 10;
      });

      const middag = dayRounds.some(round => {
        if (!round.scheduled_time) return false;
        const hour = parseInt(round.scheduled_time.split('T')[1].split(':')[0]);
        return hour >= 10 && hour < 14;
      });

      const avond = dayRounds.some(round => {
        if (!round.scheduled_time) return false;
        const hour = parseInt(round.scheduled_time.split('T')[1].split(':')[0]);
        return hour >= 18 && hour < 22;
      });

      const nacht = dayRounds.some(round => {
        if (!round.scheduled_time) return false;
        const hour = parseInt(round.scheduled_time.split('T')[1].split(':')[0]);
        return hour >= 22 || hour < 6;
      });

      historiek.push({
        date: dateString,
        ochtend,
        middag,
        avond,
        nacht,
      });
    }

    return historiek;
  };

  const medicatieHistoriek = generateHistoriek();

  if (!resident) {
    return (
      <View style={styles.container}>
        <Text>Bewoner niet gevonden</Text>
      </View>
    );
  }

  const handleCall = (phone: string) => {
    const phoneNumber = phone.replace(/\s/g, '');
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleSaveNote = async (melding: {
    type: string;
    content: string;
    urgency: 'Laag' | 'Matig' | 'Hoog';
  }) => {
    try {
      await createNote({
        resident_id: Number(id),
        category: melding.type,
        urgency: melding.urgency,
        content: melding.content,
      });
      setShowNewNoteModal(false);

      // Refresh notes list
      await loadNotes();

      Alert.alert('Succes', 'Melding succesvol opgeslagen!');
    } catch (error) {
      console.error('Failed to create note:', error);
      Alert.alert('Fout', 'Kon melding niet opslaan. Probeer opnieuw.');
    }
  };

  const handleSaveDietChanges = async (changeRequestData: CreateChangeRequestData) => {
    try {
      await createChangeRequest(changeRequestData);

      Alert.alert(
        'Succes',
        'Wijzigingsverzoek ingediend! De wijzigingen worden ter goedkeuring naar de hoofdverpleegkundige gestuurd.'
      );
    } catch (error) {
      console.error('Failed to create change request:', error);
      Alert.alert(
        'Fout',
        'Kon wijzigingsverzoek niet indienen. Probeer opnieuw.'
      );
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Info':
        return (
          <View style={styles.contentContainer}>
            {/* Persoonlijke Info */}
            <View style={styles.infoGrid}>
              <View style={styles.infoRow}>
                <View style={styles.infoColumn}>
                  <Text style={styles.infoLabel}>Volledige Naam</Text>
                  <Text style={styles.infoValue}>{resident.name}</Text>
                </View>
                <View style={styles.infoColumn}>
                  <Text style={styles.infoLabel}>Geboortedatum</Text>
                  <Text style={styles.infoValue}>{formatDate(resident.date_of_birth)}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoColumn}>
                  <Text style={styles.infoLabel}>Kamer</Text>
                  <Text style={styles.infoValue}>{roomData?.room_id || '-'}</Text>
                </View>
                <View style={styles.infoColumn}>
                  <Text style={styles.infoLabel}>Verdieping</Text>
                  <Text style={styles.infoValue}>{roomData?.floor_id || '-'}</Text>
                </View>
              </View>
            </View>

            {/* Contactpersonen */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contactpersonen</Text>
              {contacts.map((contact) => (
                <ContactCard
                  key={contact.contact_id}
                  contact={contact}
                  onCall={handleCall}
                />
              ))}
            </View>
          </View>
        );
      case 'Meldingen':
        return (
          <View style={styles.meldingenContainer}>
            <TouchableOpacity
              style={styles.newNoteButton}
              onPress={() => setShowNewNoteModal(true)}
            >
              <MaterialIcons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.newNoteButtonText}>Nieuwe Melding</Text>
            </TouchableOpacity>

            {loadingNotes ? (
              <View style={styles.emptyMeldingen}>
                <Text style={styles.emptyText}>Meldingen laden...</Text>
              </View>
            ) : notes.length > 0 ? (
              notes.map((note) => {
                const author = users.find(u => u.user_id === note.author_id);
                return (
                  <MeldingCard
                    key={note.note_id}
                    note={note}
                    authorName={author?.name || 'Onbekend'}
                  />
                );
              })
            ) : (
              <View style={styles.emptyMeldingen}>
                <Text style={styles.emptyText}>Geen meldingen gevonden</Text>
              </View>
            )}
          </View>
        );
      case 'Medicatie':
        return (
          <ScrollView style={styles.medicatieContainer}>
            {loadingMedications ? (
              <View style={styles.emptyMeldingen}>
                <Text style={styles.emptyText}>Medicatie laden...</Text>
              </View>
            ) : (
              <>
                <MedicatieSchema medications={medications} />
                <MedicatieHistoriek historiek={medicatieHistoriek} />
              </>
            )}
          </ScrollView>
        );
      case 'Dieet':
        return (
          <DieetInformatie
            residentId={Number(id)}
            currentUserId={currentUserId}
            onSaveChanges={handleSaveDietChanges}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Bewoner Header */}
        <BewonerDetailHeader
          resident={resident}
          roomNumber={roomData?.room_id || null}
          floorNumber={roomData?.floor_id || null}
        />

        {/* Tabs */}
        <BewonerTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>

      {/* Nieuwe Melding Modal */}
      <NieuweMeldingModal
        visible={showNewNoteModal}
        onClose={() => setShowNewNoteModal(false)}
        onSave={handleSaveNote}
        residentId={Number(id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: Colors.background,
    margin: Layout.screenPadding,
    padding: Layout.screenPaddingLarge,
    borderRadius: BorderRadius.lg,
    ...Platform.select({
      web: {
        maxWidth: 800,
        alignSelf: 'center',
        width: '100%',
      },
    }),
  },
  infoGrid: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 20,
  },
  infoColumn: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Layout.screenPadding,
  },
  placeholderText: {
    fontSize: FontSize.lg,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: 40,
  },
  meldingenContainer: {
    padding: Layout.screenPadding,
    ...Platform.select({
      web: {
        maxWidth: 800,
        alignSelf: 'center',
        width: '100%',
      },
    }),
  },
  newNoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.success,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Layout.screenPaddingLarge,
    borderRadius: BorderRadius.md,
    marginBottom: Layout.screenPadding,
    alignSelf: 'flex-start',
  },
  newNoteButtonText: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    marginLeft: Spacing.md,
  },
  emptyMeldingen: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['6xl'],
  },
  emptyText: {
    fontSize: FontSize.lg,
    color: Colors.textMuted,
  },
  medicatieContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
