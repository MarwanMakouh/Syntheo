import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants';

export type TabType = 'Info' | 'Notities' | 'Medicatie' | 'Dieet';

interface BewonerTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TABS: TabType[] = ['Info', 'Notities', 'Medicatie', 'Dieet'];

export function BewonerTabs({ activeTab, onTabChange }: BewonerTabsProps) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tab,
            activeTab === tab && styles.activeTab,
          ]}
          onPress={() => onTabChange(tab)}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.navAccent,
  },
  tabText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  activeTabText: {
    color: Colors.navAccent,
    fontWeight: FontWeight.semibold,
  },
});
