-- Adds the mandatory Aadhaar Back document field and permits its storage path.

alter table public.profiles
  add column if not exists aadhaar_back_img_url text;

drop policy if exists "Customers can upload own customer documents" on storage.objects;
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

drop policy if exists "Customers can update own customer documents" on storage.objects;
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
