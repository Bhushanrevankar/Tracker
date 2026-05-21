-- Run in Supabase: SQL Editor → New query → Run

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
  session text not null default 'active',
  status text,
  end_time_code text,
  logout_time text,
  productive_minutes integer,
  remarks text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists work_entries_employee_session_idx
  on public.work_entries (employee_name, session, created_at desc);

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
-- MIGRATION (you already have work_entries — run this block)
-- ---------------------------------------------------------------------------
-- alter table public.work_entries add column if not exists session text;
--
-- update public.work_entries
-- set session = 'inactive'
-- where logout_time is not null or end_time_code is not null;
--
-- update public.work_entries
-- set session = 'active'
-- where session is null;
--
-- alter table public.work_entries alter column session set not null;
-- alter table public.work_entries alter column session set default 'active';
--
-- alter table public.work_entries alter column status drop not null;
-- alter table public.work_entries alter column status drop default;
--
-- drop index if exists work_entries_employee_status_idx;
-- create index if not exists work_entries_employee_session_idx
--   on public.work_entries (employee_name, session, created_at desc);
