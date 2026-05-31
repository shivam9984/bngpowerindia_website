-- ============================================================
-- FINAL FRESH SCHEMA
-- BNGPowerIndia / FuelHub
-- Run on a clean Supabase project or after clearing existing app objects.
-- ============================================================

-- ============================================================
-- TYPES
-- ============================================================

create type public.application_service_key as enum (
  'fuel_station',
  'cbg_plant',
  'biodiesel',
  'ev_charging_station'
);

create type public.application_status as enum (
  'submitted',
  'under_review',
  'approved',
  'rejected',
  'cancelled'
);

create type public.application_payment_status as enum (
  'unpaid',
  'pending',
  'success',
  'failed',
  'refunded'
);

create type public.application_payment_mode as enum (
  'cash',
  'upi',
  'card',
  'net_banking',
  'bank_transfer',
  'cheque',
  'demand_draft',
  'gateway',
  'other'
);

-- ============================================================
-- SHARED FUNCTIONS
-- ============================================================

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- ============================================================
-- PROFILES
-- ============================================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  contact_no text,
  alternate_contact_no text,
  occupation text,
  aadhaar_number text,
  pan_number text,
  aadhaar_img_url text,
  aadhaar_back_img_url text,
  pan_img_url text,
  passport_photo_url text,
  full_address text,
  district text,
  state text,
  pincode text,
  is_profile_complete boolean not null default false,
  is_kyc_verified boolean not null default false,
  role text not null default 'customer' check (role in ('admin', 'manager', 'customer')),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.profiles enable row level security;

create function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select p.role
  from public.profiles p
  where p.id = auth.uid()
  limit 1;
$$;

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() = 'admin', false);
$$;

create function public.is_admin_or_manager()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() in ('admin', 'manager'), false);
$$;

create policy "Admins can view all profiles"
on public.profiles
for select
using (public.is_admin_or_manager());

create policy "Users can view their own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Only admins can update roles"
on public.profiles
for update
using (public.is_admin())
with check (public.is_admin());

create policy "Users can insert their own profile"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "Admins can insert profiles"
on public.profiles
for insert
with check (public.is_admin());

create function public.prevent_profile_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Only admins can update roles';
  end if;

  return new;
end;
$$;

create function public.handle_new_user()
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
  );

  return new;
end;
$$;

create trigger profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger profiles_role_guard
before update on public.profiles
for each row
execute function public.prevent_profile_role_change();

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

create index profiles_role_idx on public.profiles(role);
create unique index profiles_aadhaar_number_key
  on public.profiles (aadhaar_number)
  where aadhaar_number is not null;
create unique index profiles_pan_number_key
  on public.profiles (pan_number)
  where pan_number is not null;
create index profiles_contact_no_idx on public.profiles(contact_no);
create index profiles_state_district_idx on public.profiles(state, district);
create index profiles_profile_complete_idx on public.profiles(is_profile_complete);

-- ============================================================
-- APPLICATIONS
-- ============================================================

