import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { NavigationBar } from '@/components';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { Colors, FontSize, FontWeight } from '@/constants';

export default function TabLayout() {
  const { currentUser } = useAuth();
  const { selectedRole } = useRole();

  // Check if user is Hoofdverpleegster
  const isHoofdverpleegster =
    currentUser?.role === 'Hoofdverpleegster' ||
    selectedRole === 'Hoofdverpleegster';

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: () => (Platform.OS !== 'web' ? <NavigationBar /> : null),
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: Platform.OS === 'web'
          ? { display: 'none' }
          : {
              backgroundColor: Colors.background,
              borderTopWidth: 1,
              borderTopColor: Colors.border,
              height: Platform.OS === 'ios' ? 88 : 65,
              paddingBottom: Platform.OS === 'ios' ? 28 : 10,
              paddingTop: 8,
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
            },
        tabBarLabelStyle: {
          fontSize: FontSize.xs,
          fontWeight: FontWeight.medium,
        },
      }}>
      <Tabs.Screen
        name="bewoners"
        options={{
          title: 'Bewoners',
          href: '/(tabs)/bewoners',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="medicatieronde"
        options={{
          title: 'Medicatie',
          href: '/(tabs)/medicatieronde',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="medical-services" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="meldingen"
        options={{
          title: 'Meldingen',
          href: '/(tabs)/meldingen',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="notifications" size={size} color={color} />
          ),
        }}
      />
      {/* Menu tab - only for Hoofdverpleegster on mobile */}
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          href: isHoofdverpleegster && Platform.OS !== 'web' ? '/(tabs)/menu' : null,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="menu" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
