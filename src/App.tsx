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
import AuthSupabaseTurnstile from './pages/AuthSupabaseTurnstile';
import SignUp from './pages/SignUp';
import AuthCallback from './pages/AuthCallback';
import AuthDebugPage from './pages/AuthDebugPage';
import ClientPortalSimple from './pages/ClientPortalSimple';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import BookConsultation from './pages/BookConsultation';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import DataSubjectRequest from './pages/DataSubjectRequest';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieConsent from './components/legal/CookieConsent';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/SupabaseAuthContext';

function App() {
  const location = useLocation();
  
  // Check if we're being redirected from a 404 page or OAuth error
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const is404 = urlParams.get('404');
    const authError = urlParams.get('error');
    
    if (is404) {
      // Clean up the URL and show 404
      window.history.replaceState({}, '', '/404');
    }
    
    if (authError) {
      // Clean up OAuth error from URL and redirect to auth page
      window.history.replaceState({}, '', '/auth');
    }
  }, [location]);

  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/instructional-design-services" element={
            <>
              <Header />
              <InstructionalDesignServices />
              <Footer />
            </>
          } />
          <Route path="/drone-services" element={
            <>
              <Header />
              <DroneServices />
              <Footer />
            </>
          } />
          <Route path="/multimedia-services" element={
            <>
              <Header />
              <MultimediaServices />
              <Footer />
            </>
          } />
          <Route path="/web-graphic-design-services" element={
            <>
              <Header />
              <WebGraphicDesignServices />
              <Footer />
            </>
          } />
          <Route path="/seo-services" element={
            <>
              <Header />
              <SEOServices />
              <Footer />
            </>
          } />
          <Route path="/ai-services" element={
            <>
              <Header />
              <AIServices />
              <Footer />
            </>
          } />
          <Route path="/pricing" element={<Pricing />} />
          
          {/* Authentication Routes */}
          <Route path="/auth" element={<AuthSupabaseTurnstile />} />
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
  );
}

export default App;