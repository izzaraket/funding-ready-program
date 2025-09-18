-- Ensure RLS is enabled on users table and add comprehensive security policies

-- Enable RLS on users table (critical security fix)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them with better security
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;

-- Policy 1: Block ALL anonymous access to users table
CREATE POLICY "Block anonymous access to users" 
ON public.users 
FOR ALL 
TO anon
USING (false)
WITH CHECK (false);

-- Policy 2: Allow service role full access for edge functions
CREATE POLICY "Service role can manage users" 
ON public.users 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

-- Policy 3: Users can view their own data only
CREATE POLICY "Users can view their own data" 
ON public.users 
FOR SELECT 
TO authenticated
USING (id = auth.uid());

-- Policy 4: Users can update their own data only
CREATE POLICY "Users can update their own data" 
ON public.users 
FOR UPDATE 
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());