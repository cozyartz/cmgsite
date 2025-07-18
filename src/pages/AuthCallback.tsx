import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/SupabaseAuthContext';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { loading, user, isAdmin, isSuperAdmin } = useAuth();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setStatus('error');
          setMessage(`Authentication failed: ${error.message}`);
          return;
        }

        if (data.session) {
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');
          
          // Wait a moment then redirect based on user role
          setTimeout(() => {
            const baseUrl = 'https://cozyartzmedia.com';
            if (isSuperAdmin) {
              window.location.href = `${baseUrl}/superadmin`;
            } else if (isAdmin) {
              window.location.href = `${baseUrl}/admin`;
            } else {
              window.location.href = `${baseUrl}/client-portal`;
            }
          }, 2000);
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
  }, [loading, navigate, isAdmin, isSuperAdmin]);

  // If auth context is still loading, show loading state
  useEffect(() => {
    if (!loading && user) {
      setStatus('success');
      setMessage('Authentication successful! Redirecting...');
      
      setTimeout(() => {
        const baseUrl = 'https://cozyartzmedia.com';
        if (isSuperAdmin) {
          window.location.href = `${baseUrl}/superadmin`;
        } else if (isAdmin) {
          window.location.href = `${baseUrl}/admin`;
        } else {
          window.location.href = `${baseUrl}/client-portal`;
        }
      }, 1500);
    }
  }, [loading, user, isAdmin, isSuperAdmin, navigate]);

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
            <p className="text-gray-600">{message}</p>
            
            {user && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  Signed in as: <strong>{user.email}</strong>
                </p>
                {isSuperAdmin && (
                  <p className="text-sm text-green-800 mt-1">
                    ✨ Superadmin access detected
                  </p>
                )}
              </div>
            )}
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