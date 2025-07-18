-- Supabase Database Schema for cmgsite Authentication
-- Run this in your Supabase SQL editor after creating the project

-- Create profiles table for user data
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

-- Create policies for profiles table
CREATE POLICY "Users can view own profile" ON profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create superadmin policy (for admin users to view all profiles)
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
DECLARE
  user_role TEXT := 'user';
  user_email TEXT := NEW.email;
  github_username TEXT := NEW.raw_user_meta_data->>'user_name';
  provider_name TEXT := NEW.app_metadata->>'provider';
BEGIN
  -- Check for superadmin status
  IF user_email IN ('cozy2963@gmail.com', 'andrea@cozyartzmedia.com') OR
     github_username IN ('cozyartz') THEN
    user_role := 'admin';
  END IF;
  
  -- Insert profile with error handling
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
    -- Log error and continue
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE OR REPLACE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);
CREATE INDEX IF NOT EXISTS profiles_github_username_idx ON profiles(github_username);

-- Create helper function to check and update superadmin status
CREATE OR REPLACE FUNCTION public.check_superadmin_status(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_user_record RECORD;
  auth_user_record RECORD;
  should_be_admin BOOLEAN := FALSE;
BEGIN
  -- Get current profile
  SELECT * INTO current_user_record FROM profiles WHERE id = user_id;
  
  -- Get auth user data
  SELECT * INTO auth_user_record FROM auth.users WHERE id = user_id;
  
  -- Check if user should be admin
  IF auth_user_record.email IN ('cozy2963@gmail.com', 'andrea@cozyartzmedia.com') OR
     auth_user_record.raw_user_meta_data->>'user_name' IN ('cozyartz') THEN
    should_be_admin := TRUE;
  END IF;
  
  -- Update role if needed
  IF should_be_admin AND current_user_record.role != 'admin' THEN
    UPDATE profiles SET role = 'admin', updated_at = NOW() WHERE id = user_id;
    RETURN TRUE;
  END IF;
  
  RETURN should_be_admin;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to manually promote user to admin (for debugging)
CREATE OR REPLACE FUNCTION public.promote_to_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Find user by email
  SELECT id INTO user_id FROM profiles WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Update to admin
  UPDATE profiles SET role = 'admin', updated_at = NOW() WHERE id = user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert a comment explaining the schema
COMMENT ON TABLE profiles IS 'User profiles with role-based access control for cmgsite';
COMMENT ON COLUMN profiles.role IS 'User role: user (default) or admin (superadmin)';
COMMENT ON COLUMN profiles.github_username IS 'GitHub username for OAuth integration';

-- Add some useful views for debugging
CREATE OR REPLACE VIEW public.admin_users AS
SELECT 
  id, 
  email, 
  full_name, 
  provider, 
  github_username, 
  created_at 
FROM profiles 
WHERE role = 'admin';

-- Add RLS policy for the view
ALTER VIEW admin_users OWNER TO postgres;

-- Create a function to list all users (admin only)
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
  -- Check if current user is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
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