import { Tabs } from 'expo-router';

import { Icon, type IconName } from '@/components/ui/icon';

function tabIcon(name: IconName) {
  return function TabIcon({ color, size }: { color: string; size: number }) {
    return <Icon name={name} size={size} color={color} />;
  };
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0a84ff',
      }}>
      <Tabs.Screen
        name="index"
        options={{ title: 'Notes', tabBarIcon: tabIcon('notes') }}
      />
      <Tabs.Screen
        name="templates"
        options={{ title: 'Templates', tabBarIcon: tabIcon('template') }}
      />
      <Tabs.Screen
        name="schedules"
        options={{ title: 'Schedules', tabBarIcon: tabIcon('calendar') }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: 'Settings', tabBarIcon: tabIcon('settings') }}
      />
    </Tabs>
  );
}
