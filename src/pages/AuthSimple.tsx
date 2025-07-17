import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthSimple: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check for OAuth callback and errors in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const authError = urlParams.get('error');
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (authError) {
      if (authError.includes('github')) {
        setError('GitHub authentication failed. Please try email login.');
      } else if (authError.includes('google')) {
        setError('Google authentication failed. Please try email login.');
      } else {
        setError('Authentication failed. Please try again.');
      }
      // Clean up the URL
      window.history.replaceState({}, '', '/auth');
    }
    
    // Handle GitHub OAuth callback
    if (code && state) {
      const storedState = localStorage.getItem('oauth_state');
      if (state === storedState) {
        handleGitHubCallback(code);
      } else {
        setError('Invalid OAuth state. Please try again.');
        window.history.replaceState({}, '', '/auth');
      }
    }
  }, [location]);

  const handleGitHubCallback = async (code: string) => {
    setLoading(true);
    setError('');
    
    try {
      // Call the real backend OAuth endpoint
      const response = await fetch('/api/auth/github/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          state: state
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Authentication failed');
      }
      
      const authData = await response.json();
      
      // Store real JWT token and user data
      localStorage.setItem('auth_token', authData.token);
      localStorage.setItem('user_data', JSON.stringify(authData.user));
      localStorage.removeItem('oauth_state');
      
      // Clean up URL and navigate to dashboard
      window.history.replaceState({}, '', '/auth');
      navigate('/client-portal');
      
    } catch (error) {
      console.error('GitHub OAuth error:', error);
      setError(error instanceof Error ? error.message : 'GitHub authentication failed. Please try again.');
      localStorage.removeItem('oauth_state');
      window.history.replaceState({}, '', '/auth');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider: 'github' | 'google') => {
    setLoading(true);
    setError('');
    
    if (provider === 'github') {
      // GitHub OAuth flow - redirect to GitHub
      const clientId = 'Ov23liFnmuNZ9QkJDCnJ'; // Your GitHub OAuth app client ID
      const redirectUri = encodeURIComponent(window.location.origin + '/auth');
      const scope = 'user:email';
      const state = Math.random().toString(36).substring(7); // Random state for security
      
      localStorage.setItem('oauth_state', state);
      
      const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
      window.location.href = githubUrl;
    } else {
      setError(`${provider} authentication is currently unavailable. Please use email login.`);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Real email/password authentication
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const authData = await response.json();
      
      // Store real JWT token and user data
      localStorage.setItem('auth_token', authData.token);
      localStorage.setItem('user_data', JSON.stringify(authData.user));
      
      // Navigate to client portal
      navigate('/client-portal');
      
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
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
          <button 
            onClick={() => handleOAuthLogin('github')}
            disabled={loading}
            className="w-full bg-gray-800 text-white py-3 px-4 rounded hover:bg-gray-700 disabled:opacity-50"
          >
            Continue with GitHub
          </button>
          
          <button 
            onClick={() => handleOAuthLogin('google')}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Continue with Google
          </button>
          
          <div className="border-t pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email" 
                className="w-full p-3 border rounded"
                required
              />
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password" 
                className="w-full p-3 border rounded"
                required
              />
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 text-white py-3 px-4 rounded hover:bg-teal-700 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            
            {/* Demo Credentials */}
            <div className="mt-4 p-3 bg-slate-100 border border-slate-300 rounded">
              <h4 className="text-sm font-medium text-slate-700 mb-2">Demo Login Credentials:</h4>
              <div className="text-xs text-slate-600 space-y-1">
                <p><strong>Client Access:</strong> test@cozyartzmedia.com / TestPass123@</p>
                <p><strong>Admin Access:</strong> Use GitHub OAuth (authorized accounts only)</p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AuthSimple;