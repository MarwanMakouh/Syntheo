import { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { MeldingenFilterDropdown } from '@/components/MeldingenFilterDropdown';
import { MeldingCard } from '@/components/MeldingCard';
import { MeldingDetailsModal } from '@/components/MeldingDetailsModal';
import { NieuweMeldingModal } from '@/components';
import { notes, getResidentById, getUserById, residents } from '@/Services/API';

// Helper function to format time ago
const getTimeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} min geleden`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} uur geleden`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} dag${days > 1 ? 'en' : ''} geleden`;
  }
};

// Format timestamp for modal
const formatTimestamp = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}-${month}-${year}, ${hours}:${minutes}`;
};

// Get status for each note
const getStatus = (note: any): 'open' | 'in_behandeling' | 'afgehandeld' => {
  if (note.is_resolved) {
    return 'afgehandeld';
  }
  // Check if note has been viewed/acknowledged (for demo, we'll mark some as "in behandeling")
  if (note.note_id === 4 || note.note_id === 6) {
    return 'in_behandeling';
  }
  return 'open';
};

// Map status to display text
const getStatusDisplayText = (status: 'open' | 'in_behandeling' | 'afgehandeld'): string => {
  switch (status) {
    case 'open':
      return 'Open';
    case 'in_behandeling':
      return 'Behandeling';
    case 'afgehandeld':
      return 'Afgehandeld';
    default:
      return 'Open';
  }
};

export default function MeldingenScreen() {
  const [selectedMelding, setSelectedMelding] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showNewMeldingModal, setShowNewMeldingModal] = useState(false);

  const handleNewMelding = () => {
    setShowNewMeldingModal(true);
  };

  const handleSaveNewMelding = (melding: {
    type: string;
    content: string;
    urgency: 'Laag' | 'Matig' | 'Hoog';
    resident_id?: number;
  }) => {
    // TODO: Save to backend when ready
    console.log('Nieuwe melding:', melding);
    setShowNewMeldingModal(false);
    alert('Melding opgeslagen! (Demo mode - wordt niet bewaard)');
  };

  const handleOpenMelding = (note: any) => {
    const resident = getResidentById(note.resident_id);
    const author = getUserById(note.author_id);
    const status = getStatus(note);

    setSelectedMelding({
      residentName: resident?.name || 'Onbekend',
      category: note.category,
      urgency: note.urgency,
      reportedBy: author?.name || 'Onbekend',
      timestamp: formatTimestamp(note.created_at),
      description: note.content,
      status: getStatusDisplayText(status),
    });
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedMelding(null);
  };

  const handleSaveMelding = (status: string) => {
    console.log('Save melding with status:', status);
    // Here you would update the melding in your backend/state
  };

  return (
    <View style={styles.container}>
      {/* Header with Filter and New Button */}
      <View style={styles.header}>
        <MeldingenFilterDropdown />
        <TouchableOpacity style={styles.newButton} onPress={handleNewMelding}>
          <MaterialIcons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.newButtonText}>Nieuwe Melding</Text>
        </TouchableOpacity>
      </View>

      {/* Meldingen List */}
      <ScrollView style={styles.meldingenList}>
        {notes.map((note) => {
          const resident = getResidentById(note.resident_id);
          const status = getStatus(note);

          return (
            <MeldingCard
              key={note.note_id}
              residentName={resident?.name || 'Onbekend'}
              description={note.content}
              timeAgo={getTimeAgo(note.created_at)}
              urgency={note.urgency as 'Hoog' | 'Matig' | 'Laag'}
              status={status}
              onPress={() => handleOpenMelding(note)}
            />
          );
        })}
      </ScrollView>

      {/* Details Modal */}
      {selectedMelding && (
        <MeldingDetailsModal
          visible={modalVisible}
          onClose={handleCloseModal}
          melding={selectedMelding}
          onSave={handleSaveMelding}
        />
      )}

      {/* Nieuwe Melding Modal */}
      <NieuweMeldingModal
        visible={showNewMeldingModal}
        onClose={() => setShowNewMeldingModal(false)}
        onSave={handleSaveNewMelding}
        residents={residents}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 16,
    zIndex: 1000,
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5B47FB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  newButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  meldingenList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});
