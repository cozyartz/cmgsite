import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
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
  Search,
  TrendingUp,
  BarChart3,
  Globe
} from 'lucide-react';
import TurnstileWidget from '../components/auth/TurnstileWidget';

interface AuthSupabaseTurnstileProps {
  defaultMode?: 'signin' | 'signup';
}

const AuthSimple: React.FC<AuthSupabaseTurnstileProps> = ({ defaultMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, profile, loading, isAdmin, isSuperAdmin, signInWithOAuth, signInWithMagicLink, signUpWithMagicLink } = useAuth();
  
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
  const [fieldErrors, setFieldErrors] = useState<{email?: string; fullName?: string; emailSuggestion?: string}>({});
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isNameValid, setIsNameValid] = useState(false);
  const [emergencyBypass, setEmergencyBypass] = useState(false);
  
  // Emergency bypass for stuck loading states
  useEffect(() => {
    const bypassTimer = setTimeout(() => {
      if (loading) {
        console.warn('⚠️ Auth loading timeout - enabling emergency bypass');
        setEmergencyBypass(true);
      }
    }, 8000);
    
    return () => clearTimeout(bypassTimer);
  }, [loading]);

  // Check for plan selection from pricing page
  const selectedPlan = searchParams.get('plan');
  const billingCycle = searchParams.get('billing');
  
  // Enhanced validation functions with accessibility
  const validateEmail = (email: string): {isValid: boolean; error?: string; suggestion?: string} => {
    if (!email) {
      return { isValid: false, error: 'Email is required' };
    }
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
    
    // Check for common typos in domains with suggestions
    const domain = email.split('@')[1]?.toLowerCase();
    const commonDomains = {
      'gmial.com': 'gmail.com',
      'gmai.com': 'gmail.com', 
      'gamil.com': 'gmail.com',
      'yahooo.com': 'yahoo.com',
      'yaho.com': 'yahoo.com',
      'hotmial.com': 'hotmail.com',
      'hotmai.com': 'hotmail.com',
      'outlok.com': 'outlook.com',
      'outloo.com': 'outlook.com'
    };
    
    if (domain && commonDomains[domain]) {
      const suggestion = email.replace(domain, commonDomains[domain]);
      return { 
        isValid: false, 
        error: `Did you mean ${suggestion}?`,
        suggestion
      };
    }
    
    // Check for suspicious patterns
    if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
      return { isValid: false, error: 'Please check your email format' };
    }
    
    return { isValid: true };
  };
  
  const validateFullName = (name: string): {isValid: boolean; error?: string} => {
    if (!name.trim()) {
      return { isValid: false, error: 'Full name is required' };
    }
    
    if (name.trim().length < 2) {
      return { isValid: false, error: 'Please enter your full name' };
    }
    
    // Check for at least first and last name
    const nameParts = name.trim().split(' ').filter(part => part.length > 0);
    if (nameParts.length < 2) {
      return { isValid: false, error: 'Please enter both first and last name' };
    }
    
    // Check for valid characters
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    if (!nameRegex.test(name)) {
      return { isValid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
    }
    
    return { isValid: true };
  };
  
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

  // Simplified redirect logic without loops
  useEffect(() => {
    if (!loading && user) {
      console.log('🎯 User authenticated:', user.email);
      
      // Check if we're already on a protected route to prevent unnecessary redirects
      const currentPath = location.pathname;
      const protectedRoutes = ['/client-portal', '/superadmin', '/admin'];
      
      // Don't redirect if already on a protected route
      if (protectedRoutes.includes(currentPath)) {
        console.log('🚷 Already on protected route, skipping redirect');
        return;
      }
      
      // Only redirect once per session
      const redirectKey = `auth-redirect-${user.id}`;
      const hasRedirected = sessionStorage.getItem(redirectKey);
      if (hasRedirected) {
        console.log('🔁 Already redirected this session, skipping');
        return;
      }
      
      // Determine redirect path
      let redirectPath = '/client-portal';
      
      if (user.email === 'cozy2963@gmail.com' || user.email === 'andrea@cozyartzmedia.com') {
        redirectPath = '/superadmin';
      } else if (profile?.role === 'admin') {
        redirectPath = '/superadmin';
      }
      
      console.log('🚀 Redirecting to:', redirectPath);
      
      // Mark as redirected before navigating
      sessionStorage.setItem(redirectKey, 'true');
      
      // Use navigate instead of window.location for SPA routing
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 100);
    }
  }, [user, loading, profile, navigate, location.pathname]);

  // Update mode when URL changes
  useEffect(() => {
    const newMode = getInitialMode();
    setAuthMode(newMode);
  }, [searchParams, defaultMode]);

  // Enhanced input handlers with validation and analytics
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    // Clear previous errors
    setFieldErrors(prev => ({ ...prev, email: undefined }));
    
    // Real-time validation with suggestions
    if (newEmail) {
      const validation = validateEmail(newEmail);
      setIsEmailValid(validation.isValid);
      if (!validation.isValid) {
        setFieldErrors(prev => ({ 
          ...prev, 
          email: validation.error,
          emailSuggestion: validation.suggestion 
        }));
      }
    } else {
      setIsEmailValid(false);
    }
    
    // Show Turnstile after user starts typing (delayed for better UX)
    if (!showTurnstile && newEmail.length > 3) {
      setTimeout(() => setShowTurnstile(true), 500);
    }
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFullName(newName);
    
    // Clear previous errors
    setFieldErrors(prev => ({ ...prev, fullName: undefined }));
    
    // Real-time validation for signup mode
    if (authMode === 'signup' && newName) {
      const validation = validateFullName(newName);
      setIsNameValid(validation.isValid);
      if (!validation.isValid) {
        setFieldErrors(prev => ({ ...prev, fullName: validation.error }));
      }
    } else if (authMode === 'signup') {
      setIsNameValid(false);
    }
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
    setFieldErrors({});
    setIsEmailValid(false);
    setIsNameValid(false);
  };
  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    try {
      setError('');
      setSuccess('');
      setAuthLoading(true);
      
      // Enhanced metadata tracking for OAuth signup
      const metadata = { 
        signup_method: 'oauth',
        oauth_provider: provider,
        auth_mode: authMode,
        selected_plan: selectedPlan,
        billing_cycle: billingCycle,
        signup_source: 'website',
        user_agent: navigator.userAgent,
        referrer: document.referrer || 'direct',
        signup_timestamp: new Date().toISOString()
      };
      
      await signInWithOAuth(provider);
    } catch (error: any) {
      console.error(`OAuth ${provider} error:`, error);
      setError(error.message || `Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleMagicLinkAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation before submission
    const emailValidation = validateEmail(email);
    let nameValidation = { isValid: true };
    
    if (authMode === 'signup') {
      nameValidation = validateFullName(fullName);
    }
    
    // Update field errors with better error messages
    const errors: {email?: string; fullName?: string; emailSuggestion?: string} = {};
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error;
      errors.emailSuggestion = emailValidation.suggestion;
    }
    if (authMode === 'signup' && !nameValidation.isValid) {
      errors.fullName = nameValidation.error;
    }
    
    setFieldErrors(errors);
    
    // Stop if validation fails
    if (!emailValidation.isValid || (authMode === 'signup' && !nameValidation.isValid)) {
      return;
    }
    
    // Check Turnstile
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
        fullName: fullName.trim(),
        selectedPlan,
        billingCycle,
        signup_method: 'magic_link',
        auth_mode: authMode,
        terms_accepted: true,
        marketing_consent: false,
        signup_source: 'website',
        user_agent: navigator.userAgent,
        referrer: document.referrer || 'direct',
        signup_timestamp: new Date().toISOString(),
        form_completion_time: Date.now() - performance.now()
      };

      if (authMode === 'signup') {
        console.log('🎆 Creating new account with magic link');
        await signUpWithMagicLink(email.toLowerCase().trim(), metadata);
        setSuccess('Welcome! We\'ve sent a secure link to complete your account setup.');
      } else {
        console.log('✨ Sending magic link for signin');
        await signInWithMagicLink(email.toLowerCase().trim());
        setSuccess('Magic link sent! Check your email to access your dashboard.');
      }
      
      setEmailSent(true);
    } catch (error: any) {
      console.error('Magic link error:', error);
      
      let errorMessage = 'Failed to send magic link. Please try again.';
      
      if (error.message?.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.message?.includes('rate limit')) {
        errorMessage = 'Too many requests. Please wait a moment before trying again.';
      } else if (error.message?.includes('signup disabled')) {
        errorMessage = 'Account creation is temporarily disabled. Please try signing in instead.';
      }
      
      setError(errorMessage);
      setTurnstileToken(null);
      setShowTurnstile(true);
    } finally {
      setAuthLoading(false);
    }
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
        <div className="text-center p-8 max-w-md mx-auto">
          <div className="relative mb-6">
            <div className="w-20 h-20 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-purple-200 border-b-purple-500 rounded-full animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '3s'}}></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Connecting...</h2>
          <p className="text-gray-300 mb-4">Checking your authentication status</p>
          
          {/* Progressive enhancement - show continue button after delay */}
          <div className="mt-8">
            <button
              onClick={() => {
                console.log('🚑 Emergency bypass activated');
                setLoading(false);
              }}
              className="text-sm text-teal-400 hover:text-teal-300 underline transition-colors"
            >
              Taking too long? Click here to continue
            </button>
          </div>
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
          
          <h2 className="text-2xl font-bold text-white mb-4">
            {authMode === 'signup' ? 'Welcome to Cozyartz!' : 'Check your email!'}
          </h2>
          <p className="text-gray-300 mb-2">
            We've sent a secure {authMode === 'signup' ? 'account setup' : 'magic'} link to <strong className="text-teal-400">{email}</strong>
          </p>
          <p className="text-sm text-gray-400 mb-4">
            {authMode === 'signup' 
              ? 'Click the link in your email to complete your account setup and get started with your SEO journey!'
              : 'Click the link in your email to access your SEO dashboard instantly.'
            }
          </p>
          
          {/* Enhanced signup benefits with progress */}
          {authMode === 'signup' && (
          <div className="mb-4 p-4 bg-gradient-to-r from-teal-500/10 to-purple-500/10 border border-teal-500/20 rounded-lg">
          <h3 className="text-teal-300 font-semibold text-sm mb-3 flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
          Welcome to Cozyartz! Here's what happens next:
          </h3>
          <div className="space-y-2">
          <div className="flex items-center text-xs text-teal-200">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span>Email sent ✓</span>
                </div>
                  <div className="flex items-center text-xs text-teal-200">
                    <div className="w-2 h-2 bg-teal-400 rounded-full mr-2 animate-pulse"></div>
                    <span>Click the verification link in your email</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-400">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                    <span>Access your personalized SEO dashboard</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-400">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                    <span>Connect with MAX AI for expert guidance</span>
                  </div>
                  {selectedPlan && (
                    <div className="flex items-center text-xs text-gray-400">
                      <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                      <span>Activate your {selectedPlan} plan features</span>
                    </div>
                  )}
                </div>
              </div>
            )}

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
            className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-purple-600 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-purple-700 transition-all duration-200 mb-3"
          >
            Try a different email
          </button>
          
          {/* Help text */}
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-2">
              Didn't receive the email? Check your spam folder or 
              <button 
                onClick={() => setEmailSent(false)}
                className="text-teal-400 hover:text-teal-300 underline ml-1"
              >
                try again
              </button>
            </p>
            <p className="text-xs text-gray-500">
              Links expire in 1 hour for security
            </p>
          </div>
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
                <Search className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">Cozyartz</h1>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {authMode === 'signup' ? 'Boost Your' : 'Your SEO'}
              <span className="block bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent">
                {authMode === 'signup' ? 'Search Rankings' : 'Dashboard Awaits'}
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-8">
              {authMode === 'signup' 
                ? 'Transform your online presence with our advanced SEO strategies and proven ranking techniques.'
                : 'Access your SEO campaigns, track your rankings, and monitor your search performance growth.'
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
                  <Search className="w-4 h-4 text-teal-400" />
                </div>
                <span>Advanced Keyword Research & Optimization</span>
              </div>
              <div className="flex items-center text-gray-300">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                </div>
                <span>Search Ranking Improvement</span>
              </div>
              <div className="flex items-center text-gray-300">
                <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center mr-3">
                  <BarChart3 className="w-4 h-4 text-pink-400" />
                </div>
                <span>Performance Analytics & Reporting</span>
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
                <Search className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Cozyartz SEO</h1>
              <p className="text-gray-300 text-sm">
                {authMode === 'signup' ? 'Create Account' : 'SEO Dashboard'}
              </p>
            </div>

          {/* Mode Toggle */}
          <div className="flex bg-white/10 rounded-xl p-1 mb-6">
            <button
              onClick={() => setAuthMode('signin')}
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
              onClick={() => setAuthMode('signup')}
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
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg flex items-center">
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
              className="w-full flex items-center justify-center px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-600 transition-all duration-200 disabled:opacity-50"
            >
              <Github className="w-5 h-5 mr-3" />
              Continue with GitHub
            </button>
            
            <button
              onClick={() => handleOAuthLogin('google')}
              disabled={authLoading}
              className="w-full flex items-center justify-center px-4 py-3 bg-white hover:bg-gray-50 text-gray-900 rounded-lg border border-gray-200 transition-all duration-200 disabled:opacity-50"
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
              <span className="px-4 bg-slate-900/50 text-gray-300">Or use email</span>
            </div>
          </div>

          {/* Magic Link Form */}
          <form onSubmit={handleMagicLinkAuth} className="space-y-4">
          {authMode === 'signup' && (
          <div>
          <div className="relative">
            <input
              type="text"
              value={fullName}
              onChange={handleFullNameChange}
              placeholder="Full Name"
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    fieldErrors.fullName 
                      ? 'border-red-500/50 focus:ring-red-500' 
                      : isNameValid 
                    ? 'border-green-500/50 focus:ring-green-500'
                    : 'border-white/20 focus:ring-teal-500'
                }`}
              required
              autoComplete="name"
            aria-label="Full name"
              aria-describedby={fieldErrors.fullName ? 'name-error' : undefined}
                aria-invalid={!!fieldErrors.fullName}
              />
              {/* Validation icon */}
              {fullName && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {isNameValid ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : fieldErrors.fullName ? (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                ) : null}
              </div>
            )}
          </div>
            {/* Name validation error */}
              {fieldErrors.fullName && (
                    <p id="name-error" className="text-red-400 text-sm mt-1 flex items-center" role="alert">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {fieldErrors.fullName}
                    </p>
                  )}
                </div>
              )}
              
              <div>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Email address"
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      fieldErrors.email 
                        ? 'border-red-500/50 focus:ring-red-500' 
                        : isEmailValid 
                        ? 'border-green-500/50 focus:ring-green-500'
                        : 'border-white/20 focus:ring-teal-500'
                    }`}
                    required
                    autoComplete="email"
                    aria-label="Email address"
                    aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                    aria-invalid={!!fieldErrors.email}
                  />
                  {/* Email validation icon */}
                  {email && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {isEmailValid ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : fieldErrors.email ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : null}
                    </div>
                  )}
                </div>
                {/* Email validation error with suggestion */}
                {fieldErrors.email && (
                  <div id="email-error" className="text-red-400 text-sm mt-1" role="alert">
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {fieldErrors.email}
                    </div>
                    {fieldErrors.emailSuggestion && (
                      <button
                        type="button"
                        onClick={() => {
                          setEmail(fieldErrors.emailSuggestion!);
                          setFieldErrors(prev => ({ ...prev, email: undefined, emailSuggestion: undefined }));
                          setIsEmailValid(true);
                        }}
                        className="text-teal-400 hover:text-teal-300 underline text-xs mt-1 block transition-colors"
                        aria-label={`Use suggested email ${fieldErrors.emailSuggestion}`}
                      >
                        Use suggested email: {fieldErrors.emailSuggestion}
                      </button>
                    )}
                  </div>
                )}
              </div>

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
                disabled={
                  authLoading || 
                  !email || 
                  !isEmailValid ||
                  (authMode === 'signup' && (!fullName || !isNameValid)) || 
                  (showTurnstile && !turnstileToken)
                }
                className={`w-full py-3 px-4 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center ${
                  authLoading || 
                  !email || 
                  !isEmailValid ||
                  (authMode === 'signup' && (!fullName || !isNameValid)) || 
                  (showTurnstile && !turnstileToken)
                    ? 'bg-gray-600 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 hover:scale-[1.02] shadow-lg'
                }`}
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

export default AuthSimple;
