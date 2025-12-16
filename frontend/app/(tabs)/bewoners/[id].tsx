import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
  ContactCard,
  BewonerDetailHeader,
  BewonerTabs,
  NotitieCard,
  NieuweNotitieModal,
  MedicatieSchema,
  MedicatieHistoriek,
  DieetInformatie,
  type TabType,
} from '@/components';
import { formatDate } from '@/utils';
import {
  getResidentById,
  getContactsForResident,
  getNotesForResident,
  getMedicationForResident,
  getAllergiesForResident,
  diets,
  medicationRounds,
  rooms,
  users,
} from '@/Services';

export default function BewonerInfoScreen() {
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('Info');
  const [showNewNoteModal, setShowNewNoteModal] = useState(false);

  const resident = getResidentById(Number(id));
  const roomData = rooms.find(r => r.resident_id === Number(id));
  const contacts = getContactsForResident(Number(id));
  const notes = getNotesForResident(Number(id));
  const medications = getMedicationForResident(Number(id));
  const allergies = getAllergiesForResident(Number(id));
  const residentDiets = diets.filter(d => d.resident_id === Number(id));

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

  const handleSaveNote = (notitie: {
    type: string;
    content: string;
    urgency: 'Laag' | 'Matig' | 'Hoog';
  }) => {
    // TODO: Save to backend when ready
    console.log('Nieuwe notitie:', notitie);
    setShowNewNoteModal(false);
    alert('Notitie opgeslagen! (Demo mode - wordt niet bewaard)');
  };

  const handleSaveDietChanges = (data: any) => {
    // TODO: Save to backend when ready
    console.log('Dieet wijzigingen:', data);
    alert('Verzoek ingediend! De wijzigingen worden ter goedkeuring naar de hoofdverpleegkundige gestuurd.');
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
      case 'Notities':
        return (
          <View style={styles.notitiesContainer}>
            <TouchableOpacity
              style={styles.newNoteButton}
              onPress={() => setShowNewNoteModal(true)}
            >
              <MaterialIcons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.newNoteButtonText}>Nieuwe Notitie</Text>
            </TouchableOpacity>

            {notes.length > 0 ? (
              notes.map((note) => {
                const author = users.find(u => u.user_id === note.author_id);
                return (
                  <NotitieCard
                    key={note.note_id}
                    note={note}
                    authorName={author?.name || 'Onbekend'}
                  />
                );
              })
            ) : (
              <View style={styles.emptyNotities}>
                <Text style={styles.emptyText}>Geen notities gevonden</Text>
              </View>
            )}
          </View>
        );
      case 'Medicatie':
        return (
          <ScrollView style={styles.medicatieContainer}>
            <MedicatieSchema medications={medications} />
            <MedicatieHistoriek historiek={medicatieHistoriek} />
          </ScrollView>
        );
      case 'Dieet':
        return (
          <DieetInformatie
            allergies={allergies}
            diets={residentDiets}
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

      {/* Nieuwe Notitie Modal */}
      <NieuweNotitieModal
        visible={showNewNoteModal}
        onClose={() => setShowNewNoteModal(false)}
        onSave={handleSaveNote}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
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
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    paddingVertical: 40,
  },
  notitiesContainer: {
    padding: 16,
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
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  newNoteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyNotities: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
  },
  medicatieContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
