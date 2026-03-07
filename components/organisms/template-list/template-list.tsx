import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, ScrollView, Stack, Text, XStack, YStack } from 'tamagui';

import { EmptyState } from '@/components/molecules';
import { useTemplatesList } from '@/hooks/use-templates';
import type { Template } from '@/lib/types';

function TemplateCard({ template }: { template: Template }) {
  const router = useRouter();
  const bodyPreview = template.body_template.slice(0, 80);
  const bodySnippet = bodyPreview + (template.body_template.length > 80 ? '…' : '');
  return (
    <Stack
      padding="$4"
      backgroundColor="$background"
      borderWidth={1}
      borderColor="$borderColor"
      borderRadius="$4"
      pressStyle={{ opacity: 0.92, scale: 0.99 }}
      onPress={() => router.push(`/template/${template.id}`)}
      cursor="pointer"
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 1 }}
      shadowOpacity={0.05}
      shadowRadius={3}>
      <Text fontWeight="700" fontSize="$5" color="$color">
        {template.name || 'Untitled template'}
      </Text>
      <Text color="$gray11" fontSize="$2" marginTop="$1" numberOfLines={1}>
        Title: {template.title_pattern || '—'}
      </Text>
      {template.body_template.length > 0 && (
        <Text color="$gray10" fontSize="$2" marginTop="$1" numberOfLines={2} lineHeight={18}>
          {bodySnippet}
        </Text>
      )}
    </Stack>
  );
}

export function TemplateList() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: templates, isLoading, error } = useTemplatesList();

  const hasTemplates = templates && templates.length > 0;
  const showEmpty = !hasTemplates || error;

  return (
    <Stack flex={1} backgroundColor="$background">
      <ScrollView
        flex={1}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}>
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
          <Text fontSize="$7" fontWeight="800" color="$color">Templates</Text>
          <Button
            size="$3"
            onPress={() => router.push('/template/new')}
            theme="blue"
            borderRadius="$4"
            fontWeight="600">
            New template
          </Button>
        </XStack>
        {isLoading && (
          <Stack flex={1} padding="$4" justifyContent="center" alignItems="center">
            <Text color="$gray10">Loading templates…</Text>
          </Stack>
        )}
        {!isLoading && showEmpty && (
          <EmptyState
            title={error ? "Couldn't load templates" : 'No templates yet'}
            description={
              error
                ? "Make sure the database is set up (run the Phase 2 schema in Supabase). You can still try creating a template above."
                : 'Create a template to reuse title and body patterns for auto-generated notes.'
            }
          />
        )}
        {!isLoading && !showEmpty && (
          <YStack gap="$3">
            {(templates ?? []).map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </YStack>
        )}
      </ScrollView>
    </Stack>
  );
}
