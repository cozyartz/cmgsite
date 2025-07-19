import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import ClientPortal from './pages/ClientPortal';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/callback" element={<AuthPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/client-portal" 
            element={
              <ProtectedRoute>
                <ClientPortal />
              </ProtectedRoute>
            } 
          />
          
          {/* Superadmin Only Routes */}
          <Route 
            path="/superadmin" 
            element={
              <ProtectedRoute requireSuperAdmin={true}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;