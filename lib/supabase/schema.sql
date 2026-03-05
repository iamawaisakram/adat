-- Phase 1: notes and tasks
-- Run this in Supabase SQL Editor after creating your project.

-- Notes
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  content text not null default '',
  type text not null default 'manual' check (type in ('manual', 'auto')),
  source_template_id uuid,
  period_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tasks (belong to a note)
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  note_id uuid not null references public.notes(id) on delete cascade,
  title text not null default '',
  completed boolean not null default false,
  due_at timestamptz,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for common queries
create index if not exists idx_notes_created_at on public.notes(created_at desc);
create index if not exists idx_notes_period_key on public.notes(period_key) where period_key is not null;
create index if not exists idx_tasks_note_id on public.tasks(note_id);
create index if not exists idx_tasks_note_id_sort on public.tasks(note_id, sort_order);

-- RLS (Row Level Security): enable and allow all for now; tighten with auth later
alter table public.notes enable row level security;
alter table public.tasks enable row level security;

create policy "Allow all for notes" on public.notes for all using (true) with check (true);
create policy "Allow all for tasks" on public.tasks for all using (true) with check (true);

-- Optional: updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger notes_updated_at before update on public.notes
  for each row execute function public.set_updated_at();
create trigger tasks_updated_at before update on public.tasks
  for each row execute function public.set_updated_at();
