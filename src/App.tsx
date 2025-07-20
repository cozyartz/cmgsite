import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import ClientPortal from './pages/ClientPortal';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import Pricing from './pages/Pricing';
import SEOServices from './pages/SEOServices';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/SupabaseAuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import ClientMaxAI from './components/client/ClientMaxAI';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/callback" element={<AuthPage />} />
            
            {/* Public Pages */}
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/seo-services" element={<SEOServices />} />
            
            {/* Protected Routes */}
            <Route 
              path="/client-portal" 
              element={
                <ProtectedRoute>
                  <ClientPortal />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Dashboard for Clients */}
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
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
          
          {/* Global AI Assistant - Available on authenticated pages only */}
          <ErrorBoundary>
            <ClientMaxAI />
          </ErrorBoundary>
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;