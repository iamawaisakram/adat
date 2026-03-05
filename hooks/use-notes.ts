import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';
import { supabase } from '@/lib/supabase/client';
import type { NoteInsert, NoteUpdate } from '@/lib/types';

export function useNotesList() {
  return useQuery({
    queryKey: queryKeys.notes.list(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useNote(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.notes.detail(id ?? ''),
    queryFn: async () => {
      if (!id) throw new Error('No note id');
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: Boolean(id),
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: NoteInsert) => {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          title: input.title ?? '',
          content: input.content ?? '',
          type: input.type ?? 'manual',
          source_template_id: input.source_template_id ?? null,
          period_key: input.period_key ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.notes.all });
    },
  });
}

export function useUpdateNote(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: NoteUpdate) => {
      const { data, error } = await supabase
        .from('notes')
        .update(input)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, __, ___) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.notes.all });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.notes.detail(id),
      });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('notes').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.notes.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
}
