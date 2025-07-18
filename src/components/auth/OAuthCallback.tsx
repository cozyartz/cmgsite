/**
 * OAuth Callback Handler Component
 * Handles OAuth callback processing and routing
 */

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { oauth, errors, routes } from '../../lib/urls';
import { useAuth } from '../../contexts/AuthContext';
import { createLogger } from '../../config/environment';

const logger = createLogger('OAuthCallback');

export interface OAuthCallbackProps {
  onSuccess?: (token: string) => void;
  onError?: (error: string) => void;
  showDebugInfo?: boolean;
}

export const OAuthCallback: React.FC<OAuthCallbackProps> = ({
  onSuccess,
  onError,
  showDebugInfo = false,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, user, isAdmin, isSuperAdmin } = useAuth();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing authentication...');
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    processOAuthCallback();
  }, [location]);

  const processOAuthCallback = async () => {
    try {
      logger.debug('Processing OAuth callback', { search: location.search });

      // Extract token and error from URL
      const token = oauth.extractToken(window.location.href);
      const error = oauth.extractError(window.location.href);

      if (error) {
        const errorMessage = errors.getErrorMessage(error);
        logger.error('OAuth error received:', error);
        setStatus('error');
        setMessage(errorMessage);
        onError?.(errorMessage);
        
        // Clean up URL
        window.history.replaceState({}, '', location.pathname);
        return;
      }

      if (!token) {
        logger.warn('No token found in OAuth callback');
        setStatus('error');
        setMessage('No authentication token received');
        onError?.('No authentication token received');
        return;
      }

      logger.debug('Token received, processing authentication');
      setMessage('Verifying authentication...');

      // Store token and let AuthContext handle verification
      localStorage.setItem('auth_token', token);
      
      // Notify success callback
      onSuccess?.(token);

      // Set debug info if requested
      if (showDebugInfo) {
        try {
          // Decode JWT payload for debug display (basic decode, not verification)
          const payload = JSON.parse(atob(token.split('.')[1]));
          setDebugInfo({
            token: token.substring(0, 20) + '...',
            payload,
            timestamp: new Date().toISOString(),
          });
        } catch (e) {
          logger.warn('Could not decode token for debug info:', e);
        }
      }

      setStatus('success');
      setMessage('Authentication successful! Redirecting...');

      // Small delay to show success message
      setTimeout(() => {
        // Let AuthContext determine the correct route based on user role
        // This will trigger a re-render and proper routing
        window.location.reload();
      }, 1500);

    } catch (error) {
      logger.error('OAuth callback processing error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      setStatus('error');
      setMessage(errorMessage);
      onError?.(errorMessage);
    }
  };

  // Render different states
  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Authenticating</h2>
            <p className="text-gray-600">{message}</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="text-green-600 text-4xl mb-4">✅</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Success!</h2>
            <p className="text-gray-600">{message}</p>
            
            {debugInfo && showDebugInfo && (
              <div className="mt-6 p-4 bg-gray-100 rounded-lg text-left">
                <h3 className="font-semibold mb-2">Debug Information:</h3>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            )}
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="text-red-600 text-4xl mb-4">❌</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Failed</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            
            <div className="space-y-2">
              <button
                onClick={() => navigate('/auth')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default OAuthCallback;