create table if not exists public.ev_charging_application_details (
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

drop trigger if exists ev_charging_application_details_updated_at on public.ev_charging_application_details;
create trigger ev_charging_application_details_updated_at
before update on public.ev_charging_application_details
for each row
execute function public.set_updated_at();
