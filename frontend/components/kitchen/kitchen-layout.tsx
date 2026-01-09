import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BaseSidebarLayout } from '@/components';

interface KitchenLayoutProps {
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

export function KitchenLayout({ 
  children, 
  activeRoute, 
}: KitchenLayoutProps) {
  const navSections: NavSection[] = [
    {
      title: 'KEUKEN',
      items: [
        { id: 'allergieen', label: 'Allergieën', icon: 'warning', route: '/(kitchen-tabs)/allergieen' },
        { id: 'dieten', label: 'Diëten & Voorkeuren', icon: 'restaurant-menu', route: '/(kitchen-tabs)/dieten' },
      ],
    },
  ];

  return (
    <BaseSidebarLayout
      navSections={navSections}
      activeRoute={activeRoute}
      profileRole="Keuken Personeel"
    >
      {children}
    </BaseSidebarLayout>
  );
}
