import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BaseSidebarLayout } from '@/components/shared/base-sidebar-layout';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';

interface StaffLayoutProps {
  children: React.ReactNode;
  activeRoute?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  route: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export function StaffLayout({
  children,
  activeRoute,
}: StaffLayoutProps) {
  const { currentUser } = useAuth();
  const { selectedRole } = useRole();

  // Check both currentUser.role and selectedRole
  const isHoofdverpleegster =
    currentUser?.role === 'Hoofdverpleegster' ||
    selectedRole === 'Hoofdverpleegster';

  const navSections: NavSection[] = [
    // Dashboard section (only for Hoofdverpleegster)
    ...(isHoofdverpleegster ? [{
      title: '',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' as const, route: '/dashboard' },
      ],
    }] : []),
    // Main care section
    {
      title: 'ZORGVERLENING',
      items: [
        { id: 'bewoners', label: 'Bewoners', icon: 'people', route: '/(tabs)/bewoners' },
        { id: 'medicatie', label: 'Medicatie', icon: 'medical-services', route: '/(tabs)/medicatieronde' },
        { id: 'meldingen', label: 'Meldingen', icon: 'notifications', route: '/(tabs)/meldingen' },
      ],
    },
    // Management section (only for Hoofdverpleegster)
    ...(isHoofdverpleegster ? [{
      title: 'BEHEER',
      items: [
        { id: 'wijzigingsverzoeken', label: 'Wijzigingsverzoeken', icon: 'description' as const, route: '/wijzigingsverzoeken' },
        { id: 'kamerbeheer', label: 'Kamerbeheer', icon: 'meeting-room' as const, route: '/kamerbeheer' },
        { id: 'aankondigingen', label: 'Aankondigingen', icon: 'campaign' as const, route: '/aankondigingen' },
      ],
    }] : []),
  ];

  const profileRole = isHoofdverpleegster ? 'Hoofdverpleegster' : 'Verpleegster';

  return (
    <BaseSidebarLayout
      navSections={navSections}
      activeRoute={activeRoute}
      profileRole={profileRole}
    >
      {children}
    </BaseSidebarLayout>
  );
}
