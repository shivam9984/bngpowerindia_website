create table if not exists public.cbg_plant_application_details (
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

drop trigger if exists cbg_plant_application_details_updated_at on public.cbg_plant_application_details;
create trigger cbg_plant_application_details_updated_at
before update on public.cbg_plant_application_details
for each row
execute function public.set_updated_at();
