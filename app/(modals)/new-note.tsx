import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Input, ScrollView, Stack, Text, YStack } from 'tamagui';

import { TextArea } from '@/components/atoms';
import { useCreateNote, useTemplatesList } from '@/hooks';
import { resolveTemplateForNow } from '@/lib/auto-generate-notes';

export default function NewNoteModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const createNote = useCreateNote();
  const { data: templates = [] } = useTemplatesList();

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

  const applyTemplate = (titlePattern: string, bodyTemplate: string) => {
    const { title: t, content: c } = resolveTemplateForNow(titlePattern, bodyTemplate);
    setTitle(t);
    setContent(c);
  };

  return (
    <Stack flex={1} backgroundColor="$background" paddingTop={insets.top}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>
        <YStack flex={1} padding="$4" gap="$4">
          {templates.length > 0 && (
            <YStack gap="$2">
              <Text fontSize="$3" fontWeight="600" color="$gray11">
                Or start from template
              </Text>
              <YStack gap="$2">
                {templates.map((t) => (
                  <Button
                    key={t.id}
                    size="$3"
                    theme="gray"
                    borderRadius="$3"
                    onPress={() => applyTemplate(t.title_pattern, t.body_template)}>
                    {t.name || 'Untitled template'}
                  </Button>
                ))}
              </YStack>
            </YStack>
          )}
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
      </ScrollView>
    </Stack>
  );
}
