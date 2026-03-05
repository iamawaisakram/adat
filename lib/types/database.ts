export type NoteType = 'manual' | 'auto';

export interface Note {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  source_template_id: string | null;
  period_key: string | null;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  note_id: string;
  title: string;
  completed: boolean;
  due_at: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface NoteInsert {
  title?: string;
  content?: string;
  type?: NoteType;
  source_template_id?: string | null;
  period_key?: string | null;
}

export interface NoteUpdate {
  title?: string;
  content?: string;
  type?: NoteType;
  source_template_id?: string | null;
  period_key?: string | null;
}

export interface TaskInsert {
  note_id: string;
  title?: string;
  completed?: boolean;
  due_at?: string | null;
  sort_order?: number;
}

export interface TaskUpdate {
  title?: string;
  completed?: boolean;
  due_at?: string | null;
  sort_order?: number;
}
