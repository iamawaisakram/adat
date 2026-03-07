import 'react-native-reanimated';

import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider } from 'tamagui';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { runAutoGenerateNotes } from '@/lib/auto-generate-notes';
import { rescheduleAllTaskReminders } from '@/lib/notifications';
import { queryClient } from '@/lib/query-client';

import tamaguiConfig from '../tamagui.config';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    runAutoGenerateNotes().then(() => {
      void queryClient.invalidateQueries({ queryKey: ['notes'] });
    });
  }, []);

  useEffect(() => {
    void rescheduleAllTaskReminders();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <TamaguiProvider
          config={tamaguiConfig}
          defaultTheme={colorScheme ?? "light"}
        >
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="note/[id]"
                options={{ title: "Note", headerShown: true }}
              />
              <Stack.Screen
                name="template"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="schedule"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(modals)"
                options={{
                  presentation: 'modal',
                  headerShown: false,
                }}
              />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </TamaguiProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
