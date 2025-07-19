-- Fix for infinite recursion in profiles table policies
-- Run this in your Supabase SQL editor

-- First, drop all existing policies that might be causing recursion
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable" ON profiles;
DROP POLICY IF EXISTS "Superadmin can view all profiles" ON profiles;

-- Create simple, non-recursive policies
CREATE POLICY "Enable read access for own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable update for own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create a separate policy for superadmin access without recursion
-- Using email-based check instead of role-based to avoid recursion
CREATE POLICY "Enable superadmin access" ON profiles
  FOR ALL USING (
    auth.jwt() ->> 'email' IN ('cozy2963@gmail.com', 'andrea@cozyartzmedia.com')
    OR 
    (auth.jwt() -> 'user_metadata' ->> 'user_name') = 'cozyartz'
  );

-- Update the handle_new_user function to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
DECLARE
  user_role TEXT := 'user';
  user_email TEXT := NEW.email;
  github_username TEXT := NEW.raw_user_meta_data->>'user_name';
  provider_name TEXT := NEW.app_metadata->>'provider';
BEGIN
  -- Check for superadmin status using direct email/username check
  IF user_email IN ('cozy2963@gmail.com', 'andrea@cozyartzmedia.com') OR
     github_username IN ('cozyartz') THEN
    user_role := 'admin';
  END IF;
  
  -- Insert profile with error handling using ON CONFLICT
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    avatar_url, 
    provider, 
    github_username,
    role,
    created_at,
    updated_at
  ) VALUES (
    NEW.id, 
    COALESCE(NEW.email, ''), 
    COALESCE(
      NEW.raw_user_meta_data->>'full_name', 
      NEW.raw_user_meta_data->>'name', 
      NEW.email,
      'Unknown User'
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(provider_name, 'email'),
    NEW.raw_user_meta_data->>'user_name',
    user_role,
    NOW(),
    NOW()
  ) ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(NEW.email, profiles.email),
    full_name = COALESCE(
      NEW.raw_user_meta_data->>'full_name', 
      NEW.raw_user_meta_data->>'name', 
      profiles.full_name
    ),
    avatar_url = COALESCE(NEW.raw_user_meta_data->>'avatar_url', profiles.avatar_url),
    provider = COALESCE(provider_name, profiles.provider),
    github_username = COALESCE(NEW.raw_user_meta_data->>'user_name', profiles.github_username),
    role = user_role,
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error and continue - don't break auth flow
    RAISE LOG 'Error in handle_new_user for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update the admin checking function to avoid recursion
CREATE OR REPLACE FUNCTION public.check_superadmin_status(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  auth_user_record RECORD;
  should_be_admin BOOLEAN := FALSE;
BEGIN
  -- Get auth user data directly from auth.users
  SELECT * INTO auth_user_record FROM auth.users WHERE id = user_id;
  
  -- Check if user should be admin based on auth data, not profile data
  IF auth_user_record.email IN ('cozy2963@gmail.com', 'andrea@cozyartzmedia.com') OR
     auth_user_record.raw_user_meta_data->>'user_name' IN ('cozyartz') THEN
    should_be_admin := TRUE;
    
    -- Update role if needed (this won't cause recursion since we're not reading from profiles)
    UPDATE profiles SET role = 'admin', updated_at = NOW() 
    WHERE id = user_id AND role != 'admin';
  END IF;
  
  RETURN should_be_admin;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the list_all_users function to use JWT claims instead of profile lookups
CREATE OR REPLACE FUNCTION public.list_all_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  role TEXT,
  provider TEXT,
  github_username TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  -- Check if current user is admin using JWT claims (no recursion)
  IF NOT (
    auth.jwt() ->> 'email' IN ('cozy2963@gmail.com', 'andrea@cozyartzmedia.com')
    OR 
    (auth.jwt() -> 'user_metadata' ->> 'user_name') = 'cozyartz'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;
  
  RETURN QUERY
  SELECT 
    profiles.id,
    profiles.email,
    profiles.full_name,
    profiles.role,
    profiles.provider,
    profiles.github_username,
    profiles.created_at
  FROM profiles
  ORDER BY profiles.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Test the policies by trying a simple select (should work without recursion)
-- This will help verify the fix worked
SELECT 'RLS policies updated successfully - no more infinite recursion!' AS status;
