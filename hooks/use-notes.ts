import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';
import { supabase } from '@/lib/supabase/client';
import type { Note, NoteInsert, NoteUpdate } from '@/lib/types';

export type NotesListFilter = {
  type?: 'all' | 'manual' | 'auto';
  period?: 'all' | 'week' | 'month' | 'year';
};

function inPeriod(createdAt: string, period: 'week' | 'month' | 'year'): boolean {
  const d = new Date(createdAt);
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const dMonthStart = new Date(y, m, 1);
  const dWeekStart = new Date(now);
  dWeekStart.setDate(now.getDate() - now.getDay());
  dWeekStart.setHours(0, 0, 0, 0);
  const dWeekEnd = new Date(dWeekStart);
  dWeekEnd.setDate(dWeekStart.getDate() + 6);
  dWeekEnd.setHours(23, 59, 59, 999);
  if (period === 'year') return d.getFullYear() === y;
  if (period === 'month') return d >= dMonthStart && d.getMonth() === m;
  if (period === 'week') return d >= dWeekStart && d <= dWeekEnd;
  return false;
}

export function useNotesList(filters?: NotesListFilter) {
  const typeFilter = filters?.type ?? 'all';
  const periodFilter = filters?.period ?? 'all';

  return useQuery({
    queryKey: [...queryKeys.notes.list(), typeFilter, periodFilter],
    queryFn: async (): Promise<Note[]> => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      let list: Note[] = data ?? [];
      if (typeFilter !== 'all') {
        list = list.filter((n) => n.type === typeFilter);
      }
      if (periodFilter !== 'all') {
        list = list.filter((n) => inPeriod(n.created_at, periodFilter));
      }
      return list;
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
