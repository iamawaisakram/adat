import { useRouter } from 'expo-router';
import { useState } from 'react';

import { Button, Input, Stack, YStack } from 'tamagui';

import { TextArea } from '@/components/atoms';
import { useCreateNote } from '@/hooks/use-notes';

export default function NewNoteScreen() {
  const router = useRouter();
  const createNote = useCreateNote();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleCreate = async () => {
    try {
      const note = await createNote.mutateAsync({
        title: title.trim() || 'Untitled',
        content: content.trim(),
        type: 'manual',
      });
      router.replace(`/note/${note.id}`);
    } catch {
      // Error already surfaced by mutation
    }
  };

  return (
    <Stack flex={1} padding="$4" backgroundColor="$background">
      <YStack gap="$4">
        <Input
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          fontSize="$5"
        />
        <TextArea
          placeholder="Content (optional)"
          value={content}
          onChangeText={setContent}
          minHeight={120}
        />
        <Button
          onPress={handleCreate}
          theme="blue"
          disabled={createNote.isPending}>
          {createNote.isPending ? 'Creating…' : 'Create note'}
        </Button>
      </YStack>
    </Stack>
  );
}
