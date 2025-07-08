import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Portfolio from '../components/Portfolio';
import About from '../components/About';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const Home = () => {
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
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Home;