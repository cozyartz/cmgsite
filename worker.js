/**
 * Environment-Aware Cloudflare Worker
 * Uses environment variables instead of hardcoded URLs for maintainability
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Environment configuration with fallbacks
    const config = {
      environment: env.ENVIRONMENT || 'production',
      debug: env.DEBUG_MODE === 'true',
      enableDebugEndpoint: env.ENABLE_DEBUG_ENDPOINT === 'true',
      
      frontend: {
        baseUrl: env.FRONTEND_BASE_URL || 'https://cozyartzmedia.com',
        authUrl: env.FRONTEND_AUTH_URL || 'https://cozyartzmedia.com/auth',
        clientPortalUrl: env.FRONTEND_CLIENT_PORTAL_URL || 'https://cozyartzmedia.com/client-portal',
        adminUrl: env.FRONTEND_ADMIN_URL || 'https://cozyartzmedia.com/admin',
        superAdminUrl: env.FRONTEND_SUPERADMIN_URL || 'https://cozyartzmedia.com/superadmin',
      },
      
      api: {
        baseUrl: env.API_BASE_URL || 'https://cmgsite-client-portal.cozyartz-media-group.workers.dev',
      },
      
      oauth: {
        github: {
          redirectUri: env.GITHUB_REDIRECT_URI || 'https://cmgsite-client-portal.cozyartz-media-group.workers.dev/api/auth/github/callback',
        },
        google: {
          redirectUri: env.GOOGLE_REDIRECT_URI || 'https://cmgsite-client-portal.cozyartz-media-group.workers.dev/api/auth/google/callback',
        },
      },
    };

    // Logging helper
    const log = (level, message, ...args) => {
      if (config.debug || level === 'error') {
        console[level](`[${config.environment.toUpperCase()}] ${message}`, ...args);
      }
    };

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
      log('debug', `Request: ${request.method} ${path}`);
      
      // Version check endpoint
      if (path === '/api/version' && request.method === 'GET') {
        return new Response(JSON.stringify({ 
          version: '3.0', 
          environment: config.environment,
          timestamp: new Date().toISOString(),
          path: path,
          debug: config.debug,
        }), {
          headers: corsHeaders
        });
      }


      // Debug endpoint (only enabled in staging/development)
      if (path === '/debug/oauth' && request.method === 'GET' && config.enableDebugEndpoint) {
        return handleDebugOAuth(url, env, config, log);
      }

      // GitHub OAuth initiation
      if (path === '/api/auth/github' && request.method === 'GET') {
        return handleGitHubOAuth(env, config, log);
      }

      // GitHub OAuth callback
      if (path === '/api/auth/github/callback' && request.method === 'GET') {
        return handleGitHubCallback(url, env, config, log);
      }

      // Google OAuth initiation  
      if (path === '/api/auth/google' && request.method === 'GET') {
        return handleGoogleOAuth(env, config, log);
      }

      // Google OAuth callback
      if (path === '/api/auth/google/callback' && request.method === 'GET') {
        return handleGoogleCallback(url, env, config, log);
      }

      // Email/password login endpoint
      if (path === '/api/auth/login' && request.method === 'POST') {
        return handleEmailLogin(request, env, config, log);
      }

      // Token verification endpoint
      if (path === '/api/auth/verify' && request.method === 'GET') {
        return handleTokenVerification(request, env, config, log);
      }

      // Coupon validation endpoint
      if (path === '/api/coupons/validate' && request.method === 'POST') {
        return handleCouponValidation(request, env, config, log);
      }

      // Billing prepayment quote endpoint
      if (path === '/api/billing/prepay-quote' && request.method === 'POST') {
        return handlePrepaymentQuote(request, env, config, log);
      }

      // Payment endpoints
      if (path === '/api/payment/create' && request.method === 'POST') {
        return handlePaymentCreate(request, env, config, log);
      }

      if (path === '/api/payment/capture' && request.method === 'POST') {
        return handlePaymentCapture(request, env, config, log);
      }

      if (path === '/api/payment/prepayment' && request.method === 'POST') {
        return handlePrepaymentCreate(request, env, config, log);
      }

      // Default response
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: corsHeaders
      });

    } catch (error) {
      log('error', 'Unhandled error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal server error',
        message: config.debug ? error.message : 'An error occurred',
      }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};

// OAuth and auth handlers
async function handleDebugOAuth(url, env, config, log) {
  const urlParams = new URLSearchParams(url.search);
  const token = urlParams.get('token');
  
  if (!token) {
    return new Response('No token provided', { status: 400 });
  }

  try {
    const payload = await verifyJWT(token, env.JWT_SECRET);
    const authorizedEmails = ['cozy2963@gmail.com', 'andrea@cozyartzmedia.com'];
    const authorizedGitHubUsers = ['cozyartz'];
    
    const isSuperAdmin = (
      (payload.provider === 'google' && payload.email && authorizedEmails.includes(payload.email)) ||
      (payload.provider === 'github' && payload.github_username && authorizedGitHubUsers.includes(payload.github_username))
    );

    const debugHtml = createDebugHtml(payload, isSuperAdmin, config, token);

    return new Response(debugHtml, {
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(`Token verification failed: ${error.message}`, { 
      status: 400,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

async function handleGitHubOAuth(env, config, log) {
  if (!env.GITHUB_CLIENT_ID) {
    return new Response(JSON.stringify({ error: 'GitHub OAuth not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const state = generateRandomString(32);
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(config.oauth.github.redirectUri)}&scope=user:email&state=${state}`;
  
  log('debug', 'GitHub OAuth redirect:', githubAuthUrl);
  return Response.redirect(githubAuthUrl, 302);
}

async function handleGitHubCallback(url, env, config, log) {
  const urlParams = new URLSearchParams(url.search);
  const code = urlParams.get('code');
  const error = urlParams.get('error');

  if (error) {
    return Response.redirect(buildErrorUrl(config, `github_${error}`), 302);
  }

  if (!code) {
    return Response.redirect(buildErrorUrl(config, 'github_auth_failed'), 302);
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'CMGSite-OAuth/1.0'
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code: code,
        redirect_uri: config.oauth.github.redirectUri
      }),
    });

    if (!tokenResponse.ok) {
      log('error', 'GitHub token request failed:', tokenResponse.status);
      return Response.redirect(buildErrorUrl(config, 'github_token_request_failed'), 302);
    }

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      log('error', 'No access token in response:', tokenData);
      return Response.redirect(buildErrorUrl(config, 'github_token_failed'), 302);
    }

    // Get user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'User-Agent': 'CMGSite-Auth/1.0',
        'Accept': 'application/vnd.github.v3+json'
      },
    });

    if (!userResponse.ok) {
      log('error', 'GitHub user request failed:', userResponse.status);
      return Response.redirect(buildErrorUrl(config, 'github_user_request_failed'), 302);
    }

    const userData = await userResponse.json();
    
    // Get email if not public
    let userEmail = userData.email;
    if (!userEmail) {
      const emailResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'User-Agent': 'CMGSite-Auth/1.0',
        },
      });
      const emails = await emailResponse.json();
      const primaryEmail = emails.find(e => e.primary);
      userEmail = primaryEmail ? primaryEmail.email : `${userData.login}@github.local`;
    }
    
    // Create JWT token
    const jwtPayload = {
      sub: `github_${userData.id}`,
      email: userEmail,
      name: userData.name || userData.login,
      avatar_url: userData.avatar_url,
      provider: 'github',
      github_username: userData.login,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
    };

    const token = await createJWT(jwtPayload, env.JWT_SECRET);
    
    // Redirect based on environment and debug settings
    if (config.enableDebugEndpoint) {
      return Response.redirect(`${config.api.baseUrl}/debug/oauth?token=${token}`, 302);
    } else {
      return Response.redirect(`${config.frontend.authUrl}?token=${token}`, 302);
    }

  } catch (error) {
    log('error', 'GitHub OAuth error:', error);
    return Response.redirect(buildErrorUrl(config, 'github_auth_error'), 302);
  }
}

async function handleGoogleOAuth(env, config, log) {
  if (!env.GOOGLE_CLIENT_ID) {
    return new Response(JSON.stringify({ error: 'Google OAuth not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const state = generateRandomString(32);
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(config.oauth.google.redirectUri)}&scope=openid%20email%20profile&response_type=code&state=${state}`;
  
  log('debug', 'Google OAuth redirect:', googleAuthUrl);
  return Response.redirect(googleAuthUrl, 302);
}

async function handleGoogleCallback(url, env, config, log) {
  const urlParams = new URLSearchParams(url.search);
  const code = urlParams.get('code');

  if (!code) {
    return Response.redirect(buildErrorUrl(config, 'google_auth_failed'), 302);
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
        redirect_uri: config.oauth.google.redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      return Response.redirect(buildErrorUrl(config, 'google_token_failed'), 302);
    }

    // Get user info from Google
    const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`);
    const userData = await userResponse.json();
    
    // Create JWT token
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
    
    // Redirect based on environment and debug settings
    if (config.enableDebugEndpoint) {
      return Response.redirect(`${config.api.baseUrl}/debug/oauth?token=${token}`, 302);
    } else {
      return Response.redirect(`${config.frontend.authUrl}?token=${token}`, 302);
    }

  } catch (error) {
    log('error', 'Google OAuth error:', error);
    return Response.redirect(buildErrorUrl(config, 'google_auth_error'), 302);
  }
}

async function handleEmailLogin(request, env, config, log) {
  const { email, password } = await request.json();
  
  // For now, accept test credentials
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
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleTokenVerification(request, env, config, log) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return new Response(JSON.stringify({ error: 'No token provided' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const payload = await verifyJWT(token, env.JWT_SECRET);
    
    // Check if user is superadmin
    const authorizedEmails = ['cozy2963@gmail.com', 'andrea@cozyartzmedia.com'];
    const authorizedGitHubUsers = ['cozyartz'];
    
    const isSuperAdmin = (
      (payload.provider === 'google' && payload.email && authorizedEmails.includes(payload.email)) ||
      (payload.provider === 'github' && payload.github_username && authorizedGitHubUsers.includes(payload.github_username))
    );
    
    log('debug', 'Token verification:', { email: payload.email, github_username: payload.github_username, isSuperAdmin });
    
    return new Response(JSON.stringify({
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        avatar_url: payload.avatar_url || '',
        provider: payload.provider,
        github_username: payload.github_username,
        role: isSuperAdmin ? 'admin' : 'user'
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
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Helper functions
function buildErrorUrl(config, error, details) {
  const params = new URLSearchParams({ error });
  if (details) params.set('details', details);
  return `${config.frontend.authUrl}?${params.toString()}`;
}

function createDebugHtml(payload, isSuperAdmin, config, token) {
  const authorizedEmails = ['cozy2963@gmail.com', 'andrea@cozyartzmedia.com'];
  const redirectUrl = `${config.frontend.authUrl}?token=${token}`;
  
  return `
<!DOCTYPE html>
<html>
<head>
    <title>OAuth Debug - ${config.environment.toUpperCase()}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .success { color: green; }
        .info { color: blue; }
        .error { color: red; }
        pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
        .env-badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .env-production { background: #dc3545; color: white; }
        .env-staging { background: #ffc107; color: black; }
        .env-development { background: #28a745; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <h1>OAuth Debug Results <span class="env-badge env-${config.environment}">${config.environment.toUpperCase()}</span></h1>
        <div class="success">✅ Token verified successfully!</div>
        
        <h2>Environment Configuration:</h2>
        <pre>${JSON.stringify({
          environment: config.environment,
          debug: config.debug,
          frontend: config.frontend,
          enableDebugEndpoint: config.enableDebugEndpoint
        }, null, 2)}</pre>
        
        <h2>User Data:</h2>
        <pre>${JSON.stringify(payload, null, 2)}</pre>
        
        <h2>Superadmin Check:</h2>
        <p><strong>Email:</strong> ${payload.email}</p>
        <p><strong>Provider:</strong> ${payload.provider}</p>
        <p><strong>GitHub Username:</strong> ${payload.github_username || 'N/A'}</p>
        <p><strong>Authorized Emails:</strong> ${authorizedEmails.join(', ')}</p>
        <p><strong>Is SuperAdmin:</strong> <span class="${isSuperAdmin ? 'success' : 'info'}">${isSuperAdmin}</span></p>
        
        ${isSuperAdmin ? 
          '<div class="success"><h3>✅ SuperAdmin Access Detected!</h3><p>Redirecting to auth page for dashboard routing in 3 seconds...</p><p>If redirect fails, <a href="' + redirectUrl + '">click here</a></p></div>' :
          '<div class="info"><h3>ℹ️ Regular User Access</h3><p>Redirecting to auth page for dashboard routing in 3 seconds...</p><p>If redirect fails, <a href="' + redirectUrl + '">click here</a></p></div>'
        }
        
        <div style="margin-top: 20px; padding: 10px; background: #e9ecef; border-radius: 4px;">
            <small><strong>Redirect URL:</strong> ${redirectUrl}</small>
        </div>
    </div>
    
    <script>
        console.log('Debug data:', ${JSON.stringify(payload)});
        console.log('SuperAdmin status:', ${isSuperAdmin});
        console.log('Storing token in localStorage and redirecting to auth page');
        
        // Store token in localStorage for immediate access
        localStorage.setItem('auth_token', '${token}');
        
        // Always redirect to auth page - let frontend handle dashboard routing
        setTimeout(() => { 
          window.location.href = "${redirectUrl}"; 
        }, 3000);
    </script>
</body>
</html>`;
}

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

// Coupon validation handler
async function handleCouponValidation(request, env, config, log) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return new Response(JSON.stringify({ 
        valid: false, 
        error: 'Coupon code is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Define available coupons
    const coupons = {
      'JON250': {
        code: 'JON250',
        discount_amount_cents: 25000, // $250 off
        discount_type: 'fixed',
        description: 'Special pricing for Jon Werbeck - $250 off per month',
        valid: true
      },
      'AMYFREE': {
        code: 'AMYFREE',
        discount_amount_cents: 100000, // 100% off (free)
        discount_type: 'percentage',
        description: '6 months free Starter tier for Amy Tipton',
        valid: true
      },
      'AMYCOMPANY40': {
        code: 'AMYCOMPANY40',
        discount_amount_cents: 40, // 40% off
        discount_type: 'percentage',
        description: '40% off any tier for first year for Amy\'s company',
        valid: true
      }
    };

    const coupon = coupons[code.toUpperCase()];

    if (coupon) {
      return new Response(JSON.stringify({
        valid: true,
        coupon: coupon
      }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    } else {
      return new Response(JSON.stringify({
        valid: false,
        error: 'Invalid coupon code'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
  } catch (error) {
    log('error', 'Coupon validation error:', error);
    return new Response(JSON.stringify({
      valid: false,
      error: 'Failed to validate coupon'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

// Prepayment quote handler
async function handlePrepaymentQuote(request, env, config, log) {
  try {
    const body = await request.json();
    const { tier, couponCode } = body;

    // Define tier pricing (in cents)
    const tierPricing = {
      starter: { price: 100000, aiCalls: 100, domainLimit: 1 },
      starterPlus: { price: 125000, aiCalls: 150, domainLimit: 2 },
      growth: { price: 150000, aiCalls: 250, domainLimit: 5 },
      growthPlus: { price: 200000, aiCalls: 400, domainLimit: 10 },
      enterprise: { price: 250000, aiCalls: 500, domainLimit: 25 },
      enterprisePlus: { price: 350000, aiCalls: 1000, domainLimit: 50 }
    };

    const tierData = tierPricing[tier];
    if (!tierData) {
      return new Response(JSON.stringify({
        error: 'Invalid tier'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    let basePrice = tierData.price;
    let couponDiscount = 0;

    // Apply coupon if provided
    if (couponCode) {
      const coupons = {
        'JON250': { discount_amount_cents: 25000, discount_type: 'fixed' },
        'AMYFREE': { discount_amount_cents: 100, discount_type: 'percentage' },
        'AMYCOMPANY40': { discount_amount_cents: 40, discount_type: 'percentage' }
      };

      const coupon = coupons[couponCode.toUpperCase()];
      if (coupon) {
        if (coupon.discount_type === 'percentage') {
          couponDiscount = Math.round(basePrice * (coupon.discount_amount_cents / 100));
        } else {
          couponDiscount = coupon.discount_amount_cents;
        }
      }
    }

    const monthlyPrice = Math.max(0, basePrice - couponDiscount);
    const threeMonthTotal = monthlyPrice * 3;
    const prepaymentDiscount = 10; // 10% off for prepayment
    const prepaymentTotal = Math.round(threeMonthTotal * (1 - prepaymentDiscount / 100));
    const totalSavings = threeMonthTotal - prepaymentTotal;
    const perMonthEquivalent = Math.round(prepaymentTotal / 3);

    return new Response(JSON.stringify({
      tier,
      basePrice,
      couponDiscount,
      monthlyPrice,
      threeMonthTotal,
      prepaymentTotal,
      totalSavings,
      perMonthEquivalent
    }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });

  } catch (error) {
    log('error', 'Prepayment quote error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to generate quote'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

// Payment creation handler
async function handlePaymentCreate(request, env, config, log) {
  try {
    const body = await request.json();
    
    // Mock PayPal order creation for now
    const orderId = 'ORDER_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    return new Response(JSON.stringify({
      orderId,
      paymentId: orderId,
      status: 'created'
    }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });

  } catch (error) {
    log('error', 'Payment creation error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to create payment'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

// Payment capture handler
async function handlePaymentCapture(request, env, config, log) {
  try {
    const body = await request.json();
    const { orderId, paymentId } = body;
    
    // Mock PayPal payment capture for now
    return new Response(JSON.stringify({
      id: orderId,
      status: 'COMPLETED',
      payment: {
        id: paymentId,
        status: 'captured'
      }
    }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });

  } catch (error) {
    log('error', 'Payment capture error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to capture payment'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

// Prepayment creation handler
async function handlePrepaymentCreate(request, env, config, log) {
  try {
    const body = await request.json();
    
    // Mock prepayment order creation
    const prepaymentId = 'PREPAY_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const orderId = 'ORDER_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    return new Response(JSON.stringify({
      orderId,
      prepaymentId,
      status: 'created'
    }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });

  } catch (error) {
    log('error', 'Prepayment creation error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to create prepayment'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}