import { useRouter } from 'expo-router';
import { Button, ScrollView, Stack, Text, YStack } from 'tamagui';

import { NoteCard } from '@/components/molecules';
import { useNotesList } from '@/hooks/use-notes';

export function NoteList() {
  const router = useRouter();
  const { data: notes, isLoading, error } = useNotesList();

  if (error) {
    return (
      <Stack flex={1} padding="$4" justifyContent="center" alignItems="center">
        <Text color="$red10">Failed to load notes. Check your Supabase connection.</Text>
      </Stack>
    );
  }

  if (isLoading) {
    return (
      <Stack flex={1} padding="$4" justifyContent="center" alignItems="center">
        <Text color="$gray10">Loading notes…</Text>
      </Stack>
    );
  }

  return (
    <ScrollView flex={1} contentContainerStyle={{ padding: 16 }}>
      <YStack gap="$3">
        <Button
          alignSelf="flex-start"
          onPress={() => router.push('/note/new')}
          theme="blue">
          New note
        </Button>
        {notes && notes.length > 0 ? (
          notes.map((note) => <NoteCard key={note.id} note={note} />)
        ) : (
          <Stack padding="$4" alignItems="center">
            <Text color="$gray10">No notes yet. Create one to get started.</Text>
          </Stack>
        )}
      </YStack>
    </ScrollView>
  );
}
