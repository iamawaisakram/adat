import { Stack } from 'tamagui';

import { NoteList } from '@/components/organisms';

export default function NotesScreen() {
  return (
    <Stack flex={1} backgroundColor="$background">
      <NoteList />
    </Stack>
  );
}
