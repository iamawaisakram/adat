import type { FocusedTaskItem, NoteWidgetItem } from '@/lib/widget-payload';

/**
 * In-memory store for the latest widget payloads.
 * Used by Android widget task handler when the system requests a redraw
 * (e.g. WIDGET_ADDED, WIDGET_UPDATE) so the widget can render without the app being open.
 */
let lastFocusedPayload: { tasks: FocusedTaskItem[] } = { tasks: [] };
let lastNotePayload: NoteWidgetItem | null = null;

export function setFocusedTasksPayload(payload: { tasks: FocusedTaskItem[] }): void {
  lastFocusedPayload = payload;
}

export function setNoteWidgetPayload(payload: NoteWidgetItem | null): void {
  lastNotePayload = payload;
}

export function getFocusedTasksPayload(): { tasks: FocusedTaskItem[] } {
  return lastFocusedPayload;
}

export function getNoteWidgetPayload(): NoteWidgetItem | null {
  return lastNotePayload;
}
