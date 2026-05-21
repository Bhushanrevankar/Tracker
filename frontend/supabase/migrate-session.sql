-- Run this in Supabase SQL Editor if work_entries already exists.
-- Adds session column and fixes existing rows.

alter table public.work_entries add column if not exists session text;

update public.work_entries
set session = 'inactive'
where logout_time is not null or end_time_code is not null;

update public.work_entries
set session = 'active'
where session is null;

alter table public.work_entries alter column session set not null;
alter table public.work_entries alter column session set default 'active';

alter table public.work_entries alter column status drop not null;
alter table public.work_entries alter column status drop default;

drop index if exists work_entries_employee_status_idx;
create index if not exists work_entries_employee_session_idx
  on public.work_entries (employee_name, session, created_at desc);
