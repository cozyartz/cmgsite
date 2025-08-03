import React, { useState, useEffect } from 'react';
import { Check, Tag, Calendar, DollarSign } from 'lucide-react';
import { formatCurrency, calculatePrepaymentTotal, type PricingTier } from '../config/whitelabel';
import { useNavigate } from 'react-router-dom';
import PayPalPayment from './payment/PayPalPayment';
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
}

interface CouponInfo {
  code: string;
  discount_amount_cents: number;
  discount_type: string;
  description: string;
  valid: boolean;
}

interface PrepaymentQuote {
  tier: string;
  basePrice: number;
  couponDiscount: number;
  monthlyPrice: number;
  threeMonthTotal: number;
  prepaymentTotal: number;
  totalSavings: number;
  perMonthEquivalent: number;
}

export default function PricingWithCoupons() {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<string>('growth');
  const [couponCode, setCouponCode] = useState('');
  const [couponInfo, setCouponInfo] = useState<CouponInfo | null>(null);
  const [couponError, setCouponError] = useState('');
  const [showPrepayment, setShowPrepayment] = useState(false);
  const [prepaymentQuote, setPrepaymentQuote] = useState<PrepaymentQuote | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const tiers: PricingPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: 2900, // $29/month in cents
      aiCalls: 100,
      domainLimit: 3,
      features: [
        'Basic SEO tools',
        'Monthly reporting',
        'Email support',
        '100 AI calls/month',
        '3 domains'
      ]
    },
    {
      id: 'growth',
      name: 'Growth',
      price: 9900, // $99/month in cents
      aiCalls: 500,
      domainLimit: 10,
      features: [
        'Advanced SEO tools',
        'Bi-weekly reporting',
        'Priority support',
        '500 AI calls/month',
        '10 domains',
        'Competitor analysis',
        'API access'
      ],
      popular: true
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 19900, // $199/month in cents
      aiCalls: 1000,
      domainLimit: 25,
      features: [
        'Professional SEO suite',
        'Weekly reporting',
        'Priority support',
        '1000 AI calls/month',
        '25 domains',
        'Advanced analytics',
        'White-label options'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 29900, // $299/month in cents
      aiCalls: -1, // Unlimited
      domainLimit: -1, // Unlimited
      features: [
        'Full SEO suite',
        'Daily reporting',
        'Dedicated account manager',
        'Unlimited AI calls',
        'Unlimited domains',
        'Advanced analytics',
        'White-label options',
        'Custom integrations'
      ]
    },
    {
      id: 'legacyEnterprise',
      name: 'Legacy Enterprise',
      price: 100000, // $1000/month in cents for existing high-value clients
      aiCalls: -1, // Unlimited
      domainLimit: -1, // Unlimited
      features: [
        'Full legacy enterprise suite',
        'Daily reporting',
        'Dedicated account manager',
        'Unlimited AI calls',
        'Unlimited domains',
        'Priority processing',
        'White-label options',
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

  const fetchPrepaymentQuote = async () => {
    setIsLoadingQuote(true);

    try {
      const response = await apiService.post('/api/billing/prepay-quote', { 
        tier: selectedTier,
        couponCode: couponInfo?.code || couponCode.trim()
      });

      if (response.data) {
        setPrepaymentQuote(response.data);
      } else {
        console.error('Failed to get quote:', response.error);
      }
    } catch (error) {
      console.error('Quote error:', error);
    } finally {
      setIsLoadingQuote(false);
    }
  };

  useEffect(() => {
    if (showPrepayment) {
      fetchPrepaymentQuote();
    }
  }, [selectedTier, couponInfo, showPrepayment]);

  const selectedTierData = tiers.find(t => t.id === selectedTier);
  
  // Calculate coupon discount based on type
  const calculateCouponDiscount = (tierPrice: number) => {
    if (!couponInfo) return 0;
    
    if (couponInfo.discount_type === 'percentage') {
      // For AMYCOMPANY40, discount_amount_cents contains the percentage (40)
      const percentage = couponInfo.discount_amount_cents;
      return Math.round(tierPrice * (percentage / 100));
    } else {
      // Fixed amount discount
      return couponInfo.discount_amount_cents;
    }
  };

  const couponDiscount = selectedTierData ? calculateCouponDiscount(selectedTierData.price) : 0;
  const monthlyPrice = selectedTierData ? selectedTierData.price - couponDiscount : 0;
  const effectiveMonthlyPrice = Math.max(0, monthlyPrice);

  const handlePaymentSuccess = async (paymentResult: any) => {
    console.log('Payment successful:', paymentResult);
    navigate('/client-portal');
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment failed:', error);
    alert('Payment failed. Please try again.');
  };

  const handleStartSubscription = () => {
    setShowPayment(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Flexible SEO Plans - No Long-Term Commitment
        </h2>
        <p className="text-lg text-gray-600 mb-4">
          Professional SEO tools and AI-powered insights with no commitment required
        </p>
        <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-6 py-3 rounded-full text-sm font-medium border border-green-200 mb-4">
          <span>✓ NO COMMITMENT</span>
          <span>•</span>
          <span>✓ CANCEL ANYTIME</span>
        </div>

        {/* Coupon Input */}
        <div className="max-w-md mx-auto mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && validateCoupon()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={validateCoupon}
              disabled={isValidatingCoupon || !couponCode.trim()}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isValidatingCoupon ? 'Checking...' : 'Apply'}
            </button>
          </div>
          
          {couponError && (
            <p className="text-red-600 text-sm mt-2">{couponError}</p>
          )}
          
          {couponInfo && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm font-medium">
                ✓ Coupon applied: {couponInfo.discount_type === 'percentage' 
                  ? `${couponInfo.discount_amount_cents}% off` 
                  : `${formatCurrency(couponInfo.discount_amount_cents)} off per month`}
              </p>
              <p className="text-green-600 text-xs mt-1">{couponInfo.description}</p>
            </div>
          )}
        </div>

        {/* Prepayment Toggle */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <span className={`text-sm ${!showPrepayment ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setShowPrepayment(!showPrepayment)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              showPrepayment ? 'bg-teal-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                showPrepayment ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm ${showPrepayment ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
            3-Month Prepay (Save 10%)
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tiers.map((tier) => {
          const isSelected = selectedTier === tier.id;
          const tierCouponDiscount = calculateCouponDiscount(tier.price);
          const tierMonthlyPrice = tier.price - tierCouponDiscount;
          const effectiveTierPrice = Math.max(0, tierMonthlyPrice);

          return (
            <div
              key={tier.id}
              className={`relative rounded-2xl border-2 p-8 transition-all cursor-pointer hover:shadow-lg ${
                isSelected
                  ? 'border-teal-500 shadow-lg scale-105'
                  : tier.popular
                  ? 'border-teal-200 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedTier(tier.id)}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-teal-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{tier.name}</h3>
                <div className="flex items-baseline">
                  {couponInfo && (
                    <span className="text-lg text-gray-500 line-through mr-2">
                      {formatCurrency(tier.price)}
                    </span>
                  )}
                  <span className="text-3xl font-bold text-gray-900">
                    {formatCurrency(effectiveTierPrice)}
                  </span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
                
                {showPrepayment && prepaymentQuote && prepaymentQuote.tier === tier.id && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-sm text-blue-800">
                      <div className="font-medium">3-Month Prepayment:</div>
                      <div className="text-xs text-blue-600 mt-1">
                        Pay {formatCurrency(prepaymentQuote.prepaymentTotal)} now
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        Save {formatCurrency(prepaymentQuote.totalSavings)} total
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{tier.aiCalls} AI calls/month</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span>{tier.domainLimit} domain{tier.domainLimit > 1 ? 's' : ''}</span>
                </div>
                {tier.aiCalls === -1 && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Tag className="w-4 h-4" />
                    <span>Unlimited usage</span>
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mb-3">
                <p className="text-xs text-center text-gray-500">Cancel anytime • No commitment</p>
              </div>
              <button
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  isSelected
                    ? 'bg-teal-600 text-white hover:bg-teal-700'
                    : tier.popular
                    ? 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isSelected ? 'Selected' : 'Select Plan'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Selected Plan Summary */}
      {selectedTierData && (
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Plan Summary: {selectedTierData.name}
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Base Price:</span>
                <span className="font-medium">{formatCurrency(selectedTierData.price)}/month</span>
              </div>
              
              {couponInfo && (
                <div className="flex justify-between items-center text-green-600">
                  <span>Coupon Discount ({couponInfo.code}):</span>
                  <span className="font-medium">-{formatCurrency(couponDiscount)}/month</span>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-medium">Monthly Total:</span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatCurrency(effectiveMonthlyPrice)}/month
                  </span>
                </div>
              </div>

              {showPrepayment && prepaymentQuote && (
                <div className="border-t border-gray-200 pt-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">3-Month Total (without prepay):</span>
                    <span>{formatCurrency(prepaymentQuote.threeMonthTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-blue-600">
                    <span>Prepayment Discount (10%):</span>
                    <span>-{formatCurrency(prepaymentQuote.totalSavings)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-medium">Prepayment Total:</span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(prepaymentQuote.prepaymentTotal)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 text-center">
                    Equivalent to {formatCurrency(prepaymentQuote.perMonthEquivalent)}/month
                  </div>
                </div>
              )}
            </div>

            {showPayment ? (
              <PayPalPayment
                amount={showPrepayment && prepaymentQuote ? prepaymentQuote.prepaymentTotal : effectiveMonthlyPrice}
                description={`${selectedTierData.name} Plan - ${showPrepayment ? '3-Month Prepayment' : 'Monthly Subscription'}`}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                buttonText={showPrepayment ? 'Pay 3 Months in Advance' : 'Start Monthly Subscription'}
                subscriptionPlan={selectedTier}
              />
            ) : (
              <button 
                onClick={handleStartSubscription}
                className="w-full mt-6 bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 font-medium transition-colors"
              >
                {showPrepayment ? 'Pay 3 Months in Advance' : 'Start Monthly Subscription'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}