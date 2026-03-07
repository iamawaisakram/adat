import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';
import { supabase } from '@/lib/supabase/client';
import type { ScheduleInsert, ScheduleUpdate } from '@/lib/types';

export function useSchedulesList() {
  return useQuery({
    queryKey: queryKeys.schedules.list(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schedules')
        .select('*, templates(name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

/** Schedules that use a given template (for template delete flow). */
export function useSchedulesByTemplateId(templateId: string | undefined) {
  return useQuery({
    queryKey: [...queryKeys.schedules.all, 'byTemplate', templateId ?? ''],
    queryFn: async () => {
      if (!templateId) return [];
      const { data, error } = await supabase
        .from('schedules')
        .select('id')
        .eq('template_id', templateId);
      if (error) throw error;
      return data ?? [];
    },
    enabled: Boolean(templateId),
  });
}

export function useSchedule(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.schedules.detail(id ?? ''),
    queryFn: async () => {
      if (!id) throw new Error('No schedule id');
      const { data, error } = await supabase
        .from('schedules')
        .select('*, templates(id, name)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: Boolean(id),
  });
}

export function useCreateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ScheduleInsert) => {
      const { data, error } = await supabase
        .from('schedules')
        .insert({
          template_id: input.template_id,
          frequency: input.frequency,
          enabled: input.enabled ?? true,
          anchor_time: input.anchor_time ?? null,
          anchor_day_of_week: input.anchor_day_of_week ?? null,
          anchor_day_of_month: input.anchor_day_of_month ?? null,
          anchor_month: input.anchor_month ?? null,
          anchor_day: input.anchor_day ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.schedules.all });
    },
  });
}

export function useUpdateSchedule(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ScheduleUpdate) => {
      const { data, error } = await supabase
        .from('schedules')
        .update(input)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.schedules.all });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.schedules.detail(id),
      });
    },
  });
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('schedules').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.schedules.all });
    },
  });
}
