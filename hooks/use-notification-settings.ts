import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';
import { supabase } from '@/lib/supabase/client';
import type {
  NotificationSetting,
  NotificationSettingInsert,
} from '@/lib/types';

export function useNotificationSettingForTask(taskId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.notificationSettings.byTask(taskId ?? ''),
    queryFn: async () => {
      if (!taskId) return null;
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('task_id', taskId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: Boolean(taskId),
  });
}

/** Map of taskId -> notification setting for a list of task IDs (e.g. all tasks in a note). */
export function useNotificationSettingsForTasks(taskIds: string[]) {
  const key = taskIds.slice().sort((a, b) => a.localeCompare(b)).join(',');
  return useQuery({
    queryKey: [...queryKeys.notificationSettings.all, 'forTasks', key],
    queryFn: async () => {
      if (taskIds.length === 0) return {} as Record<string, typeof data[0] | null>;
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .in('task_id', taskIds);
      if (error) throw error;
      const map: Record<string, NotificationSetting | null> = {};
      for (const id of taskIds) map[id] = (data ?? []).find((r) => r.task_id === id) ?? null;
      return map;
    },
    enabled: taskIds.length > 0,
  });
}

export function useUpsertNotificationSetting(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Omit<NotificationSettingInsert, 'task_id'>) => {
      const { data, error } = await supabase
        .from('notification_settings')
        .upsert(
          {
            task_id: taskId,
            kind: input.kind,
            reminder_time: input.reminder_time,
            day_of_week: input.day_of_week ?? null,
            specific_at: input.specific_at ?? null,
          },
          { onConflict: 'task_id' }
        )
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, __, context) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.notificationSettings.byTask(taskId),
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.notificationSettings.all });
    },
  });
}

export function useDeleteNotificationSetting(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notification_settings')
        .delete()
        .eq('task_id', taskId);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.notificationSettings.byTask(taskId),
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.notificationSettings.all });
    },
  });
}
