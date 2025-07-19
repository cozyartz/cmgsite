import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContextSimple';
import { useNavigate, useLocation } from 'react-router-dom';
import { Github } from 'lucide-react';

const AuthPage: React.FC = () => {
  const { isAuthenticated, isSuperAdmin, signInWithOAuth, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from location state
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    // Only redirect if authenticated and not loading
    if (!loading && isAuthenticated) {
      // If coming from superadmin route but not superadmin, go to client portal
      if (from === '/superadmin' && !isSuperAdmin) {
        navigate('/client-portal', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, isSuperAdmin, loading, navigate, from]);

  const handleGitHubLogin = async () => {
    try {
      await signInWithOAuth('github');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">Loading...</h2>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If already authenticated, show loading while redirecting
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">Redirecting...</h2>
          <p className="text-gray-600">Taking you to your destination...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h1>
          <p className="text-gray-600">Sign in to access Cozyartz Media</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGitHubLogin}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Github className="w-5 h-5 mr-2" />
            Continue with GitHub
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Secure authentication powered by Supabase
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;