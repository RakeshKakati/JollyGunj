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

create table if not exists public.admins (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
revoke all on table public.admins from anon, authenticated;
grant select on table public.admins to authenticated;

insert into public.admins (email) values
  ('rakeshkakati89@gmail.com'),
  ('armaan@forgefoundry.in')
on conflict (email) do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

drop policy if exists "admins read admins" on public.admins;
create policy "admins read admins"
  on public.admins
  for select
  to authenticated
  using (public.is_admin());

create or replace function public.add_admin(p_email text, p_password text)
returns text
language plpgsql
security definer
set search_path = public, extensions, auth
as $$
declare
  v_email text := lower(trim(p_email));
  v_id uuid;
  v_created boolean := false;
begin
  if not public.is_admin() then
    raise exception 'not allowed';
  end if;
  if v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'invalid email';
  end if;

  select id into v_id from auth.users where lower(email) = v_email;
  if v_id is null then
    if length(coalesce(p_password, '')) < 8 then
      raise exception 'password must be at least 8 characters';
    end if;
    v_id := gen_random_uuid();
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) values (
      '00000000-0000-0000-0000-000000000000', v_id, 'authenticated', 'authenticated', v_email,
      crypt(p_password, gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}', '{"email_verified":true}', now(), now(),
      '', '', '', ''
    );
    insert into auth.identities (provider_id, user_id, identity_data, provider, created_at, updated_at)
    values (v_id::text, v_id, jsonb_build_object('sub', v_id::text, 'email', v_email, 'email_verified', true), 'email', now(), now());
    v_created := true;
  end if;

  insert into public.admins (email) values (v_email) on conflict (email) do nothing;
  return case when v_created then 'created' else 'granted' end;
end;
$$;

create or replace function public.remove_admin(p_email text)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_email text := lower(trim(p_email));
begin
  if not public.is_admin() then
    raise exception 'not allowed';
  end if;
  if v_email = lower(coalesce(auth.jwt() ->> 'email', '')) then
    raise exception 'you cannot remove yourself';
  end if;
  delete from public.admins where lower(email) = v_email;
  delete from auth.users where lower(email) = v_email;
end;
$$;

revoke all on function public.add_admin(text, text) from public, anon;
revoke all on function public.remove_admin(text) from public, anon;
grant execute on function public.add_admin(text, text) to authenticated;
grant execute on function public.remove_admin(text) to authenticated;

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
