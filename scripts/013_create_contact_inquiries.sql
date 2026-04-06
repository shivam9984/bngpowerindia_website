-- Matches the public /contact form, which is currently form-only.

create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text,
  email text not null,
  phone text,
  service text,
  message text,
  consent boolean not null default false,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.contact_inquiries enable row level security;

create policy "Anyone can insert contact inquiries"
on public.contact_inquiries
for insert
with check (true);

create policy "Admins and managers can view contact inquiries"
on public.contact_inquiries
for select
using (public.is_admin_or_manager());

create index if not exists contact_inquiries_created_at_idx
  on public.contact_inquiries (created_at desc);

create index if not exists contact_inquiries_email_idx
  on public.contact_inquiries (email);

drop trigger if exists contact_inquiries_updated_at on public.contact_inquiries;
create trigger contact_inquiries_updated_at
before update on public.contact_inquiries
for each row
execute function public.set_updated_at();
