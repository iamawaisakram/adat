import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, ScrollView, Stack, Text, XStack, YStack } from 'tamagui';

import { EmptyState } from '@/components/molecules';
import { useSchedulesList } from '@/hooks/use-schedules';
import type { ScheduleFrequency } from '@/lib/types';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type ScheduleRow = {
  id: string;
  template_id: string;
  frequency: ScheduleFrequency;
  enabled: boolean;
  anchor_time: string | null;
  anchor_day_of_week: number | null;
  anchor_day_of_month: number | null;
  anchor_month: number | null;
  anchor_day: number | null;
  templates: { name: string } | null;
};

function formatAnchor(row: ScheduleRow): string {
  const f = row.frequency;
  if (f === 'daily') {
    return row.anchor_time ? `daily at ${row.anchor_time}` : 'daily';
  }
  if (f === 'weekly') {
    const day = row.anchor_day_of_week != null ? DAYS_OF_WEEK[row.anchor_day_of_week] : '?';
    return `every ${day}`;
  }
  if (f === 'monthly') {
    const d = row.anchor_day_of_month ?? 1;
    const suffix = d === 1 ? 'st' : d === 2 ? 'nd' : d === 3 ? 'rd' : 'th';
    return `${d}${suffix} of month`;
  }
  if (f === 'yearly') {
    const mo = row.anchor_month != null ? MONTH_NAMES[row.anchor_month - 1] : '?';
    const day = row.anchor_day ?? 1;
    return `${mo} ${day}`;
  }
  return '';
}

function scheduleLabel(row: ScheduleRow): string {
  const freqLabel = row.frequency.charAt(0).toUpperCase() + row.frequency.slice(1);
  const anchorStr = formatAnchor(row);
  const templateName = row.templates?.name ?? 'Unknown template';
  return `${freqLabel} – ${anchorStr} – Template: ${templateName}`;
}

function ScheduleCard({ schedule }: { schedule: ScheduleRow }) {
  const router = useRouter();
  return (
    <Stack
      padding="$4"
      backgroundColor="$background"
      borderWidth={1}
      borderColor="$borderColor"
      borderRadius="$4"
      pressStyle={{ opacity: 0.92, scale: 0.99 }}
      onPress={() => router.push(`/schedule/${schedule.id}`)}
      cursor="pointer"
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 1 }}
      shadowOpacity={0.05}
      shadowRadius={3}>
      <Text fontWeight="700" fontSize="$5" color="$color">
        {scheduleLabel(schedule)}
      </Text>
      <Text color="$gray11" fontSize="$2" marginTop="$1">
        {schedule.enabled ? 'Enabled' : 'Disabled'}
      </Text>
    </Stack>
  );
}

export function ScheduleList() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: schedules, isLoading, error } = useSchedulesList();

  const hasSchedules = schedules && schedules.length > 0;
  const rows = (schedules ?? []) as ScheduleRow[];
  const showEmpty = !hasSchedules || error;

  return (
    <Stack flex={1} backgroundColor="$background">
      <ScrollView
        flex={1}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}>
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
          <Text fontSize="$7" fontWeight="800" color="$color">Schedules</Text>
          <Button
            size="$3"
            onPress={() => router.push('/schedule/new')}
            theme="blue"
            borderRadius="$4"
            fontWeight="600">
            New schedule
          </Button>
        </XStack>
        {isLoading && (
          <Stack flex={1} padding="$4" justifyContent="center" alignItems="center">
            <Text color="$gray10">Loading schedules…</Text>
          </Stack>
        )}
        {!isLoading && showEmpty && (
          <EmptyState
            title={error ? "Couldn't load schedules" : 'No schedules yet'}
            description={
              error
                ? "Make sure the database is set up (run the Phase 2 schema in Supabase). You can still try creating a schedule above."
                : 'Create a schedule to auto-generate notes (e.g. every Monday, or 1st of month).'
            }
          />
        )}
        {!isLoading && !showEmpty && (
          <YStack gap="$3">
            {rows.map((s) => (
              <ScheduleCard key={s.id} schedule={s} />
            ))}
          </YStack>
        )}
      </ScrollView>
    </Stack>
  );
}
