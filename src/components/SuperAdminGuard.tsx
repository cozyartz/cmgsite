import React, { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertTriangle, Shield, Home } from 'lucide-react';

interface SuperAdminGuardProps {
  children: ReactNode;
}

/**
 * SuperAdmin Route Guard - Restricts access to authorized users only
 * Only allows access to:
 * - cozy2963@gmail.com (Cozyartz Media Group Owner)
 * - andrea@cozyartzmedia.com (Amy)
 * - GitHub: cozyartz
 */
const SuperAdminGuard: React.FC<SuperAdminGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user, loading, isSuperAdmin } = useAuth();

  // Hardcoded authorized users for maximum security
  const AUTHORIZED_EMAILS = [
    'cozy2963@gmail.com',
    'andrea@cozyartzmedia.com'
  ];

  const AUTHORIZED_GITHUB_USERNAMES = [
    'cozyartz'
  ];

  const isAuthorizedUser = (user: any): boolean => {
    if (!user) return false;

    const email = user.email?.toLowerCase();
    const githubUsername = user.user_metadata?.user_name?.toLowerCase();
    
    // Check email authorization
    if (email && AUTHORIZED_EMAILS.includes(email)) {
      return true;
    }

    // Check GitHub username authorization
    if (githubUsername && AUTHORIZED_GITHUB_USERNAMES.includes(githubUsername)) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    // Redirect unauthorized users after loading is complete
    if (!loading && (!user || !isAuthorizedUser(user))) {
      console.warn('🚫 Unauthorized access attempt to SuperAdmin dashboard:', {
        email: user?.email,
        github: user?.user_metadata?.user_name,
        timestamp: new Date().toISOString()
      });
      
      // Redirect to home page after a brief delay to show the warning
      const timeoutId = setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [user, loading, navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Verifying authorization...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized access warning
  if (!user || !isAuthorizedUser(user)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-900/20 border border-red-500/30 rounded-xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-red-500/20 rounded-full">
              <AlertTriangle className="w-12 h-12 text-red-400" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h1>
          
          <div className="space-y-4 text-red-200 mb-6">
            <p className="text-lg">This area is restricted to authorized Cozyartz Media Group personnel only.</p>
            
            <div className="bg-red-900/30 rounded-lg p-4 text-sm">
              <div className="flex items-center justify-center mb-2">
                <Shield className="w-4 h-4 mr-2" />
                <span className="font-semibold">Security Notice</span>
              </div>
              <p>This access attempt has been logged for security purposes.</p>
            </div>
            
            {user && (
              <div className="text-xs text-red-300 bg-red-900/20 rounded-lg p-3">
                <p><strong>Current User:</strong> {user.email}</p>
                <p><strong>Provider:</strong> {user.app_metadata?.provider}</p>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-red-300">You will be redirected to the home page in a few seconds.</p>
            
            <button
              onClick={() => navigate('/', { replace: true })}
              className="w-full flex items-center justify-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Return to Home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show success indicator for authorized users
  if (isAuthorizedUser(user)) {
    return (
      <div>
        {/* Security indicator for authorized access */}
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <Shield className="w-4 h-4" />
          <span className="text-sm font-medium">Authorized Access</span>
        </div>
        
        {children}
      </div>
    );
  }

  // Fallback - should never reach here
  return null;
};

export default SuperAdminGuard;