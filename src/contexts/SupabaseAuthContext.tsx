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
  signInWithMagicLink: (email: string) => Promise<void>;
  signUpWithMagicLink: (email: string, metadata?: any) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string | null>;
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

  // Define superadmin credentials
  const superAdminEmails = ['cozy2963@gmail.com', 'andrea@cozyartzmedia.com'];
  const superAdminGithubUsernames = ['cozyartz'];

  // Check if user is superadmin
  const checkSuperAdminStatus = (user: User): boolean => {
    const email = user.email;
    const githubUsername = user.user_metadata?.user_name;
    
    return (
      (email && superAdminEmails.includes(email)) ||
      (githubUsername && superAdminGithubUsernames.includes(githubUsername))
    );
  };

  // Role-based access control
  const isAdmin = profile?.role === 'admin' || (user && checkSuperAdminStatus(user));
  const isSuperAdmin = profile?.role === 'admin' || (user && checkSuperAdminStatus(user)); // In our system, admin = superadmin

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log('🔐 Initializing authentication...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }
        
        if (session && mounted) {
          console.log('✅ Session found for:', session.user.email);
          setSession(session);
          setUser(session.user);
          await loadUserProfile(session.user);
        } else {
          console.log('ℹ️ No active session found');
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email);
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (user: User) => {
    try {
      console.log('👤 Loading profile for user:', user.id, user.email);
      
      // First try to get existing profile
      let { data: profile, error } = await dbService.getUserProfile(user.id);
      
      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        console.log('📝 Profile not found, creating new profile...');
        profile = await createUserProfile(user);
      } else if (error) {
        console.error('❌ Error fetching user profile:', error);
        return;
      }
      
      if (profile) {
        console.log('✅ Profile loaded:', profile.email, 'Role:', profile.role);
        setProfile(profile);
      }
    } catch (error) {
      console.error('❌ Error loading user profile:', error);
    }
  };

  const createUserProfile = async (user: User): Promise<UserProfile | null> => {
    try {
      console.log('🆕 Creating user profile for:', user.id, user.email);
      
      // Determine if user is superadmin
      const isSuperAdmin = checkSuperAdminStatus(user);
      console.log('🔍 Superadmin check result:', isSuperAdmin);
      
      const profileData = {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || 
                  user.user_metadata?.name || 
                  user.email?.split('@')[0] || 
                  'User',
        avatar_url: user.user_metadata?.avatar_url || null,
        provider: user.app_metadata?.provider || 'email',
        github_username: user.user_metadata?.user_name || null,
        role: isSuperAdmin ? 'admin' as const : 'user' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log('📋 Profile data to create:', profileData);
      const { data, error } = await dbService.createUserProfile(profileData);
      
      if (error) {
        console.error('❌ Error creating user profile:', error);
        return null;
      }
      
      console.log('✅ Profile created successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error creating user profile:', error);
      return null;
    }
  };

  const signInWithOAuth = async (provider: 'github' | 'google') => {
    setLoading(true);
    try {
      console.log('🔗 Starting OAuth with:', provider);
      const { data, error } = await authService.signInWithOAuth(provider);
      
      if (error) {
        console.error('❌ OAuth error:', error);
        setLoading(false);
        throw error;
      }
      
      console.log('✅ OAuth initiated successfully');
      // OAuth redirect will handle the rest, don't set loading to false here
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signInWithMagicLink = async (email: string) => {
    try {
      console.log('✨ Sending magic link to:', email);
      const { data, error } = await authService.signInWithMagicLink(email);
      if (error) {
        console.error('❌ Magic link error:', error);
        throw error;
      }
      console.log('✅ Magic link sent successfully');
    } catch (error) {
      throw error;
    }
  };

  const signUpWithMagicLink = async (email: string, metadata?: any) => {
    try {
      console.log('🆕 Sending signup magic link to:', email);
      const { data, error } = await authService.signUpWithMagicLink(email, metadata);
      if (error) {
        console.error('❌ Signup magic link error:', error);
        throw error;
      }
      console.log('✅ Signup magic link sent successfully');
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await authService.resetPassword(email);
      if (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('📧 Signing in with email:', email);
      const { data, error } = await authService.signInWithEmail(email, password);
      if (error) {
        console.error('❌ Email signin error:', error);
        setLoading(false);
        throw error;
      }
      console.log('✅ Email signin successful');
      // Auth state change will handle the rest
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      console.log('📝 Signing up with email:', email);
      const { data, error } = await authService.signUpWithEmail(email, password, {
        full_name: fullName,
      });
      if (error) {
        console.error('❌ Email signup error:', error);
        setLoading(false);
        throw error;
      }
      console.log('✅ Email signup successful');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('👋 Signing out...');
      const { error } = await authService.signOut();
      if (error) {
        console.error('❌ Signout error:', error);
        throw error;
      }
      console.log('✅ Signout successful');
      // Auth state change will handle clearing user/profile
    } catch (error) {
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
      console.error('❌ Error updating profile:', error);
      throw error;
    }
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const { storageService } = await import('../lib/supabase');
      const { data, error } = await storageService.uploadAvatar(user.id, file);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        await updateProfile({ avatar_url: data.publicUrl });
        return data.publicUrl;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error uploading avatar:', error);
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
    signInWithMagicLink,
    signUpWithMagicLink,
    signUp,
    resetPassword,
    signOut,
    updateProfile,
    uploadAvatar,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;