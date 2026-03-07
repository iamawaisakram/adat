export type NoteType = 'manual' | 'auto';

export interface Note {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  source_template_id: string | null;
  period_key: string | null;
  schedule_id: string | null;
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
  schedule_id?: string | null;
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

// Phase 2: Templates & Schedules

export type ScheduleFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Template {
  id: string;
  name: string;
  title_pattern: string;
  body_template: string;
  created_at: string;
  updated_at: string;
}

export interface Schedule {
  id: string;
  template_id: string;
  frequency: ScheduleFrequency;
  enabled: boolean;
  anchor_time: string | null;
  anchor_day_of_week: number | null;
  anchor_day_of_month: number | null;
  anchor_month: number | null;
  anchor_day: number | null;
  created_at: string;
  updated_at: string;
}

export interface TemplateInsert {
  name?: string;
  title_pattern?: string;
  body_template?: string;
}

export interface TemplateUpdate {
  name?: string;
  title_pattern?: string;
  body_template?: string;
}

export interface ScheduleInsert {
  template_id: string;
  frequency: ScheduleFrequency;
  enabled?: boolean;
  anchor_time?: string | null;
  anchor_day_of_week?: number | null;
  anchor_day_of_month?: number | null;
  anchor_month?: number | null;
  anchor_day?: number | null;
}

export interface ScheduleUpdate {
  template_id?: string;
  frequency?: ScheduleFrequency;
  enabled?: boolean;
  anchor_time?: string | null;
  anchor_day_of_week?: number | null;
  anchor_day_of_month?: number | null;
  anchor_month?: number | null;
  anchor_day?: number | null;
}