create table public.applications (
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

create index applications_applicant_idx
  on public.applications (applicant_user_id, submitted_at desc);
create index applications_status_idx
  on public.applications (status, submitted_at desc);
create index applications_service_key_idx
  on public.applications (service_key, submitted_at desc);
create index applications_submitted_by_email_idx
  on public.applications (submitted_by_email);
create index applications_profile_snapshot_gin_idx
  on public.applications
  using gin (profile_snapshot);

create trigger applications_updated_at
before update on public.applications
for each row
execute function public.set_updated_at();

-- ============================================================
-- APPLICATION DETAIL TABLES
-- ============================================================

create table public.fuel_station_application_details (
  application_id uuid primary key references public.applications(id) on delete cascade,
  fuel_company_name text not null,
  land_type text not null,
  rear_depth_mt numeric(10, 2) not null,
  lhs_depth_mt numeric(10, 2) not null,
  rhs_depth_mt numeric(10, 2) not null,
  khasra_no text not null,
  road_type text not null,
  road_width_mt numeric(10, 2) not null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  constraint fuel_station_company_check
    check (fuel_company_name in ('HMEL', 'Nayara Energy', 'Eco Bharat Bio fuel')),
  constraint fuel_station_land_type_check
    check (land_type in ('Owned', 'Leased', 'Rented', 'Under process', 'Not sure')),
  constraint fuel_station_road_type_check
    check (road_type in ('National Highway', 'State Highway', 'City Road', 'Rural Road', 'Other'))
);

alter table public.fuel_station_application_details enable row level security;

create policy "Fuel station details follow applications access"
on public.fuel_station_application_details
for all
using (
  exists (
    select 1
    from public.applications a
    where a.id = application_id
      and (a.applicant_user_id = auth.uid() or public.is_admin_or_manager())
  )
)
with check (
  exists (
    select 1
    from public.applications a
    where a.id = application_id
      and (a.applicant_user_id = auth.uid() or public.is_admin_or_manager())
  )
);

create index fuel_station_details_company_idx
  on public.fuel_station_application_details (fuel_company_name);

create trigger fuel_station_application_details_updated_at
before update on public.fuel_station_application_details
for each row
execute function public.set_updated_at();

create table public.cbg_plant_application_details (
  application_id uuid primary key references public.applications(id) on delete cascade,
  feedstock text not null,
  capacity_tpd numeric(10, 2) not null,
  land_area_acres numeric(10, 2) not null,
  offtake text not null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  constraint cbg_plant_feedstock_check
    check (feedstock in ('Press mud', 'Cattle dung', 'Agri residue', 'MSW', 'Other')),
  constraint cbg_plant_offtake_check
    check (offtake in ('OMC', 'Industrial', 'Both', 'Not sure'))
);

alter table public.cbg_plant_application_details enable row level security;

create policy "CBG details follow applications access"
on public.cbg_plant_application_details
for all
using (
  exists (
    select 1
    from public.applications a
    where a.id = application_id
      and (a.applicant_user_id = auth.uid() or public.is_admin_or_manager())
  )
)
with check (
  exists (
    select 1
    from public.applications a
    where a.id = application_id
      and (a.applicant_user_id = auth.uid() or public.is_admin_or_manager())
  )
);

create trigger cbg_plant_application_details_updated_at
before update on public.cbg_plant_application_details
for each row
execute function public.set_updated_at();

create table public.biodiesel_application_details (
  application_id uuid primary key references public.applications(id) on delete cascade,
  biodiesel_feedstock text not null,
  capacity_kld numeric(10, 2) not null,
  plant_model text not null,
  quality_standard text not null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  constraint biodiesel_feedstock_check
    check (biodiesel_feedstock in ('UCO', 'Non-edible oil', 'Tallow', 'Other')),
  constraint biodiesel_plant_model_check
    check (plant_model in ('Turnkey EPC', 'Consultancy', 'Not sure')),
  constraint biodiesel_quality_standard_check
    check (quality_standard in ('BIS/IS', 'ASTM', 'Not sure'))
);

alter table public.biodiesel_application_details enable row level security;

create policy "Biodiesel details follow applications access"
on public.biodiesel_application_details
for all
using (
  exists (
    select 1
    from public.applications a
    where a.id = application_id
      and (a.applicant_user_id = auth.uid() or public.is_admin_or_manager())
  )
)
with check (
  exists (
    select 1
    from public.applications a
    where a.id = application_id
      and (a.applicant_user_id = auth.uid() or public.is_admin_or_manager())
  )
);

create trigger biodiesel_application_details_updated_at
before update on public.biodiesel_application_details
for each row
execute function public.set_updated_at();

create table public.ev_charging_application_details (
  application_id uuid primary key references public.applications(id) on delete cascade,
  charger_type text not null,
  ports_count integer not null,
  power_sanction_kw numeric(10, 2) not null,
  site_type text not null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  constraint ev_charger_type_check
    check (charger_type in ('AC', 'DC', 'Both', 'Not sure')),
  constraint ev_site_type_check
    check (site_type in ('Commercial', 'Highway', 'Residential', 'Parking', 'Other'))
);

alter table public.ev_charging_application_details enable row level security;

create policy "EV details follow applications access"
on public.ev_charging_application_details
for all
using (
  exists (
    select 1
    from public.applications a
    where a.id = application_id
      and (a.applicant_user_id = auth.uid() or public.is_admin_or_manager())
  )
)
with check (
  exists (
    select 1
    from public.applications a
    where a.id = application_id
      and (a.applicant_user_id = auth.uid() or public.is_admin_or_manager())
  )
);

create trigger ev_charging_application_details_updated_at
before update on public.ev_charging_application_details
for each row
execute function public.set_updated_at();

-- ============================================================
-- APPLICATION PAYMENTS
-- ============================================================

create table public.application_payments (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  amount numeric(12, 2) not null,
  payment_mode public.application_payment_mode,
  payment_status public.application_payment_status not null default 'pending',
  transaction_reference text,
  gateway_payload jsonb not null default '{}'::jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.application_payments enable row level security;

create policy "Applicants can view own application payments"
on public.application_payments
for select
using (
  exists (
    select 1
    from public.applications a
    where a.id = application_id
      and (a.applicant_user_id = auth.uid() or public.is_admin_or_manager())
  )
);

create policy "Applicants can create own payment record"
on public.application_payments
for insert
with check (
  exists (
    select 1
    from public.applications a
    where a.id = application_id
      and a.applicant_user_id = auth.uid()
  )
);

create policy "Admins and managers can create payments for any application"
on public.application_payments
for insert
with check (
  public.is_admin_or_manager()
);

create policy "Admins and managers can update payments"
on public.application_payments
for update
using (public.is_admin_or_manager())
with check (public.is_admin_or_manager());



create index application_payments_application_idx
  on public.application_payments (application_id, created_at desc);
create index application_payments_transaction_reference_idx
  on public.application_payments (transaction_reference);

create trigger application_payments_updated_at
before update on public.application_payments
for each row
execute function public.set_updated_at();


-- ============================================================
-- STORAGE
-- ============================================================

insert into storage.buckets (id, name, public)
values ('customer_document', 'customer_document', false);

create policy "Customers can upload own customer documents"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'customer_document'
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'customer'
      and lower((storage.foldername(name))[1]) = lower(p.email)
      and split_part(name, '/', 2) in ('aadhaar', 'aadhaar_back', 'pan', 'photo')
  )
);

create policy "Customers can view own customer documents"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'customer_document'
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'customer'
      and lower((storage.foldername(name))[1]) = lower(p.email)
  )
);

create policy "Customers can update own customer documents"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'customer_document'
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'customer'
      and lower((storage.foldername(name))[1]) = lower(p.email)
  )
)
with check (
  bucket_id = 'customer_document'
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'customer'
      and lower((storage.foldername(name))[1]) = lower(p.email)
      and split_part(name, '/', 2) in ('aadhaar', 'aadhaar_back', 'pan', 'photo')
  )
);

create policy "Customers can delete own customer documents"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'customer_document'
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'customer'
      and lower((storage.foldername(name))[1]) = lower(p.email)
  )
);

create policy "Admins and managers can view all customer documents"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'customer_document'
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role in ('admin', 'manager')
  )
);
