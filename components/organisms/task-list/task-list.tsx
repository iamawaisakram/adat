import { useState } from 'react';

import { Button, Stack, YStack } from 'tamagui';

import { TaskRow } from '@/components/molecules';
import {
  useCreateTask,
  useNoteTasks,
  useUpdateTask,
} from '@/hooks/use-note-tasks';
import type { Task } from '@/lib/types';

type TaskListProps = {
  noteId: string;
};

export function TaskList({ noteId }: TaskListProps) {
  const { data: tasks = [], isLoading } = useNoteTasks(noteId);
  const createTask = useCreateTask(noteId);
  const updateTask = useUpdateTask(noteId);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleToggle = (task: Task) => {
    updateTask.mutate({ id: task.id, completed: !task.completed });
  };

  const handleStartEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
  };

  const handleSaveEdit = () => {
    if (editingId && editTitle.trim() !== '') {
      updateTask.mutate({ id: editingId, title: editTitle.trim() });
    }
    setEditingId(null);
  };

  const handleAddTask = () => {
    createTask.mutate({ title: 'New task' });
  };

  if (isLoading) return null;

  return (
    <YStack gap="$0">
      <Stack flexDirection="row" alignItems="center" marginBottom="$3">
        <Button
          size="$3"
          onPress={handleAddTask}
          theme="green"
          borderRadius="$3"
          fontWeight="600">
          Add task
        </Button>
      </Stack>
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          isEditing={editingId === task.id}
          editTitle={editTitle}
          onEditTitleChange={setEditTitle}
          onBlur={handleSaveEdit}
          onToggleComplete={() => handleToggle(task)}
          onPress={() => handleStartEdit(task)}
        />
      ))}
    </YStack>
  );
}
