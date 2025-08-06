import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User, AuthSession } from '../lib/auth';

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

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: AuthSession | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  signInWithMagicLink: (email: string, tenantDomain?: string) => Promise<{ success: boolean; message: string }>;
  signInWithOAuth: (provider: 'github' | 'google') => Promise<void>;
  signOut: () => Promise<void>;
  apiRequest: (endpoint: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Define superadmin credentials
  const superAdminEmails = ['cozy2963@gmail.com', 'andrea@cozyartzmedia.com'];
  const superAdminGithubUsernames = ['cozyartz'];

  // Check if user is superadmin
  const checkSuperAdminStatus = (user: User): boolean => {
    const email = user.email;
    
    return (
      (email && superAdminEmails.includes(email)) ||
      user.role === 'super_admin'
    );
  };

  // Computed values
  const isAuthenticated = !!user;
  const isAdmin = profile?.role === 'admin' || (user && checkSuperAdminStatus(user));
  const isSuperAdmin = isAdmin; // In our system, admin = superadmin

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        const currentSession = authService.getSession();
        
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (currentSession?.user) {
            // Create profile from user data
            loadUserProfile(currentSession.user).catch(console.error);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes (across tabs)
    const unsubscribe = authService.onSessionChange(async (newSession) => {
      if (!mounted) return;
      
      try {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          loadUserProfile(newSession.user).catch(console.error);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error('Error handling session change:', error);
      }
    });

    // Check for auth callback
    const urlParams = new URLSearchParams(window.location.search);
    const sessionKey = urlParams.get('session');
    const magicToken = urlParams.get('token');

    if (sessionKey) {
      // Handle OAuth callback
      handleOAuthCallback(sessionKey);
    } else if (magicToken) {
      // Handle magic link callback
      handleMagicLinkCallback(magicToken);
    }

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const handleOAuthCallback = async (sessionKey: string) => {
    try {
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_key: sessionKey }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Session is handled by authService
        const newSession = authService.getSession();
        setSession(newSession);
        setUser(newSession?.user || null);

        if (newSession?.user) {
          loadUserProfile(newSession.user);
        }

        // Clean up URL
        const url = new URL(window.location.href);
        url.searchParams.delete('session');
        window.history.replaceState({}, '', url.toString());
      } else {
        console.error('OAuth callback failed:', result.error);
      }
    } catch (error) {
      console.error('OAuth callback error:', error);
    }
  };

  const handleMagicLinkCallback = async (token: string) => {
    try {
      const result = await authService.handleMagicLinkCallback(token);
      
      if (result.success) {
        // Session is already saved by handleMagicLinkCallback
        const newSession = authService.getSession();
        setSession(newSession);
        setUser(newSession?.user || null);

        if (newSession?.user) {
          loadUserProfile(newSession.user);
        }

        // Clean up URL
        const url = new URL(window.location.href);
        url.searchParams.delete('token');
        window.history.replaceState({}, '', url.toString());
      } else {
        console.error('Magic link callback failed:', result.error);
      }
    } catch (error) {
      console.error('Magic link callback error:', error);
    }
  };

  const loadUserProfile = async (user: User) => {
    try {
      // For superadmin, create minimal profile immediately
      const isSuperAdmin = checkSuperAdminStatus(user);
      const minimalProfile: UserProfile = {
        id: user.id,
        email: user.email || '',
        full_name: user.name || user.email?.split('@')[0] || 'User',
        avatar_url: user.avatar_url || null,
        provider: user.provider || 'email',
        github_username: user.provider === 'github' ? user.name : null,
        role: isSuperAdmin ? 'admin' : 'user',
        created_at: user.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setProfile(minimalProfile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const signInWithMagicLink = async (email: string, tenantDomain?: string) => {
    return authService.signInWithMagicLink(email, tenantDomain);
  };

  const signInWithOAuth = async (provider: 'github' | 'google') => {
    try {
      await authService.signInWithOAuth(provider);
    } catch (error) {
      console.error('OAuth error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setSession(null);
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Signout error:', error);
      throw error;
    }
  };

  const apiRequest = async (endpoint: string, options?: RequestInit) => {
    return authService.apiRequest(endpoint, options);
  };

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    signInWithMagicLink,
    signInWithOAuth,
    signOut,
    apiRequest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;