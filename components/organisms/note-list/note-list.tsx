import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, ScrollView, Stack, Text, XStack, YStack } from "tamagui";

import { EmptyState, NoteCard } from "@/components/molecules";
import { useNotesList } from "@/hooks/use-notes";

export function NoteList() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: notes, isLoading, error } = useNotesList();

  if (error) {
    return (
      <Stack
        flex={1}
        padding="$4"
        justifyContent="center"
        alignItems="center"
        paddingTop={insets.top + 24}
      >
        <Text color="$red10" textAlign="center">
          Failed to load notes. Check your Supabase connection.
        </Text>
      </Stack>
    );
  }

  if (isLoading) {
    return (
      <Stack
        flex={1}
        padding="$4"
        justifyContent="center"
        alignItems="center"
        paddingTop={insets.top + 24}
      >
        <Text color="$gray10">Loading notes…</Text>
      </Stack>
    );
  }

  const hasNotes = notes && notes.length > 0;

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
        showsVerticalScrollIndicator={false}
      >
        <XStack
          justifyContent="space-between"
          alignItems="center"
          marginBottom="$4"
        >
          <Text fontSize="$7" fontWeight="800" color="$color">
            Notes
          </Text>
          <Button
            size="$3"
            onPress={() => router.push("/(modals)/new-note")}
            theme="blue"
            borderRadius="$4"
            fontWeight="600"
          >
            New Note
          </Button>
        </XStack>
        {hasNotes ? (
          <YStack gap="$3">
            {(notes ?? []).map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </YStack>
        ) : (
          <EmptyState
            title="No notes yet"
            description="Tap “New note” to capture your first thought, task list, or idea."
          />
        )}
      </ScrollView>
    </Stack>
  );
}
