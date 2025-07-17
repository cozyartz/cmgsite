import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import DashboardLayout from '../components/client/DashboardLayout';
import Overview from '../components/client/Overview';
import SEOTools from '../components/client/SEOTools';
import Analytics from '../components/client/Analytics';
import Consultations from '../components/client/Consultations';
import Billing from '../components/client/Billing';
import Settings from '../components/client/Settings';

const ClientPortal: React.FC = () => {
  const { user, client, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Debug logging
  console.log('ClientPortal render:', { user, client, loading });

  useEffect(() => {
    console.log('ClientPortal useEffect:', { user, client, loading });
    if (!loading && !user) {
      console.log('Redirecting to auth');
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500 mx-auto"></div>
          <p className="text-white mt-4">Loading your portal...</p>
        </div>
      </div>
    );
  }

  if (!user || !client) {
    console.log('ClientPortal: user or client not available, showing loading');
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500 mx-auto"></div>
          <p className="text-white mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'seo-tools':
        return <SEOTools />;
      case 'analytics':
        return <Analytics />;
      case 'consultations':
        return <Consultations />;
      case 'billing':
        return <Billing />;
      case 'settings':
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return (
    <>
      <SEO
        title="Client Portal | SEO Dashboard"
        description="Manage your SEO campaigns, track performance, and access AI-powered tools"
        keywords="SEO dashboard, client portal, analytics, AI tools"
        canonical="https://cozyartzmedia.com/client-portal"
      />
      
      <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </DashboardLayout>
    </>
  );
};

export default ClientPortal;