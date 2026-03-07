import { Stack } from 'tamagui';

import { TemplateList } from '@/components/organisms';

export default function TemplatesScreen() {
  return (
    <Stack flex={1} backgroundColor="$background">
      <TemplateList />
    </Stack>
  );
}
