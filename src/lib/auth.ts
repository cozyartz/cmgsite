/**
 * Multi-tenant JWT Authentication Service for Cloudflare
 * 
 * This replaces Supabase auth with a lightweight JWT solution that works
 * with Cloudflare D1, KV storage, and supports unlimited tenants.
 */

// Types for our auth system
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  provider: 'github' | 'google' | 'email';
  provider_id?: string;
  tenant_id?: string;
  role?: 'super_admin' | 'admin' | 'client';
  created_at: string;
}

export interface AuthSession {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_at: number;
  tenant_id?: string;
}

export interface TenantContext {
  id: string;
  name: string;
  domain: string;
  subscription_tier: 'starter' | 'growth' | 'enterprise';
  ai_calls_limit: number;
  ai_calls_used: number;
  status: 'active' | 'suspended' | 'cancelled';
}

// Auth service class
export class CloudflareAuthService {
  private apiBaseUrl: string;
  private storageKey = 'cmgsite_auth_session';

  constructor(apiBaseUrl: string = '') {
    // In production, this will be the Pages URL
    // In development, it can be localhost
    this.apiBaseUrl = apiBaseUrl || (
      typeof window !== 'undefined' 
        ? window.location.origin 
        : 'https://cozyartzmedia.com'
    );
  }

  /**
   * Get current session from localStorage
   */
  getSession(): AuthSession | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return null;

      const session: AuthSession = JSON.parse(stored);
      
