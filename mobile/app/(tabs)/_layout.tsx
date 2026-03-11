import React from 'react';
import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerStyle: {
          backgroundColor: Colors[colorScheme].background,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarStyle: {
          height: 85,
          paddingBottom: 25,
          backgroundColor: '#000',
          borderTopWidth: 1,
          borderTopColor: '#222',
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name="house.fill"
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Inventory',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name="package.fill"
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="stock-in"
        options={{
          title: 'Stock In',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name="plus.circle.fill"
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name="exclamationmark.triangle.fill"
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
