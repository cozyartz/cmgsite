/**
 * OAuth Provider Component
 * Reusable OAuth button component for GitHub and Google authentication
 */

import React, { useState } from 'react';
import { oauth, errors } from '../../lib/urls';
import { createLogger } from '../../config/environment';

const logger = createLogger('OAuthProvider');

export interface OAuthProviderProps {
  provider: 'github' | 'google';
  disabled?: boolean;
  loading?: boolean;
  onStartAuth?: () => void;
  onError?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
}

// Provider configurations
const providerConfig = {
  github: {
    name: 'GitHub',
    icon: '🐙', // You can replace with proper icons
    bgColor: 'bg-gray-800 hover:bg-gray-700',
    textColor: 'text-white',
  },
  google: {
    name: 'Google',
    icon: '🔍', // You can replace with proper icons
    bgColor: 'bg-blue-600 hover:bg-blue-700',
    textColor: 'text-white',
  },
};

export const OAuthProvider: React.FC<OAuthProviderProps> = ({
  provider,
  disabled = false,
  loading = false,
  onStartAuth,
  onError,
  className = '',
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const config = providerConfig[provider];

  const handleOAuthLogin = async () => {
    if (disabled || loading || isLoading) return;

    try {
      setIsLoading(true);
      logger.debug(`Starting ${provider} OAuth flow`);
      
      // Notify parent component
      onStartAuth?.();

      // Get OAuth URL and redirect
      const oauthUrl = oauth.getLoginUrl(provider);
      logger.debug(`Redirecting to ${provider} OAuth: ${oauthUrl}`);
      
      // Redirect to OAuth provider
      window.location.href = oauthUrl;

    } catch (error) {
      logger.error(`${provider} OAuth error:`, error);
      const errorMessage = error instanceof Error ? error.message : 'OAuth initialization failed';
      onError?.(errorMessage);
      setIsLoading(false);
    }
  };

  const isButtonLoading = loading || isLoading;
  const isButtonDisabled = disabled || isButtonLoading;

  const defaultClassName = `
    w-full py-3 px-4 rounded-lg font-medium transition-all duration-200
    ${config.bgColor} ${config.textColor}
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    ${className}
  `.trim();

  return (
    <button
      type="button"
      onClick={handleOAuthLogin}
      disabled={isButtonDisabled}
      className={defaultClassName}
      aria-label={`Continue with ${config.name}`}
    >
      {children || (
        <div className="flex items-center justify-center space-x-2">
          <span className="text-lg" aria-hidden="true">
            {config.icon}
          </span>
          <span>
            {isButtonLoading ? `Connecting to ${config.name}...` : `Continue with ${config.name}`}
          </span>
          {isButtonLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
        </div>
      )}
    </button>
  );
};

export default OAuthProvider;