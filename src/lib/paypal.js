// PayPal integration service for Cloudflare Workers
export class PayPalService {
  constructor(clientId, clientSecret, environment = 'sandbox') {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.environment = environment;
    this.baseUrl = environment === 'sandbox' 
      ? 'https://api-m.sandbox.paypal.com' 
      : 'https://api-m.paypal.com';
  }

  // Get OAuth access token
  async getAccessToken() {
    const auth = btoa(`${this.clientId}:${this.clientSecret}`);
    
    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error(`PayPal auth failed: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  }

  // Create subscription plan
  async createSubscriptionPlan(planData) {
    const accessToken = await this.getAccessToken();

    const response = await fetch(`${this.baseUrl}/v1/billing/plans`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(planData)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`PayPal plan creation failed: ${error}`);
    }

    return await response.json();
  }

  // Create subscription
  async createSubscription(subscriptionData) {
    const accessToken = await this.getAccessToken();

    const response = await fetch(`${this.baseUrl}/v1/billing/subscriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(subscriptionData)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`PayPal subscription creation failed: ${error}`);
    }

    return await response.json();
  }

  // Process one-time payment
  async processPayment(paymentData) {
    const accessToken = await this.getAccessToken();

    const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`PayPal payment creation failed: ${error}`);
    }

    return await response.json();
  }

  // Capture payment
  async capturePayment(orderId) {
    const accessToken = await this.getAccessToken();

    const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`PayPal payment capture failed: ${error}`);
    }

    return await response.json();
  }

  // Get subscription details
  async getSubscription(subscriptionId) {
    const accessToken = await this.getAccessToken();

    const response = await fetch(`${this.baseUrl}/v1/billing/subscriptions/${subscriptionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`PayPal subscription fetch failed: ${error}`);
    }

    return await response.json();
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId, reason = 'Customer requested cancellation') {
    const accessToken = await this.getAccessToken();

    const response = await fetch(`${this.baseUrl}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        reason: reason
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`PayPal subscription cancellation failed: ${error}`);
    }

    return response.status === 204; // Success returns no content
  }

  // Suspend subscription
  async suspendSubscription(subscriptionId, reason = 'Customer requested suspension') {
    const accessToken = await this.getAccessToken();

    const response = await fetch(`${this.baseUrl}/v1/billing/subscriptions/${subscriptionId}/suspend`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        reason: reason
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`PayPal subscription suspension failed: ${error}`);
    }

    return response.status === 204;
  }

  // Activate subscription
  async activateSubscription(subscriptionId, reason = 'Customer requested reactivation') {
    const accessToken = await this.getAccessToken();

    const response = await fetch(`${this.baseUrl}/v1/billing/subscriptions/${subscriptionId}/activate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        reason: reason
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`PayPal subscription activation failed: ${error}`);
    }

    return response.status === 204;
  }

  // Verify webhook signature (for webhook security)
  async verifyWebhookSignature(headers, body, webhookId) {
    const accessToken = await this.getAccessToken();

    const verifyData = {
      auth_algo: headers['paypal-auth-algo'],
      cert_id: headers['paypal-cert-id'],
      transmission_id: headers['paypal-transmission-id'],
      transmission_sig: headers['paypal-transmission-sig'],
      transmission_time: headers['paypal-transmission-time'],
      webhook_id: webhookId,
      webhook_event: JSON.parse(body)
    };

    const response = await fetch(`${this.baseUrl}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(verifyData)
    });

    if (!response.ok) {
      return false;
    }

    const result = await response.json();
    return result.verification_status === 'SUCCESS';
  }
}

// Helper functions for PayPal integration
export function formatCurrency(amountInCents) {
  return (amountInCents / 100).toFixed(2);
}

export function formatPayPalAmount(amountInCents, currencyCode = 'USD') {
  return {
    currency_code: currencyCode,
    value: formatCurrency(amountInCents)
  };
}

// Create subscription plan data
export function createSubscriptionPlanData(tier, pricing, features) {
  return {
    product_id: `seo-platform-${tier}`,
    name: `SEO Platform - ${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan`,
    description: `AI-powered SEO platform subscription - ${tier} tier`,
    status: 'ACTIVE',
    billing_cycles: [
      {
        frequency: {
          interval_unit: 'MONTH',
          interval_count: 1
        },
        tenure_type: 'REGULAR',
        sequence: 1,
        total_cycles: 0, // Infinite billing
        pricing_scheme: {
          fixed_price: formatPayPalAmount(pricing.price)
        }
      }
    ],
    payment_preferences: {
      auto_bill_outstanding: true,
      setup_fee: formatPayPalAmount(0),
      setup_fee_failure_action: 'CONTINUE',
      payment_failure_threshold: 3
    },
    taxes: {
      percentage: '0',
      inclusive: false
    }
  };
}

// Create subscription data
export function createSubscriptionData(planId, userEmail, userName, returnUrl, cancelUrl) {
  return {
    plan_id: planId,
    subscriber: {
      name: {
        given_name: userName.split(' ')[0],
        surname: userName.split(' ').slice(1).join(' ') || 'User'
      },
      email_address: userEmail
    },
    application_context: {
      brand_name: 'Cozyartz Media Group',
      locale: 'en-US',
      shipping_preference: 'NO_SHIPPING',
      user_action: 'SUBSCRIBE_NOW',
      payment_method: {
        payer_selected: 'PAYPAL',
        payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
      },
      return_url: returnUrl,
      cancel_url: cancelUrl
    }
  };
}

// Create one-time payment data
export function createPaymentData(amount, description, userEmail, returnUrl, cancelUrl) {
  return {
    intent: 'CAPTURE',
    purchase_units: [
      {
        reference_id: `payment-${Date.now()}`,
        description: description,
        amount: formatPayPalAmount(amount),
        payee: {
          email_address: 'hello@cozyartzmedia.com'
        }
      }
    ],
    payer: {
      email_address: userEmail
    },
    application_context: {
      brand_name: 'Cozyartz Media Group',
      landing_page: 'NO_PREFERENCE',
      shipping_preference: 'NO_SHIPPING',
      user_action: 'PAY_NOW',
      return_url: returnUrl,
      cancel_url: cancelUrl
    }
  };
}