import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Image,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants';
import type { Resident } from '@/types/resident';
import { formatDate } from '@/utils';

interface ResidentDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  resident: Resident | null;
  roomNumber?: string;
  age?: number;
}

export function ResidentDetailsModal({
  visible,
  onClose,
  resident,
  roomNumber,
  age,
}: ResidentDetailsModalProps) {
  if (!resident) return null;

  const contacts = resident.contacts || [];
  const allergies = resident.allergies || [];
  const diet = resident.diet;

  const handleCall = (phone: string) => {
    const phoneNumber = phone.replace(/\s/g, '');
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bewoner Details</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
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
          {/* Bewoner Header met foto */}
          <View style={styles.residentHeader}>
            {resident.photo_url ? (
              <Image
                source={{ uri: resident.photo_url }}
                style={styles.residentPhoto}
              />
            ) : (
              <View style={[styles.residentPhoto, styles.residentPhotoPlaceholder]}>
                <Ionicons name="person" size={48} color={Colors.textSecondary} />
              </View>
            )}
            <View style={styles.residentHeaderInfo}>
              <Text style={styles.residentName}>{resident.name}</Text>
              {age && (
                <Text style={styles.residentAge}>{age} jaar</Text>
              )}
            </View>
          </View>

          {/* Algemene Informatie */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Algemene Informatie</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Geboortedatum</Text>
                    <Text style={styles.infoValue}>
                      {formatDate(resident.date_of_birth, 'dd-MM-yyyy')}
                    </Text>
                  </View>
                </View>
              </View>

              {roomNumber && (
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Ionicons name="home-outline" size={20} color={Colors.primary} />
                    <View style={styles.infoTextContainer}>
                      <Text style={styles.infoLabel}>Kamer</Text>
                      <Text style={styles.infoValue}>{roomNumber}</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Contactpersonen */}
          {contacts.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contactpersonen</Text>
              {contacts.map((contact: any) => (
                <View key={contact.contact_id} style={styles.contactCard}>
                  <View style={styles.contactHeader}>
                    <Ionicons name="person-circle-outline" size={24} color={Colors.primary} />
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactName}>{contact.name}</Text>
                      <Text style={styles.contactRelation}>{contact.relationship}</Text>
                    </View>
                  </View>
                  {contact.phone_number && (
                    <TouchableOpacity
                      style={styles.contactDetail}
                      onPress={() => handleCall(contact.phone_number)}
                    >
                      <Ionicons name="call-outline" size={18} color={Colors.primary} />
                      <Text style={styles.contactDetailText}>{contact.phone_number}</Text>
                    </TouchableOpacity>
                  )}
                  {contact.email && (
                    <View style={styles.contactDetail}>
                      <Ionicons name="mail-outline" size={18} color={Colors.textSecondary} />
                      <Text style={styles.contactDetailText}>{contact.email}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Allergieën */}
          {allergies.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Allergieën</Text>
              <View style={styles.allergiesCard}>
                {allergies.map((allergy: any, index: number) => (
                  <View key={allergy.allergy_id || index} style={styles.allergyItem}>
                    <Ionicons name="warning-outline" size={20} color={Colors.error} />
                    <View style={styles.allergyInfo}>
                      <Text style={styles.allergyName}>{allergy.substance}</Text>
                      {allergy.severity && (
                        <Text style={styles.allergySeverity}>
                          Ernst: {allergy.severity}
                        </Text>
                      )}
                      {allergy.symptoms && (
                        <Text style={styles.allergySymptoms}>{allergy.symptoms}</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Dieet */}
          {diet && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dieet Informatie</Text>
              <View style={styles.dietCard}>
                {diet.diet_type && (
                  <View style={styles.dietItem}>
                    <Ionicons name="restaurant-outline" size={20} color={Colors.primary} />
                    <View style={styles.dietInfo}>
                      <Text style={styles.dietLabel}>Dieet Type</Text>
                      <Text style={styles.dietValue}>{diet.diet_type}</Text>
                    </View>
                  </View>
                )}
                {diet.texture && (
                  <View style={styles.dietItem}>
                    <Ionicons name="nutrition-outline" size={20} color={Colors.primary} />
                    <View style={styles.dietInfo}>
                      <Text style={styles.dietLabel}>Textuur</Text>
                      <Text style={styles.dietValue}>{diet.texture}</Text>
                    </View>
                  </View>
                )}
                {diet.consistency && (
                  <View style={styles.dietItem}>
                    <Ionicons name="water-outline" size={20} color={Colors.primary} />
                    <View style={styles.dietInfo}>
                      <Text style={styles.dietLabel}>Consistentie</Text>
                      <Text style={styles.dietValue}>{diet.consistency}</Text>
                    </View>
                  </View>
                )}
                {diet.extra_information && (
                  <View style={styles.dietItem}>
                    <Ionicons name="information-circle-outline" size={20} color={Colors.primary} />
                    <View style={styles.dietInfo}>
                      <Text style={styles.dietLabel}>Extra Informatie</Text>
                      <Text style={styles.dietValue}>{diet.extra_information}</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Lege states */}
          {contacts.length === 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contactpersonen</Text>
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Geen contactpersonen geregistreerd</Text>
              </View>
            </View>
          )}

          {allergies.length === 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Allergieën</Text>
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Geen allergieën geregistreerd</Text>
              </View>
            </View>
          )}

          {!diet && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dieet Informatie</Text>
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Geen dieet informatie beschikbaar</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Close Button */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.closeButtonBottom}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Sluiten</Text>
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
    backgroundColor: Colors.background,
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
  residentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing['2xl'],
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing['2xl'],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  residentPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.backgroundSecondary,
  },
  residentPhotoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  residentHeaderInfo: {
    marginLeft: Spacing.xl,
    flex: 1,
  },
  residentName: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  residentAge: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: Spacing['2xl'],
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  infoCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoRow: {
    marginBottom: Spacing.lg,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoTextContainer: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  infoLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  infoValue: {
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
  },
  contactCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  contactInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  contactName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  contactRelation: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  contactDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  contactDetailText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginLeft: Spacing.sm,
  },
  allergiesCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  allergyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  allergyInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  allergyName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  allergySeverity: {
    fontSize: FontSize.sm,
    color: Colors.error,
    marginBottom: Spacing.xs,
  },
  allergySymptoms: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  dietCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dietItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  dietInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  dietLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  dietValue: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
  },
  emptyState: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing['2xl'],
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  actionContainer: {
    padding: Spacing['2xl'],
    paddingBottom: Platform.OS === 'ios' ? 40 : Spacing['2xl'],
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  closeButtonBottom: {
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  closeButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textOnPrimary,
  },
});
