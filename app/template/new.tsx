import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Input, Stack, YStack } from 'tamagui';

import { TextArea } from '@/components/atoms';
import { useCreateTemplate } from '@/hooks/use-templates';

export default function NewTemplateScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const createTemplate = useCreateTemplate();

  const [name, setName] = useState('');
  const [titlePattern, setTitlePattern] = useState('');
  const [bodyTemplate, setBodyTemplate] = useState('');

  const handleCreate = async () => {
    try {
      const template = await createTemplate.mutateAsync({
        name: name.trim() || 'Untitled template',
        title_pattern: titlePattern.trim(),
        body_template: bodyTemplate.trim(),
      });
      router.back();
      router.push(`/template/${template.id}`);
    } catch {
      // Error surfaced by mutation
    }
  };

  return (
    <Stack flex={1} backgroundColor="$background" paddingTop={insets.top}>
      <YStack flex={1} padding="$4" gap="$4">
        <Input
          placeholder="Template name"
          value={name}
          onChangeText={setName}
          fontSize="$5"
          fontWeight="600"
          backgroundColor="$gray2"
          borderColor="$borderColor"
          borderRadius="$3"
          padding="$3"
        />
        <Input
          placeholder="Title pattern (e.g. Week of {{date}}, {{month}} {{year}})"
          value={titlePattern}
          onChangeText={setTitlePattern}
          backgroundColor="$gray2"
          borderColor="$borderColor"
          borderRadius="$3"
          padding="$3"
        />
        <TextArea
          placeholder="Body template (markdown; use {{date}}, {{month}}, {{year}} as needed)"
          value={bodyTemplate}
          onChangeText={setBodyTemplate}
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
          disabled={createTemplate.isPending}
          borderRadius="$3"
          fontWeight="600">
          {createTemplate.isPending ? 'Creating…' : 'Create template'}
        </Button>
      </YStack>
    </Stack>
  );
}
