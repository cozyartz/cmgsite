import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { useAuth } from '../contexts/SupabaseAuthContext';
import CustomerMaxAI from '../components/customer/CustomerMaxAI';
import GoogleAnalyticsCard from '../components/dashboard/GoogleAnalyticsCard';
import SearchConsoleCard from '../components/dashboard/SearchConsoleCard';
import MyBusinessCard from '../components/dashboard/MyBusinessCard';
import PageSpeedCard from '../components/dashboard/PageSpeedCard';
import DomainDashboard from '../components/domains/DomainDashboard';
import DomainSearch from '../components/domains/DomainSearch';
import DomainConsultationBooking from '../components/booking/DomainConsultationBooking';

const ClientPortalSimple: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isSuperAdmin, loading, signOut: logout } = useAuth();

  useEffect(() => {
    if (loading) return;
    
    // Check if user is authenticated via Supabase
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Debug: Log user data to understand what's happening
    console.log('ClientPortalSimple - User data:', {
      email: user.email,
      provider: user.app_metadata?.provider,
      github_username: user.user_metadata?.user_name,
      isAdmin,
      isSuperAdmin
    });
    
    // Use role utils for consistent routing
    const { getDashboardRoute, isSuperAdmin: checkSuperAdmin, isAdmin: checkAdmin } = require('../utils/roleUtils');
    
    // Check roles using utility functions
    const userIsSuperAdmin = checkSuperAdmin(user);
    const userIsAdmin = checkAdmin(user);
    
    if (userIsSuperAdmin) {
      console.log('🔴 User is SuperAdmin, routing to superadmin dashboard');
      navigate('/superadmin', { replace: true });
      return;
    }
    
    if (userIsAdmin) {
      console.log('🟡 User is Admin, routing to admin dashboard');
      navigate('/admin', { replace: true });
      return;
    }
    
    // User is regular client, stay on client portal
    console.log('🟢 User is regular client, staying on client portal');
  }, [navigate, user, isAdmin, isSuperAdmin, loading]);

  // Token verification is handled by Supabase auth context

  const getUserEmail = () => {
    return user?.email || 'guest@cozyartzmedia.com';
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/auth');
    }
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

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to your Dashboard</h2>
          <p className="text-slate-300">Monitor your website performance and digital presence</p>
        </div>
        
        {/* Google Services Dashboard */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Performance Analytics</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <GoogleAnalyticsCard className="lg:col-span-1" />
            <SearchConsoleCard className="lg:col-span-1" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <MyBusinessCard className="lg:col-span-1" />
            <PageSpeedCard className="lg:col-span-1" />
          </div>
        </div>
        
        {/* Domain Services */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Domain Services</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Book Domain Consultation</h4>
              <p className="text-gray-600 mb-4">Get expert advice on domain strategy, registration, and management.</p>
              <a
                href="/book-consultation"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Consultation ($50)
              </a>
            </div>
            <DomainSearch />
          </div>
          <DomainDashboard clientId={user?.id} />
        </div>

        {/* AI Assistant */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">AI Assistant</h3>
          <CustomerMaxAI 
            userPlan="starter" 
            userId={user?.id}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientPortalSimple;