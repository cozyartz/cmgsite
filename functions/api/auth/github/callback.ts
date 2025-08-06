/**
 * GitHub OAuth Callback Endpoint
 * 
 * Handles GitHub OAuth callback and creates user sessions
 */

interface Env {
  DB: D1Database;
  SESSIONS: KVNamespace;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  JWT_SECRET?: string;
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

// Get or create user in database
async function getOrCreateUser(db: D1Database, githubUser: any, tenantId: string): Promise<any> {
  // Try to find existing user by GitHub ID or email
  let user = await db.prepare('SELECT * FROM users WHERE provider = ? AND provider_id = ?')
    .bind('github', githubUser.id.toString()).first();
  
  if (!user && githubUser.email) {
    // Try to find by email
    user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(githubUser.email).first();
    
    if (user) {
      // Update existing user with GitHub info
      await db.prepare(`
        UPDATE users 
        SET provider = 'github', provider_id = ?, avatar_url = ?, updated_at = datetime('now')
        WHERE id = ?
      `).bind(githubUser.id.toString(), githubUser.avatar_url, user.id).run();
    }
  }
  
  if (!user) {
    // Create new user
    const userId = crypto.randomUUID();
    await db.prepare(`
      INSERT INTO users (id, email, name, avatar_url, provider, provider_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'github', ?, datetime('now'), datetime('now'))
    `).bind(
      userId, 
      githubUser.email || `${githubUser.login}@github.local`,
      githubUser.name || githubUser.login,
      githubUser.avatar_url,
      githubUser.id.toString()
    ).run();
    
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
    `).bind(clientId, `${githubUser.name || githubUser.login}'s Organization`, domain, user.id).run();
    
    client = await db.prepare('SELECT * FROM clients WHERE id = ?').bind(clientId).first();
  }
  
  return { user, client };
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

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  // Handle OAuth errors
  if (error) {
    const redirectUrl = `https://cozyartzmedia.com/auth/error?error=${encodeURIComponent(error)}`;
    return Response.redirect(redirectUrl, 302);
  }

  if (!code || !state) {
    const redirectUrl = `https://cozyartzmedia.com/auth/error?error=missing_code_or_state`;
    return Response.redirect(redirectUrl, 302);
  }

  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET || !env.JWT_SECRET) {
    const redirectUrl = `https://cozyartzmedia.com/auth/error?error=oauth_not_configured`;
    return Response.redirect(redirectUrl, 302);
  }

  try {
    // Verify state
    const stateDataJson = await env.SESSIONS.get(`oauth_state:${state}`);
    if (!stateDataJson) {
      const redirectUrl = `https://cozyartzmedia.com/auth/error?error=invalid_state`;
      return Response.redirect(redirectUrl, 302);
    }

    const stateData = JSON.parse(stateDataJson);
    const tenantId = getTenantIdFromDomain(stateData.tenant_domain);

    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      const redirectUrl = `https://cozyartzmedia.com/auth/error?error=${encodeURIComponent(tokenData.error)}`;
      return Response.redirect(redirectUrl, 302);
    }

    // Get user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const githubUser = await userResponse.json();

    // Get user emails
    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        'Authorization': `token ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const emails = await emailResponse.json();
    const primaryEmail = emails.find((email: any) => email.primary)?.email || githubUser.email;
    githubUser.email = primaryEmail;

    // Get or create user and tenant
    const { user, client } = await getOrCreateUser(env.DB, githubUser, tenantId);

    // Create access token (1 hour expiration)
    const accessTokenPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      tenant_id: tenantId,
      client_id: client.id,
      role: user.id === client?.owner_id ? 'admin' : 'client',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
    };

    const accessToken = await createJWT(accessTokenPayload, env.JWT_SECRET);

    // Create refresh token (30 days)
    const refreshToken = generateRefreshToken();
    const refreshTokenData = {
      user_id: user.id,
      client_id: client.id,
      tenant_id: tenantId,
      created_at: Date.now(),
    };

    // Store refresh token in KV (30 days)
    await env.SESSIONS.put(`refresh_token:${refreshToken}`, JSON.stringify(refreshTokenData), {
      expirationTtl: 30 * 24 * 60 * 60, // 30 days
    });

    // Clean up OAuth state
    await env.SESSIONS.delete(`oauth_state:${state}`);

    console.log('GitHub OAuth success for:', user.email, 'tenant:', tenantId);

    // Create session data for redirect
    const sessionData = {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
        provider: user.provider,
        tenant_id: tenantId,
        role: user.id === client?.owner_id ? 'admin' : 'client',
        created_at: user.created_at,
      },
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: (Date.now() + (60 * 60 * 1000)), // 1 hour from now
      tenant_id: tenantId,
    };

    // Store session temporarily for pickup by frontend
    const sessionKey = `auth_session:${crypto.randomUUID()}`;
    await env.SESSIONS.put(sessionKey, JSON.stringify(sessionData), {
      expirationTtl: 300, // 5 minutes
    });

    // Redirect to callback page with session key
    const redirectUrl = `${stateData.redirect_url}?session=${sessionKey.replace('auth_session:', '')}`;
    return Response.redirect(redirectUrl, 302);

  } catch (error) {
    console.error('GitHub OAuth error:', error);
    const redirectUrl = `https://cozyartzmedia.com/auth/error?error=oauth_failed`;
    return Response.redirect(redirectUrl, 302);
  }
};

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
};