import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AuthLanding from '../components/auth/AuthLanding';
import SEO from '../components/SEO';
import ErrorBoundary from '../components/ErrorBoundary';

const Auth: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/client-portal');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500 mx-auto"></div>
          <p className="text-white mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="SEO Client Portal - Sign In or Start Free Trial"
        description="Access your AI-powered SEO dashboard or start your free trial. Join 500+ businesses growing with our enterprise-grade SEO platform."
        keywords="SEO client portal, AI SEO platform, enterprise SEO, partnership development, organic growth, SEO dashboard"
        canonical="https://cozyartzmedia.com/auth"
      />
      
      <ErrorBoundary>
        <AuthLanding />
      </ErrorBoundary>
    </>
  );
};

export default Auth;