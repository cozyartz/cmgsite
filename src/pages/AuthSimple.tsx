import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthSimple: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
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
    
    // If there's a token, let AuthContext handle it and redirect to client portal
    // The AuthContext will determine the proper routing (superadmin vs regular user)
    if (token) {
      // Small delay to let AuthContext process the token
      setTimeout(() => {
        navigate('/client-portal');
      }, 100);
    }
  }, [location, navigate]);

  // OAuth login handlers
  const handleOAuthLogin = (provider: 'github' | 'google') => {
    setLoading(true);
    setError('');
    
    // Redirect to OAuth provider via worker domain
    window.location.href = `https://cmgsite-client-portal.cozyartz-media-group.workers.dev/api/auth/${provider}`;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login('email', {
        email: formData.email,
        password: formData.password,
      });
      
      // Navigate to client portal after successful login
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