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
  const [loading, setLoading] = useState(false); // Start with false to prevent blocking

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
    let subscription: any = null;

    // Initialize auth in background, don't block UI
    const initializeAuth = async () => {
      try {
        console.log('🔐 Initializing authentication...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('⚠️ Auth session error (non-blocking):', error);
          return;
        }
        
        if (session && mounted) {
          console.log('✅ Session found for:', session.user.email);
          setSession(session);
          setUser(session.user);
          // Load profile in background, don't block UI
          loadUserProfile(session.user).catch(console.error);
        } else {
          console.log('ℹ️ No active session found');
        }
      } catch (error) {
        console.warn('⚠️ Auth initialization failed (non-blocking):', error);
      }
    };

    // Set up auth listener in background
    const setupAuthListener = async () => {
      try {
        const { data } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('🔄 Auth state changed:', event);
            
            if (!mounted) return;
            
            try {
              setSession(session);
              setUser(session?.user ?? null);
              
              if (session?.user) {
                loadUserProfile(session.user).catch(console.error);
              } else {
                setProfile(null);
              }
            } catch (error) {
              console.warn('⚠️ Auth state change error (non-blocking):', error);
            }
          }
        );
        subscription = data.subscription;
      } catch (error) {
        console.warn('⚠️ Auth listener setup failed (non-blocking):', error);
      }
    };

    // Initialize both in background
    initializeAuth();
    setupAuthListener();

    return () => {
      mounted = false;
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.warn('⚠️ Subscription cleanup warning:', error);
        }
      }
    };
  }, []);

  const loadUserProfile = async (user: User) => {
    try {
      console.log('👤 Loading profile for user:', user.id, user.email);
      
      // Add timeout to profile loading
      const profilePromise = dbService.getUserProfile(user.id);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile loading timeout')), 5000);
      });
      
      let { data: profile, error } = await Promise.race([profilePromise, timeoutPromise]) as any;
      
      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        console.log('📝 Profile not found, creating new profile...');
        profile = await createUserProfile(user);
      } else if (error && error.message === 'Profile loading timeout') {
        console.warn('⚠️ Profile loading timeout, using minimal profile');
        // Create minimal profile for immediate access
        const isSuperAdmin = checkSuperAdminStatus(user);
        setProfile({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          avatar_url: user.user_metadata?.avatar_url || null,
          provider: user.app_metadata?.provider || 'email',
          github_username: user.user_metadata?.user_name || null,
          role: isSuperAdmin ? 'admin' : 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        return;
      } else if (error) {
        console.error('❌ Error fetching user profile:', error);
        // Still provide minimal access
        const isSuperAdmin = checkSuperAdminStatus(user);
        setProfile({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          avatar_url: user.user_metadata?.avatar_url || null,
          provider: user.app_metadata?.provider || 'email',
          github_username: user.user_metadata?.user_name || null,
          role: isSuperAdmin ? 'admin' : 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        return;
      }
      
      if (profile) {
        console.log('✅ Profile loaded:', profile.email, 'Role:', profile.role);
        setProfile(profile);
      }
    } catch (error) {
      console.error('❌ Error loading user profile:', error);
      // Fallback: create minimal profile to prevent app blocking
      const isSuperAdmin = checkSuperAdminStatus(user);
      setProfile({
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        avatar_url: user.user_metadata?.avatar_url || null,
        provider: user.app_metadata?.provider || 'email',
        github_username: user.user_metadata?.user_name || null,
        role: isSuperAdmin ? 'admin' : 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
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
      
      // Add timeout to profile creation
      const createPromise = dbService.createUserProfile(profileData);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile creation timeout')), 5000);
      });
      
      const { data, error } = await Promise.race([createPromise, timeoutPromise]) as any;
      
      if (error) {
        console.error('❌ Error creating user profile:', error);
        // Return the profile data anyway for immediate access
        return profileData;
      }
      
      console.log('✅ Profile created successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error creating user profile:', error);
      // Return basic profile data for immediate access
      const isSuperAdmin = checkSuperAdminStatus(user);
      return {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        avatar_url: user.user_metadata?.avatar_url || null,
        provider: user.app_metadata?.provider || 'email',
        github_username: user.user_metadata?.user_name || null,
        role: isSuperAdmin ? 'admin' : 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
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
      console.error('OAuth error caught:', error);
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