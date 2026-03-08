# Notes App – Product & Technical Plan

Notes app with tasks, templates, auto-generated notes (daily/weekly/monthly/yearly), and per-task notifications. Built on the existing **Expo (React Native)** stack with file-based routing.

---

## 1. Core Concepts

| Concept      | Description                                                                                                                                        |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Note**     | A single note (e.g. "March 2025", "Week of 3 Mar"). Can be manual or auto-generated. Contains **content** (rich text / markdown) and **tasks**.    |
| **Task**     | A to-do item inside a note. Has title, optional due date/time, completion state, and optional **notification settings** (when to remind the user). |
| **Template** | Reusable note structure (title pattern + body template). User creates templates; they are used when auto-generating notes.                         |
| **Schedule** | Rule for auto-generation: frequency (daily/weekly/monthly/yearly), anchor (e.g. Monday for weekly, 1st for monthly), and which template to use.    |

---

## 2. Features (Summary)

1. **Notes** – Create, edit, delete notes. Each note has content + tasks.
2. **Templates** – Create/edit templates (title pattern + body). Used for auto-generation.
3. **Auto-generated notes** – App creates notes on a schedule (e.g. every Monday = weekly note with template X; 1st of month = monthly with template Y).
4. **Task notifications** – Per task: notify daily, or on a specific day/time. User can enable notifications for one or many tasks in a note (e.g. “remind me about these 3 tasks every day”).
5. **Stay on track** – Notifications remind the user about chosen tasks (e.g. from a monthly note) so they can follow up without opening the app first.
6. **Home screen widgets** – Two widget types: (1) show **focused tasks** (user-selected tasks from any note), (2) show a **single note** the user chooses for the widget.

---

## 3. Data Model (High Level)

```
User (local; optional account later)
  └── Notes[]
        ├── id, title, content (body), createdAt, type: 'manual' | 'auto'
        ├── sourceTemplateId? (if auto-generated)
        ├── periodKey? (e.g. "2025-03", "2025-W10" for weekly)
        └── Tasks[]
              ├── id, noteId, title, completed, dueAt?
              └── NotificationSetting?
                    ├── kind: 'daily' | 'specific'
                    ├── time (e.g. 09:00)
                    └── dayOfWeek? / date? (for specific)

Templates[]
  ├── id, name, titlePattern (e.g. "Week of {{date}}", "{{month}} {{year}}")
  └── bodyTemplate (markdown/text with optional placeholders)

Schedules[] (auto-generation rules)
  ├── id, templateId
  ├── frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  ├── anchor: dayOfWeek (weekly) | dayOfMonth (monthly) | month+day (yearly) | time (daily)
  └── enabled: boolean

WidgetConfig (single record or keyed by widget kind; stored in DB or AsyncStorage)
  ├── focusedTaskIds: string[]     → task IDs to show on "Focused tasks" widget (user selection)
  └── noteWidgetNoteId: string?    → note ID to show on "Note" widget (user picks one note)
```

- **Notes** and **Tasks** are the main content; **Templates** and **Schedules** drive auto-generation; **NotificationSetting** per task drives reminders. **WidgetConfig** drives what each home screen widget displays.

---

## 4. User Flows

### 4.1 Templates

- **List templates** – Name, preview of title pattern + body.
- **Create template** – Name, title pattern (e.g. `Week of {{date}}`), body template (markdown; can include a default task list structure).
- **Edit / delete template** – Only if not used by a schedule (or cascade: “also remove schedule”).

### 4.2 Schedules (Auto-generation)

- **List schedules** – e.g. “Weekly – every Monday – Template: Weekly Review”.
- **Create schedule** – Pick template, frequency (daily/weekly/monthly/yearly), then:
  - **Weekly**: pick day (e.g. Monday), optional time.
  - **Monthly**: pick day of month (e.g. 1st), optional time.
  - **Yearly**: pick month + day, optional time.
  - **Daily**: optional time (e.g. 00:05).
- **Edit / delete schedule** – Change template or anchor; disable or remove.

### 4.3 Notes

- **List notes** – Filter by type (all / manual / auto), by period (week, month, year). Show title, date, snippet.
- **Open note** – Full content + task list. Edit content and tasks.
- **Create note (manual)** – Title + body; optionally “from template” (pick template, generate title/body once, then edit).
- **Auto-created notes** – Created in background (or on app open) when a schedule fires; appear in list like any other note; user can edit afterward.

### 4.4 Tasks & Notifications

- **Tasks inside a note** – Add/edit/complete/delete tasks; optional due date/time.
- **Notification for a task** – On a task: “Remind me” →
  - **Daily** – Same time every day (e.g. 9:00) until completed or user turns off.
  - **Specific** – One-time or recurring: specific date and/or time (and optionally day of week for recurring).
