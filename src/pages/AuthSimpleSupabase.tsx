import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { Github, Mail, AlertCircle, CheckCircle, ShieldCheck, Zap } from 'lucide-react';
import TurnstileWidget from '../components/auth/TurnstileWidget';
import MagicLinkAuth from '../components/auth/MagicLinkAuth';

const AuthSimpleSupabase: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, isAdmin, isSuperAdmin, signInWithOAuth, signInWithEmail, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [showTurnstile, setShowTurnstile] = useState(true);
  const [authMode, setAuthMode] = useState<'email' | 'magic'>('magic');

  // Redirect authenticated users
  useEffect(() => {
    if (!loading && user) {
      if (isSuperAdmin) {
        navigate('/superadmin');
      } else if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/client-portal');
      }
    }
  }, [user, loading, isSuperAdmin, isAdmin, navigate]);

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    try {
      setError('');
      setSuccess('');
      await signInWithOAuth(provider);
      // OAuth will redirect to callback page
    } catch (error: any) {
      setError(error.message || `Failed to sign in with ${provider}`);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for Turnstile token
    if (!turnstileToken) {
      setError('Please complete the security check');
      return;
    }
    
    setFormLoading(true);
    setError('');
    setSuccess('');

    try {
      // TODO: Verify turnstile token on backend before processing
      // For now, we'll proceed if we have a token
      
      if (isSignUp) {
        await signUp(formData.email, formData.password, formData.fullName);
        setSuccess('Account created successfully! Please check your email for verification.');
        setIsSignUp(false);
        setFormData({ email: '', password: '', fullName: '' });
        setTurnstileToken(null); // Reset token
        setShowTurnstile(true); // Show new challenge
      } else {
        await signInWithEmail(formData.email, formData.password);
        // Will redirect via useEffect above
      }
    } catch (error: any) {
      setError(error.message || 'Authentication failed');
      setTurnstileToken(null); // Reset on error
      setShowTurnstile(true); // Show new challenge
    } finally {
      setFormLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isSignUp ? 'Create Account' : 'Client Portal Login'}
        </h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {success}
          </div>
        )}
        
        <div className="space-y-4">
          {/* Auth Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setAuthMode('magic')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
                authMode === 'magic'
                  ? 'bg-white text-teal-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Zap className="w-4 h-4 mr-1" />
              Magic Link
            </button>
            <button
              onClick={() => setAuthMode('email')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
                authMode === 'email'
                  ? 'bg-white text-teal-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Mail className="w-4 h-4 mr-1" />
              Email/Password
            </button>
          </div>

          {/* Magic Link Auth */}
          {authMode === 'magic' && (
            <MagicLinkAuth
              mode={isSignUp ? 'signup' : 'signin'}
              onSuccess={() => {
                setSuccess('Magic link sent! Check your email.');
              }}
            />
          )}

          {/* Traditional Auth */}
          {authMode === 'email' && (
            <>
              {/* OAuth Buttons */}
              <button
                onClick={() => handleOAuthLogin('github')}
                disabled={formLoading}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Github className="w-5 h-5 mr-2" />
                Continue with GitHub
              </button>
              
              <button
                onClick={() => handleOAuthLogin('google')}
                disabled={formLoading}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>
            </>
          )}
          
          {/* Email Form - only show for email/password mode */}
          {authMode === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
            {isSignUp && (
              <input 
                type="text" 
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name" 
                className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            )}
            
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email" 
              className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoComplete="email"
              required
            />
            
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password" 
              autoComplete={isSignUp ? "new-password" : "current-password"}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            
            {/* Turnstile Widget */}
            {showTurnstile && (
              <div className="relative">
                <TurnstileWidget
                  onVerify={(token) => {
                    setTurnstileToken(token);
                    setError('');
                  }}
                  onError={() => {
                    setError('Security verification failed. Please try again.');
                    setTurnstileToken(null);
                  }}
                  onExpire={() => {
                    setTurnstileToken(null);
                    setShowTurnstile(true);
                  }}
                  theme="auto"
                  size="normal"
                />
                {turnstileToken && (
                  <div className="absolute top-2 right-2">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                  </div>
                )}
              </div>
            )}
            
            <button 
              type="submit"
              disabled={formLoading || !turnstileToken}
              className="w-full bg-teal-600 text-white py-3 px-4 rounded hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {formLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Mail className="w-5 h-5 mr-2" />
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </>
              )}
            </button>
            </form>
          )}
          
          <div className="text-center space-y-2">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setSuccess('');
                setFormData({ email: '', password: '', fullName: '' });
              }}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors block w-full"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </button>
            
            <a 
              href="/auth/debug" 
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              Debug Auth Status →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSimpleSupabase;