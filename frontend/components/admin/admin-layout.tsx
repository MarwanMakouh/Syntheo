import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BaseSidebarLayout } from '@/components/shared/base-sidebar-layout';

interface AdminLayoutProps {
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

export function AdminLayout({ children, activeRoute = 'dashboard' }: AdminLayoutProps) {
  const navSections: NavSection[] = [
    {
      title: '',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard-home' },
      ],
    },
    {
      title: 'BEHEER',
      items: [
        { id: 'medicatie-beheer', label: 'Medicatie Beheer', icon: 'medication', route: '/(medication-management-tabs)' },
        { id: 'gebruikers', label: 'Personeel', icon: 'group', route: '/admin/dashboard-gebruikers' },
        { id: 'bewoners', label: 'Bewoners', icon: 'people', route: '/admin/dashboard-bewoners' },
        { id: 'kamers', label: 'Kamers', icon: 'meeting-room', route: '/admin/dashboard-kamers' },
      ],
    },
    {
      title: 'COMMUNICATIE',
      items: [
        { id: 'wijzigingsverzoeken', label: 'Wijzigingsverzoeken', icon: 'edit', route: '/admin/dashboard-wijzigingsverzoeken' },
        { id: 'meldingen', label: 'Meldingen', icon: 'message', route: '/admin/dashboard-meldingen' },
        { id: 'announcements', label: 'Announcements', icon: 'campaign', route: '/admin/dashboard-announcements' },
      ],
    },
    {
      title: 'SYSTEEM',
      items: [
        { id: 'audit-logs', label: 'Audit Logs', icon: 'description', route: '/admin/dashboard-audit-logs' },
      ],
    },
  ];

  return (
    <BaseSidebarLayout
      navSections={navSections}
      activeRoute={activeRoute}
      profileRole="Admin"
    >
      {children}
    </BaseSidebarLayout>
  );
}
