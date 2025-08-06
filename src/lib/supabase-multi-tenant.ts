/**
 * Multi-tenant Supabase Configuration for Workers for Platforms
 * 
 * This module provides tenant-aware Supabase clients with proper isolation
 * between different customers/partners while maintaining security.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../config/env';

// Tenant-specific Supabase configuration
interface TenantSupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
  tenantId: string;
  isolationLevel: 'database' | 'schema' | 'rls'; // Row Level Security
  authSettings: {
    siteUrl: string;
    redirectUrls: string[];
    jwtSecret: string;
  };
}

// Cache for tenant-specific clients
const tenantClients = new Map<string, SupabaseClient>();

/**
 * Get tenant-specific Supabase client with proper isolation
 */
export function getTenantSupabaseClient(
  tenantId: string,
  tenantDomain: string,
  isolationLevel: 'database' | 'schema' | 'rls' = 'rls'
): SupabaseClient {
  const cacheKey = `${tenantId}-${isolationLevel}`;
  
  // Return cached client if available
  if (tenantClients.has(cacheKey)) {
    return tenantClients.get(cacheKey)!;
  }
  
  // Create tenant-specific configuration
  const tenantConfig = getTenantSupabaseConfig(tenantId, tenantDomain, isolationLevel);
  
  // Create isolated Supabase client
  const client = createClient(tenantConfig.url, tenantConfig.anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storageKey: `${tenantId}-auth-token`,
    },
    global: {
      headers: {
        'X-Client-Info': 'supabase-js-web-tenant',
        'X-Tenant-ID': tenantId,
        'X-Tenant-Domain': tenantDomain,
        'X-Isolation-Level': isolationLevel,
      },
    },
    // Enable Real-time with tenant isolation
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
      headers: {
        'X-Tenant-ID': tenantId,
      },
    },
  });
  
  // Cache the client
  tenantClients.set(cacheKey, client);
  
  console.log(`✅ Created tenant Supabase client: ${tenantId} (${isolationLevel})`);
  return client;
}

/**
 * Get tenant-specific Supabase configuration
 */
function getTenantSupabaseConfig(
  tenantId: string,
  tenantDomain: string,
  isolationLevel: 'database' | 'schema' | 'rls'
): TenantSupabaseConfig {
  const baseConfig = {
    tenantId,
    isolationLevel,
    authSettings: {
      siteUrl: `https://${tenantDomain}`,
      redirectUrls: [
        `https://${tenantDomain}/auth/callback`,
        `https://${tenantDomain}/auth/confirm`,
      ],
      jwtSecret: env.supabaseAnonKey, // This should be tenant-specific in production
    },
  };
  
  switch (isolationLevel) {
    case 'database':
      // Each tenant gets their own Supabase project (most secure, most expensive)
      return {
        ...baseConfig,
        url: process.env[`TENANT_${tenantId.toUpperCase()}_SUPABASE_URL`] || env.supabaseUrl,
        anonKey: process.env[`TENANT_${tenantId.toUpperCase()}_SUPABASE_ANON_KEY`] || env.supabaseAnonKey,
        serviceRoleKey: process.env[`TENANT_${tenantId.toUpperCase()}_SUPABASE_SERVICE_KEY`] || '',
      };
      
    case 'schema':
      // Each tenant gets their own database schema (good isolation, moderate cost)
      return {
        ...baseConfig,
        url: env.supabaseUrl,
        anonKey: env.supabaseAnonKey,
        serviceRoleKey: env.supabaseAnonKey,
      };
      
    case 'rls':
      // Row Level Security for tenant isolation (shared database, cost-effective)
      return {
        ...baseConfig,
        url: env.supabaseUrl,
        anonKey: env.supabaseAnonKey,
        serviceRoleKey: env.supabaseAnonKey,
      };
      
    default:
      throw new Error(`Unsupported isolation level: ${isolationLevel}`);
  }
}

/**
 * Multi-tenant auth service with proper tenant isolation
 */
export class MultiTenantAuthService {
  private supabase: SupabaseClient;
  private tenantId: string;
  private tenantDomain: string;
  
  constructor(tenantId: string, tenantDomain: string, isolationLevel: 'database' | 'schema' | 'rls' = 'rls') {
    this.tenantId = tenantId;
    this.tenantDomain = tenantDomain;
    this.supabase = getTenantSupabaseClient(tenantId, tenantDomain, isolationLevel);
  }
  
  /**
   * Sign in with magic link (tenant-isolated)
   */
  async signInWithMagicLink(email: string) {
    console.log(`🔐 Tenant ${this.tenantId}: Sending magic link to ${email}`);
    
    const { data, error } = await this.supabase.auth.signInWithOtp({
      email: email.toLowerCase().trim(),
      options: {
        emailRedirectTo: `https://${this.tenantDomain}/auth/callback`,
        shouldCreateUser: false,
        data: {
          tenant_id: this.tenantId,
          tenant_domain: this.tenantDomain,
          signin_method: 'magic_link',
          signin_timestamp: new Date().toISOString(),
        },
      },
    });
    
    if (error) {
      console.error(`❌ Tenant ${this.tenantId}: Magic link error:`, error);
    } else {
      console.log(`✅ Tenant ${this.tenantId}: Magic link sent successfully`);
    }
    
    return { data, error };
  }
  
