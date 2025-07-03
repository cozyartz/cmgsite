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
        title="Creative Web Design & Multimedia Solutions"
        description="Cozyartz Media Group delivers innovative web design, instructional design, and multimedia production services. We combine creativity with data-driven strategies to amplify your business growth since 2016."
        keywords="web design, graphic design, instructional design, video production, aerial photography, multimedia services, creative agency, e-learning development, drone cinematography, corporate training, professional services"
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
        businessType="ProfessionalService"
        ogImage="/cmgLogo.png"
        services={[
          "Web Design & Development",
          "Graphic Design",
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