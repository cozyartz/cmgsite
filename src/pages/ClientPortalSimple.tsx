import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ClientPortalSimple: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has auth token and verify it
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/auth');
      return;
    }
    
    // Verify token with backend
    verifyToken(token);
  }, [navigate]);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Token invalid');
      }
      
      const userData = await response.json();
      // Update user data if needed
      localStorage.setItem('user_data', JSON.stringify(userData.user));
      
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      navigate('/auth');
    }
  };

  const getUserEmail = () => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.email;
      } catch (e) {
        return 'test@cozyartzmedia.com';
      }
    }
    return 'test@cozyartzmedia.com';
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="bg-slate-800 shadow-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-white">Client Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-300">{getUserEmail()}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">S</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-slate-300 truncate">
                        Subscription Plan
                      </dt>
                      <dd className="text-lg font-medium text-white">
                        Starter
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">100</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-slate-300 truncate">
                        AI Calls Remaining
                      </dt>
                      <dd className="text-lg font-medium text-white">
                        100 / 100
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">✓</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-slate-300 truncate">
                        Account Status
                      </dt>
                      <dd className="text-lg font-medium text-white">
                        Active
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="bg-slate-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-white">
                  Welcome to Your Client Portal
                </h3>
                <div className="mt-2 max-w-xl text-sm text-slate-300">
                  <p>
                    Your login is working successfully! This is a simplified view of your client portal.
                  </p>
                </div>
                <div className="mt-5">
                  <div className="rounded-md bg-teal-600 px-4 py-3">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-white">
                          Login Test Successful
                        </h3>
                        <div className="mt-2 text-sm text-teal-100">
                          <p>
                            You have successfully logged in with the test credentials.
                            Your authentication system is working properly.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPortalSimple;