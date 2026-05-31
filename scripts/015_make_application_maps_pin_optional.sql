-- Makes the Google Maps pin optional for all service applications.

alter table public.applications
  alter column google_maps_pin drop not null;

alter table public.applications
  drop constraint if exists applications_google_maps_pin_check;

alter table public.applications
  add constraint applications_google_maps_pin_check
  check (google_maps_pin is null or google_maps_pin ~* '^https?://');
