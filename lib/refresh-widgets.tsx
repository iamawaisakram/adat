import React from 'react';
import { Platform } from 'react-native';

import {
  buildFocusedTasksPayload,
  buildNoteWidgetPayload,
} from '@/lib/widget-payload';
import {
  setFocusedTasksPayload,
  setNoteWidgetPayload,
} from '@/lib/widget-data-store';

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_FOCUSED_TASK_IDS = '@adat/widgetFocusedTaskIds';
const KEY_NOTE_WIDGET_NOTE_ID = '@adat/widgetNoteId';

async function getWidgetConfig(): Promise<{
  focusedTaskIds: string[];
  noteWidgetNoteId: string | null;
}> {
  const [rawIds, noteId] = await Promise.all([
    AsyncStorage.getItem(KEY_FOCUSED_TASK_IDS),
    AsyncStorage.getItem(KEY_NOTE_WIDGET_NOTE_ID),
  ]);
  let focusedTaskIds: string[] = [];
  if (rawIds) {
    try {
      const parsed = JSON.parse(rawIds) as unknown;
      if (Array.isArray(parsed)) focusedTaskIds = parsed;
    } catch {
      // ignore
    }
  }
  return {
    focusedTaskIds,
    noteWidgetNoteId: noteId || null,
  };
}

/**
 * Build widget payloads from current config and push to widgets.
 * iOS: expo-widgets updateSnapshot. Android: store + requestWidgetUpdate.
 */
export async function refreshWidgets(): Promise<void> {
  const config = await getWidgetConfig();

  const [focusedPayload, notePayload] = await Promise.all([
    buildFocusedTasksPayload(config.focusedTaskIds),
    buildNoteWidgetPayload(config.noteWidgetNoteId),
  ]);

  if (Platform.OS === 'android') {
    setFocusedTasksPayload(focusedPayload);
    setNoteWidgetPayload(notePayload);
    try {
      const { requestWidgetUpdate } = await import(
        'react-native-android-widget'
      );
      const { FocusedTasksAndroidWidget } = await import(
        '@/widgets/android/FocusedTasksAndroidWidget'
      );
      const { NoteAndroidWidget } = await import(
        '@/widgets/android/NoteAndroidWidget'
      );
      requestWidgetUpdate({
        widgetName: 'FocusedTasks',
        renderWidget: () => (
          <FocusedTasksAndroidWidget tasks={focusedPayload.tasks} />
        ),
      });
      requestWidgetUpdate({
        widgetName: 'Note',
        renderWidget: () => <NoteAndroidWidget note={notePayload} />,
      });
    } catch {
      // react-native-android-widget not available
    }
    return;
  }

  if (Platform.OS === 'ios') {
    try {
      const FocusedTasksWidget = (await import('@/widgets/FocusedTasksWidget'))
        .default;
      FocusedTasksWidget.updateSnapshot(focusedPayload);

      const NoteWidget = (await import('@/widgets/NoteWidget')).default;
      NoteWidget.updateSnapshot({ note: notePayload });
    } catch {
      // expo-widgets not available
    }
  }
}
