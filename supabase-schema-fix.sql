-- Simplified Supabase Schema Fix for cmgsite Authentication
-- This addresses RLS policy issues that prevent automatic profile creation

-- First, drop existing policies and trigger if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable" ON profiles;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate the profiles table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  provider TEXT,
  github_username TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create more permissive policies that allow the trigger to work
CREATE POLICY "Enable all access for authenticated users" ON profiles
  FOR ALL USING (auth.role() = 'authenticated');

-- Create policy for service role (used by triggers)
CREATE POLICY "Enable all access for service role" ON profiles
  FOR ALL USING (auth.role() = 'service_role');

-- Create a simpler trigger function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
DECLARE
  user_role TEXT := 'user';
  user_email TEXT;
  github_username TEXT;
  provider_name TEXT;
  user_full_name TEXT;
BEGIN
  -- Extract data with null checks
  user_email := COALESCE(NEW.email, '');
  github_username := COALESCE(NEW.raw_user_meta_data->>'user_name', '');
  provider_name := COALESCE(NEW.app_metadata->>'provider', 'email');
  user_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name', 
    NEW.raw_user_meta_data->>'name', 
    NEW.email,
    'Unknown User'
  );

  -- Check for superadmin status
  IF user_email IN ('cozy2963@gmail.com', 'andrea@cozyartzmedia.com') OR
     github_username IN ('cozyartz') THEN
    user_role := 'admin';
  END IF;
  
  -- Insert profile with upsert to avoid conflicts
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
    user_email,
    user_full_name,
    NEW.raw_user_meta_data->>'avatar_url',
    provider_name,
    github_username,
    user_role,
    NOW(),
    NOW()
  ) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    provider = EXCLUDED.provider,
    github_username = EXCLUDED.github_username,
    role = EXCLUDED.role,
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the actual error details
    RAISE LOG 'Error in handle_new_user for user %: % - %', NEW.id, SQLSTATE, SQLERRM;
    -- Don't fail the auth process, just log the error
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO anon;
GRANT ALL ON public.profiles TO authenticated;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);
CREATE INDEX IF NOT EXISTS profiles_github_username_idx ON profiles(github_username);

-- Test function to manually create profile (for debugging)
CREATE OR REPLACE FUNCTION public.create_profile_manually(
  user_id UUID,
  user_email TEXT,
  user_full_name TEXT DEFAULT NULL,
  user_avatar_url TEXT DEFAULT NULL,
  user_provider TEXT DEFAULT 'email',
  user_github_username TEXT DEFAULT NULL,
  user_role TEXT DEFAULT 'user'
)
RETURNS profiles AS $$
DECLARE
  new_profile profiles;
BEGIN
  INSERT INTO public.profiles (
    id, email, full_name, avatar_url, provider, github_username, role, created_at, updated_at
  ) VALUES (
    user_id, user_email, user_full_name, user_avatar_url, user_provider, user_github_username, user_role, NOW(), NOW()
  ) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    provider = EXCLUDED.provider,
    github_username = EXCLUDED.github_username,
    role = EXCLUDED.role,
    updated_at = NOW()
  RETURNING * INTO new_profile;
  
  RETURN new_profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add helpful comments
COMMENT ON TABLE profiles IS 'User profiles with simplified RLS for OAuth integration';
COMMENT ON FUNCTION public.handle_new_user() IS 'Trigger function to auto-create profiles on user signup';
COMMENT ON FUNCTION public.create_profile_manually IS 'Manual profile creation function for debugging';