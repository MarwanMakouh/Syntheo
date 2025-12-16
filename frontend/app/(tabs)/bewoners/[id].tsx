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
  type TabType,
} from '@/components';
import { formatDate } from '@/utils';
import {
  getResidentById,
  getContactsForResident,
  getNotesForResident,
  rooms,
  users,
} from '@/services';

export default function BewonerInfoScreen() {
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('Info');

  const resident = getResidentById(Number(id));
  const roomData = rooms.find(r => r.resident_id === Number(id));
  const contacts = getContactsForResident(Number(id));
  const notes = getNotesForResident(Number(id));

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
            <TouchableOpacity style={styles.newNoteButton}>
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
          <View style={styles.contentContainer}>
            <Text style={styles.placeholderText}>Medicatie komt binnenkort...</Text>
          </View>
        );
      case 'Dieet':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.placeholderText}>Dieet komt binnenkort...</Text>
          </View>
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
});
