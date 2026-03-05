import 'react-native-reanimated';

import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider } from 'tamagui';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { queryClient } from '@/lib/query-client';

import tamaguiConfig from '../tamagui.config';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme ?? 'light'}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="note/[id]"
              options={{ title: 'Note', headerShown: true }}
            />
            <Stack.Screen
              name="note/new"
              options={{ title: 'New note', headerShown: true }}
            />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </TamaguiProvider>
    </QueryClientProvider>
  );
}
