import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import InstructionalDesignServices from './pages/InstructionalDesignServices';
import DroneServices from './pages/DroneServices';
import MultimediaServices from './pages/MultimediaServices';
import WebGraphicDesignServices from './pages/WebGraphicDesignServices';
import SEOServices from './pages/SEOServices';
import AIServices from './pages/AIServices';
import Auth from './pages/Auth';
import ClientPortal from './pages/ClientPortal';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import DataSubjectRequest from './pages/DataSubjectRequest';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieConsent from './components/legal/CookieConsent';
import { AuthProvider } from './contexts/AuthContext';

function App() {
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
          <Route path="/auth" element={<Auth />} />
          <Route path="/client-portal" element={<ClientPortal />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/data-subject-request" element={<DataSubjectRequest />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CookieConsent />
      </div>
    </AuthProvider>
  );
}

export default App;