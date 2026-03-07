import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Alert, Button, Input, Stack, Text, YStack } from 'tamagui';

import { TextArea } from '@/components/atoms';
import {
  useDeleteTemplate,
  useTemplate,
  useUpdateTemplate,
} from '@/hooks/use-templates';
import {
  useSchedulesByTemplateId,
} from '@/hooks/use-schedules';
import { queryKeys } from '@/lib/query-keys';
import { supabase } from '@/lib/supabase/client';

export default function TemplateDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { data: template, isLoading } = useTemplate(id ?? undefined);
  const { data: schedulesUsingTemplate = [] } = useSchedulesByTemplateId(id ?? undefined);
  const updateTemplate = useUpdateTemplate(id ?? '');
  const deleteTemplate = useDeleteTemplate();

  const [name, setName] = useState('');
  const [titlePattern, setTitlePattern] = useState('');
  const [bodyTemplate, setBodyTemplate] = useState('');

  useEffect(() => {
    if (template) {
      setName(template.name);
      setTitlePattern(template.title_pattern);
      setBodyTemplate(template.body_template);
    }
  }, [template]);

  const handleSave = () => {
    if (!id) return;
    updateTemplate.mutate(
      { name, title_pattern: titlePattern, body_template: bodyTemplate },
      { onSuccess: () => router.back() }
    );
  };

  const handleDelete = () => {
    if (!id) return;
    const count = schedulesUsingTemplate.length;

    if (count > 0) {
      Alert.alert(
        'Template in use',
        `This template is used by ${count} schedule(s). Delete template and these schedules?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete template and schedules',
            style: 'destructive',
            onPress: async () => {
              await supabase.from('schedules').delete().eq('template_id', id);
              deleteTemplate.mutate(id, {
                onSuccess: () => {
                  void queryClient.invalidateQueries({ queryKey: queryKeys.schedules.all });
                  router.back();
                  router.replace('/(tabs)/templates');
                },
              });
            },
          },
        ]
      );
    } else {
      deleteTemplate.mutate(id, {
        onSuccess: () => {
          router.back();
          router.replace('/(tabs)/templates');
        },
      });
    }
  };

  if (isLoading || !template) {
    return (
      <Stack flex={1} padding="$4" justifyContent="center" paddingTop={insets.top}>
        <Text color="$gray10">Loading…</Text>
      </Stack>
    );
  }

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
          placeholder="Title pattern"
          value={titlePattern}
          onChangeText={setTitlePattern}
          backgroundColor="$gray2"
          borderColor="$borderColor"
          borderRadius="$3"
          padding="$3"
        />
        <TextArea
          placeholder="Body template"
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
          onPress={handleSave}
          theme="blue"
          disabled={updateTemplate.isPending}
          borderRadius="$3"
          fontWeight="600">
          {updateTemplate.isPending ? 'Saving…' : 'Save'}
        </Button>
        {schedulesUsingTemplate.length > 0 && (
          <Text fontSize="$2" color="$gray11">
            Used by {schedulesUsingTemplate.length} schedule(s). Deleting will remove them too.
          </Text>
        )}
        <Button
          size="$4"
          onPress={handleDelete}
          theme="red"
          disabled={deleteTemplate.isPending}
          borderRadius="$3">
          {deleteTemplate.isPending ? 'Deleting…' : 'Delete template'}
        </Button>
      </YStack>
    </Stack>
  );
}
