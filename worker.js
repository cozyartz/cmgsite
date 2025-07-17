// Production Cloudflare Worker with proper OAuth
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Content-Type': 'application/json',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {

      // GitHub OAuth initiation
      if (path === '/api/auth/github' && request.method === 'GET') {
        if (!env.GITHUB_CLIENT_ID) {
          return new Response(JSON.stringify({ error: 'GitHub OAuth not configured' }), {
            status: 500,
            headers: corsHeaders
          });
        }

        const state = generateRandomString(32);
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent('https://cmgsite-client-portal.cozyartz-media-group.workers.dev/api/auth/github/callback')}&scope=user:email&state=${state}`;
        
        return Response.redirect(githubAuthUrl, 302);
      }

      // GitHub OAuth callback
      if (path === '/api/auth/github/callback' && request.method === 'GET') {
        const urlParams = new URLSearchParams(url.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        if (!code) {
          return Response.redirect('https://cozyartzmedia.com/auth?error=github_auth_failed', 302);
        }

        try {
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
              code: code,
            }),
          });

          const tokenData = await tokenResponse.json();
          
          if (!tokenData.access_token) {
            return Response.redirect('https://cozyartzmedia.com/auth?error=github_token_failed', 302);
          }

          // Get user info from GitHub
          const userResponse = await fetch('https://api.github.com/user', {
            headers: {
              'Authorization': `Bearer ${tokenData.access_token}`,
              'User-Agent': 'CMGSite-Auth/1.0',
            },
          });

          const userData = await userResponse.json();
          
          // Create JWT token for our app
          const jwtPayload = {
            sub: `github_${userData.id}`,
            email: userData.email || `${userData.login}@github.local`,
            name: userData.name || userData.login,
            avatar_url: userData.avatar_url,
            provider: 'github',
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
          };

          const token = await createJWT(jwtPayload, env.JWT_SECRET);
          
          // Redirect to frontend with token
          return Response.redirect(`https://cozyartzmedia.com/auth?token=${token}`, 302);

        } catch (error) {
          console.error('GitHub OAuth error:', error);
          return Response.redirect('https://cozyartzmedia.com/auth?error=github_auth_error', 302);
        }
      }

      // Google OAuth initiation  
      if (path === '/api/auth/google' && request.method === 'GET') {
        if (!env.GOOGLE_CLIENT_ID) {
          return new Response(JSON.stringify({ error: 'Google OAuth not configured' }), {
            status: 500,
            headers: corsHeaders
          });
        }

        const state = generateRandomString(32);
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent('https://cozyartzmedia.com/api/auth/google/callback')}&scope=openid%20email%20profile&response_type=code&state=${state}`;
        
        return Response.redirect(googleAuthUrl, 302);
      }

      // Google OAuth callback
      if (path === '/api/auth/google/callback' && request.method === 'GET') {
        const urlParams = new URLSearchParams(url.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        if (!code) {
          return Response.redirect('https://cozyartzmedia.com/auth?error=google_auth_failed', 302);
        }

        try {
          // Exchange code for access token
          const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              client_id: env.GOOGLE_CLIENT_ID,
              client_secret: env.GOOGLE_CLIENT_SECRET,
              code: code,
              grant_type: 'authorization_code',
              redirect_uri: 'https://cozyartzmedia.com/api/auth/google/callback',
            }),
          });

          const tokenData = await tokenResponse.json();
          
          if (!tokenData.access_token) {
            return Response.redirect('https://cozyartzmedia.com/auth?error=google_token_failed', 302);
          }

          // Get user info from Google
          const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`);
          const userData = await userResponse.json();
          
          // Create JWT token for our app
          const jwtPayload = {
            sub: `google_${userData.id}`,
            email: userData.email,
            name: userData.name,
            avatar_url: userData.picture,
            provider: 'google',
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
          };

          const token = await createJWT(jwtPayload, env.JWT_SECRET);
          
          // Redirect to frontend with token
          return Response.redirect(`https://cozyartzmedia.com/auth?token=${token}`, 302);

        } catch (error) {
          console.error('Google OAuth error:', error);
          return Response.redirect('https://cozyartzmedia.com/auth?error=google_auth_error', 302);
        }
      }

      // Email/password login endpoint
      if (path === '/api/auth/login' && request.method === 'POST') {
        const { email, password } = await request.json();
        
        // For now, accept test credentials - replace with real DB lookup
        if (email === 'test@cozyartzmedia.com' && password === 'TestPass123@') {
          const jwtPayload = {
            sub: 'user_test_001',
            email: 'test@cozyartzmedia.com',
            name: 'Test User',
            provider: 'email',
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
          };

          const token = await createJWT(jwtPayload, env.JWT_SECRET);
          
          return new Response(JSON.stringify({
            token: token,
            user: {
              id: 'user_test_001',
              email: 'test@cozyartzmedia.com',
              name: 'Test User',
              avatar_url: '',
              provider: 'email',
              role: 'user'
            },
            client: {
              id: 'client_test_001',
              name: 'Test Client',
              subscription_tier: 'starter',
              ai_calls_limit: 100,
              ai_calls_used: 0,
              status: 'active',
              role: 'owner'
            }
          }), {
            headers: corsHeaders
          });
        } else {
          return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
            status: 401,
            headers: corsHeaders
          });
        }
      }

      // Token verification endpoint
      if (path === '/api/auth/verify' && request.method === 'GET') {
        const token = request.headers.get('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
          return new Response(JSON.stringify({ error: 'No token provided' }), {
            status: 401,
            headers: corsHeaders
          });
        }

        try {
          const payload = await verifyJWT(token, env.JWT_SECRET);
          
          return new Response(JSON.stringify({
            user: {
              id: payload.sub,
              email: payload.email,
              name: payload.name,
              avatar_url: payload.avatar_url || '',
              provider: payload.provider,
              role: 'user'
            },
            client: {
              id: 'client_test_001',
              name: 'Test Client',
              subscription_tier: 'starter',
              ai_calls_limit: 100,
              ai_calls_used: 0,
              status: 'active',
              role: 'owner'
            }
          }), {
            headers: corsHeaders
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: 'Invalid token' }), {
            status: 401,
            headers: corsHeaders
          });
        }
      }

      // Default response
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: corsHeaders
      });

    } catch (error) {
      return new Response(JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};

// Helper functions
function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function createJWT(payload, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '');
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '');
  
  const message = encodedHeader + '.' + encodedPayload;
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, '');
  
  return message + '.' + encodedSignature;
}

async function verifyJWT(token, secret) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token format');

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const message = parts[0] + '.' + parts[1];
  const signature = Uint8Array.from(atob(parts[2]), c => c.charCodeAt(0));
  
  const isValid = await crypto.subtle.verify('HMAC', key, signature, encoder.encode(message));
  if (!isValid) throw new Error('Invalid signature');

  const payload = JSON.parse(atob(parts[1]));
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired');
  }

  return payload;
}