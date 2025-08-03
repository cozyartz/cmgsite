import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Check, 
  ArrowLeft, 
  Shield, 
  Lock, 
  CreditCard, 
  Zap, 
  Star,
  Tag,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../contexts/SupabaseAuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import PayPalPayment from '../components/payment/PayPalPayment';

interface PricingTier {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  aiCalls: number;
  domainLimit: number;
  features: string[];
  popular?: boolean;
  recommended?: boolean;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [couponCode, setCouponCode] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Get parameters from URL
  useEffect(() => {
    const tier = searchParams.get('tier') || 'professional';
    const billing = searchParams.get('billing') as 'monthly' | 'yearly' || 'monthly';
    const coupon = searchParams.get('coupon') || '';
    
    setSelectedTier(tier);
    setBillingCycle(billing);
    setCouponCode(coupon);
  }, [searchParams]);

  const formatCurrency = (amountInCents: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amountInCents / 100);
  };

  const tiers: PricingTier[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: billingCycle === 'monthly' ? 2900 : 2784,
      originalPrice: billingCycle === 'yearly' ? 2900 : undefined,
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
      price: billingCycle === 'monthly' ? 9900 : 9504,
      originalPrice: billingCycle === 'yearly' ? 9900 : undefined,
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
      price: billingCycle === 'monthly' ? 19900 : 19104,
      originalPrice: billingCycle === 'yearly' ? 19900 : undefined,
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
      price: billingCycle === 'monthly' ? 29900 : 28704,
      originalPrice: billingCycle === 'yearly' ? 29900 : undefined,
      aiCalls: -1,
      domainLimit: -1,
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

  const selectedPlan = tiers.find(tier => tier.id === selectedTier);

  const handlePaymentSuccess = async (paymentResult: any) => {
    console.log('Payment successful:', paymentResult);
    setIsProcessing(false);
    navigate('/client-portal/welcome');
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment failed:', error);
    setIsProcessing(false);
    alert('Payment failed. Please try again.');
  };

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Plan Selected</h2>
          <button
            onClick={() => navigate('/pricing')}
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            ← Back to Pricing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <SEO
        title={`Checkout - ${selectedPlan.name} Plan | Cozyartz Media Group`}
        description={`Complete your ${selectedPlan.name} plan subscription with secure PayPal checkout. Professional SEO and AI services starting today.`}
        keywords="checkout, payment, SEO subscription, PayPal, secure payment"
      />
      
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Pricing */}
          <button
            onClick={() => navigate('/pricing')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pricing
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Order Summary */}
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Complete Your Order
                </h1>
                <p className="text-gray-600">
                  You're just one step away from supercharging your SEO strategy
                </p>
              </div>

              {/* Plan Details Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {selectedPlan.recommended && (
                  <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white text-center py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-medium">Most Popular Choice</span>
                    </div>
                  </div>
                )}
                
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedPlan.name}</h2>
                      <p className="text-gray-600">Perfect for your business needs</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-baseline">
                        {selectedPlan.originalPrice && (
                          <span className="text-lg text-gray-500 line-through mr-2">
                            {formatCurrency(selectedPlan.originalPrice)}
                          </span>
                        )}
                        <span className="text-3xl font-bold text-gray-900">
                          {formatCurrency(selectedPlan.price)}
                        </span>
                        <span className="text-gray-600 ml-1">/month</span>
                      </div>
                      {billingCycle === 'yearly' && (
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <Tag className="w-3 h-3 text-green-600" />
                          <span className="text-sm text-green-600 font-medium">Save 4% yearly</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Zap className="w-4 h-4 text-blue-500" />
                      <span>
                        {selectedPlan.aiCalls === -1 ? 'Unlimited' : selectedPlan.aiCalls} AI insights/month
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>
                        {selectedPlan.domainLimit === -1 ? 'Unlimited' : `Up to ${selectedPlan.domainLimit}`} domains
                      </span>
                    </div>
                  </div>

                  {/* Full Features List */}
                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">What's included:</h3>
                    <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto">
                      {selectedPlan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust & Security */}
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6 border border-blue-100">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Your purchase is protected
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Lock className="w-4 h-4 text-green-600" />
                    <span>256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>PayPal Buyer Protection</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Payment */}
            <div className="space-y-8">
              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Shield className="w-4 h-4" />
                    <span>Secure Payment</span>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                  <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{selectedPlan.name} Plan</span>
                      <span className="font-medium">{formatCurrency(selectedPlan.price)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Billing Cycle</span>
                      <span className="font-medium capitalize">{billingCycle}</span>
                    </div>
                    {billingCycle === 'yearly' && selectedPlan.originalPrice && (
                      <div className="flex justify-between items-center text-green-600">
                        <span>Yearly Discount (4%)</span>
                        <span className="font-medium">
                          -{formatCurrency(selectedPlan.originalPrice - selectedPlan.price)}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-gray-900">
                          {formatCurrency(selectedPlan.price)}
                          <span className="text-sm font-normal text-gray-600">/month</span>
                        </span>
                      </div>
                      {billingCycle === 'yearly' && (
                        <p className="text-sm text-green-600 text-right mt-1">
                          {formatCurrency(selectedPlan.price * 12)} billed annually
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* PayPal Payment Component */}
                <div className="relative">
                  {isProcessing && (
                    <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-lg">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2"></div>
                        <p className="text-gray-600">Processing your payment...</p>
                      </div>
                    </div>
                  )}
                  
                  <PayPalPayment
                    amount={selectedPlan.price}
                    description={`${selectedPlan.name} Plan - ${billingCycle === 'yearly' ? 'Annual' : 'Monthly'} Subscription`}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    subscriptionPlan={selectedTier}
                  />
                </div>

                {/* Payment Methods Accepted */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <CreditCard className="w-4 h-4" />
                    <span>We accept all major credit cards, PayPal, and Venmo</span>
                  </div>
                </div>
              </div>

              {/* Money Back Guarantee */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">30-Day Money Back Guarantee</h3>
                    <p className="text-sm text-gray-700">
                      Not satisfied? Get a full refund within 30 days, no questions asked.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;