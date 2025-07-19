import { createClient } from '@supabase/supabase-js'

// Supabase configuration - FORCE PRODUCTION ONLY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://uncynkmprbzgzvonafoe.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuY3lua21wcmJ6Z3p2b25hZm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NTcxOTksImV4cCI6MjA2ODQzMzE5OX0.F22zq5RHTzmrpIA1E2yBAE25Pqo6rpQjLcfw2EmXLd8'

// FORCE production URLs from environment
const siteUrl = import.meta.env.VITE_SITE_URL || 'https://cozyartzmedia.com'
const callbackUrl = import.meta.env.VITE_CALLBACK_URL || 'https://cozyartzmedia.com/auth/callback'

// Create Supabase client with FORCED production URLs
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // FORCE production URL - override any localhost configuration
    redirectTo: callbackUrl,
    // Force production site URL - no localhost ever
    siteUrl: siteUrl,
    // Auto refresh tokens
    autoRefreshToken: true,
    // Persist session in localStorage
    persistSession: true,
    // Detect session in URL
    detectSessionInUrl: true,
    // FORCE production flow URL
    flowType: 'pkce',
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web',
      'X-Site-URL': siteUrl,
    },
  },
})

// Enhanced auth service with magic links and security features
export const authService = {
  // Magic Link Authentication (Primary method)
  signInWithMagicLink: async (email: string) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: callbackUrl,
        shouldCreateUser: false, // Security: don't auto-create users
      },
    })
    return { data, error }
  },

  // Magic Link Signup (for new users)
  signUpWithMagicLink: async (email: string, metadata?: any) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: callbackUrl,
        shouldCreateUser: true,
        data: {
          full_name: metadata?.fullName || '',
          terms_accepted: true,
          signup_source: 'website',
          ...metadata,
        },
      },
    })
    return { data, error }
  },

  // OAuth with enhanced security
  signInWithOAuth: async (provider: 'github' | 'google') => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: callbackUrl,
        queryParams: {
          redirect_to: callbackUrl,
          site_url: siteUrl,
        },
      },
    })
    return { data, error }
  },

  // Traditional email/password (fallback)
  signInWithEmail: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // Secure email/password signup
  signUpWithEmail: async (email: string, password: string, metadata?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: callbackUrl,
        data: {
          full_name: metadata?.fullName || '',
          terms_accepted: true,
          signup_source: 'website',
          ...metadata,
        },
      },
    })
    return { data, error }
  },

  // Secure password reset
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${callbackUrl}?type=recovery`,
    })
    return { data, error }
  },

  // Update password with session validation
  updatePassword: async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })
    return { data, error }
  },

  // Update user metadata
  updateUser: async (updates: any) => {
    const { data, error } = await supabase.auth.updateUser(updates)
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Get current user
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Listen to auth changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  },
}

// Identity Linking service for managing multiple auth providers
export const identityService = {
  // Get all user identities
  getUserIdentities: async () => {
    const { data, error } = await supabase.auth.getUserIdentities()
    return { data, error }
  },

  // Link a new identity to current user
  linkIdentity: async (provider: 'github' | 'google') => {
    const { data, error } = await supabase.auth.linkIdentity({ 
      provider,
      options: {
        redirectTo: callbackUrl,
        queryParams: {
          redirect_to: callbackUrl,
          site_url: siteUrl,
        },
      }
    })
    return { data, error }
  },

  // Unlink an identity from current user
  unlinkIdentity: async (identity: any) => {
    const { data, error } = await supabase.auth.unlinkIdentity(identity)
    return { data, error }
  },

  // Check if user can unlink (must have at least 2 identities)
  canUnlinkIdentity: async () => {
    const { data: identities, error } = await supabase.auth.getUserIdentities()
    if (error) return { canUnlink: false, error }
    
    return { 
      canUnlink: identities?.identities?.length > 1, 
      error: null,
      identityCount: identities?.identities?.length || 0
    }
  },

  // Get primary identity (first one created)
  getPrimaryIdentity: async () => {
    const { data: identities, error } = await supabase.auth.getUserIdentities()
    if (error || !identities?.identities?.length) {
      return { data: null, error }
    }
    
    // Sort by created_at to find the first identity
    const sortedIdentities = identities.identities.sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    
    return { data: sortedIdentities[0], error: null }
  },

  // Check if specific provider is already linked
  isProviderLinked: async (provider: string) => {
    const { data: identities, error } = await supabase.auth.getUserIdentities()
    if (error) return { isLinked: false, error }
    
    const isLinked = identities?.identities?.some(identity => identity.provider === provider) || false
    return { isLinked, error: null }
  },
}

// Database helper functions
export const dbService = {
  // Get or create user profile
  getUserProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    return { data, error }
  },

  // Update user profile
  updateUserProfile: async (userId: string, updates: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    return { data, error }
  },

  // Create user profile
  createUserProfile: async (profile: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .insert([profile])
      .select()
      .single()
    
    return { data, error }
  },
}

// Storage service for file uploads (avatars, documents)
export const storageService = {
  // Upload avatar image
  uploadAvatar: async (userId: string, file: File) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Math.random()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { data, error } = await supabase.storage
      .from('user-content')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) return { data: null, error }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('user-content')
      .getPublicUrl(filePath)

    return { data: { path: filePath, publicUrl }, error: null }
  },

  // Delete file
  deleteFile: async (path: string) => {
    const { data, error } = await supabase.storage
      .from('user-content')
      .remove([path])
    return { data, error }
  },

  // Get public URL
  getPublicUrl: (path: string) => {
    const { data } = supabase.storage
      .from('user-content')
      .getPublicUrl(path)
    return data.publicUrl
  },
}

// Real-time service for live updates
export const realtimeService = {
  // Subscribe to profile changes
  subscribeToProfile: (userId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`profile:${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${userId}`
      }, callback)
      .subscribe()
  },

  // Subscribe to real-time notifications
  subscribeToNotifications: (userId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`notifications:${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe()
  },

  // Unsubscribe from channel
  unsubscribe: (subscription: any) => {
    return supabase.removeChannel(subscription)
  },
}

// Analytics service for user tracking
export const analyticsService = {
  // Track page view
  trackPageView: async (userId: string, page: string) => {
    const { data, error } = await supabase
      .from('analytics_events')
      .insert({
        user_id: userId,
        event_type: 'page_view',
        event_data: { page },
        created_at: new Date().toISOString()
      })
    return { data, error }
  },

  // Track custom event
  trackEvent: async (userId: string, eventType: string, eventData: any) => {
    const { data, error } = await supabase
      .from('analytics_events')
      .insert({
        user_id: userId,
        event_type: eventType,
        event_data: eventData,
        created_at: new Date().toISOString()
      })
    return { data, error }
  },
}

export default supabase