// PayPal payment creation endpoint
export interface Env {
  PAYPAL_CLIENT_ID: string;
  PAYPAL_CLIENT_SECRET: string;
  PAYPAL_BASE_URL: string; // sandbox: https://api.sandbox.paypal.com, production: https://api.paypal.com
}

interface PaymentRequest {
  amount: number; // in cents
  description: string;
  clientId?: string;
  userEmail?: string;
  returnUrl: string;
  cancelUrl: string;
}

interface PayPalAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface PayPalOrderResponse {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

async function getPayPalAccessToken(env: Env): Promise<string> {
  const auth = btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`);
  
  const response = await fetch(`${env.PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    throw new Error(`Failed to get PayPal access token: ${response.statusText}`);
  }

  const data: PayPalAccessTokenResponse = await response.json();
  return data.access_token;
}

async function createPayPalOrder(
  accessToken: string, 
  amount: number, 
  description: string,
  returnUrl: string,
  cancelUrl: string,
  env: Env
): Promise<PayPalOrderResponse> {
  const orderData = {
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: (amount / 100).toFixed(2) // Convert cents to dollars
      },
      description: description
    }],
    application_context: {
      return_url: returnUrl,
      cancel_url: cancelUrl,
      brand_name: 'Cozyartz Media Group',
      landing_page: 'NO_PREFERENCE',
      user_action: 'PAY_NOW'
    }
  };

  const response = await fetch(`${env.PAYPAL_BASE_URL}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create PayPal order: ${response.statusText} - ${errorText}`);
  }

  return await response.json();
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;

    // Validate environment variables
    if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_CLIENT_SECRET) {
      return new Response(JSON.stringify({ 
        error: 'PayPal credentials not configured' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Set PayPal base URL (default to sandbox if not specified)
    const paypalBaseUrl = env.PAYPAL_BASE_URL || 'https://api.sandbox.paypal.com';
    const envWithBaseUrl = { ...env, PAYPAL_BASE_URL: paypalBaseUrl };

    // Parse request body
    const body: PaymentRequest = await request.json();
    const { amount, description, returnUrl, cancelUrl, userEmail } = body;

    // Validate required fields
    if (!amount || !description || !returnUrl || !cancelUrl) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: amount, description, returnUrl, cancelUrl' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate amount (must be positive and reasonable)
    if (amount <= 0 || amount > 10000000) { // Max $100,000
      return new Response(JSON.stringify({ 
        error: 'Invalid amount. Must be between $0.01 and $100,000' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken(envWithBaseUrl);

    // Create PayPal order
    const order = await createPayPalOrder(
      accessToken, 
      amount, 
      description,
      returnUrl,
      cancelUrl,
      envWithBaseUrl
    );

    // Store payment info for later capture (you might want to use a database here)
    const paymentId = crypto.randomUUID();
    
    // Find approval URL
    const approvalUrl = order.links.find(link => link.rel === 'approve')?.href;

    return new Response(JSON.stringify({
      success: true,
      orderId: order.id,
      paymentId: paymentId,
      approvalUrl: approvalUrl,
      status: order.status
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });

  } catch (error: any) {
    console.error('Payment creation error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to create payment' 
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};

// Handle CORS preflight requests
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};