import type { Note, Task } from './database';

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
    };
  };
}
