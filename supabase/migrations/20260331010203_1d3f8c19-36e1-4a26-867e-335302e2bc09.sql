
-- 1. assessment_results (created first since email_captures references it)
CREATE TABLE public.assessment_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  email text,
  answers jsonb,
  category_scores jsonb,
  profile text,
  overall_percent integer,
  pdf_data text,
  data_storage_consent boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own results" ON public.assessment_results
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- 2. email_captures
CREATE TABLE public.email_captures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  source text DEFAULT 'email_capture_page',
  user_agent text,
  ip_address text,
  assessment_result_id uuid REFERENCES public.assessment_results(id),
  captured_at timestamptz DEFAULT now()
);
ALTER TABLE public.email_captures ENABLE ROW LEVEL SECURITY;

-- 3. users (simple contact records)
CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. scholarship_applications
CREATE TABLE public.scholarship_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  org_name text,
  program_summary text,
  roadblock text,
  commitment_confirmed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.scholarship_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own applications" ON public.scholarship_applications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own applications" ON public.scholarship_applications
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 5. workshop_registrations
CREATE TABLE public.workshop_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.workshop_registrations ENABLE ROW LEVEL SECURITY;
