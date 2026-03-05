import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Input, Stack, YStack } from 'tamagui';

import { TextArea } from '@/components/atoms';
import { useCreateNote } from '@/hooks/use-notes';

export default function NewNoteModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
      router.back();
      router.push(`/note/${note.id}`);
    } catch {
      // Error already surfaced by mutation
    }
  };

  return (
    <Stack flex={1} backgroundColor="$background" paddingTop={insets.top}>
      <YStack flex={1} padding="$4" gap="$4">
        <Input
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          fontSize="$5"
          fontWeight="600"
          backgroundColor="$gray2"
          borderColor="$borderColor"
          borderRadius="$3"
          padding="$3"
        />
        <TextArea
          placeholder="What's on your mind? (optional)"
          value={content}
          onChangeText={setContent}
          minHeight={140}
          backgroundColor="$gray2"
          borderColor="$borderColor"
          borderRadius="$3"
          padding="$3"
        />
        <Button
          size="$4"
          onPress={handleCreate}
          theme="blue"
          disabled={createNote.isPending}
          borderRadius="$3"
          fontWeight="600">
          {createNote.isPending ? 'Creating…' : 'Create note'}
        </Button>
      </YStack>
    </Stack>
  );
}
