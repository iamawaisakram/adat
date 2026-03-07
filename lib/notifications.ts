import { Platform } from 'react-native';

import { supabase } from '@/lib/supabase/client';
import type { NotificationSettingKind } from '@/lib/types';

import { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';
import { getPermissionsAsync, requestPermissionsAsync } from 'expo-notifications/build/NotificationPermissions';
import { setNotificationChannelAsync } from 'expo-notifications/build/setNotificationChannelAsync';
import { AndroidImportance } from 'expo-notifications/build/NotificationChannelManager.types';
import { scheduleNotificationAsync } from 'expo-notifications/build/scheduleNotificationAsync';
import { cancelScheduledNotificationAsync } from 'expo-notifications/build/cancelScheduledNotificationAsync';

const CHANNEL_ID = 'task-reminders';
const MAX_SCHEDULED = 50;

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existing } = await getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await requestPermissionsAsync();
  return status === 'granted';
}

export async function ensureChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  try {
    await setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Task reminders',
      importance: AndroidImportance.DEFAULT,
    });
  } catch {
    // Native channel manager can throw (e.g. NullPointerException) if provider
    // isn't ready. Continue without custom channel; Android may use default.
  }
}

/** Parse "09:00" into { hour, minute }. */
function parseTime(timeStr: string): { hour: number; minute: number } {
  const [h, m] = timeStr.split(':').map(Number);
  return { hour: h ?? 9, minute: m ?? 0 };
}

/**
 * Schedule a single task reminder. Call after saving notification_setting.
 * identifier is stored so we can cancel later (we use task_id as identifier prefix).
 */
export async function scheduleTaskReminder(
  taskId: string,
  noteId: string,
  taskTitle: string,
  kind: NotificationSettingKind,
  reminderTime: string,
  specificAt: string | null
): Promise<string | null> {
  await ensureChannel();
  const identifier = `task-${taskId}`;

  if (kind === 'daily') {
    const { hour, minute } = parseTime(reminderTime);
    const id = await scheduleNotificationAsync({
      content: {
        title: 'Reminder',
        body: taskTitle || 'Task',
        data: { taskId, noteId },
        categoryIdentifier: 'task',
      },
      trigger: {
        type: 'daily',
        hour,
        minute,
        repeats: true,
        channelId: CHANNEL_ID,
      },
      identifier,
    });
    return id;
  }

  if (kind === 'specific' && specificAt) {
    const date = new Date(specificAt);
    if (date.getTime() <= Date.now()) return null;
    const id = await scheduleNotificationAsync({
      content: {
        title: 'Reminder',
        body: taskTitle || 'Task',
        data: { taskId, noteId },
        categoryIdentifier: 'task',
      },
      trigger: {
        type: 'date',
        date,
        channelId: CHANNEL_ID,
      },
      identifier,
    });
    return id;
  }

  return null;
}

export async function cancelTaskReminder(taskId: string): Promise<void> {
  await cancelScheduledNotificationAsync(`task-${taskId}`);
}

/**
 * Reschedule all reminders from DB (e.g. on app open).
 * Caps total scheduled to avoid platform limits.
 */
export async function rescheduleAllTaskReminders(): Promise<void> {
  const granted = await requestNotificationPermission();
  if (!granted) return;
  await ensureChannel();

  const { data: settings, error: settingsError } = await supabase
    .from('notification_settings')
    .select('task_id, kind, reminder_time, specific_at');

  if (settingsError || !settings?.length) return;

  let scheduled = 0;
  for (const row of settings) {
    if (scheduled >= MAX_SCHEDULED) break;
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('id, title, note_id')
      .eq('id', row.task_id)
      .single();
    if (taskError || !task) continue;
    await cancelTaskReminder(row.task_id);
    const id = await scheduleTaskReminder(
      row.task_id,
      task.note_id,
      task.title,
      row.kind as NotificationSettingKind,
      row.reminder_time,
      row.specific_at
    );
    if (id) scheduled++;
  }
}
