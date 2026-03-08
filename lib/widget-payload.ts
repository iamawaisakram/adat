import { supabase } from '@/lib/supabase/client';

export type FocusedTaskItem = {
  taskId: string;
  noteId: string;
  title: string;
  completed: boolean;
  dueAt: string | null;
};

export type NoteWidgetItem = {
  noteId: string;
  title: string;
  contentSnippet: string;
  tasks: { taskId: string; title: string; completed: boolean; dueAt: string | null }[];
};

const SNIPPET_MAX_LEN = 120;

/**
 * Fetch task rows by IDs and map to widget payload shape.
 */
export async function buildFocusedTasksPayload(
  taskIds: string[]
): Promise<{ tasks: FocusedTaskItem[] }> {
  if (!taskIds.length) return { tasks: [] };
  const { data, error } = await supabase
    .from('tasks')
    .select('id, note_id, title, completed, due_at')
    .in('id', taskIds);
  if (error) return { tasks: [] };
  const tasks: FocusedTaskItem[] = (data ?? []).map((t) => ({
    taskId: t.id,
    noteId: t.note_id,
    title: t.title ?? '',
    completed: t.completed ?? false,
    dueAt: t.due_at ?? null,
  }));
  return { tasks };
}

/**
 * Fetch a single note with its tasks and build note widget payload.
 */
export async function buildNoteWidgetPayload(
  noteId: string | null
): Promise<NoteWidgetItem | null> {
  if (!noteId) return null;
  const { data: note, error: noteError } = await supabase
    .from('notes')
    .select('id, title, content')
    .eq('id', noteId)
    .single();
  if (noteError || !note) return null;

  const { data: tasks = [] } = await supabase
    .from('tasks')
    .select('id, title, completed, due_at')
    .eq('note_id', noteId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  const contentSnippet =
    (note.content ?? '').replaceAll(/\s+/g, ' ').slice(0, SNIPPET_MAX_LEN) +
    ((note.content ?? '').length > SNIPPET_MAX_LEN ? '…' : '');

  return {
    noteId: note.id,
    title: note.title ?? '',
    contentSnippet,
    tasks: tasks.map((t) => ({
      taskId: t.id,
      title: t.title ?? '',
      completed: t.completed ?? false,
      dueAt: t.due_at ?? null,
    })),
  };
}
