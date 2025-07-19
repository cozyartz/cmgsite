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

// Auth helper functions
export const authService = {
  // Sign in with OAuth provider - AGGRESSIVE LOCALHOST OVERRIDE
  signInWithOAuth: async (provider: 'github' | 'google') => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        // FORCE production redirect - no localhost ever
        redirectTo: callbackUrl,
        // Explicit query parameters to override Supabase dashboard config
        queryParams: {
          redirect_to: callbackUrl,
          site_url: siteUrl,
        },
      },
    })
    return { data, error }
  },

  // Sign in with email and password
  signInWithEmail: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // Sign up with email and password
  signUp: async (email: string, password: string, metadata?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
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

export default supabase