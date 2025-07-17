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
    
    // Handle OAuth success callback
    const token = urlParams.get('token');
    if (token) {
      handleOAuthSuccess();
    }
  }, [location]);

  // Handle successful OAuth login from URL parameters
  const handleOAuthSuccess = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userParam = urlParams.get('user');
    
    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        
        // Store JWT token and user data
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        
        // Clean up URL
        window.history.replaceState({}, '', '/auth');
        
        // Navigate to client portal
        navigate('/client-portal');
      } catch (err) {
        setError('Invalid authentication response');
      }
    }
  };

  const handleOAuthLogin = (provider: 'github' | 'google') => {
    setLoading(true);
    setError('');
    
    if (provider === 'github') {
      // GitHub OAuth flow - redirect to worker endpoint which handles the GitHub OAuth
      window.location.href = '/api/auth/github';
    } else if (provider === 'google') {
      // Google OAuth flow - redirect to worker endpoint which handles the Google OAuth
      window.location.href = '/api/auth/google';
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
                disabled={loading}
                className="w-full bg-teal-600 text-white py-3 px-4 rounded hover:bg-teal-700 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AuthSimple;