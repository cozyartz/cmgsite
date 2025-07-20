import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import { apiService } from '../../lib/api';
import { CreditCard, Shield, Lock, CheckCircle } from 'lucide-react';

interface SquarePaymentProps {
  amount: number;
  description: string;
  onSuccess: (paymentResult: any) => void;
  onError: (error: any) => void;
  buttonText?: string;
  subscriptionPlan?: string;
}

declare global {
  interface Window {
    Square: any;
  }
}

const SquarePayment: React.FC<SquarePaymentProps> = ({
  amount,
  description,
  onSuccess,
  onError,
  buttonText = 'Pay Now',
  subscriptionPlan
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [card, setCard] = useState<any>(null);
  const [payments, setPayments] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initializeSquare();
  }, []);

  const initializeSquare = async () => {
    try {
      // Load Square Web SDK (production)
      if (!window.Square) {
        const script = document.createElement('script');
        script.src = 'https://web.squarecdn.com/v1/square.js';
        script.async = true;
        script.onload = () => initSquarePayments();
        document.head.appendChild(script);
      } else {
        initSquarePayments();
      }
    } catch (err) {
      console.error('Failed to load Square SDK:', err);
      setError('Payment system unavailable');
    }
  };

  const initSquarePayments = async () => {
    try {
      // Use your specific Online location ID for SEO platform
      const payments = window.Square.payments('sq0idp-w1pVQ5CxY80-gb0Dh0Q-3A', 'LPM1GX56NW50D');
      setPayments(payments);

      const card = await payments.card();
      await card.attach('#square-card-container');
      setCard(card);
    } catch (err) {
      console.error('Failed to initialize Square payments:', err);
      setError('Payment form unavailable');
    }
  };

  const handlePayment = async () => {
    if (!card || !payments) {
      setError('Payment form not ready');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Tokenize the card
      const result = await card.tokenize();
      
      if (result.status === 'OK') {
        // Send payment request to backend
        const response = await apiService.post('/api/payment/process', {
          sourceId: result.token,
          amount: amount * 100, // Convert to cents
          currency: 'USD',
          description,
          clientId: client?.id,
          subscriptionPlan
        });

        if (response.data) {
          onSuccess(response.data);
        } else {
          throw new Error(response.error || 'Payment failed');
        }
      } else {
        throw new Error('Card tokenization failed');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Payment failed');
      onError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <Shield className="h-8 w-8 text-teal-400 mr-2" />
          <h3 className="text-xl font-bold text-white">Secure Payment</h3>
        </div>
        <p className="text-slate-300">{description}</p>
        <p className="text-2xl font-bold text-teal-400 mt-2">
          ${amount.toFixed(2)}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Square Card Container */}
      <div className="mb-6">
        <div id="square-card-container" className="bg-white rounded-lg"></div>
      </div>

      {/* Payment Security Info */}
      <div className="mb-6 p-4 bg-slate-700 rounded-lg">
        <div className="flex items-center mb-2">
          <Lock className="h-4 w-4 text-teal-400 mr-2" />
          <span className="text-sm text-white font-medium">256-bit SSL Encryption</span>
        </div>
        <p className="text-xs text-slate-400">
          Your payment information is encrypted and secure. We never store your card details.
        </p>
        <div className="flex items-center mt-2">
          <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
          <span className="text-xs text-slate-400">PCI DSS Compliant</span>
        </div>
      </div>

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={isLoading || !card}
        className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4" />
            <span>{buttonText}</span>
          </>
        )}
      </button>

      {/* Billing Info */}
      {user && (
        <div className="mt-4 p-3 bg-slate-700 rounded-lg">
          <p className="text-sm text-slate-400">Bill to:</p>
          <p className="text-white font-medium">{user?.email}</p>
          <p className="text-slate-400 text-sm">User</p>
        </div>
      )}

      {/* Subscription Info */}
      {subscriptionPlan && (
        <div className="mt-4 p-3 bg-slate-700 rounded-lg">
          <p className="text-sm text-slate-400">Subscription:</p>
          <p className="text-white font-medium capitalize">{subscriptionPlan} Plan</p>
          <p className="text-slate-400 text-sm">Monthly billing • Cancel anytime</p>
        </div>
      )}
    </div>
  );
};

export default SquarePayment;