import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Input, ScrollView, Stack, Text, YStack } from 'tamagui';

import {
  useDeleteSchedule,
  useSchedule,
  useTemplatesList,
  useUpdateSchedule,
} from '@/hooks';
import type { ScheduleFrequency } from '@/lib/types';

const FREQUENCIES: ScheduleFrequency[] = ['daily', 'weekly', 'monthly', 'yearly'];
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ScheduleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: schedule, isLoading } = useSchedule(id ?? undefined);
  const { data: templates = [] } = useTemplatesList();
  const updateSchedule = useUpdateSchedule(id ?? '');
  const deleteSchedule = useDeleteSchedule();

  const [templateId, setTemplateId] = useState('');
  const [frequency, setFrequency] = useState<ScheduleFrequency>('weekly');
  const [enabled, setEnabled] = useState(true);
  const [anchorTime, setAnchorTime] = useState('00:00');
  const [anchorDayOfWeek, setAnchorDayOfWeek] = useState(1);
  const [anchorDayOfMonth, setAnchorDayOfMonth] = useState(1);
  const [anchorMonth, setAnchorMonth] = useState(1);
  const [anchorDay, setAnchorDay] = useState(1);

  useEffect(() => {
    if (schedule) {
      setTemplateId(schedule.template_id);
      setFrequency(schedule.frequency);
      setEnabled(schedule.enabled);
      setAnchorTime(schedule.anchor_time ?? '00:00');
      setAnchorDayOfWeek(schedule.anchor_day_of_week ?? 1);
      setAnchorDayOfMonth(schedule.anchor_day_of_month ?? 1);
      setAnchorMonth(schedule.anchor_month ?? 1);
      setAnchorDay(schedule.anchor_day ?? 1);
    }
  }, [schedule]);

  const handleSave = () => {
    if (!id) return;
    updateSchedule.mutate(
      {
        template_id: templateId,
        frequency,
        enabled,
        anchor_time: anchorTime || null,
        anchor_day_of_week: frequency === 'weekly' ? anchorDayOfWeek : null,
        anchor_day_of_month: frequency === 'monthly' ? anchorDayOfMonth : null,
        anchor_month: frequency === 'yearly' ? anchorMonth : null,
        anchor_day: frequency === 'yearly' ? anchorDay : null,
      },
      { onSuccess: () => router.back() }
    );
  };

  const handleDelete = () => {
    if (!id) return;
    deleteSchedule.mutate(id, {
      onSuccess: () => {
        router.back();
        router.replace('/(tabs)/schedules');
      },
    });
  };

  if (isLoading || !schedule) {
    return (
      <Stack flex={1} padding="$4" justifyContent="center" paddingTop={insets.top}>
        <Text color="$gray10">Loading…</Text>
      </Stack>
    );
  }

  return (
    <ScrollView
      flex={1}
      backgroundColor="$background"
      contentContainerStyle={{ padding: 20, paddingTop: insets.top + 8, paddingBottom: 40 }}>
      <YStack gap="$4">
        <Text fontSize="$4" fontWeight="600" color="$color">Template</Text>
        <YStack gap="$2">
          {templates.map((t) => (
            <Button
              key={t.id}
              size="$4"
              theme={templateId === t.id ? 'blue' : 'gray'}
              borderRadius="$3"
              onPress={() => setTemplateId(t.id)}>
              {t.name || 'Untitled'}
            </Button>
          ))}
        </YStack>

        <Text fontSize="$4" fontWeight="600" color="$color">Frequency</Text>
        <YStack flexDirection="row" flexWrap="wrap" gap="$2">
          {FREQUENCIES.map((f) => (
            <Button
              key={f}
              size="$3"
              theme={frequency === f ? 'blue' : 'gray'}
              borderRadius="$3"
              onPress={() => setFrequency(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </YStack>

        <Button
          size="$4"
          theme={enabled ? 'green' : 'gray'}
          borderRadius="$3"
          onPress={() => setEnabled(!enabled)}>
          {enabled ? 'Enabled' : 'Disabled'}
        </Button>

        {frequency === 'daily' && (
          <>
            <Text fontSize="$4" fontWeight="600" color="$color">Time (HH:MM)</Text>
            <Input
              value={anchorTime}
              onChangeText={setAnchorTime}
              backgroundColor="$gray2"
              borderColor="$borderColor"
              borderRadius="$3"
              padding="$3"
            />
          </>
        )}
        {frequency === 'weekly' && (
          <>
            <Text fontSize="$4" fontWeight="600" color="$color">Day of week</Text>
            <YStack flexDirection="row" flexWrap="wrap" gap="$2">
              {DAYS_OF_WEEK.map((day, i) => (
                <Button
                  key={day}
                  size="$3"
                  theme={anchorDayOfWeek === i ? 'blue' : 'gray'}
                  borderRadius="$3"
                  onPress={() => setAnchorDayOfWeek(i)}>
                  {day}
                </Button>
              ))}
            </YStack>
            <Text fontSize="$3" color="$gray11">Optional time (HH:MM)</Text>
            <Input
              value={anchorTime}
              onChangeText={setAnchorTime}
              backgroundColor="$gray2"
              borderColor="$borderColor"
              borderRadius="$3"
              padding="$3"
            />
          </>
        )}
        {frequency === 'monthly' && (
          <>
            <Text fontSize="$4" fontWeight="600" color="$color">Day of month (1–31)</Text>
            <Input
              value={String(anchorDayOfMonth)}
              onChangeText={(t) => setAnchorDayOfMonth(Math.max(1, Math.min(31, Number.parseInt(t, 10) || 1)))}
              keyboardType="number-pad"
              backgroundColor="$gray2"
              borderColor="$borderColor"
              borderRadius="$3"
              padding="$3"
            />
            <Text fontSize="$3" color="$gray11">Optional time (HH:MM)</Text>
            <Input
              value={anchorTime}
              onChangeText={setAnchorTime}
              backgroundColor="$gray2"
              borderColor="$borderColor"
              borderRadius="$3"
              padding="$3"
            />
          </>
        )}
        {frequency === 'yearly' && (
          <>
            <Text fontSize="$4" fontWeight="600" color="$color">Month and day</Text>
            <YStack flexDirection="row" gap="$2">
              <Input
                flex={1}
                value={String(anchorMonth)}
                onChangeText={(t) => setAnchorMonth(Math.max(1, Math.min(12, Number.parseInt(t, 10) || 1)))}
                keyboardType="number-pad"
                backgroundColor="$gray2"
                borderColor="$borderColor"
                borderRadius="$3"
                padding="$3"
              />
              <Input
                flex={1}
                value={String(anchorDay)}
                onChangeText={(t) => setAnchorDay(Math.max(1, Math.min(31, Number.parseInt(t, 10) || 1)))}
                keyboardType="number-pad"
                backgroundColor="$gray2"
                borderColor="$borderColor"
                borderRadius="$3"
                padding="$3"
              />
            </YStack>
            <Text fontSize="$3" color="$gray11">Optional time (HH:MM)</Text>
            <Input
              value={anchorTime}
              onChangeText={setAnchorTime}
              backgroundColor="$gray2"
              borderColor="$borderColor"
              borderRadius="$3"
              padding="$3"
            />
          </>
        )}

        <Button
          size="$4"
          onPress={handleSave}
          theme="blue"
          disabled={!templateId || updateSchedule.isPending}
          borderRadius="$3"
          fontWeight="600">
          {updateSchedule.isPending ? 'Saving…' : 'Save'}
        </Button>
        <Button
          size="$4"
          onPress={handleDelete}
          theme="red"
          disabled={deleteSchedule.isPending}
          borderRadius="$3">
          {deleteSchedule.isPending ? 'Deleting…' : 'Delete schedule'}
        </Button>
      </YStack>
    </ScrollView>
  );
}
