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
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [clientInfo, setClientInfo] = useState({
    fullName: '',
    email: '',
    company: '',
    website: '',
    phone: '',
    goals: ''
  });

  // Get parameters from URL
  useEffect(() => {
    const tier = searchParams.get('tier') || 'growth';
    const billing = searchParams.get('billing') as 'monthly' | 'yearly' || 'monthly';
    const coupon = searchParams.get('coupon') || '';
    
    setSelectedTier(tier);
    setBillingCycle(billing);
    setCouponCode(coupon);
  }, [searchParams]);

  // Pre-fill client info if user is logged in
  useEffect(() => {
    if (user) {
      setClientInfo(prev => ({
        ...prev,
        fullName: user.user_metadata?.full_name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

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

  const selectedPlan = tiers.find(tier => tier.id === selectedTier) || tiers.find(tier => tier.id === 'growth');

  const applyCoupon = () => {
    const validCoupons: {[key: string]: number} = {
      'SAVE20': 20,
      'WELCOME': 15,
      'FIRSTMONTH': 50,
      'NEWCLIENT': 25
    };
    
    const discount = validCoupons[couponCode.toUpperCase()];
    if (discount) {
      setAppliedCoupon({ code: couponCode.toUpperCase(), discount });
    } else {
      alert('Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const calculateFinalPrice = () => {
    if (!selectedPlan) return 0;
    let price = selectedPlan.price;
    if (appliedCoupon) {
      price = price - (price * appliedCoupon.discount / 100);
    }
    return Math.round(price);
  };

  const handleClientInfoChange = (field: string, value: string) => {
    setClientInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleTierChange = (tierId: string) => {
    setSelectedTier(tierId);
    // Update URL to reflect the change
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('tier', tierId);
    navigate(`/checkout?${newSearchParams.toString()}`, { replace: true });
  };

  const handleBillingCycleChange = () => {
    const newCycle = billingCycle === 'monthly' ? 'yearly' : 'monthly';
    setBillingCycle(newCycle);
    // Update URL to reflect the change
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('billing', newCycle);
    navigate(`/checkout?${newSearchParams.toString()}`, { replace: true });
  };

  const handlePaymentSuccess = async (paymentResult: any) => {
    console.log('Payment successful:', paymentResult);
    console.log('Client setup info:', clientInfo);
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
              {/* Plan Selection */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Choose Your Plan</h2>
                <p className="text-gray-600 mb-6">Select the plan that best fits your business needs</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tiers.map((tier) => (
                    <div
                      key={tier.id}
                      className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg ${
                        selectedTier === tier.id
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleTierChange(tier.id)}
                    >
                      {tier.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            MOST POPULAR
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{tier.name}</h3>
                          <p className="text-sm text-gray-600">
                            {tier.aiCalls === -1 ? 'Unlimited' : tier.aiCalls} AI credits/month
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            {formatCurrency(tier.price)}
                          </div>
                          <div className="text-sm text-gray-600">/month</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-teal-500" />
                          <span>{tier.domainLimit === -1 ? 'Unlimited' : `Up to ${tier.domainLimit}`} domains</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-teal-500" />
                          <span>{tier.features[0]}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-teal-500" />
                          <span>{tier.features[1]}</span>
                        </div>
                        {tier.features.length > 3 && (
                          <div className="text-sm text-gray-500">
                            +{tier.features.length - 2} more features
                          </div>
                        )}
                      </div>
                      
                      {selectedTier === tier.id && (
                        <div className="absolute top-4 right-4">
                          <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Billing Cycle Toggle */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-4">
                    <span className={`font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                      Monthly
                    </span>
                    <button
                      onClick={handleBillingCycleChange}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                        billingCycle === 'yearly' ? 'bg-teal-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className={`font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
                      Yearly
                      <span className="ml-1 text-sm text-green-600 font-semibold">(Save 4%)</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Client Setup Information */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Client Setup Information</h2>
                <p className="text-gray-600 mb-6">Help us set up your SEO account with the right information to get started.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={clientInfo.fullName}
                      onChange={(e) => handleClientInfoChange('fullName', e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={clientInfo.email}
                      onChange={(e) => handleClientInfoChange('email', e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={clientInfo.company}
                      onChange={(e) => handleClientInfoChange('company', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Your company name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website URL *
                    </label>
                    <input
                      type="url"
                      value={clientInfo.website}
                      onChange={(e) => handleClientInfoChange('website', e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={clientInfo.phone}
                      onChange={(e) => handleClientInfoChange('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Goals & Priorities
                    </label>
                    <textarea
                      value={clientInfo.goals}
                      onChange={(e) => handleClientInfoChange('goals', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Tell us about your SEO goals, target keywords, or specific areas you'd like to focus on..."
                    />
                  </div>
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Complete Your Order
                </h1>
                <p className="text-gray-600">
                  You're just one step away from supercharging your SEO strategy
                </p>
              </div>

              {/* Selected Plan Summary */}
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
                      <p className="text-gray-600">Selected plan details</p>
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

                {/* Coupon Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coupon Code (Optional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      disabled={!!appliedCoupon}
                    />
                    {appliedCoupon ? (
                      <button
                        onClick={removeCoupon}
                        className="px-4 py-2 text-red-600 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={applyCoupon}
                        disabled={!couponCode.trim()}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                  {appliedCoupon && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ Coupon "{appliedCoupon.code}" applied! {appliedCoupon.discount}% discount
                    </p>
                  )}
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
                    {appliedCoupon && (
                      <div className="flex justify-between items-center text-green-600">
                        <span>Coupon Discount ({appliedCoupon.discount}%)</span>
                        <span className="font-medium">
                          -{formatCurrency(selectedPlan.price * appliedCoupon.discount / 100)}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-gray-900">
                          {formatCurrency(calculateFinalPrice())}
                          <span className="text-sm font-normal text-gray-600">/month</span>
                        </span>
                      </div>
                      {billingCycle === 'yearly' && (
                        <p className="text-sm text-green-600 text-right mt-1">
                          {formatCurrency(calculateFinalPrice() * 12)} billed annually
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
                  
                  {/* Terms and Conditions */}
                  <div className="mb-6">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-1 w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        required
                      />
                      <label htmlFor="terms" className="text-sm text-gray-700">
                        I agree to the{' '}
                        <a href="/terms-of-service" target="_blank" className="text-teal-600 hover:text-teal-700 underline">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="/privacy-policy" target="_blank" className="text-teal-600 hover:text-teal-700 underline">
                          Privacy Policy
                        </a>
                        . I understand that this is a recurring subscription that will automatically renew each {billingCycle === 'yearly' ? 'year' : 'month'} until cancelled.
                      </label>
                    </div>
                  </div>

                  {/* Payment Button - Only show if terms accepted and required fields filled */}
                  {(!termsAccepted || !clientInfo.fullName || !clientInfo.email || !clientInfo.website) ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">
                        Please fill in all required fields and accept the terms to continue
                      </p>
                      <div className="bg-gray-100 text-gray-400 py-3 px-6 rounded-lg">
                        Complete Setup to Continue
                      </div>
                    </div>
                  ) : (
                    <PayPalPayment
                      amount={calculateFinalPrice()}
                      description={`${selectedPlan.name} Plan - ${billingCycle === 'yearly' ? 'Annual' : 'Monthly'} Subscription`}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      subscriptionPlan={selectedTier}
                    />
                  )}
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