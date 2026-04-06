-- Shared helper functions used by multiple tables and RLS policies.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

create or replace function public.current_user_role()
returns text
language sql
stable
as $$
  select p.role
  from public.profiles p
  where p.id = auth.uid()
  limit 1;
$$;

create or replace function public.is_admin_or_manager()
returns boolean
language sql
stable
as $$
  select coalesce(public.current_user_role() in ('admin', 'manager'), false);
$$;
