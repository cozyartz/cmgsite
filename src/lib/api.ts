/**
 * Centralized API Client
 * Handles all HTTP requests with error handling, retry logic, and token management
 */

import { config, createLogger } from '../config/environment';

const logger = createLogger('ApiClient');

// API Error types
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: Response,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Request/Response types
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  headers: Headers;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  requireAuth?: boolean;
}

// Token management for Supabase
class TokenManager {
  private token: string | null = null;
  private refreshPromise: Promise<string> | null = null;

  setToken(token: string) {
    this.token = token;
    // No need to store in localStorage - Supabase handles this
    logger.debug('Token updated');
  }

  async getToken(): Promise<string | null> {
    // Get token from Supabase session instead of localStorage
    try {
      const { supabase } = await import('./supabase');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        this.token = session.access_token;
        return this.token;
      }
      
      return null;
    } catch (error) {
      logger.error('Failed to get Supabase token:', error);
      return null;
    }
  }

  clearToken() {
    this.token = null;
    // Clear Supabase session
    import('./supabase').then(({ supabase }) => {
      supabase.auth.signOut();
    });
    logger.debug('Token cleared');
  }

  async refreshToken(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performTokenRefresh();
    
    try {
      const newToken = await this.refreshPromise;
      this.setToken(newToken);
      return newToken;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<string> {
    const currentToken = this.getToken();
    if (!currentToken) {
      throw new ApiError('No token available for refresh', 401);
    }

    const response = await fetch(`${config.api.baseUrl}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      this.clearToken();
      throw new ApiError('Token refresh failed', response.status, response);
    }

    const data = await response.json();
    return data.token;
  }
}

// HTTP Client with retry logic
class HttpClient {
  private tokenManager = new TokenManager();

  async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = config.api.timeout,
      retries = config.api.retryAttempts,
      requireAuth = false,
    } = options;

    // Build request headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    // Add authentication if required
    const token = await this.tokenManager.getToken();
    if (requireAuth || token) {
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      } else if (requireAuth) {
        throw new ApiError('Authentication required but no token available', 401);
      }
    }

    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${config.api.baseUrl}${endpoint}`;

    logger.debug(`Making ${method} request to ${url}`, { headers: requestHeaders, body });

    let lastError: Error;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          method,
          headers: requestHeaders,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Handle authentication errors
        if (response.status === 401 && requireAuth && attempt === 0) {
          try {
            const newToken = await this.tokenManager.refreshToken();
            requestHeaders['Authorization'] = `Bearer ${newToken}`;
            continue; // Retry with new token
          } catch (refreshError) {
            this.tokenManager.clearToken();
            throw new ApiError('Authentication failed', 401, response);
          }
        }

        // Parse response
        let data: T;
        const contentType = response.headers.get('content-type') || '';
        
        if (contentType.includes('application/json')) {
          data = await response.json();
        } else if (contentType.includes('text/')) {
          data = (await response.text()) as unknown as T;
        } else {
          data = (await response.blob()) as unknown as T;
        }

        // Handle API errors
        if (!response.ok) {
          const errorMessage = typeof data === 'object' && data && 'error' in data
            ? (data as any).error
            : `Request failed with status ${response.status}`;
          
          if (response.status >= 400 && response.status < 500) {
            throw new ApiError(errorMessage, response.status, response, data);
          }
          
          if (response.status >= 500) {
            // Server errors - retry
            throw new ApiError(errorMessage, response.status, response, data);
          }
        }

        logger.debug(`Request successful: ${method} ${url}`, { status: response.status });

        return {
          data,
          status: response.status,
          headers: response.headers,
        };

      } catch (error) {
        lastError = error as Error;
        
        if (error instanceof ApiError && error.status && error.status < 500) {
          // Client errors - don't retry
          throw error;
        }

        if (error instanceof DOMException && error.name === 'AbortError') {
          throw new NetworkError('Request timeout', error);
        }

        if (attempt === retries) {
          // Last attempt failed
          break;
        }

        // Wait before retry (exponential backoff)
        const delay = Math.pow(2, attempt) * 1000;
        logger.warn(`Request failed, retrying in ${delay}ms (attempt ${attempt + 1}/${retries + 1})`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError instanceof Error 
      ? lastError 
      : new NetworkError('Request failed after all retry attempts');
  }

  // Convenience methods
  async get<T = any>(endpoint: string, options?: Omit<RequestOptions, 'method'>) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T = any>(endpoint: string, data?: any, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'POST', body: data });
  }

  async put<T = any>(endpoint: string, data?: any, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body: data });
  }

  async delete<T = any>(endpoint: string, options?: Omit<RequestOptions, 'method'>) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  async patch<T = any>(endpoint: string, data?: any, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body: data });
  }

  // Token management methods
  setAuthToken(token: string) {
    this.tokenManager.setToken(token);
  }

  async getAuthToken() {
    return await this.tokenManager.getToken();
  }

  clearAuthToken() {
    this.tokenManager.clearToken();
  }

  async refreshAuthToken() {
    return this.tokenManager.refreshToken();
  }
}

// API endpoint definitions with types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  provider: 'email' | 'github' | 'google';
  github_username?: string;
  role?: string;
}

export interface Client {
  id: string;
  name: string;
  subscription_tier: string;
  ai_calls_limit: number;
  ai_calls_used: number;
  status: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  client: Client;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// API service class with typed methods
export class ApiService {
  constructor(private client: HttpClient) {}

  // Authentication endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/api/auth/login', credentials);
    this.client.setAuthToken(response.data.token);
    return response.data;
  }

  async verify(): Promise<{ user: User; client: Client }> {
    const response = await this.client.get<{ user: User; client: Client }>('/api/auth/verify', {
      requireAuth: true,
    });
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.client.post('/api/auth/logout', {}, { requireAuth: true });
    } finally {
      this.client.clearAuthToken();
    }
  }

  // OAuth endpoints
  getOAuthUrl(provider: 'github' | 'google'): string {
    return `${config.api.baseUrl}/api/auth/${provider}`;
  }

  // Version endpoint
  async getVersion(): Promise<{ version: string; timestamp: string }> {
    const response = await this.client.get<{ version: string; timestamp: string }>('/api/version');
    return response.data;
  }

  // Generic API call for custom endpoints
  async call<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
    const response = await this.client.request<T>(endpoint, options);
    return response.data;
  }
}

// Create singleton instances
export const httpClient = new HttpClient();
export const apiService = new ApiService(httpClient);

// Error types are already exported above with class declarations

// Development helpers
if (config.isDevelopment) {
  // Expose API client to window for debugging
  (window as any).apiClient = {
    httpClient,
    apiService,
    config,
  };
}