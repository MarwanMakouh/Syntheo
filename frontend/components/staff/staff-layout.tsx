import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BaseSidebarLayout } from '@/components/shared/base-sidebar-layout';
import { useAuth } from '@/contexts/AuthContext';

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
  
  const isHoofdverpleegster = currentUser?.role === 'Hoofdverpleegster';

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
