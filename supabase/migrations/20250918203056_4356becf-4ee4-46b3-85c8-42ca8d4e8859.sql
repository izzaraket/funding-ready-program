-- Fix security vulnerability: Block anonymous access to sensitive tables
-- This prevents anonymous users from accessing data when user_id is null

-- Block anonymous access to workshop_registrations
CREATE POLICY "Block anonymous access to workshop registrations"
ON public.workshop_registrations
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Block anonymous access to assessment_results  
CREATE POLICY "Block anonymous access to assessment results"
ON public.assessment_results
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Block anonymous access to scholarship_applications
CREATE POLICY "Block anonymous access to scholarship applications"
ON public.scholarship_applications
FOR ALL
TO anon  
USING (false)
WITH CHECK (false);

-- Ensure user_id columns are properly set by making them NOT NULL where appropriate
-- For workshop_registrations, make user_id NOT NULL to prevent null user_id records
ALTER TABLE public.workshop_registrations 
ALTER COLUMN user_id SET NOT NULL;

-- For assessment_results, user_id can be null for anonymous assessments, but we block anon access above
-- For scholarship_applications, user_id can be null for anonymous applications, but we block anon access above