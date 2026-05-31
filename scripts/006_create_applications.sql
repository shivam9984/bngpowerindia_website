-- Base application record. Matches the generic fields from /dashboard/apply/[service].

do $$
begin
  if not exists (select 1 from pg_type where typname = 'application_service_key') then
    create type public.application_service_key as enum (
      'fuel_station',
      'cbg_plant',
      'biodiesel',
      'ev_charging_station'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'application_status') then
    create type public.application_status as enum (
      'draft',
      'submitted',
      'under_review',
      'in_progress',
      'approved',
      'rejected',
      'cancelled'
    );
  end if;
end $$;

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  applicant_user_id uuid not null references auth.users(id) on delete restrict,
  service_key public.application_service_key not null,
  service_label text not null,
  status public.application_status not null default 'submitted',
  submitted_by_name text,
  submitted_by_email text,
  profile_snapshot jsonb not null default '{}'::jsonb,
  state text not null,
  district text not null,
  subdistrict_tehsil text not null,
  pincode text not null,
  full_address text not null,
  google_maps_pin text,
  landmark text,
  notes text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  submitted_at timestamptz not null default timezone('utc'::text, now()),
  constraint applications_service_key_label_check
    check (
      (service_key = 'fuel_station' and service_label = 'Fuel Station')
      or (service_key = 'cbg_plant' and service_label = 'CBG Plant')
      or (service_key = 'biodiesel' and service_label = 'Biodiesel')
      or (service_key = 'ev_charging_station' and service_label = 'EV Charging Station')
    ),
  constraint applications_google_maps_pin_check
    check (google_maps_pin is null or google_maps_pin ~* '^https?://'),
  constraint applications_pincode_check
    check (pincode ~ '^[0-9]{6}$')
);

alter table public.applications enable row level security;

create policy "Applicants can view own applications"
on public.applications
for select
using (auth.uid() = applicant_user_id);

create policy "Applicants can insert own applications"
on public.applications
for insert
with check (auth.uid() = applicant_user_id);

create policy "Applicants can update own applications before review"
on public.applications
for update
using (auth.uid() = applicant_user_id and reviewed_at is null)
with check (auth.uid() = applicant_user_id);

create policy "Admins and managers can view all applications"
on public.applications
for select
using (public.is_admin_or_manager());

create policy "Admins and managers can update all applications"
on public.applications
for update
using (public.is_admin_or_manager())
with check (public.is_admin_or_manager());

create index if not exists applications_applicant_idx
  on public.applications (applicant_user_id, submitted_at desc);

create index if not exists applications_status_idx
  on public.applications (status, submitted_at desc);

create index if not exists applications_service_key_idx
  on public.applications (service_key, submitted_at desc);

create index if not exists applications_submitted_by_email_idx
  on public.applications (submitted_by_email);

create index if not exists applications_profile_snapshot_gin_idx
  on public.applications
  using gin (profile_snapshot);

drop trigger if exists applications_updated_at on public.applications;
create trigger applications_updated_at
before update on public.applications
for each row
execute function public.set_updated_at();
