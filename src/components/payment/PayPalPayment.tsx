import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import { apiService } from '../../lib/api';
import { CreditCard, Shield, Lock, CheckCircle, Loader2 } from 'lucide-react';

interface PayPalPaymentProps {
  amount: number;
  description: string;
  onSuccess: (paymentResult: any) => void;
  onError: (error: any) => void;
  buttonText?: string;
  subscriptionPlan?: string;
  isPrePayment?: boolean;
  tier?: string;
  couponCode?: string;
}

const PayPalPayment: React.FC<PayPalPaymentProps> = ({
  amount,
  description,
  onSuccess,
  onError,
  buttonText = 'Pay with PayPal',
  subscriptionPlan,
  isPrePayment = false,
  tier,
  couponCode
}) => {
  const { client, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const clientId = "AQMzbwCSEUPkjLW8Ff7YarfVmRec3633qRlyvB2mCN_eX4W3-dAdtBZ_UPkINI6WtXaJ2WwLmcIGxuaF";

  const initialPayPalOptions = {
    clientId: clientId,
    currency: "USD",
    intent: "capture",
    enableFunding: "venmo,card",
    disableFunding: "",
    dataClientToken: "",
    components: "buttons,marks,messages,funding-eligibility"
  };

  const createOrder = async () => {
    try {
      setIsLoading(true);
      setError('');

      const endpoint = isPrePayment ? '/api/payment/prepayment' : '/api/payment/create';
      const payload = isPrePayment 
        ? {
            tier,
            couponCode,
            userEmail: user?.email,
            returnUrl: `${window.location.origin}/client-portal/payment/success`,
            cancelUrl: `${window.location.origin}/client-portal/payment/cancel`
          }
        : {
            amount,
            description,
            clientId: client?.id,
            userEmail: user?.email,
            returnUrl: `${window.location.origin}/client-portal/payment/success`,
            cancelUrl: `${window.location.origin}/client-portal/payment/cancel`
          };

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://cmgsite-client-portal.cozyartz-media-group.workers.dev'}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization will be handled by the API client
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment');
      }

      // Store payment/prepayment ID for later capture
      sessionStorage.setItem('paymentId', data.paymentId || data.prepaymentId);
      
      return data.orderId;
    } catch (err: any) {
      console.error('Create order error:', err);
      setError(err.message || 'Failed to create payment order');
      onError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const onApprove = async (data: any) => {
    try {
      setIsLoading(true);
      
      const paymentId = sessionStorage.getItem('paymentId');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://cmgsite-client-portal.cozyartz-media-group.workers.dev'}/api/payment/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization will be handled by the API client
        },
        body: JSON.stringify({
          orderId: data.orderID,
          paymentId: paymentId
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to capture payment');
      }

      // Clean up session storage
      sessionStorage.removeItem('paymentId');
      
      onSuccess(result);
    } catch (err: any) {
      console.error('Capture payment error:', err);
      setError(err.message || 'Failed to capture payment');
      onError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onCancel = () => {
    setError('Payment was cancelled');
    onError(new Error('Payment cancelled by user'));
  };

  const onErrorHandler = (err: any) => {
    console.error('PayPal error:', err);
    setError('PayPal payment error occurred');
    onError(err);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Payment</h3>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Shield className="w-4 h-4 text-green-600" />
            <span>256-bit SSL</span>
          </div>
          <div className="flex items-center space-x-1">
            <Lock className="w-4 h-4 text-green-600" />
            <span>Secure</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>PayPal Protected</span>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">{description}</span>
          <span className="text-2xl font-bold text-gray-900">
            ${(amount / 100).toFixed(2)}
          </span>
        </div>
        {isPrePayment && (
          <div className="mt-2 text-sm text-green-600">
            ✅ Includes 10% prepayment discount
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <PayPalScriptProvider options={initialPayPalOptions}>
        <PayPalButtonWrapper 
          createOrder={createOrder}
          onApprove={onApprove}
          onCancel={onCancel}
          onError={onErrorHandler}
          isLoading={isLoading}
        />
      </PayPalScriptProvider>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <div className="flex items-center justify-center space-x-2">
          <CreditCard className="w-4 h-4" />
          <span>Accepts all major credit cards, PayPal, and Venmo</span>
        </div>
      </div>
    </div>
  );
};

// Wrapper component to handle PayPal script loading
const PayPalButtonWrapper: React.FC<{
  createOrder: () => Promise<string>;
  onApprove: (data: any) => Promise<void>;
  onCancel: () => void;
  onError: (err: any) => void;
  isLoading: boolean;
}> = ({ createOrder, onApprove, onCancel, onError, isLoading }) => {
  const [{ isLoading: scriptLoading, isResolved }] = usePayPalScriptReducer();

  if (scriptLoading || !isResolved) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading PayPal...</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Processing payment...</span>
        </div>
      )}
      
      <PayPalButtons
        style={{
          layout: "vertical",
          color: "blue",
          shape: "rect",
          label: "paypal",
          height: 45
        }}
        createOrder={createOrder}
        onApprove={onApprove}
        onCancel={onCancel}
        onError={onError}
        disabled={isLoading}
      />
    </div>
  );
};

export default PayPalPayment;