/**
 * OAuth Hook
 * Manages OAuth state and operations
 */

import { useState, useCallback } from 'react';
import { oauth, errors } from '../lib/urls';
import { createLogger } from '../config/environment';

const logger = createLogger('useOAuth');

export interface OAuthState {
  isLoading: boolean;
  error: string | null;
  provider: 'github' | 'google' | null;
}

export interface OAuthOperations {
  startOAuth: (provider: 'github' | 'google') => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export interface UseOAuthReturn extends OAuthState, OAuthOperations {}

export function useOAuth(): UseOAuthReturn {
  const [state, setState] = useState<OAuthState>({
    isLoading: false,
    error: null,
    provider: null,
  });

  const startOAuth = useCallback(async (provider: 'github' | 'google') => {
    try {
      logger.debug(`Starting ${provider} OAuth flow`);
      
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        provider,
      }));

      // Get OAuth URL
      const oauthUrl = oauth.getLoginUrl(provider);
      logger.debug(`Redirecting to ${provider} OAuth URL: ${oauthUrl}`);

      // Redirect to OAuth provider
      window.location.href = oauthUrl;

    } catch (error) {
      logger.error(`Failed to start ${provider} OAuth:`, error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : `Failed to start ${provider} authentication`;

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        provider: null,
      }));

      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      provider: null,
    });
  }, []);

  return {
    ...state,
    startOAuth,
    clearError,
    reset,
  };
}

// OAuth utility hook for URL processing
export function useOAuthCallback() {
  const processCallback = useCallback((url: string = window.location.href) => {
    logger.debug('Processing OAuth callback URL:', url);

    const token = oauth.extractToken(url);
    const error = oauth.extractError(url);

    if (error) {
      logger.error('OAuth error in callback:', error);
      const errorMessage = errors.getErrorMessage(error);
      return { success: false, error: errorMessage, token: null };
    }

    if (!token) {
      logger.warn('No token found in OAuth callback');
      return { success: false, error: 'No authentication token received', token: null };
    }

    logger.debug('OAuth callback processed successfully');
    return { success: true, error: null, token };
  }, []);

  const clearCallbackParams = useCallback(() => {
    // Clean up URL parameters
    const url = new URL(window.location.href);
    url.searchParams.delete('token');
    url.searchParams.delete('error');
    url.searchParams.delete('code');
    url.searchParams.delete('state');
    
    window.history.replaceState({}, '', url.toString());
    logger.debug('OAuth callback parameters cleared from URL');
  }, []);

  return {
    processCallback,
    clearCallbackParams,
  };
}

// OAuth provider availability hook
export function useOAuthProviders() {
  const [availability, setAvailability] = useState({
    github: true, // Assume available by default
    google: true, // Assume available by default
    checking: false,
  });

  const checkAvailability = useCallback(async () => {
    // This could be expanded to actually check provider availability
    // For now, we'll assume both are available
    setAvailability({
      github: true,
      google: true,
      checking: false,
    });
  }, []);

  return {
    ...availability,
    checkAvailability,
  };
}

export default useOAuth;