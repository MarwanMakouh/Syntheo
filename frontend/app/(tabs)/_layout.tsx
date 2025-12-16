import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { NavigationBar } from '@/components/navigation-bar';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: () => <NavigationBar />,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#666666',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          height: Platform.OS === 'ios' ? 88 : Platform.OS === 'android' ? 65 : 60,
          paddingBottom: Platform.OS === 'ios' ? 28 : Platform.OS === 'android' ? 10 : 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="bewoners"
        options={{
          title: 'Bewoners',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="medicatieronde"
        options={{
          title: 'Medicatie',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="medical-services" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="meldingen"
        options={{
          title: 'Meldingen',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="notifications" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
