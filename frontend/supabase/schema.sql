-- Run in Supabase: SQL Editor → New query → Run
-- If you already have work_entries from an older schema, run the MIGRATION block at the bottom instead of dropping the table.

-- ---------------------------------------------------------------------------
-- Fresh install
-- ---------------------------------------------------------------------------
create table if not exists public.work_entries (
  id uuid primary key default gen_random_uuid(),
  employee_name text not null,
  work_date date not null,
  login_time text not null,
  project text not null,
  assigned_movie text not null,
  start_time_code text not null,
  languages text not null,
  type_of_work text not null,
  status text not null default 'In Progress',
  end_time_code text,
  logout_time text,
  productive_minutes integer,
  remarks text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists work_entries_employee_status_idx
  on public.work_entries (employee_name, status, created_at desc);

-- Auto-update updated_at on row change
create or replace function public.set_work_entries_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists work_entries_updated_at on public.work_entries;

create trigger work_entries_updated_at
  before update on public.work_entries
  for each row
  execute function public.set_work_entries_updated_at();

alter table public.work_entries enable row level security;

drop policy if exists "Allow public insert on work_entries" on public.work_entries;
drop policy if exists "Allow public select on work_entries" on public.work_entries;
drop policy if exists "Allow public update on work_entries" on public.work_entries;

create policy "Allow public insert on work_entries"
  on public.work_entries
  for insert
  to anon, authenticated
  with check (true);

create policy "Allow public select on work_entries"
  on public.work_entries
  for select
  to anon, authenticated
  using (true);

create policy "Allow public update on work_entries"
  on public.work_entries
  for update
  to anon, authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- MIGRATION (only if work_entries already exists without new columns)
-- ---------------------------------------------------------------------------
-- alter table public.work_entries add column if not exists status text not null default 'In Progress';
-- alter table public.work_entries add column if not exists end_time_code text;
-- alter table public.work_entries add column if not exists logout_time text;
-- alter table public.work_entries add column if not exists productive_minutes integer;
-- alter table public.work_entries add column if not exists remarks text;
-- alter table public.work_entries add column if not exists updated_at timestamptz not null default now();
-- create index if not exists work_entries_employee_status_idx on public.work_entries (employee_name, status, created_at desc);
-- (Re-run the trigger, RLS policies, and update policy from above if needed.)
