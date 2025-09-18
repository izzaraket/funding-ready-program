-- Create comprehensive RLS policies for email_captures table to prevent unauthorized access

-- Drop any existing policies on email_captures if they exist
DROP POLICY IF EXISTS "Users can view their own email captures" ON public.email_captures;
DROP POLICY IF EXISTS "Users can insert their own email captures" ON public.email_captures;

-- Policy 1: Block ALL public access to email captures (no one should read marketing data)
CREATE POLICY "Block all public access to email captures" 
ON public.email_captures 
FOR ALL 
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- Policy 2: Allow service role full access for edge functions
CREATE POLICY "Service role can manage email captures" 
ON public.email_captures 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

-- Policy 3: Allow authenticated users to view only their own email captures (when user_id is linked)
CREATE POLICY "Users can view their own linked email captures" 
ON public.email_captures 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid() AND user_id IS NOT NULL);

-- Ensure RLS is enabled on email_captures table
ALTER TABLE public.email_captures ENABLE ROW LEVEL SECURITY;