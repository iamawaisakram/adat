import { supabase } from '@/lib/supabase/client';
import type { ScheduleFrequency } from '@/lib/types';

/**
 * Compute the current period key for a schedule (idempotent key for "this" period).
 */
function getPeriodKey(
  frequency: ScheduleFrequency,
  anchor: {
    anchor_day_of_week: number | null;
    anchor_day_of_month: number | null;
    anchor_month: number | null;
    anchor_day: number | null;
  },
  now: Date
): string {
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();

  switch (frequency) {
    case 'daily':
      return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    case 'monthly':
      return `${y}-${String(m).padStart(2, '0')}`;
    case 'yearly':
      return String(y);
    case 'weekly': {
      const dayOfWeek = anchor.anchor_day_of_week ?? 0; // 0 = Sunday
      const currentDay = now.getDay();
      let diff = currentDay - dayOfWeek;
      if (diff < 0) diff += 7;
      const start = new Date(now);
      start.setDate(now.getDate() - diff);
      const sy = start.getFullYear();
      const sm = start.getMonth() + 1;
      const sd = start.getDate();
      return `${sy}-${String(sm).padStart(2, '0')}-${String(sd).padStart(2, '0')}`;
    }
    default:
      return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }
}

/**
 * Resolve template placeholders for "now" (e.g. when creating a note from template).
 * Exported for use in "new note from template" flow.
 */
export function resolveTemplateForNow(
  titlePattern: string,
  bodyTemplate: string
): { title: string; content: string } {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const periodKey = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  return resolveTemplate(titlePattern, bodyTemplate, periodKey, now);
}

/**
 * Resolve template placeholders with current period context.
 */
function resolveTemplate(
  titlePattern: string,
  bodyTemplate: string,
  periodKey: string,
  now: Date
): { title: string; content: string } {
  const parts = periodKey.split('-').map(Number);
  const year = parts[0] ?? now.getFullYear();
  const month = (parts[1] && parts[1] >= 1 && parts[1] <= 12) ? parts[1] : now.getMonth() + 1;
  const dateStr = periodKey;
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const monthName = monthNames[month - 1];
  const isoWeek = getISOWeek(now);

  const replace = (s: string) =>
    s
      .replaceAll('{{date}}', dateStr)
      .replaceAll('{{year}}', String(year))
      .replaceAll('{{month}}', String(month))
      .replaceAll('{{monthName}}', monthName)
      .replaceAll('{{isoWeek}}', isoWeek);

  return {
    title: replace(titlePattern),
    content: replace(bodyTemplate),
  };
}

function getISOWeek(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

/**
 * Run auto-generation: for each enabled schedule, ensure a note exists for the current period.
 * Idempotent: one note per (schedule_id, period_key).
 * Only creates notes for the current period (no backfill of past periods).
 */
export async function runAutoGenerateNotes(): Promise<void> {
  const now = new Date();

  const { data: schedules, error: listError } = await supabase
    .from('schedules')
    .select('id, template_id, frequency, anchor_day_of_week, anchor_day_of_month, anchor_month, anchor_day')
    .eq('enabled', true);

  if (listError || !schedules?.length) return;

  for (const schedule of schedules) {
    const periodKey = getPeriodKey(
      schedule.frequency as ScheduleFrequency,
      {
        anchor_day_of_week: schedule.anchor_day_of_week,
        anchor_day_of_month: schedule.anchor_day_of_month,
        anchor_month: schedule.anchor_month,
        anchor_day: schedule.anchor_day,
      },
      now
    );

    const { data: existing } = await supabase
      .from('notes')
      .select('id')
      .eq('schedule_id', schedule.id)
      .eq('period_key', periodKey)
      .maybeSingle();

    if (existing) continue;

    const { data: template, error: templateError } = await supabase
      .from('templates')
      .select('title_pattern, body_template')
      .eq('id', schedule.template_id)
      .single();

    if (templateError || !template) continue;

    const { title, content } = resolveTemplate(
      template.title_pattern,
      template.body_template,
      periodKey,
      now
    );

    await supabase.from('notes').insert({
      title,
      content,
      type: 'auto',
      source_template_id: schedule.template_id,
      period_key: periodKey,
      schedule_id: schedule.id,
    });
  }
}
