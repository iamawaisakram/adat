import { useState } from 'react';
import { Button, Input, Stack, Text, YStack } from 'tamagui';

import {
  requestNotificationPermission,
  scheduleTaskReminder,
  cancelTaskReminder,
} from '@/lib/notifications';
import type { NotificationSetting, NotificationSettingKind } from '@/lib/types';

type ReminderModalProps = {
  taskId: string;
  noteId: string;
  taskTitle: string;
  currentSetting: NotificationSetting | null;
  /** Default time for new daily reminders (e.g. 09:00). */
  defaultDailyTime?: string;
  onUpsert: (input: {
    kind: NotificationSettingKind;
    reminder_time: string;
    specific_at?: string | null;
  }) => Promise<void>;
  onDelete: () => Promise<void>;
  onClose: () => void;
};

export function ReminderModal({
  taskId,
  noteId,
  taskTitle,
  currentSetting,
  defaultDailyTime = '09:00',
  onUpsert,
  onDelete,
  onClose,
}: ReminderModalProps) {
  const [kind, setKind] = useState<NotificationSettingKind>(
    currentSetting?.kind ?? 'daily'
  );
  const [time, setTime] = useState(
    currentSetting?.reminder_time ?? defaultDailyTime
  );
  const [specificAt, setSpecificAt] = useState(
    currentSetting?.specific_at
      ? new Date(currentSetting.specific_at).toISOString().slice(0, 16)
      : ''
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const granted = await requestNotificationPermission();
    if (!granted) {
      return;
    }
    setSaving(true);
    try {
      await cancelTaskReminder(taskId);
      if (kind === 'daily') {
        await onUpsert({ kind: 'daily', reminder_time: time });
        await scheduleTaskReminder(
          taskId,
          noteId,
          taskTitle,
          'daily',
          time,
          null
        );
      } else {
        const at = specificAt ? new Date(specificAt).toISOString() : null;
        await onUpsert({
          kind: 'specific',
          reminder_time: time,
          specific_at: at,
        });
        if (at) {
          await scheduleTaskReminder(
            taskId,
            noteId,
            taskTitle,
            'specific',
            time,
            at
          );
        }
      }
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    setSaving(true);
    try {
      await cancelTaskReminder(taskId);
      await onDelete();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack padding="$4" backgroundColor="$background">
      <Text fontSize="$5" fontWeight="700" marginBottom="$3">
        Remind me
      </Text>
      <YStack gap="$3">
        <Stack flexDirection="row" gap="$2">
          <Button
            size="$3"
            theme={kind === 'daily' ? 'blue' : 'gray'}
            onPress={() => setKind('daily')}>
            Daily
          </Button>
          <Button
            size="$3"
            theme={kind === 'specific' ? 'blue' : 'gray'}
            onPress={() => setKind('specific')}>
            Specific
          </Button>
        </Stack>
        {kind === 'daily' && (
          <Stack>
            <Text fontSize="$2" color="$gray11" marginBottom="$1">
              Time (e.g. 09:00) — uses your device’s local time
            </Text>
            <Input
              value={time}
              onChangeText={setTime}
              placeholder="09:00"
              backgroundColor="$gray2"
              borderColor="$borderColor"
              borderRadius="$3"
              padding="$3"
            />
          </Stack>
        )}
        {kind === 'specific' && (
          <Stack>
            <Text fontSize="$2" color="$gray11" marginBottom="$1">
              Date & time (local)
            </Text>
            <Input
              value={specificAt}
              onChangeText={setSpecificAt}
              placeholder="2025-12-31T09:00"
              backgroundColor="$gray2"
              borderColor="$borderColor"
              borderRadius="$3"
              padding="$3"
            />
          </Stack>
        )}
        <Button
          size="$4"
          theme="blue"
          onPress={handleSave}
          disabled={saving || (kind === 'specific' && !specificAt)}
          borderRadius="$3">
          {saving ? 'Saving…' : 'Save reminder'}
        </Button>
        {currentSetting && (
          <Button size="$4" theme="red" onPress={handleRemove} disabled={saving}>
            Remove reminder
          </Button>
        )}
        <Button size="$4" theme="gray" onPress={onClose}>
          Cancel
        </Button>
      </YStack>
    </Stack>
  );
}
