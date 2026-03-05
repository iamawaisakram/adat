import { useRouter } from 'expo-router';
import { Stack, Text } from 'tamagui';

import type { Note } from '@/lib/types';

type NoteCardProps = {
  note: Note;
};

export function NoteCard({ note }: NoteCardProps) {
  const router = useRouter();
  const snippet = note.content.slice(0, 100);
  const displaySnippet = snippet + (note.content.length > 100 ? '…' : '');

  return (
    <Stack
      padding="$4"
      backgroundColor="$background"
      borderWidth={1}
      borderColor="$borderColor"
      borderRadius="$4"
      pressStyle={{ opacity: 0.92, scale: 0.99 }}
      hoverStyle={{ backgroundColor: '$gray2' }}
      onPress={() => router.push(`/note/${note.id}`)}
      cursor="pointer"
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 1 }}
      shadowOpacity={0.05}
      shadowRadius={3}>
      <Text fontWeight="700" fontSize="$5" color="$color">
        {note.title || 'Untitled'}
      </Text>
      {displaySnippet ? (
        <Text
          color="$gray11"
          fontSize="$3"
          marginTop="$2"
          numberOfLines={2}
          lineHeight={20}>
          {displaySnippet}
        </Text>
      ) : (
        <Text color="$gray9" fontSize="$2" marginTop="$1" fontStyle="italic">
          No content
        </Text>
      )}
    </Stack>
  );
}
