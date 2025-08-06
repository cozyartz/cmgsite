import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Github, Chrome, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const AuthPage: React.FC = () => {
  const { user, isSuperAdmin, signInWithMagicLink, signInWithOAuth, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // State management
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    setMessage('');

    try {
      const result = await signInWithMagicLink(email);
      
      if (result.success) {
        setMessage('✅ Magic link sent! Check your email and click the link to sign in.');
        setEmail('');
      } else {
        setMessage(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error('Magic link error:', error);
      setMessage('❌ Failed to send magic link. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // OAuth handlers
  const handleGitHubLogin = async () => {
    try {
      setMessage('Redirecting to GitHub...');
      await signInWithOAuth('github');
    } catch (error) {
      console.error('GitHub login error:', error);
      setMessage('❌ Failed to sign in with GitHub. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setMessage('Redirecting to Google...');
      await signInWithOAuth('google');
    } catch (error) {
      console.error('Google login error:', error);
      setMessage('❌ Failed to sign in with Google. Please try again.');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to CMGsite
          </h1>
          <p className="text-gray-600">
            Sign in to access your Cozyartz Media Group client portal
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-start space-x-3 ${
            message.includes('✅') 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            {message.includes('✅') ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`text-sm ${message.includes('✅') ? 'text-green-800' : 'text-red-800'}`}>
                {message}
              </p>
            </div>
          </div>
        )}

        {/* Magic Link Form */}
        <form onSubmit={handleMagicLinkSubmit} className="space-y-4 mb-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your email address"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !email}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {isSubmitting ? (
              <Loader className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Mail className="w-5 h-5 mr-2" />
            )}
            {isSubmitting ? 'Sending Magic Link...' : 'Send Magic Link'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* OAuth Section */}
        <div className="space-y-3">
          <button
            onClick={handleGitHubLogin}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <Github className="w-5 h-5 mr-3" />
            Continue with GitHub
          </button>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <Chrome className="w-5 h-5 mr-3" />
            Continue with Google
          </button>
        </div>


        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Secure authentication powered by Cloudflare
          </p>
          <p className="text-xs text-gray-400 mt-2">
            By signing in, you agree to our{' '}
            <a href="/terms" className="text-purple-600 hover:text-purple-500">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-purple-600 hover:text-purple-500">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;