-- Create profiles table aligned with the current profile form and 3-role model.
create table if not exists public.profiles (
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
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);




-- Enable RLS
alter table public.profiles enable row level security;

-- RLS Policies
-- Admins can view all profiles
create policy "Admins  can view all profiles" on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin','manager')
    )
  );

-- Users can view their own profile
create policy "Users can view their own profile" on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile (except role)
create policy "Users can update their own profile" on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Only admins can update roles
create policy "Only admins can update roles" on public.profiles for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Users can insert their own profile
create policy "Users can insert their own profile" on public.profiles for insert
  with check (auth.uid() = id);

-- Admins can insert profiles
create policy "Admins can insert profiles" on public.profiles for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Create trigger function to update updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- Create an index on role for faster queries
create index if not exists profiles_role_idx on public.profiles(role);
create unique index if not exists profiles_aadhaar_number_key
  on public.profiles (aadhaar_number)
  where aadhaar_number is not null;
create unique index if not exists profiles_pan_number_key
  on public.profiles (pan_number)
  where pan_number is not null;
create index if not exists profiles_contact_no_idx on public.profiles(contact_no);
create index if not exists profiles_state_district_idx on public.profiles(state, district);
create index if not exists profiles_profile_complete_idx on public.profiles(is_profile_complete);
