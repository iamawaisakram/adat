import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';
import { supabase } from '@/lib/supabase/client';
import type { TemplateInsert, TemplateUpdate } from '@/lib/types';

export function useTemplatesList() {
  return useQuery({
    queryKey: queryKeys.templates.list(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useTemplate(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.templates.detail(id ?? ''),
    queryFn: async () => {
      if (!id) throw new Error('No template id');
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: Boolean(id),
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: TemplateInsert) => {
      const { data, error } = await supabase
        .from('templates')
        .insert({
          name: input.name ?? '',
          title_pattern: input.title_pattern ?? '',
          body_template: input.body_template ?? '',
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
    },
  });
}

export function useUpdateTemplate(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: TemplateUpdate) => {
      const { data, error } = await supabase
        .from('templates')
        .update(input)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.templates.detail(id),
      });
    },
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('templates').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.schedules.all });
    },
  });
}
