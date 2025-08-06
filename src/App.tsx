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
import BookConsultation from './pages/BookConsultation';
import BookConsultationTest from './pages/BookConsultationTest';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import CookieConsentBanner from './components/legal/CookieConsentBanner';
import PrivacySettings from './components/legal/PrivacySettings';
import EnhancedAIAssistant from './components/support/EnhancedAIAssistant';

function App() {
  const [showPrivacySettings, setShowPrivacySettings] = React.useState(false);
  const [consentPreferences, setConsentPreferences] = React.useState({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  });

  return (
    <ErrorBoundary>
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
            <Route path="/book-consultation" element={<BookConsultation />} />
            <Route path="/book-consultation-test" element={<BookConsultationTest />} />
            
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
            
            {/* Enhanced Global AI Assistant - Available on all pages for lead capture */}
            <ErrorBoundary>
              <EnhancedAIAssistant 
                context="sales" 
                enableLeadCapture={true}
                position="bottom-right"
              />
            </ErrorBoundary>

            {/* 🔒 GDPR/CCPA Cookie Consent Banner */}
            <CookieConsentBanner 
              onConsentChange={setConsentPreferences}
            />

            {/* Privacy Settings Modal */}
            <PrivacySettings 
              isOpen={showPrivacySettings}
              onClose={() => setShowPrivacySettings(false)}
            />

            {/* Floating Privacy Settings Button */}
            <button
              onClick={() => setShowPrivacySettings(true)}
              className="fixed bottom-4 left-4 w-12 h-12 bg-gray-800 hover:bg-gray-900 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105 z-40 flex items-center justify-center"
              title="Privacy Settings"
              aria-label="Open privacy settings"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
              </svg>
            </button>
          </div>
        </AuthProvider>
      </ErrorBoundary>
    </ErrorBoundary>
  );
}

export default App;