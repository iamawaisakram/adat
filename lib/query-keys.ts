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
} as const;
