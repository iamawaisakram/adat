import { Stack } from 'expo-router';

export default function ScheduleLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="new" options={{ title: 'New schedule' }} />
      <Stack.Screen name="[id]" options={{ title: 'Schedule' }} />
    </Stack>
  );
}
