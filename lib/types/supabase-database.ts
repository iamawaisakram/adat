import type { Note, Task, Template, Schedule, NotificationSetting } from './database';

export interface Database {
  public: {
    Tables: {
      notes: {
        Row: Note;
        Insert: Omit<Note, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Note, 'id' | 'created_at'>> & { updated_at?: string };
      };
      tasks: {
        Row: Task;
        Insert: Omit<Task, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Task, 'id' | 'created_at'>> & { updated_at?: string };
      };
      templates: {
        Row: Template;
        Insert: Omit<Template, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Template, 'id' | 'created_at'>> & { updated_at?: string };
      };
      schedules: {
        Row: Schedule;
        Insert: Omit<Schedule, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Schedule, 'id' | 'created_at'>> & { updated_at?: string };
      };
      notification_settings: {
        Row: NotificationSetting;
        Insert: Omit<NotificationSetting, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<NotificationSetting, 'id' | 'created_at'>> & { updated_at?: string };
      };
    };
  };
}
