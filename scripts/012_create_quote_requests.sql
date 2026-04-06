-- Matches the public /quote page, which is currently form-only.

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text not null,
  email text not null,
  phone text not null,
  fuel_type text not null,
  quantity numeric(12, 2) not null,
  frequency text not null,
  delivery_address text not null,
  additional_notes text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  constraint quote_requests_frequency_check
    check (frequency in ('one-time', 'weekly', 'monthly', 'quarterly'))
);

alter table public.quote_requests enable row level security;

create policy "Anyone can insert quote requests"
on public.quote_requests
for insert
with check (true);

create policy "Admins and managers can view quote requests"
on public.quote_requests
for select
using (public.is_admin_or_manager());

create index if not exists quote_requests_created_at_idx
  on public.quote_requests (created_at desc);

create index if not exists quote_requests_email_idx
  on public.quote_requests (email);

drop trigger if exists quote_requests_updated_at on public.quote_requests;
create trigger quote_requests_updated_at
before update on public.quote_requests
for each row
execute function public.set_updated_at();
