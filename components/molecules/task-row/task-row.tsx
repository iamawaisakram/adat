import { Checkbox, Input, Text, XStack } from 'tamagui';

import type { Task } from '@/lib/types';

type TaskRowProps = {
  task: Task;
  isEditing?: boolean;
  editTitle?: string;
  onEditTitleChange?: (value: string) => void;
  onBlur?: () => void;
  onToggleComplete?: () => void;
  onPress?: () => void;
};

export function TaskRow({
  task,
  isEditing = false,
  editTitle = task.title,
  onEditTitleChange,
  onBlur,
  onToggleComplete,
  onPress,
}: TaskRowProps) {
  return (
    <XStack
      alignItems="center"
      gap="$2"
      paddingVertical="$2"
      onPress={onPress}
      cursor={onPress ? 'pointer' : undefined}>
      <Checkbox
        size="$4"
        checked={task.completed}
        onCheckedChange={onToggleComplete}
      />
      {isEditing ? (
        <Input
          flex={1}
          size="$3"
          value={editTitle}
          onChangeText={onEditTitleChange}
          onBlur={onBlur}
          autoFocus
        />
      ) : (
        <Text
          flex={1}
          textDecorationLine={task.completed ? 'line-through' : 'none'}
          color={task.completed ? '$gray10' : '$color'}>
          {task.title || 'Untitled task'}
        </Text>
      )}
    </XStack>
  );
}
