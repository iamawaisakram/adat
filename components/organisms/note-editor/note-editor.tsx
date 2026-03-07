import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Markdown from 'react-native-markdown-display';
import { Input, Button, ScrollView, Stack, Text, YStack } from 'tamagui';

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
  const [contentMode, setContentMode] = useState<'edit' | 'preview'>('edit');

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
        <Stack flexDirection="row" alignItems="center" gap="$2" marginBottom="$1">
          <Button
            size="$2"
            theme={contentMode === 'edit' ? 'blue' : 'gray'}
            borderRadius="$3"
            onPress={() => setContentMode('edit')}>
            Edit
          </Button>
          <Button
            size="$2"
            theme={contentMode === 'preview' ? 'blue' : 'gray'}
            borderRadius="$3"
            onPress={() => setContentMode('preview')}>
            Preview
          </Button>
        </Stack>
        {contentMode === 'edit' ? (
          <TextArea
            placeholder="Content (Markdown supported)"
            value={content}
            onChangeText={setContent}
            onBlur={handleContentBlur}
            minHeight={140}
            backgroundColor="$gray2"
            borderColor="$borderColor"
            borderRadius="$3"
            padding="$3"
          />
        ) : (
          <Stack
            minHeight={140}
            backgroundColor="$gray2"
            borderRadius="$3"
            padding="$3">
            <Markdown
              style={{
                body: { color: undefined },
                text: { color: undefined },
                paragraph: { marginTop: 4, marginBottom: 4 },
                heading1: { fontSize: 24, fontWeight: '700' },
                heading2: { fontSize: 20, fontWeight: '600' },
                heading3: { fontSize: 18 },
              }}>
              {content || '_No content_'}
            </Markdown>
          </Stack>
        )}
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