- **Choose which tasks get notified** – Toggle per task (one or multiple); user explicitly selects which tasks in a note should trigger notifications (e.g. “only these 3 from my monthly note”).

### 4.5 Home Screen Widgets

- **Widget 1: Focused tasks** – Shows the tasks the user is “focusing on” (can be from different notes). User selects which tasks appear (e.g. from note screen: “Add to widget” / “Focus on home screen”); can add/remove single or multiple tasks. Widget displays title, completion state, optional due info; tap opens app to the note containing that task.
- **Widget 2: Note** – Shows one note the user has chosen for the widget (title + content snippet and/or task list). User picks “Show this note on home screen” (e.g. from note screen or from a widget config in app). Widget can show small/medium/large variants (more content on larger size); tap opens app to that note.

---

## 5. Notifications (Technical)

- **Channel** – Expo (React Native) → **expo-notifications**.
- **Scheduling** – Store “notification intent” per task (next trigger time + recurrence). Options:
  - **Local notifications only** – Schedule on device (expo-notifications); works offline; survives app restarts if we reschedule on launch.
  - **Background** – Use a small background task (expo-task-manager) or “on app open” job to create notes from schedules and reschedule task notifications for the next 24h / week (platform limits apply).
- **Persistence** – Notification settings and next-fire times stored with the task (local DB); on app open we recalculate and schedule local notifications for the next N days so we don’t hit OS limits (e.g. 64 on iOS).

---

## 6. Auto-Generation (Technical)

- **When** – Either at a fixed time (e.g. midnight) or “on first app open after the anchor has passed” (e.g. first open after Monday → create this week’s note).
- **How** – On app launch (and optionally via a periodic background task if available):
  - Load all enabled **Schedules**.
  - For each, compute “expected period” (e.g. current week, current month).
  - If a note for that period doesn’t exist, create it from the template (resolve `{{date}}`, `{{month}}`, `{{year}}`, etc.) and insert into **Notes** with `type: 'auto'` and `sourceTemplateId` / `periodKey`.
- **Idempotent** – One note per (schedule + period); no duplicates.

---

## 7. Home Screen Widgets (Technical)

- **Platform** – **iOS**: WidgetKit / SwiftUI (via Expo’s widget support, e.g. **expo-widgets** or native extension). **Android**: App Widgets (native Kotlin/XML or library that bridges to React Native data). Expo SDK 53+ has alpha support for building iOS widgets with React-like components and a config plugin; Android often still requires a native widget that reads shared data.
- **Data to widget** – Widgets cannot run the full app/JS at render time. Use **App Groups** (iOS) and **shared storage** (e.g. a small JSON/file or the same SQLite DB in a shared container) so the main app writes “widget payload” (focused task list, or selected note’s title + snippet + tasks) and the widget extension reads it. On app open or when user changes “focus” / “note for widget”, the app updates this payload and refreshes the widget timeline (iOS: `WidgetCenter.shared.reloadAllTimelines()` or equivalent).
- **Widget 1 – Focused tasks** – Payload: list of `{ taskId, noteId, title, completed, dueAt? }` for `focusedTaskIds`. Widget shows these in a compact list; tap deep-link to `note/[noteId]` (and optionally scroll to task). User manages focus list in app (e.g. “Add to home screen focus” from task context menu or a dedicated “Focus” screen).
- **Widget 2 – Note** – Payload: `{ noteId, title, contentSnippet, tasks[] }` for the note chosen in `noteWidgetNoteId`. Widget shows title + snippet and/or task list; tap deep-link to `note/[noteId]`. User chooses the note in app (e.g. “Show this note on widget” in note menu or in Settings → Widgets).
- **Sizes** – Support small (e.g. 3–5 tasks or note title + 1 line), medium (more tasks or longer snippet), large (full task list + snippet) where platform allows.

---

## 8. Tech Stack (Aligned with Current Project)

| Layer          | Choice                                | Notes                                                                                                  |
| -------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| App            | Existing Expo 54 + expo-router        | Keep current structure.                                                                                |
| UI             | **Tamagui**                           | Components, theming, responsive layout.                                                                |
| State (client) | **Zustand**                           | UI state (modals, widget config, focus list).                                                          |
| State (server) | **React Query**                       | Server state; Supabase as backend.                                                                     |
| Backend        | **Supabase**                          | Auth, DB (PostgREST), optional Realtime.                                                               |
| Storage        | Local-first (or Supabase-first)       | Supabase for persisted data; local cache via React Query.                                              |
| Notifications  | expo-notifications                    | Local scheduled notifications; request permissions on first “Remind me” use.                           |
| Background     | expo-task-manager (optional)          | For “create note at midnight” or rescheduling notifications; fallback: do generation on app open.      |
| Widgets        | expo-widgets (iOS) / native (Android) | Home screen widgets: focused tasks + single note; shared storage (App Groups / DB) for widget payload. |
| Sync (future)  | Optional                              | Supabase can cover sync when needed.                                                                   |

