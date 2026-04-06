# Schema Alignment Notes

This folder now contains a split schema proposal that matches the data currently collected in the app.

Recommended execution order:

1. `001_create_profiles.sql`
2. `002_profile_trigger.sql`
3. `003_create_shared_types.sql`
4. `004_create_shared_functions.sql`
5. `005_align_profiles_schema.sql`
6. `006_create_applications.sql`
7. `007_create_fuel_station_application_details.sql`
8. `008_create_cbg_plant_application_details.sql`
9. `009_create_biodiesel_application_details.sql`
10. `010_create_ev_charging_application_details.sql`
11. `011_create_application_payments.sql`
12. `012_create_quote_requests.sql`
13. `013_create_contact_inquiries.sql`

Important alignment findings:

- `required_schema.sql` uses `user_profiles`, but the app reads and updates `public.profiles`.
- The profile page expects fields not present in the original `001_create_profiles.sql`, including `middle_name`, `passport_photo_url`, `contact_no`, `full_address`, `aadhaar_number`, and `pan_number`.
- The application page stores shared location fields and a `profile_snapshot`; the old proposal did not model that shape directly.
- Several enums in `required_schema.sql` do not match the current UI options.
  - `land_type` in the UI includes `Rented`, `Under process`, and `Not sure`.
  - `road_type` in the UI includes `City Road`, `Rural Road`, and `Other`.
  - EV `charger_type` in the UI is `AC`, `DC`, `Both`, `Not sure`.
- Public `/quote` and `/contact` pages collect data today but had no dedicated tables in the proposed schema.

`required_schema.sql` can now be treated as a draft/reference file. The numbered files above are the aligned schema proposal.
