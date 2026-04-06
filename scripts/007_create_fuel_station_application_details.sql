create table if not exists public.fuel_station_application_details (
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

create index if not exists fuel_station_details_company_idx
  on public.fuel_station_application_details (fuel_company_name);

drop trigger if exists fuel_station_application_details_updated_at on public.fuel_station_application_details;
create trigger fuel_station_application_details_updated_at
before update on public.fuel_station_application_details
for each row
execute function public.set_updated_at();
