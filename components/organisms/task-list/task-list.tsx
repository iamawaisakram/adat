import { useState } from 'react';
import { Modal } from 'react-native';

import { Button, Stack, YStack } from 'tamagui';

import { TaskRow } from '@/components/molecules';
import {
  useCreateTask,
  useNoteTasks,
  useUpdateTask,
} from '@/hooks/use-note-tasks';
import {
  useNotificationSettingsForTasks,
  useUpsertNotificationSetting,
  useDeleteNotificationSetting,
} from '@/hooks/use-notification-settings';
import type { Task } from '@/lib/types';

import { ReminderModal } from './reminder-modal';

type TaskListProps = {
  noteId: string;
};

function reminderLabel(setting: { kind: string; reminder_time: string; specific_at: string | null } | null): string | null {
  if (!setting) return null;
  if (setting.kind === 'daily') return `Daily at ${setting.reminder_time}`;
  if (setting.specific_at) return new Date(setting.specific_at).toLocaleString();
  return null;
}

export function TaskList({ noteId }: TaskListProps) {
  const { data: tasks = [], isLoading } = useNoteTasks(noteId);
  const taskIds = tasks.map((t) => t.id);
  const { data: settingsMap = {} } = useNotificationSettingsForTasks(taskIds);
  const createTask = useCreateTask(noteId);
  const updateTask = useUpdateTask(noteId);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [reminderTaskId, setReminderTaskId] = useState<string | null>(null);

  const reminderTask = reminderTaskId ? tasks.find((t) => t.id === reminderTaskId) : null;
  const upsertSetting = useUpsertNotificationSetting(reminderTaskId ?? '');
  const deleteSetting = useDeleteNotificationSetting(reminderTaskId ?? '');

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
          onRemindPress={() => setReminderTaskId(task.id)}
          reminderLabel={reminderLabel(settingsMap[task.id] ?? null)}
        />
      ))}
      <Modal
        visible={!!reminderTaskId && !!reminderTask}
        transparent
        animationType="slide"
        onRequestClose={() => setReminderTaskId(null)}>
        <Stack flex={1} justifyContent="center" backgroundColor="rgba(0,0,0,0.5)" padding="$4">
          {reminderTask && (
            <ReminderModal
              taskId={reminderTask.id}
              noteId={noteId}
              taskTitle={reminderTask.title}
              currentSetting={settingsMap[reminderTask.id] ?? null}
              onUpsert={async (input) => {
                await upsertSetting.mutateAsync(input);
              }}
              onDelete={async () => {
                await deleteSetting.mutateAsync();
              }}
              onClose={() => setReminderTaskId(null)}
            />
          )}
        </Stack>
      </Modal>
    </YStack>
  );
}
