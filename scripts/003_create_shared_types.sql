-- Shared enums aligned with the current application forms and role model.

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin', 'manager', 'customer');
  end if;

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

  if not exists (select 1 from pg_type where typname = 'application_payment_status') then
    create type public.application_payment_status as enum (
      'unpaid',
      'pending',
      'success',
      'failed',
      'refunded'
    );
  end if;
end $$;
