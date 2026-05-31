-- Storage RLS for private bucket: customer_document
-- Assumptions:
-- 1. Bucket "customer_document" already exists and is private.
-- 2. Customer document paths follow: {email}/aadhaar, {email}/aadhaar_back, {email}/pan, {email}/photo
-- 3. public.profiles contains id, email, and role.

-- Customers can upload only into their own folder with approved filenames.
create policy "Customers can upload own customer documents"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'customer_document'
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'customer'
      and lower((storage.foldername(name))[1]) = lower(p.email)
      and split_part(name, '/', 2) in ('aadhaar', 'aadhaar_back', 'pan', 'photo')
  )
);

-- Customers can view only their own documents.
create policy "Customers can view own customer documents"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'customer_document'
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'customer'
      and lower((storage.foldername(name))[1]) = lower(p.email)
  )
);

-- Customers can replace only their own documents.
create policy "Customers can update own customer documents"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'customer_document'
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'customer'
      and lower((storage.foldername(name))[1]) = lower(p.email)
  )
)
with check (
  bucket_id = 'customer_document'
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'customer'
      and lower((storage.foldername(name))[1]) = lower(p.email)
      and split_part(name, '/', 2) in ('aadhaar', 'aadhaar_back', 'pan', 'photo')
  )
);

-- Customers can delete only their own documents.
create policy "Customers can delete own customer documents"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'customer_document'
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'customer'
      and lower((storage.foldername(name))[1]) = lower(p.email)
  )
);

-- Admins and managers can view all customer documents for verification/review.
create policy "Admins and managers can view all customer documents"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'customer_document'
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role in ('admin', 'manager')
  )
);