  /**
   * Sign up with magic link (tenant-isolated)
   */
  async signUpWithMagicLink(email: string, metadata?: any) {
    console.log(`🆕 Tenant ${this.tenantId}: Signing up ${email}`);
    
    const { data, error } = await this.supabase.auth.signInWithOtp({
      email: email.toLowerCase().trim(),
      options: {
        emailRedirectTo: `https://${this.tenantDomain}/auth/callback`,
        shouldCreateUser: true,
        data: {
          tenant_id: this.tenantId,
          tenant_domain: this.tenantDomain,
          full_name: metadata?.fullName || '',
          terms_accepted: true,
          signup_source: 'tenant_website',
          ...metadata,
        },
      },
    });
    
    if (error) {
      console.error(`❌ Tenant ${this.tenantId}: Signup error:`, error);
    } else {
      console.log(`✅ Tenant ${this.tenantId}: Signup magic link sent`);
    }
    
    return { data, error };
  }
  
  /**
   * OAuth signin with tenant context
   */
  async signInWithOAuth(provider: 'github' | 'google') {
    console.log(`🔗 Tenant ${this.tenantId}: OAuth with ${provider}`);
    
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `https://${this.tenantDomain}/auth/callback`,
        queryParams: {
          tenant_id: this.tenantId,
          tenant_domain: this.tenantDomain,
        },
        skipBrowserRedirect: false,
      },
    });
    
    if (error) {
      console.error(`❌ Tenant ${this.tenantId}: OAuth error:`, error);
    }
    
    return { data, error };
  }
  
  /**
   * Get tenant-specific user profile
   */
  async getUserProfile(userId: string) {
    console.log(`👤 Tenant ${this.tenantId}: Getting profile for ${userId}`);
    
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .eq('tenant_id', this.tenantId) // Ensure tenant isolation
      .single();
    
    if (error) {
      console.error(`❌ Tenant ${this.tenantId}: Profile error:`, error);
    }
    
    return { data, error };
  }
  
  /**
   * Create tenant-specific user profile
   */
  async createUserProfile(profile: any) {
    console.log(`🆕 Tenant ${this.tenantId}: Creating profile for ${profile.email}`);
    
    const tenantProfile = {
      ...profile,
      tenant_id: this.tenantId,
      tenant_domain: this.tenantDomain,
      created_at: new Date().toISOString(),
    };
    
    const { data, error } = await this.supabase
      .from('profiles')
      .insert([tenantProfile])
      .select()
      .single();
    
    if (error) {
      console.error(`❌ Tenant ${this.tenantId}: Profile creation error:`, error);
    }
    
    return { data, error };
  }
  
  /**
   * Sign out
   */
  async signOut() {
    console.log(`👋 Tenant ${this.tenantId}: Signing out`);
    const { error } = await this.supabase.auth.signOut();
    
    if (error) {
      console.error(`❌ Tenant ${this.tenantId}: Signout error:`, error);
    }
    
    return { error };
  }
  
  /**
   * Get current session
   */
  async getSession() {
    const { data: { session }, error } = await this.supabase.auth.getSession();
    
    // Verify session belongs to this tenant
    if (session?.user?.user_metadata?.tenant_id !== this.tenantId) {
      console.warn(`⚠️ Session tenant mismatch: expected ${this.tenantId}, got ${session?.user?.user_metadata?.tenant_id}`);
      return { session: null, error: new Error('Tenant mismatch') };
    }
    
    return { session, error };
  }
  
  /**
   * Listen to auth changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }
}

/**
 * Configure Supabase auth settings for multi-tenant setup
 */
export async function configureTenantAuth(
  tenantId: string,
  tenantDomain: string,
  authConfig: {
    providers: string[];
    redirectUrls: string[];
    jwtSecret?: string;
  }
) {
  try {
    console.log(`🔧 Configuring auth for tenant: ${tenantId}`);
    
    // This would typically call Supabase Management API to configure tenant-specific auth
    // For now, we'll just validate the configuration
    
    const requiredProviders = ['email', 'github', 'google'];
    const enabledProviders = authConfig.providers.filter(p => requiredProviders.includes(p));
    
    if (enabledProviders.length === 0) {
      throw new Error('At least one auth provider must be enabled');
    }
    
    // Validate redirect URLs
    const validRedirectUrls = authConfig.redirectUrls.filter(url => {
      try {
        const parsed = new URL(url);
        return parsed.hostname === tenantDomain;
      } catch {
        return false;
      }
    });
    
    if (validRedirectUrls.length === 0) {
      throw new Error('At least one valid redirect URL must be provided');
    }
    
    console.log(`✅ Tenant auth configured: ${tenantId}`, {
      providers: enabledProviders,
      redirectUrls: validRedirectUrls,
    });
    
    return {
      success: true,
      tenantId,
      tenantDomain,
      providers: enabledProviders,
      redirectUrls: validRedirectUrls,
    };
    
  } catch (error) {
    console.error(`❌ Failed to configure tenant auth: ${tenantId}`, error);
    throw error;
  }
}

export { getTenantSupabaseClient };