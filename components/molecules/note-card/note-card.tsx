import { useRouter } from 'expo-router';
import { Stack, Text } from 'tamagui';

import type { Note } from '@/lib/types';

type NoteCardProps = {
  note: Note;
};

export function NoteCard({ note }: NoteCardProps) {
  const router = useRouter();
  const snippet = note.content.slice(0, 80);
  const displaySnippet = snippet + (note.content.length > 80 ? '…' : '');

  return (
    <Stack
      padding="$3"
      backgroundColor="$background"
      borderWidth={1}
      borderColor="$borderColor"
      borderRadius="$2"
      pressStyle={{ opacity: 0.9 }}
      onPress={() => router.push(`/note/${note.id}`)}
      cursor="pointer">
      <Text fontWeight="600" fontSize="$4">
        {note.title || 'Untitled'}
      </Text>
      {displaySnippet ? (
        <Text color="$gray10" fontSize="$2" marginTop="$1" numberOfLines={2}>
          {displaySnippet}
        </Text>
      ) : null}
    </Stack>
  );
}
