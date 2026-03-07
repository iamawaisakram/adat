export const queryKeys = {
  notes: {
    all: ['notes'] as const,
    list: () => [...queryKeys.notes.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.notes.all, 'detail', id] as const,
  },
  tasks: {
    all: ['tasks'] as const,
    list: (noteId: string) => [...queryKeys.tasks.all, 'list', noteId] as const,
  },
  templates: {
    all: ['templates'] as const,
    list: () => [...queryKeys.templates.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.templates.all, 'detail', id] as const,
  },
  schedules: {
    all: ['schedules'] as const,
    list: () => [...queryKeys.schedules.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.schedules.all, 'detail', id] as const,
  },
} as const;
