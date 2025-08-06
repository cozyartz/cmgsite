/**
 * Magic Link Authentication Endpoint
 * 
 * Sends passwordless login links via email using Resend API
 * Works with multi-tenant setup and existing D1 database
 */

interface Env {
  DB: D1Database;
  SESSIONS: KVNamespace;
  RESEND_API_KEY?: string;
  JWT_SECRET?: string;
  BASE_URL?: string;
}

interface MagicLinkRequest {
  email: string;
  tenant_domain?: string;
  redirect_url?: string;
}

// Generate secure random token
function generateSecureToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Create JWT token
async function createJWT(payload: any, secret: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  
  const encodedHeader = btoa(JSON.stringify(header)).replace(/[+/=]/g, (m) => ({ '+': '-', '/': '_', '=': '' })[m] || m);
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/[+/=]/g, (m) => ({ '+': '-', '/': '_', '=': '' })[m] || m);
  
  const message = `${encodedHeader}.${encodedPayload}`;
  const msgBuffer = new TextEncoder().encode(message);
  const keyBuffer = new TextEncoder().encode(secret);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw', keyBuffer, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgBuffer);
  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/[+/=]/g, (m) => ({ '+': '-', '/': '_', '=': '' })[m] || m);
  
  return `${message}.${encodedSignature}`;
}

// Get or create user in database
async function getOrCreateUser(db: D1Database, email: string, tenantId: string): Promise<any> {
  // First try to find existing user
  let user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
  
  if (!user) {
    // Create new user
    const userId = crypto.randomUUID();
    await db.prepare(`
      INSERT INTO users (id, email, name, provider, created_at, updated_at)
      VALUES (?, ?, ?, 'email', datetime('now'), datetime('now'))
    `).bind(userId, email, email.split('@')[0]).run();
    
    user = await db.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first();
  }
  
  // Get or create client (tenant) association
  let client = await db.prepare('SELECT * FROM clients WHERE owner_id = ?').bind(user.id).first();
  
  if (!client) {
    // Create client for this user if they don't have one
    const clientId = crypto.randomUUID();
    const domain = tenantId === 'cmg-default' ? 'cozyartzmedia.com' : `${tenantId}.cozyartzmedia.com`;
    
    await db.prepare(`
      INSERT INTO clients (id, name, domain, owner_id, subscription_tier, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'starter', datetime('now'), datetime('now'))
    `).bind(clientId, `${email.split('@')[0]}'s Organization`, domain, user.id).run();
    
    client = await db.prepare('SELECT * FROM clients WHERE id = ?').bind(clientId).first();
  }
  
  return { user, client };
}

// Send magic link email
async function sendMagicLinkEmail(email: string, magicLink: string, apiKey: string): Promise<void> {
  const emailData = {
    from: 'Cozyartz Media Group <hello@cozyartzmedia.com>',
    to: [email],
    subject: 'Sign in to your account',
    html: `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://cozyartzmedia.com/cmgLogo.png" alt="Cozyartz Media Group" style="height: 60px;">
        </div>
        
        <h1 style="color: #14b8a6; text-align: center; margin-bottom: 30px;">Sign in to your account</h1>
        
        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 30px;">
          Click the button below to sign in to your account. This link will expire in 15 minutes.
        </p>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${magicLink}" 
             style="background: #14b8a6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
            Sign In Securely
          </a>
        </div>
        
        <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
          If you didn't request this sign-in link, you can safely ignore this email. The link will expire automatically.
        </p>
        
        <div style="border-top: 1px solid #e5e7eb; margin-top: 40px; padding-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
          <p>Cozyartz Media Group • Battle Creek, MI • (269) 261-0069</p>
        </div>
      </div>
    `,
  };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Failed to send email: ${response.status} ${JSON.stringify(errorData)}`);
  }
}

// Determine tenant ID from domain
function getTenantIdFromDomain(domain: string): string {
  if (domain === 'cozyartzmedia.com' || domain === 'www.cozyartzmedia.com' || domain === 'localhost') {
    return 'cmg-default';
  }
  
  const subdomainMatch = domain.match(/^([^.]+)\.cozyartzmedia\.com$/);
  if (subdomainMatch) {
    return `partner-${subdomainMatch[1]}`;
  }
  
  return `custom-${domain.replace(/\./g, '-')}`;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    // Parse request
    const body: MagicLinkRequest = await request.json();
    
    if (!body.email) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Email is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid email format'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check for required environment variables
    if (!env.RESEND_API_KEY || !env.JWT_SECRET) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Email service not configured'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const tenantDomain = body.tenant_domain || 'cozyartzmedia.com';
    const tenantId = getTenantIdFromDomain(tenantDomain);
    const redirectUrl = body.redirect_url || `https://${tenantDomain}/auth/callback`;

    console.log('Magic link request:', {
      email: body.email,
      tenantDomain,
      tenantId,
      redirectUrl
    });

    // Get or create user and tenant
    const { user, client } = await getOrCreateUser(env.DB, body.email, tenantId);

    // Generate secure token for magic link
    const token = generateSecureToken();
    const expiresAt = Date.now() + (15 * 60 * 1000); // 15 minutes

    // Store token in KV with expiration
    const tokenData = {
      email: body.email,
      user_id: user.id,
      client_id: client.id,
      tenant_id: tenantId,
      redirect_url: redirectUrl,
      created_at: Date.now(),
    };

    await env.SESSIONS.put(`magic_link:${token}`, JSON.stringify(tokenData), {
      expirationTtl: 900, // 15 minutes
    });

    // Create magic link
    const baseUrl = env.BASE_URL || `https://${tenantDomain}`;
    const magicLink = `${baseUrl}/auth/magic-link?token=${token}`;

    // Send email
    await sendMagicLinkEmail(body.email, magicLink, env.RESEND_API_KEY);

    console.log('Magic link sent successfully to:', body.email);

    return new Response(JSON.stringify({
      success: true,
      message: 'Magic link sent to your email'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Magic link error:', error);

    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to send magic link',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Handle OPTIONS for CORS
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