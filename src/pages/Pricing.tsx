import React, { useState } from 'react';
import { Check, Tag, Calendar, DollarSign, ArrowRight, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  aiCalls: number;
  domainLimit: number;
  features: string[];
  popular?: boolean;
  discount?: number;
  recommended?: boolean;
}

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<string>('growth');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const formatCurrency = (amountInCents: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amountInCents / 100);
  };

  const tiers: PricingPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: billingCycle === 'monthly' ? 99900 : 95900, // $999/$959
      aiCalls: 100,
      domainLimit: 3,
      features: [
        'Basic SEO audit tools',
        'Monthly performance reports',
        'Email support',
        '100 AI-powered insights/month',
        'Up to 3 domains',
        'Core keyword tracking',
        'Basic competitor analysis'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      price: billingCycle === 'monthly' ? 149900 : 143900, // $1499/$1439
      aiCalls: 250,
      domainLimit: 10,
      features: [
        'Advanced SEO suite',
        'Bi-weekly reports & insights',
        'Priority email + chat support',
        '250 AI-powered insights/month',
        'Up to 10 domains',
        'Advanced keyword tracking',
        'Competitor gap analysis',
        'Technical SEO monitoring',
        'Content optimization suggestions'
      ],
      popular: true,
      recommended: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: billingCycle === 'monthly' ? 249900 : 239900, // $2499/$2399
      aiCalls: 500,
      domainLimit: 25,
      features: [
        'Complete SEO platform',
        'Weekly strategy reports',
        'Dedicated account manager',
        '500 AI-powered insights/month',
        'Up to 25 domains',
        'Custom keyword tracking',
        'Advanced competitor intelligence',
        'Full technical SEO suite',
        'AI-driven content strategy',
        'White-label reporting',
        'API access',
        'Custom integrations'
      ],
      discount: 15
    }
  ];

  const handleGetStarted = (planId: string) => {
    // Navigate to auth page with plan selection
    navigate(`/auth?plan=${planId}&billing=${billingCycle}`);
  };

  const handleContactSales = () => {
    navigate('/book-consultation');
  };

  const selectedPlan = tiers.find(tier => tier.id === selectedTier);

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="SEO & AI Services Pricing | Professional Plans | Cozyartz Media Group"
        description="Professional SEO and AI-powered services starting at $999/month. Choose from Starter, Professional, and Enterprise plans with advanced features, dedicated support, and custom integrations."
        keywords="SEO pricing, AI services pricing, enterprise SEO, professional SEO plans, monthly SEO services, business SEO packages"
        ogImage="https://cozyartzmedia.com/pricing-og.jpg"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "SEO & AI Services",
          "description": "Professional SEO and AI-powered services for businesses",
          "offers": tiers.map(tier => ({
            "@type": "Offer",
            "name": tier.name + " Plan",
            "price": (tier.price / 100).toString(),
            "priceCurrency": "USD",
            "priceValidUntil": "2025-12-31",
            "availability": "https://schema.org/InStock"
          }))
        }}
      />
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Professional SEO & AI Services
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Choose the perfect plan for your business. All plans include our AI-powered SEO insights, 
              professional reporting, and expert support. No long-term contracts required.
            </p>

            {/* Billing Toggle */}
            <div className="flex justify-center items-center gap-4 mb-8">
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  billingCycle === 'yearly' ? 'bg-teal-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Yearly
              </span>
              {billingCycle === 'yearly' && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Save 4%
                </span>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="flex justify-center items-center gap-8 text-sm text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span>No Long-term Contracts</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <span>AI-Powered Insights</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600" />
                <span>Expert Support</span>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tiers.map((tier) => {
              const isSelected = selectedTier === tier.id;
              const monthlyPrice = tier.price;
              const yearlyDiscount = billingCycle === 'yearly' ? '4% off yearly' : '';

              return (
                <div
                  key={tier.id}
                  className={`relative rounded-2xl border-2 p-8 transition-all cursor-pointer hover:shadow-xl ${
                    tier.recommended
                      ? 'border-teal-500 shadow-xl scale-105 bg-gradient-to-b from-teal-50 to-white'
                      : isSelected
                      ? 'border-teal-300 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTier(tier.id)}
                >
                  {tier.recommended && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                        🚀 Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatCurrency(monthlyPrice)}
                      </span>
                      <span className="text-gray-500 ml-2">/month</span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <p className="text-sm text-green-600 mt-1">
                        {formatCurrency(monthlyPrice * 12)} billed annually
                      </p>
                    )}
                  </div>

                  {/* Key Stats */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Zap className="w-4 h-4 text-blue-500" />
                      <span>{tier.aiCalls} AI insights/month</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span>Up to {tier.domainLimit} domains</span>
                    </div>
                    {tier.discount && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Tag className="w-4 h-4" />
                        <span>{tier.discount}% off consultations</span>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGetStarted(tier.id);
                    }}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                      tier.recommended
                        ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 shadow-lg'
                        : isSelected
                        ? 'bg-teal-600 text-white hover:bg-teal-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-xs text-center text-gray-500 mt-3">
                    No setup fees • Cancel anytime
                  </p>
                </div>
              );
            })}
          </div>

          {/* Enterprise CTA */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Need a Custom Solution?
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Large enterprise or agency? We offer custom plans with volume discounts, 
                white-label options, and dedicated account management.
              </p>
              <button
                onClick={handleContactSales}
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Contact Sales
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Frequently Asked Questions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h4>
                <p className="text-gray-600 text-sm">Yes! You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">What are AI insights?</h4>
                <p className="text-gray-600 text-sm">Our AI analyzes your website and provides actionable SEO recommendations, content suggestions, and competitive insights.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Is there a setup fee?</h4>
                <p className="text-gray-600 text-sm">No setup fees! We'll have your account ready within 24 hours of signup with no additional charges.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">What support is included?</h4>
                <p className="text-gray-600 text-sm">All plans include email support. Professional and Enterprise plans include priority support and dedicated account management.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;