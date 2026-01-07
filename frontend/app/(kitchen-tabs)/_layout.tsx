import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { NavigationBar } from '@/components';
import { Colors, FontSize, FontWeight } from '@/constants';

export default function KitchenTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: () => <NavigationBar />,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          height: Platform.OS === 'ios' ? 88 : Platform.OS === 'android' ? 65 : 60,
          paddingBottom: Platform.OS === 'ios' ? 28 : Platform.OS === 'android' ? 10 : 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: FontSize.xs,
          fontWeight: FontWeight.medium,
        },
      }}>
      <Tabs.Screen
        name="allergieen"
        options={{
          title: 'Allergieën',
          href: '/(kitchen-tabs)/allergieen',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="warning" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dieten"
        options={{
          title: 'Diëten & Voorkeuren',
          href: '/(kitchen-tabs)/dieten',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="restaurant-menu" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
