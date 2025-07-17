import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthSimple: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOAuthLogin = (provider: 'github' | 'google') => {
    setLoading(true);
    // Redirect to OAuth provider
    window.location.href = `https://cmgsite-client-portal.cozyartz-media-group.workers.dev/api/auth/${provider}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Test login
    if (formData.email === 'test@cozyartzmedia.com' && formData.password === 'TestPass123@') {
      // Mock successful login
      localStorage.setItem('auth_token', 'mock-jwt-token-' + Date.now());
      // Use window.location to ensure we stay on the current domain
      window.location.href = '/client-portal';
      return;
    } else {
      setError('Invalid credentials. Use test@cozyartzmedia.com / TestPass123@');
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
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AuthSimple;