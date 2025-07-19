import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import InstructionalDesignServices from './pages/InstructionalDesignServices';
import DroneServices from './pages/DroneServices';
import MultimediaServices from './pages/MultimediaServices';
import WebGraphicDesignServices from './pages/WebGraphicDesignServices';
import SEOServices from './pages/SEOServices';
import AIServices from './pages/AIServices';
import Pricing from './pages/Pricing';
import AuthSimpleBackup from './pages/AuthSimpleBackup';
import SignUp from './pages/SignUp';
import AuthCallback from './pages/AuthCallback';
import AuthDebugPage from './pages/AuthDebugPage';
import AuthDebug from './components/AuthDebug';
import ClientPortalSimple from './pages/ClientPortalSimple';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import BookConsultation from './pages/BookConsultation';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import DataSubjectRequest from './pages/DataSubjectRequest';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import CookieConsent from './components/legal/CookieConsent';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/SupabaseAuthContext';

function App() {
  const location = useLocation();
  
  // Handle OAuth callback codes that might come to wrong URLs
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const hashParams = new URLSearchParams(location.hash.substring(1));
    
    // Check for OAuth callback parameters
    const code = urlParams.get('code');
    const accessToken = hashParams.get('access_token') || urlParams.get('access_token');
    const error = urlParams.get('error') || hashParams.get('error');
    
    // If we have OAuth parameters but we're not on the callback route, redirect
    if ((code || accessToken || error) && location.pathname !== '/auth/callback') {
      console.log('🔄 OAuth callback detected, redirecting to proper callback route');
      const params = new URLSearchParams();
      
      // Preserve all OAuth parameters
      urlParams.forEach((value, key) => {
        params.set(key, value);
      });
      hashParams.forEach((value, key) => {
        params.set(key, value);
      });
      
      window.location.href = `/auth/callback?${params.toString()}`;
      return;
    }
    
    // Original 404 and error handling
    const is404 = urlParams.get('404');
    const authError = urlParams.get('error');
    
    if (is404) {
      window.history.replaceState({}, '', '/404');
    }
    
    if (authError && location.pathname !== '/auth/callback') {
      window.history.replaceState({}, '', '/auth');
    }
  }, [location]);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/instructional-design-services" element={
              <Layout>
                <InstructionalDesignServices />
              </Layout>
            } />
            <Route path="/drone-services" element={
              <Layout>
                <DroneServices />
              </Layout>
            } />
            <Route path="/multimedia-services" element={
              <Layout>
                <MultimediaServices />
              </Layout>
            } />
            <Route path="/web-graphic-design-services" element={
              <Layout>
                <WebGraphicDesignServices />
              </Layout>
            } />
            <Route path="/seo-services" element={
              <Layout>
                <SEOServices />
              </Layout>
            } />
            <Route path="/ai-services" element={
              <Layout>
                <AIServices />
              </Layout>
            } />
            <Route path="/pricing" element={<Pricing />} />
          
          {/* Authentication Routes */}
          <Route path="/auth" element={<AuthSimpleBackup />} />
          <Route path="/auth/*" element={<AuthSimpleBackup />} />
          <Route path="/auth-debug" element={<AuthDebug />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/auth/debug" element={<AuthDebugPage />} />
          
          {/* Protected Routes - Regular Users */}
          <Route path="/client-portal" element={
            <ProtectedRoute>
              <ClientPortalSimple />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <ClientPortalSimple />
            </ProtectedRoute>
          } />
          
          {/* Protected Routes - Admin Only */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* Protected Routes - Super Admin Only (that's you!) */}
          <Route path="/superadmin" element={
            <ProtectedRoute requireSuperAdmin={true}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* Public Routes */}
          <Route path="/book-consultation" element={<BookConsultation />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/data-subject-request" element={<DataSubjectRequest />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
          <CookieConsent />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;