**Code structure & conventions** (file naming, Atomic Design, hook placement): see [docs/architecture.md](architecture.md).

---

## 9. App Structure (Screens / Routes)

Suggested structure under existing `app/` (expo-router):

```
app/
  _layout.tsx              (root; keep)
  (tabs)/
    _layout.tsx            (tabs; adjust labels)
    index.tsx              → Notes list (default home)
    templates.tsx          → Templates list
    schedules.tsx          → Schedules list (auto-generation rules)
    settings.tsx           → Notifications permission, defaults
  note/
    [id].tsx               → Single note view + edit (content + tasks)
  note/new.tsx             → New manual note (optional “from template”)
  template/
    [id].tsx               → Edit template
    new.tsx                → New template
  schedule/
    [id].tsx               → Edit schedule
    new.tsx                → New schedule
  modal.tsx                (keep or repurpose)
```

- **Notes list** – Primary tab; optional filters (this week, this month, all).
- **Templates** – CRUD templates.
- **Schedules** – CRUD auto-generation rules.
- **Settings** – Notification permission, default reminder time, etc.
- **Note [id]** – Read/edit note; add/edit/complete tasks; set “Remind me” (single or multiple tasks); “Add to widget” / “Show this note on widget” for home screen widgets.

---

## 10. Implementation Phases

### Phase 1 – Foundation ✅

- [x] Data layer: define schema (Notes, Tasks, Templates, Schedules, NotificationSetting); choose DB (supabase) and implement CRUD.
- [x] Notes list screen: list notes, open by id.
- [x] Single note screen: view/edit content and task list (no notifications yet).
- [x] Manual “new note” (and optionally “from template” as one-time copy).

### Phase 2 – Templates & Schedules ✅

- [x] Templates CRUD: name, title pattern, body template (with placeholders).
- [x] Schedules CRUD: template, frequency, anchor (day/time).
- [x] Auto-generation job: on app open, create missing notes for current period from each schedule; idempotent per period.

### Phase 3 – Task Notifications ✅

- [x] expo-notifications: request permission; schedule local notifications.
- [x] Per-task notification settings: “Remind me” → daily at X or specific day/time; store with task.
- [x] UI: toggle notifications for one or multiple tasks per note; list of “reminded” tasks in note or in settings.
- [x] On app open: reschedule upcoming notifications from stored settings (within platform limits).

### Phase 4 – Polish ✅

- [x] Rich note content (e.g. markdown renderer), better task UX (due dates, subtasks if needed).
- [x] Settings: default reminder time, notification permission prompt, about.
- [x] Edge cases: timezone for “daily at 9am”, handling past periods for schedules.

### Phase 5 – Home Screen Widgets ✅

- [x] **Widget config in app** – Persist `focusedTaskIds` and `noteWidgetNoteId` (WidgetConfig); UI to add/remove tasks from “focus” list and to pick the note for the note widget (e.g. from note screen or Settings → Widgets).
- [x] **Shared payload** – On launch and when config changes, write widget payload (focused tasks list, selected note snippet + tasks) to App Groups (iOS) / shared storage (Android); trigger widget timeline refresh.
- [x] **Widget 1 – Focused tasks** – Implement “Focused tasks” widget (iOS with expo-widgets or native extension; Android with native widget). Read payload; show task list; deep-link tap to `note/[noteId]`. Support small/medium/large if applicable.
- [x] **Widget 2 – Note** – Implement “Note” widget. Read payload for selected note; show title + content snippet and/or tasks; deep-link tap to `note/[noteId]`. Support sizes.

---

## 11. Open Decisions

- **Widget parity** – Ship “Focused tasks” and “Note” on iOS first (expo-widgets / WidgetKit), then Android with a native widget that consumes the same payload, or use a community solution if one matures.
- **Placeholders in templates** – Exact set: e.g. `{{date}}`, `{{week}}`, `{{month}}`, `{{year}}`, `{{isoWeek}}`; document for users.
- **Recurrence for “specific” notifications** – One-time vs repeating (e.g. “every Tuesday at 9”) and whether to store recurrence in data model for v1.
- **Offline-only vs optional sync** – v1 can be local-only; sync and multi-device later.

---

## 12. Success Criteria (MVP)

1. User can create notes with tasks and create templates.
2. User can set up a schedule (e.g. “every Monday, template X”) and the app auto-creates the corresponding weekly note.
3. User can select one or more tasks in any note and set a daily (or specific) reminder; they receive the chosen notifications and can stay on track (e.g. for monthly-note tasks).
4. User can add a **Focused tasks** home screen widget showing selected tasks from any note(s), and a **Note** widget showing one chosen note; tapping either opens the app to the relevant note.

This plan is ready to be broken down into tickets and implemented phase by phase in the existing Expo app.
