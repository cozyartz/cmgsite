import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import ClientPortal from './pages/ClientPortal';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import Pricing from './pages/Pricing';
import Checkout from './pages/Checkout';
import SEOServices from './pages/SEOServices';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import TermsOfService from './pages/TermsOfService';
import DataSubjectRequest from './pages/DataSubjectRequest';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/SupabaseAuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import AIAssistant from './components/support/AIAssistant';

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
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/seo-services" element={<SEOServices />} />
            
            {/* Legal Pages */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/data-subject-request" element={<DataSubjectRequest />} />
            
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
            
            {/* 404 Not Found - Catch all unmatched routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Global AI Assistant - Available on all pages for lead capture */}
          <ErrorBoundary>
            <AIAssistant 
              context="sales" 
              enableLeadCapture={true}
            />
          </ErrorBoundary>
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;