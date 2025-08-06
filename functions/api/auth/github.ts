/**
 * GitHub OAuth Authentication Endpoint
 * 
 * Handles GitHub OAuth flow for multi-tenant authentication
 * Works with any domain/subdomain without needing separate OAuth apps
 */

interface Env {
  DB: D1Database;
  SESSIONS: KVNamespace;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  JWT_SECRET?: string;
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

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  
  const tenantDomain = url.searchParams.get('tenant_domain') || 'cozyartzmedia.com';
  const redirectUrl = url.searchParams.get('redirect_url') || `https://${tenantDomain}/auth/callback`;

  if (!env.GITHUB_CLIENT_ID) {
    return new Response('GitHub OAuth not configured', { status: 500 });
  }

  // Generate state for CSRF protection
  const state = crypto.randomUUID();
  
  // Store state in KV for verification
  await env.SESSIONS.put(`oauth_state:${state}`, JSON.stringify({
    tenant_domain: tenantDomain,
    redirect_url: redirectUrl,
    created_at: Date.now(),
  }), {
    expirationTtl: 600, // 10 minutes
  });

  // GitHub OAuth URL - supports any redirect URI in our domain
  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
  githubAuthUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  githubAuthUrl.searchParams.set('redirect_uri', `https://cozyartzmedia.com/api/auth/github/callback`);
  githubAuthUrl.searchParams.set('scope', 'user:email');
  githubAuthUrl.searchParams.set('state', state);

  return Response.redirect(githubAuthUrl.toString(), 302);
};

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
};