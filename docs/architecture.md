# Architecture & Conventions

Code structure, stack, and naming for the app.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| **UI** | **Tamagui** – components, theming, responsive layout |
| **State (client)** | **Zustand** – UI state (modals, widget config, theme, focus list) |
| **State (server)** | **React Query** – server state (notes, tasks, templates, schedules) |
| **Backend** | **Supabase** – auth, database (PostgREST), optional Realtime |

---

## Code Structure

- **Atomic Design**: `atoms` → `molecules` → `organisms` (screens use organisms).
- **Components** live in a component folder (e.g. `components/atoms/button/`).
- **Hooks**:
  - Used by **one component only** → next to that component (e.g. `TaskRow/use-task-row.ts`).
  - Used in **multiple places** → in the global `hooks/` folder.

Example:

```
src/
  components/
    atoms/
      button/
        button.tsx
        index.ts
    molecules/
      task-row/
        task-row.tsx
        use-task-row.ts
        index.ts
    organisms/
      task-list/
        task-list.tsx
        index.ts
  hooks/
    use-notes.ts
    use-theme.ts
  stores/
  lib/
  app/
```

---

## Barrel Imports & Tree-Shaking

- **Use barrel files** (`index.ts`) so consumers can import from a single entry (e.g. `@/components/atoms`).
- **Implement barrels as re-exports only** so the bundler can tree-shake unused code:
  - In each **component folder**: `index.ts` re-exports the component (and co-located hook if public).
  - In each **layer** (`atoms`, `molecules`, `organisms`): `index.ts` re-exports from every folder in that layer.

**Rules for tree-shaking:**

1. **Re-export only** – No logic or side effects in barrel files. Use:
   - `export { Button } from './button';`  
   - or `export { default as Button } from './button';`
2. **No aggregating** – Avoid `import * as X from './x'; export X` in barrels; prefer direct re-exports so the bundler can eliminate unused exports.
3. **One level per barrel** – Each folder has one `index.ts`; layer barrels re-export from folders, not from other barrels (or keep one level of barrel per layer).

**Example – component folder barrel:**

```ts
// components/atoms/button/index.ts
export { default as Button } from './button';
```

**Example – layer barrel:**

```ts
// components/atoms/index.ts
export { Button } from './button';
export { Icon } from './icon';
export { Text } from './text';
```

**Example – app import (tree-shakeable):**

```ts
import { Button, Text } from '@/components/atoms';
import { TaskRow } from '@/components/molecules';
```

Apply the same pattern for `hooks/` (e.g. `hooks/index.ts` re-exporting all hooks) and `stores/` if you expose multiple stores from one entry.

---

## File Naming

- **Use kebab-case for all source files.**

Examples:

- `button.tsx`, `task-row.tsx`, `use-task-row.ts`, `use-notes.ts`
- Not: `Button.tsx`, `TaskRow.tsx`, `useTaskRow.ts`

Apply to components, hooks, utils, stores, and other source files. Config files (e.g. `tsconfig.json`, `app.json`) keep their usual names.
