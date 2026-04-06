create table if not exists public.biodiesel_application_details (
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

drop trigger if exists biodiesel_application_details_updated_at on public.biodiesel_application_details;
create trigger biodiesel_application_details_updated_at
before update on public.biodiesel_application_details
for each row
execute function public.set_updated_at();
