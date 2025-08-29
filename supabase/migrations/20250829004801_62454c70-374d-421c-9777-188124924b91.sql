-- Create users table for email collection
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create assessment results table
CREATE TABLE public.assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  category_scores JSONB NOT NULL,
  profile TEXT NOT NULL,
  overall_percent INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create workshop registrations table
CREATE TABLE public.workshop_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  registration_type TEXT NOT NULL CHECK (registration_type IN ('paid', 'scholarship')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  organization_name TEXT,
  contact_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create scholarship applications table  
CREATE TABLE public.scholarship_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  org_name TEXT NOT NULL,
  program_summary TEXT NOT NULL,
  roadblock TEXT NOT NULL,
  commitment_confirmed BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarship_applications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (id = auth.uid());

-- Create RLS policies for assessment results
CREATE POLICY "Users can view their own results" ON public.assessment_results
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own results" ON public.assessment_results
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create RLS policies for workshop registrations
CREATE POLICY "Users can view their own registrations" ON public.workshop_registrations
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own registrations" ON public.workshop_registrations
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create RLS policies for scholarship applications
CREATE POLICY "Users can view their own applications" ON public.scholarship_applications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own applications" ON public.scholarship_applications
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();