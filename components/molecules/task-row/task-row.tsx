import { Checkbox, Input, Text, XStack, YStack } from 'tamagui';

import type { Task } from '@/lib/types';

function formatDueAt(dueAt: string | null): string | null {
  if (!dueAt) return null;
  const d = new Date(dueAt);
  if (Number.isNaN(d.getTime())) return null;
  const isDateOnly = d.getHours() === 0 && d.getMinutes() === 0;
  return isDateOnly ? d.toLocaleDateString() : d.toLocaleString();
}

type TaskRowProps = {
  task: Task;
  isEditing?: boolean;
  editTitle?: string;
  editDueAt?: string;
  onEditTitleChange?: (value: string) => void;
  onEditDueAtChange?: (value: string) => void;
  onBlur?: () => void;
  onToggleComplete?: () => void;
  onPress?: () => void;
  onRemindPress?: () => void;
  reminderLabel?: string | null;
};

export function TaskRow({
  task,
  isEditing = false,
  editTitle = task.title,
  editDueAt = task.due_at ? new Date(task.due_at).toISOString().slice(0, 16) : '',
  onEditTitleChange,
  onEditDueAtChange,
  onBlur,
  onToggleComplete,
  onPress,
  onRemindPress,
  reminderLabel,
}: TaskRowProps) {
  const dueLabel = formatDueAt(task.due_at);

  return (
    <XStack
      alignItems="center"
      gap="$3"
      paddingVertical="$2.5"
      paddingHorizontal="$2"
      borderRadius="$3"
      backgroundColor="$gray2"
      marginBottom="$2"
      onPress={onPress}
      cursor={onPress ? 'pointer' : undefined}>
      <Checkbox
        size="$4"
        checked={task.completed}
        onCheckedChange={onToggleComplete}
      />
      <YStack flex={1} gap="$0">
        {isEditing ? (
          <YStack gap="$2">
            <Input
              size="$3"
              value={editTitle}
              onChangeText={onEditTitleChange}
              onBlur={onBlur}
              autoFocus
              backgroundColor="$background"
              borderRadius="$2"
            />
            <Input
              size="$2"
              value={editDueAt}
              onChangeText={onEditDueAtChange}
              onBlur={onBlur}
              placeholder="Due (e.g. 2025-12-31 or 2025-12-31T14:00)"
              backgroundColor="$background"
              borderRadius="$2"
            />
          </YStack>
        ) : (
          <>
            <Text
              fontSize="$4"
              textDecorationLine={task.completed ? 'line-through' : 'none'}
              color={task.completed ? '$gray10' : '$color'}>
              {task.title || 'Untitled task'}
            </Text>
            {dueLabel && (
              <Text fontSize="$2" color="$gray10">
                Due: {dueLabel}
              </Text>
            )}
            {reminderLabel && (
              <Text fontSize="$2" color="$gray10">
                Remind: {reminderLabel}
              </Text>
            )}
          </>
        )}
      </YStack>
      {onRemindPress && (
        <Text
          fontSize="$4"
          onPress={(e) => {
            e?.stopPropagation?.();
            onRemindPress();
          }}
          color={reminderLabel ? '$blue10' : '$gray10'}
          cursor="pointer">
          {reminderLabel ? '🔔' : '⏰'}
        </Text>
      )}
    </XStack>
  );
}
