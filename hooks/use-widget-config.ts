import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_FOCUSED_TASK_IDS = '@adat/widgetFocusedTaskIds';
const KEY_NOTE_WIDGET_NOTE_ID = '@adat/widgetNoteId';

export function useWidgetConfig() {
  const [focusedTaskIds, setFocusedTaskIdsState] = useState<string[]>([]);
  const [noteWidgetNoteId, setNoteWidgetNoteIdState] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(KEY_FOCUSED_TASK_IDS).then((raw) => {
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as string[];
            if (Array.isArray(parsed)) setFocusedTaskIdsState(parsed);
          } catch {
            // ignore
          }
        }
      }),
      AsyncStorage.getItem(KEY_NOTE_WIDGET_NOTE_ID).then((id) => {
        if (id) setNoteWidgetNoteIdState(id);
      }),
    ]).then(() => setLoaded(true));
  }, []);

  const setFocusedTaskIds = useCallback(async (ids: string[]) => {
    setFocusedTaskIdsState(ids);
    await AsyncStorage.setItem(KEY_FOCUSED_TASK_IDS, JSON.stringify(ids));
  }, []);

  const setNoteWidgetNoteId = useCallback(async (noteId: string | null) => {
    setNoteWidgetNoteIdState(noteId);
    await AsyncStorage.setItem(KEY_NOTE_WIDGET_NOTE_ID, noteId ?? '');
  }, []);

  const addFocusedTask = useCallback(
    async (taskId: string) => {
      const next = focusedTaskIds.includes(taskId)
        ? focusedTaskIds
        : [...focusedTaskIds, taskId];
      await setFocusedTaskIds(next);
      return next;
    },
    [focusedTaskIds, setFocusedTaskIds]
  );

  const removeFocusedTask = useCallback(
    async (taskId: string) => {
      const next = focusedTaskIds.filter((id) => id !== taskId);
      await setFocusedTaskIds(next);
      return next;
    },
    [focusedTaskIds, setFocusedTaskIds]
  );

  const toggleFocusedTask = useCallback(
    async (taskId: string) => {
      const next = focusedTaskIds.includes(taskId)
        ? focusedTaskIds.filter((id) => id !== taskId)
        : [...focusedTaskIds, taskId];
      await setFocusedTaskIds(next);
      return next;
    },
    [focusedTaskIds, setFocusedTaskIds]
  );

  const isTaskFocused = useCallback(
    (taskId: string) => focusedTaskIds.includes(taskId),
    [focusedTaskIds]
  );

  return {
    focusedTaskIds,
    noteWidgetNoteId,
    setFocusedTaskIds,
    setNoteWidgetNoteId,
    addFocusedTask,
    removeFocusedTask,
    toggleFocusedTask,
    isTaskFocused,
    loaded,
  };
}
