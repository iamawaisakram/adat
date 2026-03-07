import { Checkbox, Input, Text, XStack, YStack } from 'tamagui';

import type { Task } from '@/lib/types';

type TaskRowProps = {
  task: Task;
  isEditing?: boolean;
  editTitle?: string;
  onEditTitleChange?: (value: string) => void;
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
  onEditTitleChange,
  onBlur,
  onToggleComplete,
  onPress,
  onRemindPress,
  reminderLabel,
}: TaskRowProps) {
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
          <Input
            size="$3"
            value={editTitle}
            onChangeText={onEditTitleChange}
            onBlur={onBlur}
            autoFocus
            backgroundColor="$background"
            borderRadius="$2"
          />
        ) : (
          <Text
            fontSize="$4"
            textDecorationLine={task.completed ? 'line-through' : 'none'}
            color={task.completed ? '$gray10' : '$color'}>
            {task.title || 'Untitled task'}
          </Text>
        )}
        {reminderLabel && (
          <Text fontSize="$2" color="$gray10">
            Remind: {reminderLabel}
          </Text>
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
