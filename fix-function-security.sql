-- Fix security advisor warnings for functions missing search_path
-- This addresses the function security definer issues

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
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
    RAISE LOG 'Error in handle_new_user for user %: % - %', NEW.id, SQLSTATE, SQLERRM;
    RETURN NEW;
END;
$$;

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix check_superadmin_status function
CREATE OR REPLACE FUNCTION public.check_superadmin_status(user_id UUID)
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_record RECORD;
  auth_user_record RECORD;
  should_be_admin BOOLEAN := FALSE;
BEGIN
  -- Get current profile
  SELECT * INTO current_user_record FROM public.profiles WHERE id = user_id;
  
  -- Get auth user data
  SELECT * INTO auth_user_record FROM auth.users WHERE id = user_id;
  
  -- Check if user should be admin
  IF auth_user_record.email IN ('cozy2963@gmail.com', 'andrea@cozyartzmedia.com') OR
     auth_user_record.raw_user_meta_data->>'user_name' IN ('cozyartz') THEN
    should_be_admin := TRUE;
  END IF;
  
  -- Update role if needed
  IF should_be_admin AND current_user_record.role != 'admin' THEN
    UPDATE public.profiles SET role = 'admin', updated_at = NOW() WHERE id = user_id;
    RETURN TRUE;
  END IF;
  
  RETURN should_be_admin;
END;
$$;

-- Fix promote_to_admin function
CREATE OR REPLACE FUNCTION public.promote_to_admin(user_email TEXT)
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Find user by email
  SELECT id INTO user_id FROM public.profiles WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Update to admin
  UPDATE public.profiles SET role = 'admin', updated_at = NOW() WHERE id = user_id;
  
  RETURN TRUE;
END;
$$;

-- Fix list_all_users function
CREATE OR REPLACE FUNCTION public.list_all_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  role TEXT,
  provider TEXT,
  github_username TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if current user is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
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
  FROM public.profiles
  ORDER BY profiles.created_at DESC;
END;
$$;

-- Also fix the manual profile creation function
CREATE OR REPLACE FUNCTION public.create_profile_manually(
  user_id UUID,
  user_email TEXT,
  user_full_name TEXT DEFAULT NULL,
  user_avatar_url TEXT DEFAULT NULL,
  user_provider TEXT DEFAULT 'email',
  user_github_username TEXT DEFAULT NULL,
  user_role TEXT DEFAULT 'user'
)
RETURNS profiles 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_profile public.profiles;
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
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO service_role;
GRANT EXECUTE ON FUNCTION public.check_superadmin_status(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.promote_to_admin(TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.list_all_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_profile_manually(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO service_role;
