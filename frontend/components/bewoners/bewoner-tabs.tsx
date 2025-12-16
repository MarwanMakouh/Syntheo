import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

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
});
