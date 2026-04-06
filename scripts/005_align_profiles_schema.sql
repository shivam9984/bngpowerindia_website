-- Aligns public.profiles with the fields actually used in signup, profile, and dashboard pages.

alter table public.profiles
  add column if not exists contact_no text,
  add column if not exists alternate_contact_no text,
  add column if not exists occupation text,
  add column if not exists aadhaar_number text,
  add column if not exists pan_number text,
  add column if not exists aadhaar_img_url text,
  add column if not exists pan_img_url text,
  add column if not exists passport_photo_url text,
  add column if not exists full_address text,
  add column if not exists district text,
  add column if not exists state text,
  add column if not exists pincode text,
  add column if not exists is_profile_complete boolean not null default false,
  add column if not exists is_kyc_verified boolean not null default false;

alter table public.profiles
  drop column if exists first_name,
  drop column if exists middle_name,
  drop column if exists last_name;

do $$
begin
  begin
    alter table public.profiles drop constraint if exists profiles_role_check;
  exception when undefined_object then
    null;
  end;

  alter table public.profiles
    add constraint profiles_role_check
    check (role in ('admin', 'manager', 'customer'));
exception when duplicate_object then
  null;
end $$;

create unique index if not exists profiles_aadhaar_number_key
  on public.profiles (aadhaar_number)
  where aadhaar_number is not null;

create unique index if not exists profiles_pan_number_key
  on public.profiles (pan_number)
  where pan_number is not null;

create index if not exists profiles_contact_no_idx on public.profiles (contact_no);
create index if not exists profiles_state_district_idx on public.profiles (state, district);
create index if not exists profiles_profile_complete_idx on public.profiles (is_profile_complete);

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();
