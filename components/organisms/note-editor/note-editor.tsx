import { useEffect, useState } from 'react';

import { Input, ScrollView, Stack, YStack } from 'tamagui';

import { TextArea } from '@/components/atoms';
import { TaskList } from '@/components/organisms/task-list';
import { useNote, useUpdateNote } from '@/hooks/use-notes';

type NoteEditorProps = {
  noteId: string;
};

export function NoteEditor({ noteId }: NoteEditorProps) {
  const { data: note, isLoading } = useNote(noteId);
  const updateNote = useUpdateNote(noteId);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note?.id, note?.title, note?.content]);

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
    return <Stack flex={1} padding="$4"><Stack>Loading…</Stack></Stack>;
  }

  return (
    <ScrollView flex={1} contentContainerStyle={{ padding: 16 }}>
      <YStack gap="$4">
        <Input
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          onBlur={handleTitleBlur}
          fontSize="$6"
          fontWeight="600"
        />
        <TextArea
          placeholder="Content"
          value={content}
          onChangeText={setContent}
          onBlur={handleContentBlur}
          minHeight={120}
        />
        <TaskList noteId={noteId} />
      </YStack>
    </ScrollView>
  );
}
