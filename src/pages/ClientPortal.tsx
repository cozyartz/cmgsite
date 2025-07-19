import React from 'react';
import { useAuth } from '../contexts/SupabaseAuthContext';
import SuperAdminNavigation from '../components/SuperAdminNavigation';

const ClientPortal: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  const isSuperAdmin = user?.user_metadata?.role === 'superadmin';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Conditional SuperAdmin Navigation */}
      {isSuperAdmin && <SuperAdminNavigation />}
      
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Client Portal</h1>
              <p className="text-sm text-gray-600">Basic client access and tools</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.user_metadata?.full_name || user?.email}</p>
                <p className="text-xs text-gray-500">Client Access</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Your Client Portal</h2>
            <p className="text-gray-600">This is your secure client dashboard.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientPortal;