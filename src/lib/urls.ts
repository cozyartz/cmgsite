/**
 * URL Management System
 * Centralized URL construction and routing logic
 */

import { config, createLogger } from '../config/environment';

const logger = createLogger('UrlManager');

// Route constants
export const ROUTES = {
  // Public routes
  HOME: '/',
  AUTH: '/auth',
  PRICING: '/pricing',
  SERVICES: {
    AI: '/ai-services',
    SEO: '/seo-services',
    WEB_DESIGN: '/web-graphic-design-services',
    MULTIMEDIA: '/multimedia-services',
    DRONE: '/drone-services',
    INSTRUCTIONAL: '/instructional-design-services',
  },
  
  // Legal pages
  PRIVACY: '/privacy-policy',
  TERMS: '/terms-of-service',
  COOKIES: '/cookie-policy',
  DATA_REQUEST: '/data-subject-request',
  
  // Authenticated routes
  CLIENT_PORTAL: '/client-portal',
  ADMIN: '/admin',
  SUPERADMIN: '/superadmin',
  
  // Error pages
  NOT_FOUND: '/404',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    VERIFY: '/api/auth/verify',
    REFRESH: '/api/auth/refresh',
    GITHUB: '/api/auth/github',
    GITHUB_CALLBACK: '/api/auth/github/callback',
    GOOGLE: '/api/auth/google',
    GOOGLE_CALLBACK: '/api/auth/google/callback',
  },
  
  // System
  VERSION: '/api/version',
  
  // Debug (development only)
  DEBUG_OAUTH: '/debug/oauth',
} as const;

// User role types for routing
export type UserRole = 'user' | 'admin' | 'superadmin';

// URL builder functions
export class UrlBuilder {
  /**
   * Build frontend URL with environment awareness
   */
  static frontend(path: string = '', params?: Record<string, string>): string {
    let url = `${config.frontend.baseUrl}${path}`;
    
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }
    
    logger.debug(`Built frontend URL: ${url}`);
    return url;
  }

  /**
   * Build API URL with environment awareness
   */
  static api(endpoint: string, params?: Record<string, string>): string {
    let url = `${config.api.baseUrl}${endpoint}`;
    
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }
    
    logger.debug(`Built API URL: ${url}`);
    return url;
  }

  /**
   * Build OAuth redirect URLs
   */
  static oauthRedirect(provider: 'github' | 'google'): string {
    return UrlBuilder.api(API_ENDPOINTS.AUTH[provider.toUpperCase() as 'GITHUB' | 'GOOGLE']);
  }

  /**
   * Build OAuth callback URLs
   */
  static oauthCallback(provider: 'github' | 'google'): string {
    const endpoint = provider === 'github' 
      ? API_ENDPOINTS.AUTH.GITHUB_CALLBACK 
      : API_ENDPOINTS.AUTH.GOOGLE_CALLBACK;
    return UrlBuilder.api(endpoint);
  }

  /**
   * Build error redirect URLs
   */
  static errorRedirect(error: string, context?: string): string {
    const params: Record<string, string> = { error };
    if (context) params.context = context;
    
    return UrlBuilder.frontend(ROUTES.AUTH, params);
  }

  /**
   * Build success redirect URLs based on user role
   */
  static successRedirect(role: UserRole = 'user', debug = false): string {
    if (debug && config.features.debugMode) {
      return UrlBuilder.api(API_ENDPOINTS.DEBUG_OAUTH);
    }

    switch (role) {
      case 'superadmin':
        return config.frontend.superAdminUrl;
      case 'admin':
        return config.frontend.adminUrl;
      case 'user':
      default:
        return config.frontend.clientPortalUrl;
    }
  }

  /**
   * Build debug URLs (development only)
   */
  static debug(endpoint: string, params?: Record<string, string>): string {
    if (!config.features.debugMode) {
      throw new Error('Debug URLs are only available in debug mode');
    }
    
    return UrlBuilder.api(endpoint, params);
  }

  /**
   * Validate URL format
   */
  static validate(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get relative path from full URL
   */
  static getPath(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname + urlObj.search + urlObj.hash;
    } catch {
      return url; // Return as-is if not a valid URL
    }
  }
}

// Route helpers
export class RouteHelper {
  /**
   * Determine the correct route based on user role and authentication status
   */
  static getDefaultRoute(
    isAuthenticated: boolean, 
    role: UserRole = 'user',
    requestedRoute?: string
  ): string {
    if (!isAuthenticated) {
      return ROUTES.AUTH;
    }

    // If user requested a specific route, validate they have access
    if (requestedRoute) {
      if (RouteHelper.hasAccess(requestedRoute, role)) {
        return requestedRoute;
      }
    }

    // Default authenticated routes based on role
    switch (role) {
      case 'superadmin':
        return ROUTES.SUPERADMIN;
      case 'admin':
        return ROUTES.ADMIN;
      case 'user':
      default:
        return ROUTES.CLIENT_PORTAL;
    }
  }

  /**
   * Check if user has access to a route based on their role
   */
  static hasAccess(route: string, role: UserRole): boolean {
    // Public routes - everyone has access
    const publicRoutes = [
      ROUTES.HOME,
      ROUTES.AUTH,
      ROUTES.PRICING,
      ROUTES.PRIVACY,
      ROUTES.TERMS,
      ROUTES.COOKIES,
      ROUTES.DATA_REQUEST,
      ROUTES.NOT_FOUND,
      ...Object.values(ROUTES.SERVICES),
    ];

    if (publicRoutes.includes(route)) {
      return true;
    }

    // Role-specific routes
    switch (role) {
      case 'superadmin':
        // Superadmins have access to everything
        return true;
      
      case 'admin':
        // Admins have access to admin and client portal
        return [ROUTES.ADMIN, ROUTES.CLIENT_PORTAL].includes(route);
      
      case 'user':
      default:
        // Regular users only have access to client portal
        return route === ROUTES.CLIENT_PORTAL;
    }
  }

