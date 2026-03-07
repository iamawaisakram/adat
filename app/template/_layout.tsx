import { Stack } from 'expo-router';

export default function TemplateLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="new" options={{ title: 'New template' }} />
      <Stack.Screen name="[id]" options={{ title: 'Template' }} />
    </Stack>
  );
}
