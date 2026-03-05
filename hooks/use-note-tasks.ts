import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';
import { supabase } from '@/lib/supabase/client';
import type { TaskInsert, TaskUpdate } from '@/lib/types';

export function useNoteTasks(noteId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.tasks.list(noteId ?? ''),
    queryFn: async () => {
      if (!noteId) return [];
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('note_id', noteId)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    enabled: Boolean(noteId),
  });
}

export function useCreateTask(noteId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Omit<TaskInsert, 'note_id'>) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          note_id: noteId,
          title: input.title ?? '',
          completed: input.completed ?? false,
          due_at: input.due_at ?? null,
          sort_order: input.sort_order ?? 0,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.list(noteId),
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
}

export function useUpdateTask(noteId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...input
    }: TaskUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update(input)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.list(noteId),
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
}

export function useDeleteTask(noteId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.list(noteId),
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
}
