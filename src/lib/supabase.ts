import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

// Create Supabase client with error handling and fallbacks
let supabase: any;

try {
  // Only create client if we have valid environment variables
  if (env.supabaseUrl && env.supabaseAnonKey && !env.supabaseUrl.includes('placeholder')) {
    supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
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
      },
      global: {
        headers: {
          'X-Client-Info': 'supabase-js-web',
          'X-Site-URL': env.siteUrl,
        },
      },
    });
    console.log('✅ Supabase client initialized successfully');
  } else {
    console.warn('⚠️ Supabase client not initialized - missing or invalid configuration');
    supabase = null;
  }
} catch (error) {
  console.warn('⚠️ Failed to initialize Supabase client:', error);
  supabase = null;
}

export { supabase };

// Helper function to check if supabase is available
const ensureSupabaseAvailable = () => {
  if (!supabase) {
    throw new Error('Authentication service unavailable - Supabase client not initialized');
  }
  return supabase;
};

// Enhanced auth service with magic links and security features
export const authService = {
  // Magic Link Authentication (Primary method)
  signInWithMagicLink: async (email: string) => {
    const client = ensureSupabaseAvailable();
    console.log('✨ Sending magic link to:', email);
    
    // Basic email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email address format');
    }
    
    const { data, error } = await client.auth.signInWithOtp({
      email: email.toLowerCase().trim(),
      options: {
        emailRedirectTo: env.callbackUrl,
        shouldCreateUser: false, // Security: don't auto-create users for signin
        data: {
          signin_method: 'magic_link',
          signin_timestamp: new Date().toISOString()
        }
      },
    });
    
    if (error) {
      console.error('❌ Magic link signin error:', error);
      
      // Provide user-friendly error messages
      if (error.message.includes('rate limit')) {
        throw new Error('Too many requests. Please wait a few minutes before trying again.');
      } else if (error.message.includes('Invalid email')) {
        throw new Error('Please enter a valid email address.');
      } else if (error.message.includes('Email not confirmed')) {
        throw new Error('Please check your email and click the confirmation link first.');
      }
      
      throw error;
    } else {
      console.log('✅ Magic link sent successfully');
    }
    
    return { data, error };
  },

  // Magic Link Signup (for new users)
  signUpWithMagicLink: async (email: string, metadata?: any) => {
    const client = ensureSupabaseAvailable();
    console.log('🆕 Sending signup magic link to:', email, metadata);
    const { data, error } = await client.auth.signInWithOtp({
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
    const client = ensureSupabaseAvailable();
    console.log('🔗 Starting OAuth with provider:', provider);
    const { data, error } = await client.auth.signInWithOAuth({
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
    const client = ensureSupabaseAvailable();
    console.log('📧 Signing in with email/password:', email);
    const { data, error } = await client.auth.signInWithPassword({
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
    const client = ensureSupabaseAvailable();
    console.log('📝 Signing up with email/password:', email);
    const { data, error } = await client.auth.signUp({
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
    const client = ensureSupabaseAvailable();
    const { data, error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${env.callbackUrl}?type=recovery`,
    });
    return { data, error };
  },

  // Update password with session validation
  updatePassword: async (newPassword: string) => {
    const client = ensureSupabaseAvailable();
    const { data, error } = await client.auth.updateUser({
      password: newPassword
    });
    return { data, error };
  },

  // Update user metadata
  updateUser: async (updates: any) => {
    const client = ensureSupabaseAvailable();
    const { data, error } = await client.auth.updateUser(updates);
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    const client = ensureSupabaseAvailable();
    console.log('👋 Signing out...');
    const { error } = await client.auth.signOut();
    if (error) {
      console.error('❌ Signout error:', error);
    } else {
      console.log('✅ Signout successful');
    }
    return { error };
  },

  // Get current session
  getSession: async () => {
    const client = ensureSupabaseAvailable();
    const { data: { session }, error } = await client.auth.getSession();
    return { session, error };
  },

  // Get current user
  getUser: async () => {
    const client = ensureSupabaseAvailable();
    const { data: { user }, error } = await client.auth.getUser();
    return { user, error };
  },

  // Listen to auth changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    const client = ensureSupabaseAvailable();
    return client.auth.onAuthStateChange(callback);
  },
};

// Database helper functions
export const dbService = {
  // Get or create user profile
  getUserProfile: async (userId: string) => {
    const client = ensureSupabaseAvailable();
    console.log('👤 Getting user profile for:', userId);
    const { data, error } = await client
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
    const client = ensureSupabaseAvailable();
    console.log('📝 Updating user profile for:', userId, updates);
    const { data, error } = await client
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
    const client = ensureSupabaseAvailable();
    console.log('🆕 Creating user profile:', profile.email);
    const { data, error } = await client
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

    const client = ensureSupabaseAvailable();
    const { data, error } = await client.storage
      .from('user-content')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) return { data: null, error };

    // Get public URL
    const { data: { publicUrl } } = client.storage
      .from('user-content')
      .getPublicUrl(filePath);

    return { data: { path: filePath, publicUrl }, error: null };
  },

  // Delete file
  deleteFile: async (path: string) => {
    const client = ensureSupabaseAvailable();
    const { data, error } = await client.storage
      .from('user-content')
      .remove([path]);
    return { data, error };
  },

  // Get public URL
  getPublicUrl: (path: string) => {
    const client = ensureSupabaseAvailable();
    const { data } = client.storage
      .from('user-content')
      .getPublicUrl(path);
    return data.publicUrl;
  },
};

export default supabase;