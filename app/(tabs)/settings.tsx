import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Input, ScrollView, Text, YStack } from 'tamagui';

import { useDefaultReminderTime } from '@/hooks/use-settings';
import { useWidgetConfig } from '@/hooks/use-widget-config';
import { requestNotificationPermission } from '@/lib/notifications';
import { refreshWidgets } from '@/lib/refresh-widgets';
import { getPermissionsAsync } from 'expo-notifications/build/NotificationPermissions';
import Constants from 'expo-constants';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const {
    defaultReminderTime,
    setDefaultReminderTime,
    loaded: defaultTimeLoaded,
  } = useDefaultReminderTime();
  const [reminderTimeInput, setReminderTimeInput] = useState(defaultReminderTime);
  const [notificationStatus, setNotificationStatus] = useState<
    'granted' | 'denied' | 'undetermined' | null
  >(null);
  const { focusedTaskIds, noteWidgetNoteId, loaded: widgetConfigLoaded } =
    useWidgetConfig();

  useEffect(() => {
    getPermissionsAsync().then(({ status }) => setNotificationStatus(status));
  }, []);

  useEffect(() => {
    if (defaultTimeLoaded) setReminderTimeInput(defaultReminderTime);
  }, [defaultTimeLoaded, defaultReminderTime]);

  const handleSaveDefaultTime = () => {
    const trimmed = reminderTimeInput.trim();
    if (/^\d{1,2}:\d{2}$/.test(trimmed)) {
      setDefaultReminderTime(trimmed).catch(() => {});
    }
  };

  const handleRequestNotificationPermission = async () => {
    const granted = await requestNotificationPermission();
    const { status } = await getPermissionsAsync();
    setNotificationStatus(status);
    if (!granted) {
      // Open app settings so user can enable manually
      await Linking.openSettings();
    }
  };

  return (
    <ScrollView
      flex={1}
      backgroundColor="$background"
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 24,
      }}
      showsVerticalScrollIndicator={false}>
      <YStack gap="$4">
        <Text fontSize="$7" fontWeight="800" color="$color">
          Settings
        </Text>

        <YStack gap="$2">
          <Text fontSize="$4" fontWeight="600" color="$color">
            Default reminder time
          </Text>
          <Text fontSize="$2" color="$gray11">
            Used when you set a new daily reminder (e.g. 09:00).
          </Text>
          <Input
            value={reminderTimeInput}
            onChangeText={setReminderTimeInput}
            onBlur={handleSaveDefaultTime}
            placeholder="09:00"
            backgroundColor="$gray2"
            borderColor="$borderColor"
            borderRadius="$3"
            padding="$3"
          />
        </YStack>

        <YStack gap="$2">
          <Text fontSize="$4" fontWeight="600" color="$color">
            Notifications
          </Text>
          <Text fontSize="$2" color="$gray11">
            Task reminders need notification permission.
          </Text>
          {notificationStatus !== null && (
            <Text fontSize="$3" color="$gray10">
              Status: {notificationStatus === 'granted' ? 'Allowed' : 'Not allowed'}
            </Text>
          )}
          <Button
            theme="blue"
            borderRadius="$3"
            onPress={handleRequestNotificationPermission}>
            {notificationStatus === 'granted'
              ? 'Open notification settings'
              : 'Allow notifications'}
          </Button>
        </YStack>

        <YStack gap="$2">
          <Text fontSize="$4" fontWeight="600" color="$color">
            Home screen widgets
          </Text>
          <Text fontSize="$2" color="$gray11">
            Add the “Focused tasks” or “Note” widget from your home screen. In a
            note, use ☆ on a task to focus it; use “Show this note on widget” to
            set the Note widget.
          </Text>
          {widgetConfigLoaded && (
            <Text fontSize="$3" color="$gray10">
              Focused: {focusedTaskIds.length} task(s). Note widget:{' '}
              {noteWidgetNoteId ? 'set' : 'not set'}
            </Text>
          )}
          <Button
            theme="gray"
            borderRadius="$3"
            onPress={() => refreshWidgets().catch(() => {})}>
            Refresh widgets
          </Button>
        </YStack>

        <YStack gap="$2" paddingTop="$2">
          <Text fontSize="$4" fontWeight="600" color="$color">
            About
          </Text>
          <Text fontSize="$3" color="$gray11">
            {Constants.expoConfig?.name ?? 'Notes'} – version{' '}
            {Constants.expoConfig?.version ?? '1.0.0'}
          </Text>
        </YStack>
      </YStack>
    </ScrollView>
  );
}
