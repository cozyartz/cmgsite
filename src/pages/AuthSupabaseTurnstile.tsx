import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { 
  Github, 
  Mail, 
  AlertCircle, 
  CheckCircle, 
  Zap, 
  Sparkles, 
  Shield, 
  Lock,
  User,
  ArrowRight,
  Palette,
  Camera,
  Video,
  Globe
} from 'lucide-react';
import TurnstileWidget from '../components/auth/TurnstileWidget';

interface AuthSupabaseTurnstileProps {
  defaultMode?: 'signin' | 'signup';
}

const AuthSupabaseTurnstile: React.FC<AuthSupabaseTurnstileProps> = ({ defaultMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, loading, isAdmin, isSuperAdmin, signInWithOAuth, signInWithMagicLink, signUpWithMagicLink } = useAuth();
  
  // Determine initial auth mode from props, URL params, or default to signin
  const getInitialMode = (): 'signin' | 'signup' => {
    if (defaultMode) return defaultMode;
    const modeParam = searchParams.get('mode');
    if (modeParam === 'signup' || modeParam === 'signin') return modeParam;
    return 'signin';
  };

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(getInitialMode);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [showTurnstile, setShowTurnstile] = useState(false);

  // Check for plan selection from pricing page
  const selectedPlan = searchParams.get('plan');
  const billingCycle = searchParams.get('billing');
  
  // Check for auth token in URL (from OAuth callback)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    
    if (token) {
      // Store token and let Supabase handle the session
      console.log('Token found in URL, processing...');
      // Clean up URL
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location]);

  // Redirect authenticated users
  useEffect(() => {
    if (!loading && user) {
      if (isSuperAdmin) {
        navigate('/superadmin');
      } else if (isAdmin) {
        console.log('Redirecting admin to admin dashboard');
        navigate('/admin');
      } else {
        navigate('/client-portal');
      }
    }
  }, [user, loading, isSuperAdmin, isAdmin, navigate]);

  // Update mode when URL changes
  useEffect(() => {
    const newMode = getInitialMode();
    setAuthMode(newMode);
  }, [searchParams, defaultMode]);

  // Show Turnstile after user interacts with form
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (!showTurnstile && e.target.value.length > 0) {
      setShowTurnstile(true);
    }
  };

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    try {
      setError('');
      setSuccess('');
      setSuccess('');
      setAuthLoading(true);
      await signInWithOAuth(provider);
    } catch (error: any) {
      setError(error.message || `Failed to sign in with ${provider}`);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleMagicLinkAuth = async (e: React.FormEvent) => {
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
    e.preventDefault();
    if (!turnstileToken) {
      setError('Please complete the security verification');
      return;
    }

    setAuthLoading(true);
    setError('');
    setSuccess('');
    setEmailSent(false);

    try {
      const metadata = { 
        fullName,
        selectedPlan,
        billingCycle 
      };

      if (authMode === 'signup') {
        await signUpWithMagicLink(email, metadata);
        setSuccess('Account creation initiated! Check your email for the magic link.');
      } else {
        await signInWithMagicLink(email);
        setSuccess('Magic link sent! Check your email to sign in.');
      }
      
      setEmailSent(true);
    } catch (error: any) {
      setError(error.message || 'Failed to send magic link');
      setTurnstileToken(null);
      setShowTurnstile(true);
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle form input changes and show Turnstile when user starts typing
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (!showTurnstile && e.target.value.length > 0) {
      setShowTurnstile(true);
    }
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  };

  const resetForm = () => {
    setEmail('');
    setFullName('');
    setEmailSent(false);
    setError('');
    setSuccess('');
    setTurnstileToken(null);
    setShowTurnstile(false);
    setAuthLoading(false);
  };

  const toggleMode = (newMode: 'signin' | 'signup') => {
    setAuthMode(newMode);
    resetForm();
    // Update URL without navigation
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('mode', newMode);
    window.history.replaceState({}, '', `${window.location.pathname}?${newSearchParams}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin mx-auto"></div>
            <Sparkles className="w-8 h-8 text-teal-400 absolute inset-0 m-auto animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white mt-6">Welcome back!</h2>
          <p className="text-gray-300">Loading your creative workspace...</p>
        </div>
      </div>
    );
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-lg w-full text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-teal-400 to-purple-500 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">Check your email!</h2>
          <p className="text-gray-300 mb-2">
            We've sent a secure magic link to <strong className="text-teal-400">{email}</strong>
          </p>
          <p className="text-sm text-gray-400 mb-4">
            Click the link to {authMode === 'signup' ? 'complete your account setup' : 'access your creative workspace'}
          </p>

          {selectedPlan && (
            <div className="mb-6 p-3 bg-teal-500/20 border border-teal-500/30 rounded-lg">
              <p className="text-sm text-teal-200">
                🎯 Selected Plan: <strong className="capitalize">{selectedPlan}</strong>
                {billingCycle && ` (${billingCycle})`}
              </p>
            </div>
          )}
          
          <button
            onClick={resetForm}
            className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-purple-600 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-purple-700 transition-all duration-200"
          >
            Try a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl flex items-center justify-center gap-12">
        
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:block flex-1 max-w-lg">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-purple-500 rounded-xl flex items-center justify-center mr-3">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">Cozyartz</h1>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {authMode === 'signup' ? 'Join Our Creative' : 'Your Creative'}
              <span className="block bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent">
                {authMode === 'signup' ? 'Community' : 'Workspace Awaits'}
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-8">
              {authMode === 'signup' 
                ? 'Start your creative journey with our professional team and advanced tools.'
                : 'Access your projects, collaborate with our team, and bring your creative visions to life.'
              }
            </p>

            {selectedPlan && (
              <div className="mb-6 p-4 bg-teal-500/20 border border-teal-500/30 rounded-lg">
                <h3 className="text-white font-semibold mb-2">Selected Plan</h3>
                <p className="text-teal-300 capitalize">
                  {selectedPlan} Plan {billingCycle && `(${billingCycle})`}
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="flex items-center text-gray-300">
                <div className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center mr-3">
                  <Globe className="w-4 h-4 text-teal-400" />
                </div>
                <span>Web Design & Development</span>
              </div>
              <div className="flex items-center text-gray-300">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">
                  <Camera className="w-4 h-4 text-purple-400" />
                </div>
                <span>Photography & Visual Design</span>
              </div>
              <div className="flex items-center text-gray-300">
                <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center mr-3">
                  <Video className="w-4 h-4 text-pink-400" />
                </div>
                <span>Video Production & Animation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">

            {/* Mobile Branding */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Cozyartz Media</h1>
              <p className="text-gray-300 text-sm">
                {authMode === 'signup' ? 'Create Account' : 'Client Portal'}
              </p>
            </div>

            {/* Mode Toggle */}
            <div className="flex bg-white/10 rounded-xl p-1 mb-6">
              <button
                onClick={() => toggleMode('signin')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                  authMode === 'signin'
                    ? 'bg-white text-slate-900 shadow-lg'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Lock className="w-4 h-4 mr-2" />
                Sign In
              </button>
              <button
                onClick={() => toggleMode('signup')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                  authMode === 'signup'
                    ? 'bg-white text-slate-900 shadow-lg'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <User className="w-4 h-4 mr-2" />
                Sign Up
              </button>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg flex items-center animate-shake">
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <span className="text-sm font-medium">{success}</span>
              </div>
            )}

            {/* OAuth Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleOAuthLogin('github')}
                disabled={authLoading}
                className="w-full flex items-center justify-center px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Github className="w-5 h-5 mr-3" />
                Continue with GitHub
              </button>
              
              <button
                onClick={() => handleOAuthLogin('google')}
                disabled={authLoading}
                className="w-full flex items-center justify-center px-4 py-3 bg-white hover:bg-gray-50 text-gray-900 rounded-lg border border-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-900/50 text-gray-300">Or use magic link</span>
              </div>
            </div>

            {/* Magic Link Form */}
            <form onSubmit={handleMagicLinkAuth} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              )}
              
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Email address"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Turnstile Widget */}
              {showTurnstile && (
                <div className="relative">
                  <TurnstileWidget
                    onVerify={(token) => {
                      setTurnstileToken(token);
                      setError('');
                      setError('');
                    }}
                    onError={() => {
                      setError('Security verification failed. Please try again.');
                      setTurnstileToken(null);
                    }}
                    onExpire={() => {
                      setTurnstileToken(null);
                    }}
                    theme="dark"
                    size="normal"
                  />
                  {turnstileToken && (
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading || !email || (authMode === 'signup' && !fullName) || (showTurnstile && !turnstileToken)}
                className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-purple-600 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {authLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    {authMode === 'signup' ? 'Create Account' : 'Send Magic Link'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-400">
                By continuing, you agree to our{' '}
                <a href="/terms-of-service" className="text-teal-400 hover:text-teal-300 transition-colors">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy-policy" className="text-teal-400 hover:text-teal-300 transition-colors">
                  Privacy Policy
                </a>
              </p>
              
              <div className="mt-4 flex items-center justify-center text-gray-400">
                <Shield className="w-4 h-4 mr-2" />
                <span className="text-xs">Secured by Cloudflare Turnstile</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSupabaseTurnstile;