import { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  provider: string;
  github_username?: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

// Define superadmin credentials
export const SUPERADMIN_CONFIG = {
  emails: ['cozy2963@gmail.com', 'andrea@cozyartzmedia.com'],
  githubUsernames: ['cozyartz'],
};

/**
 * Check if a user is a superadmin based on email or GitHub username
 */
export const isSuperAdmin = (user: User | null, profile?: UserProfile | null): boolean => {
  if (!user) return false;

  // Check email
  if (user.email && SUPERADMIN_CONFIG.emails.includes(user.email)) {
    return true;
  }

  // Check GitHub username
  const githubUsername = user.user_metadata?.user_name;
  if (githubUsername && SUPERADMIN_CONFIG.githubUsernames.includes(githubUsername)) {
    return true;
  }

  // Check profile role
  if (profile?.role === 'admin') {
    return true;
  }

  return false;
};

/**
 * Check if a user has admin privileges (includes superadmin)
 */
export const isAdmin = (user: User | null, profile?: UserProfile | null): boolean => {
  return isSuperAdmin(user, profile);
};

/**
 * Get the appropriate dashboard route for a user based on their role
 */
export const getDashboardRoute = (user: User | null, profile?: UserProfile | null): string => {
  if (isSuperAdmin(user, profile)) {
    return '/superadmin';
  } else if (isAdmin(user, profile)) {
    return '/admin';
  } else {
    return '/client-portal';
  }
};

/**
 * Get user role as a readable string
 */
export const getUserRoleString = (user: User | null, profile?: UserProfile | null): string => {
  if (isSuperAdmin(user, profile)) {
    return 'Super Administrator';
  } else if (isAdmin(user, profile)) {
    return 'Administrator';
  } else {
    return 'User';
  }
};

/**
 * Check if user has access to a specific route
 */
export const hasRouteAccess = (
  route: string, 
  user: User | null, 
  profile?: UserProfile | null
): boolean => {
  if (!user) return false;

  switch (route) {
    case '/superadmin':
      return isSuperAdmin(user, profile);
    case '/admin':
      return isAdmin(user, profile);
    case '/client-portal':
    case '/dashboard':
      return true; // All authenticated users can access
    default:
      return true; // Public routes
  }
};

export default {
  isSuperAdmin,
  isAdmin,
  getDashboardRoute,
  getUserRoleString,
  hasRouteAccess,
  SUPERADMIN_CONFIG,
};