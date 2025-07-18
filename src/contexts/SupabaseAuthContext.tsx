import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, authService, dbService } from '../lib/supabase';

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
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  signInWithOAuth: (provider: 'github' | 'google') => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
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
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Define superadmin users
  const superAdminEmails = ['cozy2963@gmail.com', 'andrea@cozyartzmedia.com'];
  const superAdminGithubUsernames = ['cozyartz'];

  // Role-based access control
  const isAdmin = profile?.role === 'admin';
  const isSuperAdmin = profile?.role === 'admin'; // In our system, admin = superadmin

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { session } = await authService.getSession();
        
        if (session) {
          setSession(session);
          setUser(session.user);
          await loadUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      let { data: profile, error } = await dbService.getUserProfile(userId);
      
      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const user = await authService.getUser();
        if (user.user) {
          profile = await createUserProfile(user.user);
        }
      }
      
      if (profile) {
        setProfile(profile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const createUserProfile = async (user: User) => {
    try {
      // Determine if user is superadmin
      const isSuperAdmin = checkSuperAdminStatus(user);
      
      const profileData = {
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata.full_name || user.user_metadata.name || user.email!,
        avatar_url: user.user_metadata.avatar_url,
        provider: user.app_metadata.provider,
        github_username: user.user_metadata.user_name,
        role: isSuperAdmin ? 'admin' as const : 'user' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await dbService.createUserProfile(profileData);
      
      if (error) {
        console.error('Error creating user profile:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error creating user profile:', error);
      return null;
    }
  };

  const checkSuperAdminStatus = (user: User): boolean => {
    const email = user.email;
    const githubUsername = user.user_metadata.user_name;
    
    return (
      (email && superAdminEmails.includes(email)) ||
      (githubUsername && superAdminGithubUsernames.includes(githubUsername))
    );
  };

  const signInWithOAuth = async (provider: 'github' | 'google') => {
    setLoading(true);
    try {
      const { error } = await authService.signInWithOAuth(provider);
      if (error) {
        throw error;
      }
      // OAuth redirect will handle the rest
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await authService.signInWithEmail(email, password);
      if (error) {
        throw error;
      }
      // Auth state change will handle setting user/profile
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      const { data, error } = await authService.signUp(email, password, {
        full_name: fullName,
      });
      if (error) {
        throw error;
      }
      // Auth state change will handle setting user/profile
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await authService.signOut();
      if (error) {
        throw error;
      }
      // Auth state change will handle clearing user/profile
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;
    
    try {
      const { data, error } = await dbService.updateUserProfile(profile.id, {
        ...updates,
        updated_at: new Date().toISOString(),
      });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    isAdmin,
    isSuperAdmin,
    signInWithOAuth,
    signInWithEmail,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;