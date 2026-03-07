import { Stack } from 'tamagui';

import { ScheduleList } from '@/components/organisms';

export default function SchedulesScreen() {
  return (
    <Stack flex={1} backgroundColor="$background">
      <ScheduleList />
    </Stack>
  );
}
