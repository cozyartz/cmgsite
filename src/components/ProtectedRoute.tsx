import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { isSuperAdmin, isAdmin, hasRouteAccess } from '../utils/roleUtils';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false, 
  requireSuperAdmin = false 
}) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If profile is still loading, show loading state instead of blocking access
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Check access permissions using utility functions
  const userIsSuperAdmin = isSuperAdmin(user, profile);
  const userIsAdmin = isAdmin(user, profile);
  
  console.log(`🔐 ProtectedRoute check for ${location.pathname}:`, {
    userEmail: user.email,
    userIsSuperAdmin,
    userIsAdmin,
    requireSuperAdmin,
    requireAdmin,
    profileRole: profile?.role
  });
  
  if (requireSuperAdmin && !userIsSuperAdmin) {
    console.log(`❌ Access denied to ${location.pathname} - requires superadmin, user is not superadmin`);
    return <Navigate to="/client-portal" replace />;
  }

  if (requireAdmin && !userIsAdmin) {
    console.log(`❌ Access denied to ${location.pathname} - requires admin, user is not admin`);
    return <Navigate to="/client-portal" replace />;
  }

  // Log successful access
  console.log(`✅ Access granted to ${location.pathname} for user: ${user.email}`);

  return <>{children}</>;
};

export default ProtectedRoute;