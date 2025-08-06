import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthDebugComponent: React.FC = () => {
  const { user, profile, loading, isAdmin, isSuperAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Auth Debug Information</h1>
      
      <div className="space-y-4">
        <div>
          <strong>Loading:</strong> {loading ? 'true' : 'false'}
        </div>
        
        <div>
          <strong>User:</strong> {user ? `${user.email} (${user.id})` : 'null'}
        </div>
        
        <div>
          <strong>Profile:</strong> {profile ? `${profile.email} - Role: ${profile.role}` : 'null'}
        </div>
        
        <div>
          <strong>Is Admin:</strong> {isAdmin ? 'true' : 'false'}
        </div>
        
        <div>
          <strong>Is Super Admin:</strong> {isSuperAdmin ? 'true' : 'false'}
        </div>
        
        <div>
          <strong>Current URL:</strong> {window.location.href}
        </div>
        
        <div>
          <strong>Supabase Session:</strong>
          <button 
            onClick={async () => {
              const { supabase } = await import('../lib/supabase');
              const { data } = await supabase.auth.getSession();
              console.log('Current session:', data.session);
              alert(`Session: ${data.session ? 'Active' : 'None'}`);
            }}
            className="ml-2 bg-blue-600 px-3 py-1 rounded text-sm"
          >
            Check Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthDebugComponent;
