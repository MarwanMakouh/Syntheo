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
import { useLocalSearchParams, useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
  getResidentById,
  getRoomNumber,
  getContactsForResident,
  rooms,
} from '@/Services/API';

type TabType = 'Info' | 'Notities' | 'Medicatie' | 'Dieet';

export default function Bewoner DetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    };
    return date.toLocaleDateString('nl-NL', options);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

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
                <View key={contact.contact_id} style={styles.contactCard}>
                  <View style={styles.contactIcon}>
                    <MaterialIcons name="person" size={20} color="#666666" />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <Text style={styles.contactRelation}>{contact.relation}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.phoneButton}
                    onPress={() => handleCall(contact.phone)}
                  >
                    <MaterialIcons name="phone" size={20} color="#666666" />
                    <Text style={styles.phoneText}>{contact.phone}</Text>
                  </TouchableOpacity>
                </View>
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
      {/* Header met terug knop */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#00A86B" />
          <Text style={styles.backText}>Terug naar Dashboard</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Bewoner Header */}
        <View style={styles.residentHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(resident.name)}</Text>
          </View>
          <View style={styles.residentInfo}>
            <Text style={styles.residentName}>{resident.name}</Text>
            <Text style={styles.residentDetails}>
              Kamer {roomData?.room_id} · Verdieping {roomData?.floor_id}
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {(['Info', 'Notities', 'Medicatie', 'Dieet'] as TabType[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

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
  header: {
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'ios' ? 50 : Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#00A86B',
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  residentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#666666',
  },
  residentInfo: {
    marginLeft: 16,
    flex: 1,
  },
  residentName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  residentDetails: {
    fontSize: 14,
    color: '#666666',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#00A86B',
  },
  tabText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#00A86B',
    fontWeight: '600',
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
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  contactRelation: {
    fontSize: 14,
    color: '#666666',
  },
  phoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  phoneText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 6,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    paddingVertical: 40,
  },
});
