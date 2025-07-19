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
  if (!user || !profile) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check access permissions using utility functions
  if (requireSuperAdmin && !isSuperAdmin(user, profile)) {
    console.log(`Access denied to ${location.pathname} - requires superadmin, user role: ${profile.role}`);
    return <Navigate to="/client-portal" replace />;
  }

  if (requireAdmin && !isAdmin(user, profile)) {
    console.log(`Access denied to ${location.pathname} - requires admin, user role: ${profile.role}`);
    return <Navigate to="/client-portal" replace />;
  }

  // Log successful access
  console.log(`Access granted to ${location.pathname} for user: ${user.email}, role: ${profile.role}`);

  return <>{children}</>;
};

export default ProtectedRoute;