import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Platform,
  Linking,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
  ContactCard,
  BewonerDetailHeader,
  BewonerTabs,
  type TabType,
} from '@/components';
import { formatDate } from '@/utils';
import {
  getResidentById,
  getContactsForResident,
  rooms,
} from '@/services';

export default function BewonerInfoScreen() {
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('Info');

  const resident = getResidentById(Number(id));
  const roomData = rooms.find(r => r.resident_id === Number(id));
  const contacts = getContactsForResident(Number(id));

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
          <View style={styles.contentContainer}>
            <Text style={styles.placeholderText}>Notities komen binnenkort...</Text>
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
});
