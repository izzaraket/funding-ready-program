

# Recreate Database for Lovable Cloud

After migrating to Lovable Cloud, the database is empty. We need to recreate 4 tables that the app depends on.

---

## Tables to Create

### 1. `email_captures`
Stores emails collected from the email capture page.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, default gen_random_uuid() |
| email | text | NOT NULL |
| source | text | default 'email_capture_page' |
| user_agent | text | nullable |
| ip_address | text | nullable |
| assessment_result_id | uuid | nullable, FK to assessment_results |
| captured_at | timestamptz | default now() |

### 2. `users`
Simple user records (not auth users -- just email contacts).

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, default gen_random_uuid() |
| email | text | NOT NULL, UNIQUE |
| created_at | timestamptz | default now() |

### 3. `assessment_results`
Stores completed assessment data and generated PDFs.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, default gen_random_uuid() |
| user_id | uuid | nullable |
| email | text | nullable |
| answers | jsonb | nullable |
| category_scores | jsonb | nullable |
| profile | text | nullable |
| overall_percent | integer | nullable |
| pdf_data | text | nullable |
| data_storage_consent | boolean | default false |
| created_at | timestamptz | default now() |

### 4. `scholarship_applications`
Workshop scholarship applications.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, default gen_random_uuid() |
| user_id | uuid | NOT NULL |
| org_name | text | nullable |
| program_summary | text | nullable |
| roadblock | text | nullable |
| commitment_confirmed | boolean | default false |
| created_at | timestamptz | default now() |

### 5. `workshop_registrations`
Workshop registration data.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, default gen_random_uuid() |
| user_id | uuid | nullable |
| created_at | timestamptz | default now() |

---

## RLS Policies

All tables will have RLS enabled. Since edge functions use the **service role key** (bypasses RLS), and most data is inserted server-side, policies should:

- **email_captures**: No public read. Service role handles all inserts.
- **users**: No public read. Service role handles all inserts.
- **assessment_results**: Allow authenticated users to read their own rows (`user_id = auth.uid()`). Service role handles inserts from edge functions.
- **scholarship_applications**: Allow authenticated users to insert/read their own rows.
- **workshop_registrations**: Service role handles all access; no public policies needed.

---

## Implementation

One database migration creating all 5 tables with RLS enabled and appropriate policies. The build errors in `Results.tsx` and `WorkshopSignup.tsx` will resolve once the tables exist and types are regenerated.

