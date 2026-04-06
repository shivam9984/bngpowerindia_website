create table if not exists public.application_payments (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  amount numeric(12, 2) not null,
  currency_code text not null default 'INR',
  payment_mode text,
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

create policy "Admins and managers can update payments"
on public.application_payments
for update
using (public.is_admin_or_manager())
with check (public.is_admin_or_manager());

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

create index if not exists application_payments_application_idx
  on public.application_payments (application_id, created_at desc);

create index if not exists application_payments_transaction_reference_idx
  on public.application_payments (transaction_reference);

drop trigger if exists application_payments_updated_at on public.application_payments;
create trigger application_payments_updated_at
before update on public.application_payments
for each row
execute function public.set_updated_at();
