-- Migration 007: Fix Security Issues from Supabase Linter
-- This migration addresses critical security findings:
-- 1. Security definer views
-- 2. RLS policies referencing user_metadata
-- 3. Function search_path issues

-- =================================================================
-- 1. FIX SECURITY DEFINER VIEWS
-- =================================================================

-- Remove security definer from problematic views and recreate them properly
DROP VIEW IF EXISTS public.user_activity_summary;
DROP VIEW IF EXISTS public.admin_users;
DROP VIEW IF EXISTS public.dashboard_overview;

-- Recreate user_activity_summary without SECURITY DEFINER
CREATE VIEW public.user_activity_summary AS
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.created_at,
    p.updated_at,
    p.last_login,
    CASE 
        WHEN p.last_login > NOW() - INTERVAL '7 days' THEN 'active'
        WHEN p.last_login > NOW() - INTERVAL '30 days' THEN 'inactive'
        ELSE 'dormant'
    END as activity_status
FROM public.profiles p;

-- Recreate admin_users view without SECURITY DEFINER
-- Only show users with admin role based on profiles table, not user_metadata
CREATE VIEW public.admin_users AS
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.role,
    p.created_at,
    p.updated_at
FROM public.profiles p
WHERE p.role = 'admin';

-- Recreate dashboard_overview without SECURITY DEFINER
CREATE VIEW public.dashboard_overview AS
SELECT 
    (SELECT COUNT(*) FROM public.profiles) as total_users,
    (SELECT COUNT(*) FROM public.profiles WHERE role = 'admin') as admin_users,
    (SELECT COUNT(*) FROM public.profiles WHERE last_login > NOW() - INTERVAL '7 days') as active_users,
    (SELECT COUNT(*) FROM public.profiles WHERE created_at > NOW() - INTERVAL '30 days') as new_users_month;

-- =================================================================
-- 2. FIX RLS POLICIES REFERENCING USER_METADATA
-- =================================================================

-- Drop the problematic RLS policies that reference user_metadata
DROP POLICY IF EXISTS "Enable superadmin access" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_superadmin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_superadmin" ON public.profiles;

-- Create secure RLS policies based on the profiles table role column instead of user_metadata
-- This ensures that superadmin status is controlled by the database, not by user-editable metadata

-- Policy for superadmin access based on profiles.role
CREATE POLICY "Enable superadmin access based on role" ON public.profiles
    FOR ALL
    USING (
        -- Allow access if user is the owner of the profile
        auth.uid() = id
        OR
        -- Allow access if user has admin role in profiles table
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
        OR
        -- Allow access for specific superadmin emails (hardcoded for security)
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND email IN ('cozy2963@gmail.com', 'andrea@cozyartzmedia.com')
        )
    );

-- Policy for selecting profiles with superadmin check
CREATE POLICY "profiles_select_secure" ON public.profiles
    FOR SELECT
    USING (
        -- Users can see their own profile
        auth.uid() = id
        OR
        -- Admins can see all profiles
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
        OR
        -- Hardcoded superadmin emails can see all
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND email IN ('cozy2963@gmail.com', 'andrea@cozyartzmedia.com')
        )
    );

-- Policy for updating profiles with superadmin check
CREATE POLICY "profiles_update_secure" ON public.profiles
    FOR UPDATE
    USING (
        -- Users can update their own profile (except role)
        (auth.uid() = id AND OLD.role = NEW.role)
        OR
        -- Only admins can change roles
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
        OR
        -- Hardcoded superadmin emails can update anything
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND email IN ('cozy2963@gmail.com', 'andrea@cozyartzmedia.com')
        )
    );

-- =================================================================
-- 3. FIX FUNCTION SEARCH_PATH ISSUES
-- =================================================================

-- Update all functions to have secure search_path
-- This prevents potential SQL injection via search_path manipulation

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'auth'
AS $$
BEGIN
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
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url',
        COALESCE(NEW.raw_app_meta_data->>'provider', 'email'),
        NEW.raw_user_meta_data->>'user_name',
        CASE 
            WHEN NEW.email IN ('cozy2963@gmail.com', 'andrea@cozyartzmedia.com') THEN 'admin'
            ELSE 'user'
        END,
        NOW(),
        NOW()
    );
    RETURN NEW;
END;
$$;

-- Fix get_dashboard_stats function
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    result json;
BEGIN
    SELECT json_build_object(
        'total_users', (SELECT COUNT(*) FROM profiles),
        'admin_users', (SELECT COUNT(*) FROM profiles WHERE role = 'admin'),
        'active_users', (SELECT COUNT(*) FROM profiles WHERE last_login > NOW() - INTERVAL '7 days'),
        'new_users_month', (SELECT COUNT(*) FROM profiles WHERE created_at > NOW() - INTERVAL '30 days')
    ) INTO result;
    
    RETURN result;
END;
$$;

