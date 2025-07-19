import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

// Create Supabase client with validated environment configuration
export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    // Auto refresh tokens
    autoRefreshToken: true,
    // Persist session in localStorage
    persistSession: true,
    // Detect session in URL hash/search params
    detectSessionInUrl: true,
    // Use PKCE flow for better security
    flowType: 'pkce',
    // Storage key for session persistence
    storageKey: 'cmgsite-auth-token',
    // Use custom auth domain with fallback
    url: 'https://auth.cozyartzmedia.com',
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web',
      'X-Site-URL': env.siteUrl,
    },
    // Custom fetch to handle auth domain with fallback
    fetch: async (url, options = {}) => {
      try {
        // Try the custom auth domain first
        const response = await fetch(url, options);
        if (response.ok) {
          return response;
        }
        // If it fails and it's an auth request, fallback to default Supabase URL
        if (url.includes('auth.cozyartzmedia.com')) {
          const fallbackUrl = url.replace('https://auth.cozyartzmedia.com', env.supabaseUrl + '/auth/v1');
          console.warn('Custom auth domain failed, falling back to:', fallbackUrl);
          return fetch(fallbackUrl, options);
        }
        return response;
      } catch (error) {
        // If custom domain fails completely, fallback to default
        if (url.includes('auth.cozyartzmedia.com')) {
          const fallbackUrl = url.replace('https://auth.cozyartzmedia.com', env.supabaseUrl + '/auth/v1');
          console.error('Custom auth domain error, falling back to:', fallbackUrl, error);
          return fetch(fallbackUrl, options);
        }
        throw error;
      }
    },
  },
});

// Enhanced auth service with magic links and security features
export const authService = {
  // Magic Link Authentication (Primary method)
  signInWithMagicLink: async (email: string) => {
    console.log('✨ Sending magic link to:', email);
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: env.callbackUrl,
        shouldCreateUser: false, // Security: don't auto-create users for signin
      },
    });
    
    if (error) {
      console.error('❌ Magic link signin error:', error);
    } else {
      console.log('✅ Magic link sent successfully');
    }
    
    return { data, error };
  },

  // Magic Link Signup (for new users)
  signUpWithMagicLink: async (email: string, metadata?: any) => {
    console.log('🆕 Sending signup magic link to:', email, metadata);
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: env.callbackUrl,
        shouldCreateUser: true,
        data: {
          full_name: metadata?.fullName || '',
          terms_accepted: true,
          signup_source: 'website',
          ...metadata,
        },
      },
    });
    
    if (error) {
      console.error('❌ Magic link signup error:', error);
    } else {
      console.log('✅ Signup magic link sent successfully');
    }
    
    return { data, error };
  },

  // OAuth with enhanced security
  signInWithOAuth: async (provider: 'github' | 'google') => {
    console.log('🔗 Starting OAuth with provider:', provider);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: env.callbackUrl,
        queryParams: {
          redirect_to: env.callbackUrl,
        },
        skipBrowserRedirect: false,
      },
    });
    
    if (error) {
      console.error('❌ OAuth error:', error);
    } else {
      console.log('✅ OAuth initiated successfully');
    }
    
    return { data, error };
  },

  // Traditional email/password (fallback)
  signInWithEmail: async (email: string, password: string) => {
    console.log('📧 Signing in with email/password:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('❌ Email signin error:', error);
    } else {
      console.log('✅ Email signin successful');
    }
    
    return { data, error };
  },

  // Secure email/password signup
  signUpWithEmail: async (email: string, password: string, metadata?: any) => {
    console.log('📝 Signing up with email/password:', email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: env.callbackUrl,
        data: {
          full_name: metadata?.full_name || '',
          terms_accepted: true,
          signup_source: 'website',
          ...metadata,
        },
      },
    });
    
    if (error) {
      console.error('❌ Email signup error:', error);
    } else {
      console.log('✅ Email signup successful');
    }
    
    return { data, error };
  },

  // Secure password reset
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${env.callbackUrl}?type=recovery`,
    });
    return { data, error };
  },

  // Update password with session validation
  updatePassword: async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    return { data, error };
  },

  // Update user metadata
  updateUser: async (updates: any) => {
    const { data, error } = await supabase.auth.updateUser(updates);
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    console.log('👋 Signing out...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('❌ Signout error:', error);
    } else {
      console.log('✅ Signout successful');
    }
    return { error };
  },

  // Get current session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  // Get current user
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Listen to auth changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Database helper functions
export const dbService = {
  // Get or create user profile
  getUserProfile: async (userId: string) => {
    console.log('👤 Getting user profile for:', userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('❌ Error getting user profile:', error);
    } else {
      console.log('✅ User profile retrieved:', data?.email);
    }
    
    return { data, error };
  },

  // Update user profile
  updateUserProfile: async (userId: string, updates: any) => {
    console.log('📝 Updating user profile for:', userId, updates);
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error updating user profile:', error);
    } else {
      console.log('✅ User profile updated successfully');
    }
    
    return { data, error };
  },

  // Create user profile
  createUserProfile: async (profile: any) => {
    console.log('🆕 Creating user profile:', profile.email);
    const { data, error } = await supabase
      .from('profiles')
      .insert([profile])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error creating user profile:', error);
    } else {
      console.log('✅ User profile created successfully');
    }
    
    return { data, error };
  },
};

// Storage service for file uploads (avatars, documents)
export const storageService = {
  // Upload avatar image
  uploadAvatar: async (userId: string, file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { data, error } = await supabase.storage
      .from('user-content')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) return { data: null, error };

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('user-content')
      .getPublicUrl(filePath);

    return { data: { path: filePath, publicUrl }, error: null };
  },

  // Delete file
  deleteFile: async (path: string) => {
    const { data, error } = await supabase.storage
      .from('user-content')
      .remove([path]);
    return { data, error };
  },

  // Get public URL
  getPublicUrl: (path: string) => {
    const { data } = supabase.storage
      .from('user-content')
      .getPublicUrl(path);
    return data.publicUrl;
  },
};

export default supabase;