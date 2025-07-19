import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { getDashboardRoute, getUserRoleString, isSuperAdmin } from '../utils/roleUtils';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { loading, user, profile } = useAuth();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing authentication...');
  const [redirectCountdown, setRedirectCountdown] = useState(3);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setStatus('error');
          setMessage(`Authentication failed: ${error.message}`);
          return;
        }

        if (data.session) {
          console.log('Session found:', data.session);
          setStatus('success');
          setMessage('Authentication successful! Determining your access level...');
        } else {
          setStatus('error');
          setMessage('No session found. Please try logging in again.');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    // Only process if not already loading from auth context
    if (!loading) {
      handleAuthCallback();
    }
  }, [loading]);

  // Handle redirect when user and profile are loaded
  useEffect(() => {
    if (!loading && user && status === 'success') {
      const redirectPath = getDashboardRoute(user, profile);
      const userRole = getUserRoleString(user, profile);
      
      console.log(`User: ${user.email}, Role: ${userRole}, Redirecting to: ${redirectPath}`);
      setMessage(`Welcome ${userRole}! Redirecting to your dashboard in ${redirectCountdown} seconds...`);
      
      const countdownInterval = setInterval(() => {
        setRedirectCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            navigate(redirectPath);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [loading, user, profile, status, navigate, redirectCountdown]);

  // Handle manual redirect button
  const handleManualRedirect = () => {
    const redirectPath = getDashboardRoute(user, profile);
    navigate(redirectPath);
  };

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4">
              <RefreshCw className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Authentication</h2>
            <p className="text-gray-600">{message}</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome!</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            
            {user && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  Signed in as: <strong>{user.email}</strong>
                </p>
                <p className="text-sm text-green-800 mt-1">
                  Access Level: <strong>{getUserRoleString(user, profile)}</strong>
                </p>
                {isSuperAdmin(user, profile) && (
                  <p className="text-sm text-green-800 mt-1">
                    ✨ Superadmin access detected - you have full system access
                  </p>
                )}
              </div>
            )}

            <div className="mt-6 space-y-3">
              <button
                onClick={handleManualRedirect}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard Now
              </button>
              
              <div className="text-sm text-gray-500">
                Auto-redirecting in {redirectCountdown} seconds...
              </div>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Error</h2>
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

      default:
        return null;
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

export default AuthCallback;