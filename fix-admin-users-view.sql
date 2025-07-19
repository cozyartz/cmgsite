-- Fix the admin_users view security issue
-- This removes the SECURITY DEFINER property that was causing the warning

-- Drop the existing view that has SECURITY DEFINER
DROP VIEW IF EXISTS public.admin_users;

-- Recreate the view without SECURITY DEFINER
CREATE VIEW public.admin_users AS
SELECT 
  id, 
  email, 
  full_name, 
  provider, 
  github_username, 
  created_at 
FROM profiles 
WHERE role = 'admin';

-- Add a comment explaining the view
COMMENT ON VIEW public.admin_users IS 'View of admin users without SECURITY DEFINER property';

-- Add RLS policy for the view if needed
-- Users can only see this view if they are admin themselves
CREATE POLICY "Admin users can view admin list" ON profiles
  FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    ) 
    AND role = 'admin'
  );
