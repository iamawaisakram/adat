import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Input, ScrollView, Stack, Text, YStack } from 'tamagui';

import { TextArea } from '@/components/atoms';
import { TaskList } from '@/components/organisms/task-list';
import { useNote, useUpdateNote } from '@/hooks/use-notes';

type NoteEditorProps = {
  noteId: string;
};

export function NoteEditor({ noteId }: NoteEditorProps) {
  const insets = useSafeAreaInsets();
  const { data: note, isLoading } = useNote(noteId);
  const updateNote = useUpdateNote(noteId);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  const handleTitleBlur = () => {
    if (note && title !== note.title) {
      updateNote.mutate({ title });
    }
  };

  const handleContentBlur = () => {
    if (note && content !== note.content) {
      updateNote.mutate({ content });
    }
  };

  if (isLoading || !note) {
    return (
      <Stack flex={1} padding="$4" justifyContent="center" paddingTop={insets.top}>
        <Text color="$gray10">Loading…</Text>
      </Stack>
    );
  }

  return (
    <ScrollView
      flex={1}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: insets.top + 8,
        paddingBottom: insets.bottom + 24,
      }}
      showsVerticalScrollIndicator={false}>
      <YStack gap="$4">
        <Input
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          onBlur={handleTitleBlur}
          fontSize="$7"
          fontWeight="700"
          backgroundColor="$gray2"
          borderColor="$borderColor"
          borderRadius="$3"
          padding="$3"
        />
        <TextArea
          placeholder="Content"
          value={content}
          onChangeText={setContent}
          onBlur={handleContentBlur}
          minHeight={140}
          backgroundColor="$gray2"
          borderColor="$borderColor"
          borderRadius="$3"
          padding="$3"
        />
        <Stack marginTop="$2">
          <Text fontSize="$4" fontWeight="600" color="$color" marginBottom="$2">
            Tasks
          </Text>
          <TaskList noteId={noteId} />
        </Stack>
      </YStack>
    </ScrollView>
  );
}
