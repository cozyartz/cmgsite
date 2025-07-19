import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Github, Chrome, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const AuthPage: React.FC = () => {
  const { user, isSuperAdmin, signInWithOAuth, loading } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();
  const location = useLocation();

  // State management
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authMethod, setAuthMethod] = useState<'oauth' | 'email'>('oauth');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
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

  // OAuth handlers
  const handleGitHubLogin = async () => {
    try {
      setError('');
      await signInWithOAuth('github');
    } catch (error) {
      console.error('GitHub login error:', error);
      setError('Failed to sign in with GitHub. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await signInWithOAuth('google');
    } catch (error) {
      console.error('Google login error:', error);
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  // Email authentication handlers
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      if (authMode === 'signup') {
        // Validation for signup
        if (!formData.fullName.trim()) {
          throw new Error('Full name is required');
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        
        const { supabase } = await import('../lib/supabase');
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
            }
          }
        });

        if (error) throw error;

        if (data?.user && !data?.user?.email_confirmed_at) {
          setSuccess('Please check your email and click the confirmation link to activate your account.');
        } else {
          setSuccess('Account created successfully! You can now sign in.');
          setAuthMode('signin');
        }
      } else {
        // Sign in
        const { supabase } = await import('../lib/supabase');
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const toggleAuthMode = () => {
    setAuthMode(prev => prev === 'signin' ? 'signup' : 'signin');
    setError('');
    setSuccess('');
    setFormData({ email: '', password: '', confirmPassword: '', fullName: '' });
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
            {authMode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-600">
            {authMode === 'signin' 
              ? 'Sign in to access Cozyartz Media' 
              : 'Join our platform and start building'
            }
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-green-800">{success}</p>
            </div>
          </div>
        )}

        {/* Auth Method Toggle */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setAuthMethod('oauth')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              authMethod === 'oauth'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Social Login
          </button>
          <button
            onClick={() => setAuthMethod('email')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              authMethod === 'email'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Email & Password
          </button>
        </div>

        {/* OAuth Section */}
        {authMethod === 'oauth' && (
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
        )}

        {/* Email Form Section */}
        {authMethod === 'email' && (
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required={authMode === 'signup'}
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

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
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {authMode === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required={authMode === 'signup'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {isSubmitting ? (
                <Loader className="w-5 h-5 animate-spin mr-2" />
              ) : null}
              {isSubmitting 
                ? (authMode === 'signin' ? 'Signing In...' : 'Creating Account...') 
                : (authMode === 'signin' ? 'Sign In' : 'Create Account')
              }
            </button>
          </form>
        )}

        {/* Mode Toggle */}
        <div className="mt-6 text-center">
          <button
            onClick={toggleAuthMode}
            className="text-sm text-purple-600 hover:text-purple-500 font-medium"
          >
            {authMode === 'signin' 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"
            }
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Secure authentication powered by Supabase
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;