import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/SupabaseAuthContext';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Portfolio from '../components/Portfolio';
import About from '../components/About';
import PricingPreview from '../components/PricingPreview';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  // Handle OAuth callback codes that land on home page
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    
    // If we have OAuth parameters, redirect to auth callback
    if (code || error) {
      console.log('🔄 OAuth callback detected on home page, redirecting...');
      window.location.href = `/auth/callback${location.search}`;
      return;
    }
  }, [location]);

  // If user is authenticated, redirect to dashboard ONLY from home page
  useEffect(() => {
    if (!loading && user && location.pathname === '/') {
      console.log('🎯 User is logged in, redirecting from home page:', user.email);
      
      // Determine dashboard route based on superadmin status
      let dashboardPath = '/client-portal';
      if (user.email === 'cozy2963@gmail.com' || user.email === 'andrea@cozyartzmedia.com') {
        dashboardPath = '/superadmin';
      }
      
      console.log('🔄 Redirecting to:', dashboardPath);
      navigate(dashboardPath, { replace: true });
    }
  }, [user, loading, location.pathname, navigate]);
  return (
    <div className="min-h-screen">
      <SEO
        title="Cozyartz Media Group | Creative Web Design & AI-Powered Digital Solutions"
        description="Transform your business with our comprehensive creative services: AI automation, web design, instructional design, and multimedia production. Serving Fortune 500 companies since 2016 in Battle Creek, Michigan."
        keywords="web design, AI services, business automation, instructional design, video production, aerial photography, multimedia services, creative agency, e-learning development, drone cinematography, corporate training, professional services, Google certified SEO, Amy Cozart-Lundin"
        businessName="Cozyartz Media Group"
        phone="+1 (269) 261-0069"
        email="hello@cozyartzmedia.com"
        address={{
          city: "Battle Creek",
          state: "MI",
          zip: "49015",
          country: "US"
        }}
        geo={{
          latitude: 42.3211,
          longitude: -85.1797
        }}
        canonical="https://cozyartzmedia.com"
        ogUrl="https://cozyartzmedia.com"
        businessType="ProfessionalService"
        ogTitle="Cozyartz Media Group | AI-Powered Creative Solutions Since 2016"
        ogDescription="Expert web design, AI automation, and multimedia production services. Trusted by Fortune 500 companies. Google certified team with 10+ years experience."
        ogImage="https://cozyartzmedia.com/og-image.jpg"
        twitterImage="https://cozyartzmedia.com/twitter-image.jpg"
        services={[
          "AI Business Automation",
          "Web Design & Development",
          "SEO Services",
          "Instructional Design",
          "Video Production",
          "Aerial Photography",
          "Multimedia Production",
          "E-Learning Development",
          "Corporate Training",
          "Drone Cinematography"
        ]}
        foundingDate="2016"
      />
      <Header />
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <About />
        <PricingPreview />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Home;