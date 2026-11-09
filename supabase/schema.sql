create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  form_type text not null check (form_type in ('corporate', 'contact', 'rent')),
  name text not null,
  phone text not null,
  email text,
  outlet text,
  package text,
  event_date date,
  event_time text,
  attendees integer,
  locality text,
  area text,
  owner_type text,
  maps_url text,
  floor text,
  frontage text,
  message text,
  status text not null default 'new' check (status in ('new', 'in_progress', 'closed')),
  created_at timestamptz not null default now()
);

alter table public.enquiries add column if not exists owner_type text;
alter table public.enquiries add column if not exists maps_url text;
alter table public.enquiries add column if not exists floor text;
alter table public.enquiries add column if not exists frontage text;

alter table public.enquiries enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'rakeshkakati89@gmail.com';
$$;

drop policy if exists "anyone can submit an enquiry" on public.enquiries;
create policy "anyone can submit an enquiry"
  on public.enquiries
  for insert
  to anon, authenticated
  with check (status = 'new');

drop policy if exists "admins insert enquiries" on public.enquiries;
create policy "admins insert enquiries"
  on public.enquiries
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "admins read enquiries" on public.enquiries;
create policy "admins read enquiries"
  on public.enquiries
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admins update enquiries" on public.enquiries;
create policy "admins update enquiries"
  on public.enquiries
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins delete enquiries" on public.enquiries;
create policy "admins delete enquiries"
  on public.enquiries
  for delete
  to authenticated
  using (public.is_admin());

grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on table public.enquiries to anon, authenticated, service_role;
