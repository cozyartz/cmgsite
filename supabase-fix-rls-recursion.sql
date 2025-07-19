-- CRITICAL FIX: Remove infinite recursion in profiles RLS policies
-- This script fixes the "infinite recursion detected in policy for relation profiles" error

-- First, drop all existing policies to start clean
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable" ON profiles;
DROP POLICY IF EXISTS "Superadmin can view all profiles" ON profiles;

-- Create non-conflicting RLS policies
-- Policy 1: Users can view their own profile
CREATE POLICY "profiles_select_own" ON profiles 
  FOR SELECT USING (auth.uid() = id);

-- Policy 2: Users can update their own profile  
CREATE POLICY "profiles_update_own" ON profiles 
  FOR UPDATE USING (auth.uid() = id);

-- Policy 3: Users can insert their own profile
CREATE POLICY "profiles_insert_own" ON profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy 4: Superadmins can view all profiles (no recursion)
-- This policy explicitly checks email/github without referencing the profiles table
CREATE POLICY "profiles_select_superadmin" ON profiles 
  FOR SELECT USING (
    -- Check if current user is superadmin by email or github
    auth.email() IN ('cozy2963@gmail.com', 'andrea@cozyartzmedia.com') OR
    auth.jwt()::jsonb->'user_metadata'->>'user_name' IN ('cozyartz')
  );

-- Policy 5: Superadmins can update all profiles
CREATE POLICY "profiles_update_superadmin" ON profiles 
  FOR UPDATE USING (
    auth.email() IN ('cozy2963@gmail.com', 'andrea@cozyartzmedia.com') OR
    auth.jwt()::jsonb->'user_metadata'->>'user_name' IN ('cozyartz')
  );

-- Test the fix by checking policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';

-- Verify no recursion issues
SELECT id, email, role FROM profiles WHERE id = auth.uid() LIMIT 1;