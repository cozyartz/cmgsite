import React, { useState } from 'react';
import { Check, Tag, Calendar, DollarSign, ArrowRight, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { apiService } from '../lib/api';

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

interface CouponInfo {
  code: string;
  discount_amount_cents: number;
  discount_type: string;
  description: string;
  valid: boolean;
}

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<string>('professional');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [couponCode, setCouponCode] = useState('');
  const [couponInfo, setCouponInfo] = useState<CouponInfo | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

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
      price: billingCycle === 'monthly' ? 2900 : 2784, // $29/$27.84 (4% yearly discount)
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
      id: 'growth',
      name: 'Growth',
      price: billingCycle === 'monthly' ? 9900 : 9504, // $99/$95.04 (4% yearly discount)
      aiCalls: 500,
      domainLimit: 10,
      features: [
        'Everything in Starter',
        'Advanced SEO tools',
        'Bi-weekly reporting',
        'Priority support',
        '500 AI-powered insights/month',
        'Up to 10 domains',
        'Competitor analysis',
        'API access'
      ],
      popular: true,
      recommended: true
    },
    {
      id: 'professional',
      name: 'Professional',
      price: billingCycle === 'monthly' ? 19900 : 19104, // $199/$191.04 (4% yearly discount)
      aiCalls: 1000,
      domainLimit: 25,
      features: [
        'Everything in Growth',
        'Professional SEO suite',
        'Weekly reporting',
        'Priority support',
        '1000 AI-powered insights/month',
        'Up to 25 domains',
        'Advanced analytics',
        'White-label reporting'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: billingCycle === 'monthly' ? 29900 : 28704, // $299/$287.04 (4% yearly discount)
      aiCalls: -1, // Unlimited
      domainLimit: -1, // Unlimited
      features: [
        'Complete SEO platform',
        'Weekly strategy reports',
        'Dedicated account manager',
        'Unlimited AI-powered insights',
        'Unlimited domains',
        'Custom keyword tracking',
        'Advanced competitor intelligence',
        'Full technical SEO suite',
        'AI-driven content strategy',
        'White-label reporting',
        'API access',
        'Custom integrations'
      ]
    }
  ];

  const validateCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsValidatingCoupon(true);
    setCouponError('');

    try {
      const response = await apiService.post('/api/coupons/validate', { 
        code: couponCode.trim() 
      });

      if (response.data?.valid) {
        setCouponInfo({
          code: response.data.coupon.code,
          discount_amount_cents: response.data.coupon.discount_amount_cents,
          discount_type: response.data.coupon.discount_type,
          description: response.data.coupon.description,
          valid: true
        });
        setCouponError('');
      } else {
        setCouponError(response.error || 'Invalid coupon code');
        setCouponInfo(null);
      }
    } catch (error) {
      setCouponError('Failed to validate coupon');
      setCouponInfo(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const calculateCouponDiscount = (tierPrice: number) => {
    if (!couponInfo) return 0;
    
    if (couponInfo.discount_type === 'percentage') {
      const percentage = couponInfo.discount_amount_cents;
      return Math.round(tierPrice * (percentage / 100));
    } else {
      return couponInfo.discount_amount_cents;
    }
  };

  const handleGetStarted = (planId: string) => {
    const params = new URLSearchParams({
      tier: planId,
      billing: billingCycle,
      ...(couponInfo ? { coupon: couponInfo.code } : {})
    });
    navigate(`/checkout?${params.toString()}`);
  };


  const handleContactSales = () => {
    navigate('/book-consultation');
  };


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

            {/* Coupon Input */}
            <div className="max-w-md mx-auto mb-8">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter coupon code (optional)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && validateCoupon()}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
                <button
                  onClick={validateCoupon}
                  disabled={isValidatingCoupon || !couponCode.trim()}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isValidatingCoupon ? 'Checking...' : 'Apply'}
                </button>
              </div>
              
              {couponError && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">❌ {couponError}</p>
                </div>
              )}
              
              {couponInfo && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm font-medium">
                    ✅ Coupon applied: {couponInfo.discount_type === 'percentage' 
                      ? `${couponInfo.discount_amount_cents}% off` 
                      : `${formatCurrency(couponInfo.discount_amount_cents)} off per month`}
                  </p>
                  <p className="text-green-600 text-xs mt-1">{couponInfo.description}</p>
                </div>
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
              const couponDiscount = calculateCouponDiscount(tier.price);
              const monthlyPrice = Math.max(0, tier.price - couponDiscount);

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
                      {couponInfo && couponDiscount > 0 && (
                        <span className="text-lg text-gray-500 line-through mr-2">
                          {formatCurrency(tier.price)}
                        </span>
                      )}
                      <span className="text-4xl font-bold text-gray-900">
                        {formatCurrency(monthlyPrice)}
                      </span>
                      <span className="text-gray-500 ml-2">/month</span>
                    </div>
                    {couponInfo && couponDiscount > 0 && (
                      <div className="flex items-center gap-2 mt-1">
                        <Tag className="w-3 h-3 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">
                          Save {formatCurrency(couponDiscount)}/month
                        </span>
                      </div>
                    )}
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