      // Check if session is expired
      if (Date.now() >= session.expires_at) {
        this.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error reading session:', error);
      this.clearSession();
      return null;
    }
  }

  /**
   * Save session to localStorage
   */
  private setSession(session: AuthSession): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(session));
      
      // Trigger storage event for other tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: this.storageKey,
        newValue: JSON.stringify(session),
        storageArea: localStorage
      }));
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  /**
   * Clear current session
   */
  clearSession(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(this.storageKey);
    window.dispatchEvent(new StorageEvent('storage', {
      key: this.storageKey,
      newValue: null,
      storageArea: localStorage
    }));
  }

  /**
   * Get current user from session
   */
  getUser(): User | null {
    const session = this.getSession();
    return session?.user || null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  /**
   * Sign in with email (magic link)
   */
  async signInWithMagicLink(email: string, tenantDomain?: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/auth/magic-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.toLowerCase().trim(),
          tenant_domain: tenantDomain || window.location.hostname,
          redirect_url: `${window.location.origin}/auth/callback`
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send magic link');
      }

      return { success: true, message: 'Magic link sent to your email' };
    } catch (error) {
      console.error('Magic link error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to send magic link' 
      };
    }
  }

  /**
   * Sign in with OAuth provider
   */
  async signInWithOAuth(provider: 'github' | 'google'): Promise<void> {
    const tenantDomain = window.location.hostname;
    const redirectUrl = encodeURIComponent(`${window.location.origin}/auth/callback`);
    
    // Redirect to OAuth endpoint
    window.location.href = `${this.apiBaseUrl}/api/auth/${provider}?tenant_domain=${tenantDomain}&redirect_url=${redirectUrl}`;
  }

  /**
   * Handle OAuth callback
   */
  async handleOAuthCallback(code: string, state?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const provider = urlParams.get('provider') || 'github';
      
      const response = await fetch(`${this.apiBaseUrl}/api/auth/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          state,
          provider,
          tenant_domain: window.location.hostname,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Authentication failed');
      }

      // Save the session
      this.setSession({
        user: result.user,
        access_token: result.access_token,
        refresh_token: result.refresh_token,
        expires_at: result.expires_at,
        tenant_id: result.tenant_id,
      });

      return { success: true };
    } catch (error) {
      console.error('OAuth callback error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Authentication failed' 
      };
    }
  }

  /**
   * Handle magic link callback
   */
  async handleMagicLinkCallback(token: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/auth/verify-magic-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          tenant_domain: window.location.hostname,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Token verification failed');
      }

      // Save the session
      this.setSession({
        user: result.user,
        access_token: result.access_token,
        refresh_token: result.refresh_token,
        expires_at: result.expires_at,
        tenant_id: result.tenant_id,
      });

      return { success: true };
    } catch (error) {
      console.error('Magic link callback error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Token verification failed' 
      };
    }
  }

  /**
   * Sign out user
   */
  async signOut(): Promise<void> {
    const session = this.getSession();
    
    if (session) {
      try {
        // Call logout endpoint to invalidate token server-side
        await fetch(`${this.apiBaseUrl}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Logout API error:', error);
        // Continue with client-side logout even if server call fails
      }
    }

    this.clearSession();
  }

  /**
   * Refresh the current session
   */
  async refreshSession(): Promise<boolean> {
    const session = this.getSession();
    if (!session?.refresh_token) return false;

    try {
      const response = await fetch(`${this.apiBaseUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: session.refresh_token,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        this.clearSession();
        return false;
      }

      // Update session with new tokens
      this.setSession({
        ...session,
        access_token: result.access_token,
        refresh_token: result.refresh_token,
        expires_at: result.expires_at,
      });

      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearSession();
      return false;
    }
  }

  /**
   * Get tenant context for current user
   */
  async getTenantContext(): Promise<TenantContext | null> {
    const session = this.getSession();
    if (!session) return null;

    try {
      const response = await fetch(`${this.apiBaseUrl}/api/tenant/context`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Tenant context error:', error);
      return null;
    }
  }

  /**
   * Make authenticated API request
   */
  async apiRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const session = this.getSession();
    
    if (!session) {
      throw new Error('Not authenticated');
    }

    // Check if token is about to expire (within 5 minutes)
    if (Date.now() >= (session.expires_at - 5 * 60 * 1000)) {
      const refreshed = await this.refreshSession();
      if (!refreshed) {
        throw new Error('Session expired');
      }
    }

    const updatedSession = this.getSession();
    if (!updatedSession) {
      throw new Error('Session lost during refresh');
    }

    return fetch(`${this.apiBaseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${updatedSession.access_token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  }

  /**
   * Listen to session changes (for multiple tabs)
   */
  onSessionChange(callback: (session: AuthSession | null) => void): () => void {
    if (typeof window === 'undefined') return () => {};

    const handler = (event: StorageEvent) => {
      if (event.key === this.storageKey) {
        const session = event.newValue ? JSON.parse(event.newValue) : null;
        callback(session);
      }
    };

    window.addEventListener('storage', handler);
    
    // Return cleanup function
    return () => window.removeEventListener('storage', handler);
  }

  /**
   * Determine tenant ID from domain
   */
  getTenantIdFromDomain(hostname: string = window.location.hostname): string {
    // Default tenant (Cozyartz Media Group)
    if (hostname === 'cozyartzmedia.com' || hostname === 'www.cozyartzmedia.com' || hostname === 'localhost') {
      return 'cmg-default';
    }

    // Subdomain routing (partner1.cozyartzmedia.com -> partner-001)
    const subdomainMatch = hostname.match(/^([^.]+)\.cozyartzmedia\.com$/);
    if (subdomainMatch) {
      return `partner-${subdomainMatch[1]}`;
    }

    // Custom domain routing (partner-seo.com -> custom-partner-seo)
    return `custom-${hostname.replace(/\./g, '-')}`;
  }
}

// Create singleton instance
export const authService = new CloudflareAuthService();

// Helper hooks for React components
export const useAuth = () => {
  const [session, setSession] = React.useState<AuthSession | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Get initial session
    const currentSession = authService.getSession();
    setSession(currentSession);
    setLoading(false);

    // Listen for session changes
    const unsubscribe = authService.onSessionChange((newSession) => {
      setSession(newSession);
    });

    return unsubscribe;
  }, []);

  return {
    user: session?.user || null,
    session,
    isAuthenticated: !!session,
    loading,
    signIn: authService.signInWithMagicLink.bind(authService),
    signInWithOAuth: authService.signInWithOAuth.bind(authService),
    signOut: authService.signOut.bind(authService),
    refreshSession: authService.refreshSession.bind(authService),
    apiRequest: authService.apiRequest.bind(authService),
  };
};

// Add React import for the hook
import React from 'react';