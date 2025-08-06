/**
 * Magic Link Verification Endpoint
 * 
 * Verifies magic link tokens and creates user sessions
 */

interface Env {
  DB: D1Database;
  SESSIONS: KVNamespace;
  JWT_SECRET?: string;
}

interface VerifyTokenRequest {
  token: string;
  tenant_domain?: string;
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

// Generate refresh token
function generateRefreshToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const body: VerifyTokenRequest = await request.json();
    
    if (!body.token) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Token is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!env.JWT_SECRET) {
      return new Response(JSON.stringify({
        success: false,
        error: 'JWT service not configured'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get token data from KV
    const tokenDataJson = await env.SESSIONS.get(`magic_link:${body.token}`);
    
    if (!tokenDataJson) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid or expired token'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const tokenData = JSON.parse(tokenDataJson);

    // Get user from database
    const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(tokenData.user_id).first();
    
    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: 'User not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get client/tenant info
    const client = await env.DB.prepare('SELECT * FROM clients WHERE id = ?').bind(tokenData.client_id).first();

    // Update user's last login
    await env.DB.prepare('UPDATE users SET updated_at = datetime("now") WHERE id = ?').bind(user.id).run();

    // Create access token (1 hour expiration)
    const accessTokenPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      tenant_id: tokenData.tenant_id,
      client_id: tokenData.client_id,
      role: user.id === client?.owner_id ? 'admin' : 'client',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
    };

    const accessToken = await createJWT(accessTokenPayload, env.JWT_SECRET);

    // Create refresh token (30 days)
    const refreshToken = generateRefreshToken();
    const refreshTokenData = {
      user_id: user.id,
      client_id: tokenData.client_id,
      tenant_id: tokenData.tenant_id,
      created_at: Date.now(),
    };

    // Store refresh token in KV (30 days)
    await env.SESSIONS.put(`refresh_token:${refreshToken}`, JSON.stringify(refreshTokenData), {
      expirationTtl: 30 * 24 * 60 * 60, // 30 days
    });

    // Delete the used magic link token
    await env.SESSIONS.delete(`magic_link:${body.token}`);

    console.log('Magic link verified successfully for:', user.email);

    // Return session data
    return new Response(JSON.stringify({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
        provider: user.provider,
        tenant_id: tokenData.tenant_id,
        role: user.id === client?.owner_id ? 'admin' : 'client',
        created_at: user.created_at,
      },
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: (Date.now() + (60 * 60 * 1000)), // 1 hour from now
      tenant_id: tokenData.tenant_id,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Magic link verification error:', error);

    return new Response(JSON.stringify({
      success: false,
      error: 'Token verification failed',
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