-- Fix get_user_growth_analytics function
CREATE OR REPLACE FUNCTION public.get_user_growth_analytics()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    result json;
BEGIN
    SELECT json_agg(
        json_build_object(
            'date', date_trunc('day', created_at)::date,
            'new_users', count(*)
        ) ORDER BY date_trunc('day', created_at)::date
    )
    FROM profiles
    WHERE created_at >= NOW() - INTERVAL '30 days'
    GROUP BY date_trunc('day', created_at)::date
    INTO result;
    
    RETURN COALESCE(result, '[]'::json);
END;
$$;

-- Fix get_revenue_analytics function
CREATE OR REPLACE FUNCTION public.get_revenue_analytics()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    result json;
BEGIN
    -- Return empty analytics for now since we don't have a payments table
    SELECT json_build_object(
        'total_revenue', 0,
        'monthly_revenue', 0,
        'revenue_growth', 0
    ) INTO result;
    
    RETURN result;
END;
$$;

-- Fix update_user_last_login function
CREATE OR REPLACE FUNCTION public.update_user_last_login()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    UPDATE profiles 
    SET 
        last_login = NOW(),
        updated_at = NOW()
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$;

-- Fix update_user_spending function
CREATE OR REPLACE FUNCTION public.update_user_spending(user_id uuid, amount numeric)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    -- Update user spending (add to profiles table if needed)
    UPDATE profiles 
    SET updated_at = NOW()
    WHERE id = user_id;
END;
$$;

-- Fix generate_sample_analytics_data function
CREATE OR REPLACE FUNCTION public.generate_sample_analytics_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    -- This function generates sample data for testing
    -- In production, this should be removed or restricted
    RAISE NOTICE 'Sample analytics data generation disabled in production';
END;
$$;

-- Fix check_superadmin_status function
CREATE OR REPLACE FUNCTION public.check_superadmin_status(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'auth'
AS $$
DECLARE
    is_superadmin boolean := false;
    user_email text;
BEGIN
    -- Get user email from auth.users
    SELECT email INTO user_email 
    FROM auth.users 
    WHERE id = user_id;
    
    -- Check if user is superadmin based on hardcoded emails or role
    SELECT 
        (role = 'admin' OR user_email IN ('cozy2963@gmail.com', 'andrea@cozyartzmedia.com'))
    INTO is_superadmin
    FROM profiles 
    WHERE id = user_id;
    
    RETURN COALESCE(is_superadmin, false);
END;
$$;

-- Fix list_all_users function
CREATE OR REPLACE FUNCTION public.list_all_users()
RETURNS setof profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'auth'
AS $$
BEGIN
    -- Only allow superadmins to list all users
    IF NOT public.check_superadmin_status(auth.uid()) THEN
        RAISE EXCEPTION 'Access denied: Superadmin access required';
    END IF;
    
    RETURN QUERY SELECT * FROM profiles ORDER BY created_at DESC;
END;
$$;

-- Fix promote_to_admin function
CREATE OR REPLACE FUNCTION public.promote_to_admin(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'auth'
AS $$
BEGIN
    -- Only allow superadmins to promote users
    IF NOT public.check_superadmin_status(auth.uid()) THEN
        RAISE EXCEPTION 'Access denied: Superadmin access required';
    END IF;
    
    UPDATE profiles 
    SET 
        role = 'admin',
        updated_at = NOW()
    WHERE id = target_user_id;
END;
$$;

-- =================================================================
-- 4. GRANT APPROPRIATE PERMISSIONS
-- =================================================================

-- Grant permissions for views
GRANT SELECT ON public.user_activity_summary TO authenticated;
GRANT SELECT ON public.admin_users TO authenticated;
GRANT SELECT ON public.dashboard_overview TO authenticated;

-- Grant permissions for functions
GRANT EXECUTE ON FUNCTION public.get_dashboard_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_growth_analytics() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_revenue_analytics() TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_superadmin_status(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_all_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.promote_to_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_user_spending(uuid, numeric) TO authenticated;

-- =================================================================
-- 5. ADD SECURITY COMMENTS
-- =================================================================

COMMENT ON VIEW public.user_activity_summary IS 'User activity summary - secure view without SECURITY DEFINER';
COMMENT ON VIEW public.admin_users IS 'Admin users view - shows only users with admin role from profiles table';
COMMENT ON VIEW public.dashboard_overview IS 'Dashboard overview statistics - secure aggregated data';

COMMENT ON FUNCTION public.check_superadmin_status(uuid) IS 'Securely checks superadmin status using profiles.role and hardcoded emails';
COMMENT ON FUNCTION public.handle_new_user() IS 'Handles new user creation with secure search_path';

-- =================================================================
-- MIGRATION COMPLETE
-- =================================================================

-- Log the migration
INSERT INTO public.migration_log (version, description, applied_at) 
VALUES ('007', 'Fix security issues: removed security definer views, fixed RLS policies to not use user_metadata, set secure search_path for functions', NOW())
ON CONFLICT DO NOTHING;