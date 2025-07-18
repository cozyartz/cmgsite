import React, { useState } from 'react';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import PayPalPayment from './PayPalPayment';
import { apiService } from '../../lib/api';
import { 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  ArrowRight, 
  Star,
  X
} from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  priceInCents: number;
  aiCalls: number;
  features: string[];
  popular?: boolean;
}

const SubscriptionManager: React.FC = () => {
  const { client, updateClient } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: 1000,
      priceInCents: 100000,
      aiCalls: 100,
      features: [
        'Basic AI tools',
        'Monthly analytics',
        'Email support',
        'Basic templates',
        'Usage tracking'
      ]
    },
    {
      id: 'growth',
      name: 'Growth',
      price: 1500,
      priceInCents: 150000,
      aiCalls: 250,
      features: [
        'Advanced AI tools',
        'Real-time analytics',
        'Priority support',
        'Custom templates',
        'Consultation discount (10%)',
        'Competitor tracking'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 2500,
      priceInCents: 250000,
      aiCalls: 500,
      features: [
        'All AI tools',
        'Custom analytics',
        'Dedicated support',
        'White-label options',
        'Monthly consultation included',
        'Custom integrations',
        'Priority processing'
      ]
    }
  ];

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentResult: any) => {
    setIsProcessing(true);
    
    try {
      // Update client subscription
      await updateClient({
        subscription_tier: selectedPlan!.id,
        ai_calls_limit: selectedPlan!.aiCalls
      });

      // Create subscription record
      const response = await apiService.post('/api/subscriptions/create', {
        clientId: client?.id,
        planId: selectedPlan!.id,
        paymentId: paymentResult.payment.id,
        amount: selectedPlan!.priceInCents
      });

      if (response.data) {
        setShowPayment(false);
        setSelectedPlan(null);
        // Show success message
        alert('Subscription updated successfully!');
      }
    } catch (error) {
      console.error('Subscription update failed:', error);
      alert('Failed to update subscription');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment failed:', error);
    alert('Payment failed. Please try again.');
  };

  const getCurrentPlan = () => {
    return subscriptionPlans.find(plan => plan.id === client?.subscription_tier);
  };

  const currentPlan = getCurrentPlan();

  if (showPayment && selectedPlan) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Complete Subscription</h2>
          <button
            onClick={() => setShowPayment(false)}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Plan Summary */}
          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Plan Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Plan</span>
                <span className="text-white font-medium">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">AI Calls</span>
                <span className="text-white font-medium">{selectedPlan.aiCalls}/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Monthly Price</span>
                <span className="text-white font-medium">${selectedPlan.price.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-700 pt-3">
                <div className="flex justify-between">
                  <span className="text-white font-medium">Total Due Today</span>
                  <span className="text-teal-400 font-bold">${selectedPlan.price.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-700 rounded-lg">
              <p className="text-sm text-slate-400">
                <Calendar className="h-4 w-4 inline mr-2" />
                Next billing: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Payment Form */}
          <PayPalPayment
            amount={selectedPlan.priceInCents}
            description={`${selectedPlan.name} Plan Subscription`}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            buttonText={`Subscribe to ${selectedPlan.name}`}
            subscriptionPlan={selectedPlan.id}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Plan</h2>
        <p className="text-slate-400">
          Select the perfect plan for your SEO needs. Upgrade or downgrade anytime.
        </p>
      </div>

      {/* Current Plan */}
      {currentPlan && (
        <div className="bg-slate-800 p-6 rounded-lg border border-teal-400">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Current Plan</h3>
              <p className="text-slate-400">
                {currentPlan.name} • ${currentPlan.price}/month • {client?.ai_calls_used}/{client?.ai_calls_limit} AI calls used
              </p>
            </div>
            <div className="text-right">
              <p className="text-teal-400 font-bold">${currentPlan.price}/month</p>
              <p className="text-sm text-slate-400">Next billing: Feb 15, 2024</p>
            </div>
          </div>
        </div>
      )}

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-slate-800 p-6 rounded-lg border transition-all ${
              plan.popular 
                ? 'border-teal-400 ring-2 ring-teal-400/20' 
                : 'border-slate-700 hover:border-slate-600'
            } ${
              currentPlan?.id === plan.id ? 'opacity-60' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-teal-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </div>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-teal-400">${plan.price}</span>
                <span className="text-slate-400">/month</span>
              </div>
              <p className="text-slate-300 font-medium">
                {plan.aiCalls} AI calls included
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-teal-400 mr-3 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handlePlanSelect(plan)}
              disabled={currentPlan?.id === plan.id || isProcessing}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                currentPlan?.id === plan.id
                  ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  : plan.popular
                  ? 'bg-teal-500 hover:bg-teal-600 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}
            >
              {currentPlan?.id === plan.id ? (
                <span>Current Plan</span>
              ) : (
                <>
                  <span>
                    {currentPlan && subscriptionPlans.findIndex(p => p.id === currentPlan.id) < subscriptionPlans.findIndex(p => p.id === plan.id)
                      ? 'Upgrade' 
                      : currentPlan 
                      ? 'Switch' 
                      : 'Select'
                    }
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="bg-slate-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-white font-medium mb-2">Can I change my plan anytime?</h4>
            <p className="text-slate-400 text-sm">
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately,
              and billing is prorated.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">What happens if I exceed my AI calls?</h4>
            <p className="text-slate-400 text-sm">
              Additional AI calls are charged at $0.50 per call. You'll receive notifications when
              approaching your limit.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Are consultations included?</h4>
            <p className="text-slate-400 text-sm">
              Enterprise plans include 1 hour of consultation monthly. Other plans receive discounted
              consultation rates.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Is there a contract?</h4>
            <p className="text-slate-400 text-sm">
              No contracts required. All plans are month-to-month and can be cancelled at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManager;