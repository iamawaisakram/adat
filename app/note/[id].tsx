import { useLocalSearchParams } from 'expo-router';
import { Stack } from 'tamagui';

import { NoteEditor } from '@/components/organisms';

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) return null;

  return (
    <Stack flex={1} backgroundColor="$background">
      <NoteEditor noteId={id} />
    </Stack>
  );
}
