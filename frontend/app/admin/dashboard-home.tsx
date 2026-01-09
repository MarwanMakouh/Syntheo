import { StyleSheet, View, Text, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { AdminLayout, ActionCard, ActivityTimeline, type ActivityItem } from '@/components/admin';
import { RoleGuard } from '@/components';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Layout } from '@/constants';

export default function DashboardHomeScreen() {
  const router = useRouter();

  // Mock data - later te vervangen met echte API data
  const recentActivities: ActivityItem[] = [
    {
      id: 1,
      description: 'Sarah Janssens heeft notitie toegevoegd voor Jan Pieters',
      timestamp: '18/11 14:35',
      type: 'success',
    },
    {
      id: 2,
      description: 'Wijzigingsverzoek goedgekeurd voor Anna Van Berg',
      timestamp: '18/11 12:20',
      type: 'success',
    },
    {
      id: 3,
      description: 'Nieuw personeelslid toegevoegd: Lisa Vermeulen',
      timestamp: '17/11 16:45',
      type: 'warning',
    },
  ];

  const handleBewonersBeheren = () => {
    router.push('/admin/dashboard-bewoners');
  };

  const handlePersoneelBeheren = () => {
    router.push('/admin/dashboard-gebruikers');
  };

  const handleAuditlogboek = () => {
    router.push('/admin/dashboard-audit-logs');
  };

  return (
    <RoleGuard allowedRoles={['Beheerder']}>
      <AdminLayout activeRoute="dashboard">
        <ScrollView style={styles.container}>
          <View style={styles.content}>
            {/* Page Title */}
            <Text style={styles.pageTitle}>Beheerder Dashboard</Text>

          {/* Action Cards */}
          <View style={styles.cardsContainer}>
            <View style={styles.cardWrapper}>
              <ActionCard
                title="Personeel Beheren"
                description="Gebruikersaccounts toevoegen en beheren"
                icon="person-add"
                iconColor={Colors.success}
                onPress={handlePersoneelBeheren}
              />
            </View>
            <View style={styles.cardWrapper}>
              <ActionCard
                title="Bewoners Beheren"
                description="Bewoners toevoegen, bewerken of verwijderen"
                icon="group"
                iconColor={Colors.success}
                onPress={handleBewonersBeheren}
              />
            </View>
            <View style={styles.cardWrapper}>
              <ActionCard
                title="Auditlogboek"
                description="Bekijk alle systeemacties"
                icon="assignment"
                iconColor={Colors.success}
                onPress={handleAuditlogboek}
              />
            </View>
          </View>

          {/* Recent Activity Section */}
          <View style={styles.activitySection}>
            <Text style={styles.sectionTitle}>Recente Activiteit</Text>
            <View style={styles.activityContainer}>
              <ActivityTimeline activities={recentActivities} />
            </View>
          </View>
        </View>
      </ScrollView>
    </AdminLayout>
    </RoleGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  content: {
    padding: Layout.screenPaddingLarge,
    ...Platform.select({
      web: {
        maxWidth: 1400,
        alignSelf: 'center',
        width: '100%',
      },
    }),
  },
  pageTitle: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing['3xl'],
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.md,
    marginBottom: Spacing['3xl'],
  },
  cardWrapper: {
    width: Platform.OS === 'web' ? '33.333%' : '100%',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
  },
  activitySection: {
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xl,
  },
  activityContainer: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing['2xl'],
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
