import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PricingWithCoupons from '../components/PricingWithCoupons';
import SEO from '../components/SEO';

const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <SEO
        title="Pricing Plans | Enterprise SEO & AI Services | Cozyartz Media Group"
        description="Professional SEO and AI-powered services starting at $1,000/month. Choose from Starter, Growth, and Enterprise plans with advanced features, dedicated support, and custom integrations."
        keywords="SEO pricing, AI services pricing, enterprise SEO, professional SEO plans, monthly SEO services, business SEO packages"
        ogImage="https://cozyartzmedia.com/pricing-og.jpg"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "SEO & AI Services",
          "description": "Professional SEO and AI-powered services for businesses",
          "offers": [
            {
              "@type": "Offer",
              "name": "Starter Plan",
              "price": "1000",
              "priceCurrency": "USD",
              "priceValidUntil": "2024-12-31",
              "availability": "https://schema.org/InStock"
            },
            {
              "@type": "Offer", 
              "name": "Growth Plan",
              "price": "1500",
              "priceCurrency": "USD",
              "priceValidUntil": "2024-12-31",
              "availability": "https://schema.org/InStock"
            },
            {
              "@type": "Offer",
              "name": "Enterprise Plan", 
              "price": "2500",
              "priceCurrency": "USD",
              "priceValidUntil": "2024-12-31",
              "availability": "https://schema.org/InStock"
            }
          ]
        }}
      />
      <Header />
      <main className="pt-20">
        <PricingWithCoupons />
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;