  /**
   * Get breadcrumb navigation for a route
   */
  static getBreadcrumbs(route: string, role: UserRole): Array<{ label: string; path: string }> {
    const breadcrumbs: Array<{ label: string; path: string }> = [
      { label: 'Home', path: ROUTES.HOME },
    ];

    switch (route) {
      case ROUTES.CLIENT_PORTAL:
        breadcrumbs.push({ label: 'Client Portal', path: ROUTES.CLIENT_PORTAL });
        break;
      case ROUTES.ADMIN:
        breadcrumbs.push({ label: 'Admin Dashboard', path: ROUTES.ADMIN });
        break;
      case ROUTES.SUPERADMIN:
        breadcrumbs.push({ label: 'Super Admin Dashboard', path: ROUTES.SUPERADMIN });
        break;
      default:
        if (Object.values(ROUTES.SERVICES).includes(route)) {
          breadcrumbs.push({ label: 'Services', path: '/' });
          // Add specific service breadcrumb
        }
        break;
    }

    return breadcrumbs;
  }

  /**
   * Check if current route requires authentication
   */
  static requiresAuth(route: string): boolean {
    const protectedRoutes = [
      ROUTES.CLIENT_PORTAL,
      ROUTES.ADMIN,
      ROUTES.SUPERADMIN,
    ];

    return protectedRoutes.includes(route);
  }

  /**
   * Get the minimum role required for a route
   */
  static getRequiredRole(route: string): UserRole | null {
    switch (route) {
      case ROUTES.SUPERADMIN:
        return 'superadmin';
      case ROUTES.ADMIN:
        return 'admin';
      case ROUTES.CLIENT_PORTAL:
        return 'user';
      default:
        return null; // Public route
    }
  }
}

// OAuth URL helpers
export class OAuthHelper {
  /**
   * Get OAuth login URL for a provider
   */
  static getLoginUrl(provider: 'github' | 'google'): string {
    return UrlBuilder.oauthRedirect(provider);
  }

  /**
   * Get OAuth callback URL for a provider
   */
  static getCallbackUrl(provider: 'github' | 'google'): string {
    return UrlBuilder.oauthCallback(provider);
  }

  /**
   * Build OAuth error redirect with context
   */
  static buildErrorRedirect(provider: 'github' | 'google', error: string): string {
    return UrlBuilder.errorRedirect(`${provider}_${error}`, provider);
  }

  /**
   * Build OAuth success redirect with token
   */
  static buildSuccessRedirect(token: string, role: UserRole = 'user', debug = false): string {
    const baseUrl = UrlBuilder.successRedirect(role, debug);
    return `${baseUrl}?token=${encodeURIComponent(token)}`;
  }

  /**
   * Extract token from OAuth callback URL
   */
  static extractToken(url: string): string | null {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('token');
    } catch {
      return null;
    }
  }

  /**
   * Extract error from OAuth callback URL
   */
  static extractError(url: string): string | null {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('error');
    } catch {
      return null;
    }
  }
}

// Error handling helpers
export class ErrorUrlHelper {
  /**
   * Build error redirect URLs with proper context
   */
  static buildErrorUrl(error: string, context?: string, details?: string): string {
    const params: Record<string, string> = { error };
    if (context) params.context = context;
    if (details) params.details = details;
    
    return UrlBuilder.frontend(ROUTES.AUTH, params);
  }

  /**
   * Get user-friendly error messages
   */
  static getErrorMessage(error: string): string {
    const errorMessages: Record<string, string> = {
      // OAuth errors
      github_oauth_not_configured: 'GitHub OAuth is not configured. Please use email login.',
      google_oauth_not_configured: 'Google OAuth is not configured. Please use email login.',
      github_auth_failed: 'GitHub authentication failed. Please try again.',
      google_auth_failed: 'Google authentication failed. Please try again.',
      github_token_failed: 'GitHub token exchange failed. Please try again.',
      google_token_failed: 'Google token exchange failed. Please try again.',
      github_auth_error: 'GitHub authentication error. Please try email login.',
      google_auth_error: 'Google authentication error. Please try email login.',
      
      // General auth errors
      invalid_credentials: 'Invalid email or password. Please try again.',
      token_expired: 'Your session has expired. Please log in again.',
      insufficient_permissions: 'You do not have permission to access this resource.',
      
      // Network errors
      network_error: 'Network error. Please check your connection and try again.',
      server_error: 'Server error. Please try again later.',
    };

    return errorMessages[error] || 'An unexpected error occurred. Please try again.';
  }
}

// Navigation helpers for React Router
export class NavigationHelper {
  /**
   * Create navigation state for React Router
   */
  static createNavigationState(from?: string, data?: any) {
    return {
      from: from || window.location.pathname,
      timestamp: Date.now(),
      data,
    };
  }

  /**
   * Get return URL from navigation state
   */
  static getReturnUrl(state: any, defaultUrl: string = ROUTES.HOME): string {
    return state?.from || defaultUrl;
  }

  /**
   * Check if we should redirect after authentication
   */
  static shouldRedirect(currentPath: string, targetPath: string): boolean {
    return currentPath !== targetPath;
  }
}

// Export everything for easy importing
export {
  UrlBuilder as urls,
  RouteHelper as routes,
  OAuthHelper as oauth,
  ErrorUrlHelper as errors,
  NavigationHelper as navigation,
};