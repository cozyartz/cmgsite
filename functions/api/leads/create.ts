/**
 * Lead Creation API Endpoint
 * Creates leads in Breakcold CRM via server-side API
 */

interface Env {
  BREAKCOLD_API_KEY?: string;
  JWT_SECRET?: string;
  BREAKCOLD_SECRET_STORE_ID?: string;
  BREAKCOLD_WEBHOOK_SECRET?: string;
}

interface CreateLeadRequest {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  title?: string;
  source?: string;
  tags?: string[];
  customAttributes?: Record<string, any>;
  notes?: string;
  context?: string;
  leadScore?: number;
  conversationHistory?: string[];
}

// Retrieve API key from Cloudflare Pages environment
const getBreakcoldApiKey = async (env: Env): Promise<string> => {
  console.log('Checking for BREAKCOLD_API_KEY in environment...');
  
  // In Cloudflare Pages Functions, secrets are available directly on env
  if (env.BREAKCOLD_API_KEY) {
    console.log('Found BREAKCOLD_API_KEY in environment');
    return env.BREAKCOLD_API_KEY;
  }
  
  console.error('BREAKCOLD_API_KEY not found in environment');
  console.log('Available env keys:', Object.keys(env));
  
  throw new Error('Breakcold API key not available - ensure BREAKCOLD_API_KEY is set in Cloudflare Pages secrets');
};

// Verify JWT token
const verifyToken = async (token: string, secret: string): Promise<any> => {
  try {
    // In a real implementation, you'd use a proper JWT library
    // For now, we'll do basic validation
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
    
    // Decode payload (base64)
    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiration
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      throw new Error('Token expired');
    }
    
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Create lead in Breakcold via API
const createBreakcoldLead = async (leadData: CreateLeadRequest, apiKey: string) => {
  const breakcoldEndpoint = 'https://api.breakcold.com/v3/leads';
  
  const payload = {
    firstName: leadData.firstName,
    lastName: leadData.lastName,
    email: leadData.email,
    phone: leadData.phone,
    company: leadData.company,
    website: leadData.website,
    title: leadData.title,
    source: leadData.source || 'Website API',
    tags: leadData.tags || ['Website Lead'],
    customAttributes: {
      ...leadData.customAttributes,
      leadScore: leadData.leadScore,
      capturedAt: new Date().toISOString(),
      conversationContext: leadData.conversationHistory?.join('\n')
    },
    notes: leadData.notes || `Lead captured via website API. Context: ${leadData.context || 'unknown'}`
  };

  const response = await fetch(breakcoldEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Breakcold API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
  }

  return await response.json();
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    // Get API key from environment or secret store
    let apiKey: string;
    try {
      apiKey = await getBreakcoldApiKey(env);
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Breakcold API key not available',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Authentication required'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.slice(7);
    const jwtSecret = env.JWT_SECRET;
    
    if (jwtSecret) {
      try {
        await verifyToken(token, jwtSecret);
      } catch (error) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid authentication token'
        }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Parse request body
    let leadData: CreateLeadRequest;
    
    try {
      leadData = await request.json();
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid JSON payload'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate required fields
    if (!leadData.email) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Email is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leadData.email)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid email format'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Creating lead:', {
      email: leadData.email,
      company: leadData.company,
      source: leadData.source,
      leadScore: leadData.leadScore
    });

    // Create lead in Breakcold
    const breakcoldResult = await createBreakcoldLead(leadData, apiKey);

    console.log('Lead created successfully:', breakcoldResult.id);

    // Return success response
    return new Response(JSON.stringify({
      success: true,
      data: breakcoldResult,
      message: 'Lead created successfully'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Lead creation error:', error);

    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to create lead',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Handle OPTIONS requests for CORS
export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
};