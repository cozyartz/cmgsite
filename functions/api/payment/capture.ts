// PayPal payment capture endpoint
export interface Env {
  PAYPAL_CLIENT_ID: string;
  PAYPAL_CLIENT_SECRET: string;
  PAYPAL_BASE_URL: string;
}

interface CaptureRequest {
  orderId: string;
  paymentId?: string;
}

interface PayPalAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface PayPalCaptureResponse {
  id: string;
  status: string;
  payment_source?: any;
  purchase_units: Array<{
    payments: {
      captures: Array<{
        id: string;
        status: string;
        amount: {
          currency_code: string;
          value: string;
        };
      }>;
    };
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

async function capturePayPalOrder(
  accessToken: string,
  orderId: string,
  env: Env
): Promise<PayPalCaptureResponse> {
  const response = await fetch(`${env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to capture PayPal order: ${response.statusText} - ${errorText}`);
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
    const body: CaptureRequest = await request.json();
    const { orderId, paymentId } = body;

    // Validate required fields
    if (!orderId) {
      return new Response(JSON.stringify({ 
        error: 'Missing required field: orderId' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken(envWithBaseUrl);

    // Capture the PayPal order
    const captureResult = await capturePayPalOrder(accessToken, orderId, envWithBaseUrl);

    // Check if capture was successful
    if (captureResult.status !== 'COMPLETED') {
      return new Response(JSON.stringify({
        error: 'Payment capture failed',
        status: captureResult.status
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Extract capture details
    const capture = captureResult.purchase_units[0]?.payments?.captures?.[0];
    if (!capture) {
      return new Response(JSON.stringify({
        error: 'No capture found in response'
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // TODO: Here you would typically:
    // 1. Store the payment record in your database
    // 2. Create/update user subscription
    // 3. Send confirmation email
    // 4. Update user permissions/access

    return new Response(JSON.stringify({
      success: true,
      orderId: captureResult.id,
      captureId: capture.id,
      status: capture.status,
      amount: capture.amount,
      paymentId: paymentId || null,
      message: 'Payment captured successfully'
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
    console.error('Payment capture error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to capture payment' 
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