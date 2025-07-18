import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { OAuthProvider } from '../components/auth/OAuthProvider';
import { useOAuth, useOAuthCallback } from '../hooks/useOAuth';
import { apiService } from '../lib/api';
import { oauth, errors, routes } from '../lib/urls';

const AuthSimple: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, isAdmin, isSuperAdmin, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  // Check for OAuth callback and errors in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const authError = urlParams.get('error');
    const token = urlParams.get('token');
    
    if (authError) {
      if (authError === 'github_oauth_not_configured') {
        setError('GitHub OAuth is not yet configured. Please use email login for now.');
      } else if (authError === 'google_oauth_not_configured') {
        setError('Google OAuth is not yet configured. Please use email login for now.');
      } else if (authError.includes('github')) {
        setError('GitHub authentication failed. Please try email login.');
      } else if (authError.includes('google')) {
        setError('Google authentication failed. Please try email login.');
      } else {
        setError('Authentication failed. Please try again.');
      }
      // Clean up the URL
      window.history.replaceState({}, '', '/auth');
    }
    
    // If there's a token, store it and clean up URL - AuthContext will handle it
    if (token) {
      localStorage.setItem('auth_token', token);
      // Clean up the URL
      window.history.replaceState({}, '', '/auth');
      // Let the routing effect handle navigation after AuthContext processes the token
    }
  }, [location, navigate]);

  // Effect to route authenticated users to the correct dashboard
  useEffect(() => {
    if (!loading && user) {
      if (isSuperAdmin) {
        console.log('Routing to superadmin dashboard');
        navigate('/superadmin');
      } else if (isAdmin) {
        console.log('Routing to admin dashboard');
        navigate('/admin');
      } else {
        console.log('Routing to client portal');
        navigate('/client-portal');
      }
    }
  }, [user, loading, isSuperAdmin, isAdmin, navigate]);

  // OAuth hooks
  const { isLoading: oauthLoading, error: oauthError, startOAuth } = useOAuth();
  const { processCallback, clearCallbackParams } = useOAuthCallback();

  // OAuth login handlers
  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    try {
      setFormLoading(true);
      setError('');
      await startOAuth(provider);
    } catch (error) {
      setError(error instanceof Error ? error.message : `Failed to start ${provider} authentication`);
      setFormLoading(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    try {
      const response = await apiService.login({
        email: formData.email,
        password: formData.password,
      });
      
      // Navigate to client portal after successful login
      navigate('/client-portal');
      
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Login failed. Please check your credentials.');
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

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Client Portal Login</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <OAuthProvider
            provider="github"
            disabled={formLoading || oauthLoading}
            loading={oauthLoading}
            onStartAuth={() => handleOAuthLogin('github')}
            onError={setError}
          />
          
          <OAuthProvider
            provider="google"
            disabled={formLoading || oauthLoading}
            loading={oauthLoading}
            onStartAuth={() => handleOAuthLogin('google')}
            onError={setError}
          />
          
          <div className="border-t pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email" 
                className="w-full p-3 border rounded"
                autoComplete="email"
                required
              />
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password" 
                autoComplete="current-password"
                className="w-full p-3 border rounded"
                required
              />
              <button 
                type="submit"
                disabled={formLoading}
                className="w-full bg-teal-600 text-white py-3 px-4 rounded hover:bg-teal-700 disabled:opacity-50"
              >
                {formLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AuthSimple;