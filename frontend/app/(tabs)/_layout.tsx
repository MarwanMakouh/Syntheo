import { Tabs } from 'expo-router';
import React from 'react';

import { NavigationBar } from '@/components/navigation-bar';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: () => <NavigationBar />,
        tabBarStyle: { display: 'none' },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
        }}
      />
    </Tabs>
  );
}
