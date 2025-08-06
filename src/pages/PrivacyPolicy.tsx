import React from 'react';
import SEO from '../components/SEO';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PrivacyPolicyContent from '../components/legal/PrivacyPolicyContent';

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <SEO
        title="Privacy Policy - Cozyartz Media Group | GDPR & CCPA Compliant"
        description="Comprehensive privacy policy covering AI data processing, GDPR/CCPA compliance, cookie usage, and your privacy rights. Updated for EU AI Act 2025."
        keywords="privacy policy, GDPR compliance, CCPA, AI data processing, cookie policy, data protection, EU AI Act 2025"
        canonical="https://cozyartzmedia.com/privacy-policy"
      />
      
      <Header />
      
      <main className="min-h-screen bg-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <PrivacyPolicyContent />
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default PrivacyPolicy;