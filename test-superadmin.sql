-- Test SuperAdmin Seeding in Supabase
-- Run this after you've logged in to check if your profile was created correctly

-- 1. Check all profiles in the system
SELECT id, email, full_name, role, provider, github_username, created_at 
FROM profiles
ORDER BY created_at DESC;

-- 2. Check specifically for your accounts
SELECT id, email, role, provider, github_username 
FROM profiles 
WHERE email IN ('cozy2963@gmail.com', 'andrea@cozyartzmedia.com')
   OR github_username = 'cozyartz';

-- 3. Check auth.users table for your accounts
SELECT id, email, raw_user_meta_data->>'user_name' as github_username, 
       app_metadata->>'provider' as provider,
       created_at
FROM auth.users
WHERE email IN ('cozy2963@gmail.com', 'andrea@cozyartzmedia.com')
   OR raw_user_meta_data->>'user_name' = 'cozyartz';

-- 4. If you need to manually promote yourself to admin, run this:
-- UPDATE profiles SET role = 'admin' WHERE email = 'cozy2963@gmail.com';

-- 5. Or use the helper function:
-- SELECT promote_to_admin('cozy2963@gmail.com');

-- 6. Check if the superadmin detection function works:
-- Replace 'your-user-id-here' with your actual user ID from the queries above
-- SELECT check_superadmin_status('your-user-id-here');