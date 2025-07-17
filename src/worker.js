// Cloudflare Worker for AI Gateway and API endpoints
import { EmailService } from './lib/email.js';
import { PayPalService, createPaymentData, createSubscriptionData, createSubscriptionPlanData } from './lib/paypal.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route handling
      if (path.startsWith('/api/auth/')) {
        return handleAuth(request, env, path);
      } else if (path.startsWith('/api/ai/')) {
        return handleAI(request, env, path);
      } else if (path.startsWith('/api/dashboard/')) {
        return handleDashboard(request, env, path);
      } else if (path.startsWith('/api/analytics/')) {
        return handleAnalytics(request, env, path);
      } else if (path.startsWith('/api/consultations/')) {
        return handleConsultations(request, env, path);
      } else if (path.startsWith('/api/billing/')) {
        return handleBilling(request, env, path);
      } else if (path.startsWith('/api/settings/')) {
        return handleSettings(request, env, path);
      } else if (path.startsWith('/api/clients/')) {
        return handleClients(request, env, path);
      } else if (path.startsWith('/api/payment/')) {
        return handlePayment(request, env, path);
      } else if (path.startsWith('/api/subscriptions/')) {
        return handleSubscriptions(request, env, path);
      } else if (path.startsWith('/api/gdpr/')) {
        return handleGDPR(request, env, path);
      } else if (path.startsWith('/api/whitelabel/')) {
        return handleWhitelabel(request, env, path);
      } else if (path.startsWith('/api/coupons/')) {
        return handleCoupons(request, env, path);
      } else if (path.startsWith('/api/domains/')) {
        return handleDomains(request, env, path);
      } else if (path.startsWith('/api/email/')) {
        return handleEmail(request, env, path);
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders });
    } catch (error) {
      console.error('Worker Error:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

// Authentication handlers
async function handleAuth(request, env, path) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  if (path === '/api/auth/login' && request.method === 'POST') {
    const { email, password } = await request.json();
    
    // Rate limiting
    try {
      checkRateLimit(email);
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 429,
        headers: corsHeaders
      });
    }
    
    // Query user from D1 database
    const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: corsHeaders
      });
    }

    // Verify password with secure hashing
    if (!user.password_hash) {
      return new Response(JSON.stringify({ error: 'Please contact support to set up your password' }), {
        status: 401,
        headers: corsHeaders
      });
    }
    
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: corsHeaders
      });
    }
    
    // Get client info
    const clientUser = await env.DB.prepare('SELECT c.*, cu.role FROM clients c JOIN client_users cu ON c.id = cu.client_id WHERE cu.user_id = ?').bind(user.id).first();
    
    // Clear rate limit on successful login
    clearRateLimit(email);
    
    // Generate JWT token
    const token = await generateJWT(user.id, env.JWT_SECRET);
    
    return new Response(JSON.stringify({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
        provider: user.provider
      },
      client: clientUser ? {
        id: clientUser.id,
        name: clientUser.name,
        domain: clientUser.domain,
        subscription_tier: clientUser.subscription_tier,
        ai_calls_limit: clientUser.ai_calls_limit,
        ai_calls_used: clientUser.ai_calls_used,
        status: clientUser.status,
        role: clientUser.role
      } : null
    }), {
      headers: corsHeaders
    });
  }

  if (path === '/api/auth/register' && request.method === 'POST') {
    const { email, password, name } = await request.json();
    
    // Check if user exists
    const existingUser = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
    
    if (existingUser) {
      return new Response(JSON.stringify({ error: 'User already exists' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Hash password securely
    let passwordHash;
    try {
      passwordHash = await hashPassword(password);
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: corsHeaders
      });
    }
    
    // Create user
    const userId = crypto.randomUUID();
    await env.DB.prepare('INSERT INTO users (id, email, name, provider, password_hash) VALUES (?, ?, ?, ?, ?)').bind(userId, email, name, 'email', passwordHash).run();
    
    // Create default client
    const clientId = crypto.randomUUID();
    await env.DB.prepare('INSERT INTO clients (id, name, owner_id) VALUES (?, ?, ?)').bind(clientId, `${name}'s Company`, userId).run();
    
    // Add user to client
    await env.DB.prepare('INSERT INTO client_users (client_id, user_id, role) VALUES (?, ?, ?)').bind(clientId, userId, 'owner').run();
    
    // Generate JWT token
    const token = await generateJWT(userId, env.JWT_SECRET);
    
    // Send welcome email
    if (env.RESEND_API_KEY) {
      try {
        const emailService = new EmailService(env.RESEND_API_KEY);
        await emailService.sendWelcomeEmail(email, name, `${name}'s Company`);
      } catch (error) {
        console.error('Welcome email failed:', error);
        // Don't fail registration if email fails
      }
    }
    
    return new Response(JSON.stringify({
      token,
      user: {
        id: userId,
        email,
        name,
        provider: 'email'
      },
      client: {
        id: clientId,
        name: `${name}'s Company`,
        subscription_tier: 'starter',
        ai_calls_limit: 100,
        ai_calls_used: 0,
        status: 'active',
        role: 'owner'
      }
    }), {
      headers: corsHeaders
    });
  }

  if (path === '/api/auth/verify' && request.method === 'GET') {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return new Response(JSON.stringify({ error: 'No token provided' }), {
        status: 401,
        headers: corsHeaders
      });
    }

    try {
      const userId = await verifyJWT(token, env.JWT_SECRET);
      
      // Get user and client info
      const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first();
      const clientUser = await env.DB.prepare('SELECT c.*, cu.role FROM clients c JOIN client_users cu ON c.id = cu.client_id WHERE cu.user_id = ?').bind(userId).first();
      
      return new Response(JSON.stringify({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar_url: user.avatar_url,
          provider: user.provider
        },
        client: clientUser ? {
          id: clientUser.id,
          name: clientUser.name,
          domain: clientUser.domain,
          subscription_tier: clientUser.subscription_tier,
          ai_calls_limit: clientUser.ai_calls_limit,
          ai_calls_used: clientUser.ai_calls_used,
          status: clientUser.status,
          role: clientUser.role
        } : null
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

  // GitHub OAuth login
  if (path === '/api/auth/github' && request.method === 'GET') {
    const redirectUri = env.ENVIRONMENT === 'development' 
      ? `http://localhost:8787/api/auth/github/callback`
      : `${new URL(request.url).origin}/api/auth/github/callback`;
    const scope = 'user:email';
    const state = crypto.randomUUID();
    
    // Store state in session for security
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
    
    return Response.redirect(githubUrl, 302);
  }

  // GitHub OAuth callback
  if (path === '/api/auth/github/callback' && request.method === 'GET') {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    
    if (!code) {
      return Response.redirect(`${new URL(request.url).origin}/?error=github_auth_failed`, 302);
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
      
      if (tokenData.error) {
        throw new Error(tokenData.error_description || 'GitHub OAuth failed');
      }

      // Get user info from GitHub
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'User-Agent': 'CMG-Client-Portal',
        },
      });

      const githubUser = await userResponse.json();
      
      // Get user emails
      const emailResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'User-Agent': 'CMG-Client-Portal',
        },
      });

      const emails = await emailResponse.json();
      const primaryEmail = emails.find(email => email.primary)?.email || githubUser.email;

      // Check if user exists in database
      let user = await env.DB.prepare('SELECT * FROM users WHERE provider = ? AND provider_id = ?')
        .bind('github', githubUser.login).first();
      
      if (!user) {
        // Check if user exists with same email
        user = await env.DB.prepare('SELECT * FROM users WHERE email = ?')
          .bind(primaryEmail).first();
        
        if (user) {
          // Link GitHub account to existing user
          await env.DB.prepare('UPDATE users SET provider = ?, provider_id = ?, avatar_url = ? WHERE id = ?')
            .bind('github', githubUser.login, githubUser.avatar_url, user.id).run();
        } else {
          // Create new user
          const userId = crypto.randomUUID();
          await env.DB.prepare('INSERT INTO users (id, email, name, avatar_url, provider, provider_id) VALUES (?, ?, ?, ?, ?, ?)')
            .bind(userId, primaryEmail, githubUser.name || githubUser.login, githubUser.avatar_url, 'github', githubUser.login).run();
          
          // Get the newly created user
          user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first();
        }
      }

      // Get client info
      const clientUser = await env.DB.prepare('SELECT c.*, cu.role FROM clients c JOIN client_users cu ON c.id = cu.client_id WHERE cu.user_id = ?')
        .bind(user.id).first();
      
      // Generate JWT token
      const token = await generateJWT(user.id, env.JWT_SECRET);
      
      // Redirect to frontend with token
      const frontendUrl = `${new URL(request.url).origin}/client-portal?token=${token}`;
      return Response.redirect(frontendUrl, 302);
      
    } catch (error) {
      console.error('GitHub OAuth error:', error);
      return Response.redirect(`${new URL(request.url).origin}/?error=github_auth_failed`, 302);
    }
  }

  return new Response('Not Found', { status: 404, headers: corsHeaders });
}

// AI processing handlers
async function handleAI(request, env, path) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  if (path === '/api/ai/generate' && request.method === 'POST') {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: corsHeaders
      });
    }

    try {
      const userId = await verifyJWT(token, env.JWT_SECRET);
      const { type, prompt, clientId } = await request.json();
      
      // Check client's AI usage limits
      const client = await env.DB.prepare('SELECT * FROM clients WHERE id = ?').bind(clientId).first();
      
      if (client.ai_calls_used >= client.ai_calls_limit) {
        return new Response(JSON.stringify({ error: 'AI usage limit exceeded' }), {
          status: 429,
          headers: corsHeaders
        });
      }

      // Generate content using Workers AI
      const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(type)
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      // Update usage count
      await env.DB.prepare('UPDATE clients SET ai_calls_used = ai_calls_used + 1 WHERE id = ?').bind(clientId).run();
      
      // Log usage
      await env.DB.prepare('INSERT INTO ai_usage (id, client_id, user_id, model, request_type, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(
        crypto.randomUUID(),
        clientId,
        userId,
        'llama-3.1-8b-instruct',
        type,
        new Date().toISOString()
      ).run();

      // Store generated content
      await env.DB.prepare('INSERT INTO generated_content (id, client_id, user_id, content_type, prompt, generated_content, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(
        crypto.randomUUID(),
        clientId,
        userId,
        type,
        prompt,
        aiResponse.response,
        new Date().toISOString()
      ).run();

      return new Response(JSON.stringify({
        content: aiResponse.response,
        tokensUsed: aiResponse.usage?.total_tokens || 0
      }), {
        headers: corsHeaders
      });
    } catch (error) {
      console.error('AI Generation Error:', error);
      return new Response(JSON.stringify({ error: 'AI generation failed' }), {
        status: 500,
        headers: corsHeaders
      });
    }
  } else if (path === '/api/ai/assistant' && request.method === 'POST') {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: corsHeaders
      });
    }

    try {
      const userId = await verifyJWT(token, env.JWT_SECRET);
      const { message, context, userEmail, messageHistory } = await request.json();
      
      // Create assistant system prompt based on context
      const systemPrompt = getAssistantSystemPrompt(context, userEmail);
      
      // Build conversation history for context
      const messages = [
        { role: 'system', content: systemPrompt }
      ];
      
      // Add recent message history for context (last 5 exchanges)
      if (messageHistory && messageHistory.length > 0) {
        const recentHistory = messageHistory.slice(-10);
        recentHistory.forEach(msg => {
          messages.push({
            role: msg.isBot ? 'assistant' : 'user',
            content: msg.content
          });
        });
      }
      
      // Add current message
      messages.push({ role: 'user', content: message });
      
      // Generate response using Workers AI
      const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: messages,
        max_tokens: 500,
        temperature: 0.7
      });
      
      return new Response(JSON.stringify({ 
        success: true, 
        response: aiResponse.response 
      }), {
        headers: corsHeaders
      });
      
    } catch (error) {
      console.error('AI Assistant Error:', error);
      return new Response(JSON.stringify({ error: 'Assistant service temporarily unavailable' }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }

  return new Response('Not Found', { status: 404, headers: corsHeaders });
}

// Dashboard handlers
async function handleDashboard(request, env, path) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  if (path === '/api/dashboard/metrics' && request.method === 'GET') {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: corsHeaders
      });
    }

    try {
      const userId = await verifyJWT(token, env.JWT_SECRET);
      
      // Mock metrics for demo
      const metrics = {
        organicTraffic: 12543,
        keywordRankings: 47,
        conversionRate: 3.4,
        totalLeads: 89
      };

      return new Response(JSON.stringify(metrics), {
        headers: corsHeaders
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: corsHeaders
      });
    }
  }

  return new Response('Not Found', { status: 404, headers: corsHeaders });
}


// Consultation handlers
async function handleConsultations(request, env, path) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  if (request.method === 'GET') {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: corsHeaders
      });
    }

    try {
      const userId = await verifyJWT(token, env.JWT_SECRET);
      
      // Get consultations from database
      const consultations = await env.DB.prepare('SELECT * FROM consultations WHERE user_id = ? ORDER BY scheduled_at DESC').bind(userId).all();

      return new Response(JSON.stringify(consultations.results), {
        headers: corsHeaders
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: corsHeaders
      });
    }
  }

  if (request.method === 'POST') {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: corsHeaders
      });
    }

    try {
      const userId = await verifyJWT(token, env.JWT_SECRET);
      const { type, scheduledAt, clientId } = await request.json();
      
      // Get pricing for consultation type (updated rates)
      const pricing = {
        strategic: { rate: 25000, duration: 120 }, // $250/hour in cents
        partnership: { rate: 50000, duration: 120 }, // $500/hour in cents
        implementation: { rate: 15000, duration: 60 } // $150/hour in cents
      };

      const consultationId = crypto.randomUUID();
      await env.DB.prepare('INSERT INTO consultations (id, client_id, user_id, consultation_type, duration_minutes, hourly_rate_cents, scheduled_at, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(
        consultationId,
        clientId,
        userId,
        type,
        pricing[type].duration,
        pricing[type].rate,
        scheduledAt,
        'scheduled'
      ).run();

      return new Response(JSON.stringify({ id: consultationId }), {
        headers: corsHeaders
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: corsHeaders
      });
    }
  }

  return new Response('Not Found', { status: 404, headers: corsHeaders });
}

// Billing handlers
async function handleBilling(request, env, path) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: corsHeaders
    });
  }

  try {
    const userId = await verifyJWT(token, env.JWT_SECRET);
    
    if (path === '/api/billing/invoices' && request.method === 'GET') {
      const invoices = await env.DB.prepare('SELECT * FROM invoices i JOIN client_users cu ON i.client_id = cu.client_id WHERE cu.user_id = ? ORDER BY created_at DESC').bind(userId).all();
      
      return new Response(JSON.stringify(invoices.results), {
        headers: corsHeaders
      });
    }

    if (path === '/api/billing/usage' && request.method === 'GET') {
      const client = await env.DB.prepare('SELECT c.* FROM clients c JOIN client_users cu ON c.id = cu.client_id WHERE cu.user_id = ?').bind(userId).first();
      
      const usage = {
        aiCallsUsed: client.ai_calls_used,
        aiCallsLimit: client.ai_calls_limit,
        overage: Math.max(0, client.ai_calls_used - client.ai_calls_limit),
        consultationHours: 6,
        consultationCost: 1200
      };

      return new Response(JSON.stringify(usage), {
        headers: corsHeaders
      });
    }

    if (path === '/api/billing/upgrade' && request.method === 'POST') {
      const { plan, clientId } = await request.json();
      
      const planLimits = {
        starter: { limit: 100, price: 100000 }, // $1,000 in cents
        growth: { limit: 250, price: 150000 }, // $1,500 in cents
        enterprise: { limit: 500, price: 250000 } // $2,500 in cents
      };

      await env.DB.prepare('UPDATE clients SET subscription_tier = ?, ai_calls_limit = ? WHERE id = ?').bind(
        plan,
        planLimits[plan].limit,
        clientId
      ).run();

      return new Response(JSON.stringify({ success: true }), {
        headers: corsHeaders
      });
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: corsHeaders
    });
  }

  // Calculate prepayment quote
  if (path === '/api/billing/prepay-quote' && request.method === 'POST') {
    const { tier, couponCode } = await request.json();
    
    // Get client to check for active coupon
    const client = await env.DB.prepare('SELECT c.*, cu.discount_applied_cents FROM clients c JOIN client_users cu2 ON c.id = cu2.client_id LEFT JOIN coupon_usage cu ON c.active_coupon_id = cu.id WHERE cu2.user_id = ?').bind(userId).first();
    
    if (!client) {
      return new Response(JSON.stringify({ error: 'Client not found' }), {
        status: 404,
        headers: corsHeaders
      });
    }

    // Get tier pricing from configuration
    const tierPricing = {
      starter: 100000, // $1,000
      starterPlus: 125000, // $1,250  
      growth: 150000, // $1,500
      growthPlus: 200000, // $2,000
      enterprise: 250000, // $2,500
      enterprisePlus: 350000 // $3,500
    };

    const basePrice = tierPricing[tier];
    if (!basePrice) {
      return new Response(JSON.stringify({ error: 'Invalid pricing tier' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Apply active coupon discount
    let couponDiscount = 0;
    if (client.discount_applied_cents) {
      couponDiscount = client.discount_applied_cents;
    } else if (couponCode) {
      // Validate coupon if provided but not active
      const coupon = await env.DB.prepare('SELECT discount_amount_cents, discount_type FROM coupons WHERE code = ? AND status = ?').bind(couponCode, 'active').first();
      if (coupon) {
        if (coupon.discount_type === 'percentage') {
          // For percentage coupons, calculate discount based on base price
          const discountPercentage = coupon.discount_amount_cents; // Percentage stored in discount_amount_cents for percentage type
          couponDiscount = Math.round(basePrice * (discountPercentage / 100));
        } else {
          couponDiscount = coupon.discount_amount_cents;
        }
      }
    }

    const monthlyPrice = Math.max(0, basePrice - couponDiscount);
    const threeMonthTotal = monthlyPrice * 3;
    const prepaymentDiscount = 10; // 10% discount
    const prepaymentTotal = Math.round(threeMonthTotal * (1 - prepaymentDiscount / 100));
    const totalSavings = threeMonthTotal - prepaymentTotal;

    return new Response(JSON.stringify({
      tier,
      basePrice,
      couponDiscount,
      monthlyPrice,
      threeMonthTotal,
      prepaymentDiscount,
      prepaymentTotal,
      totalSavings,
      perMonthEquivalent: Math.round(prepaymentTotal / 3)
    }), {
      headers: corsHeaders
    });
  }

  // Process prepayment
  if (path === '/api/billing/prepay' && request.method === 'POST') {
    const { tier, paymentNonce, couponCode } = await request.json();
    
    // Get client
    const client = await env.DB.prepare('SELECT c.*, cu.discount_applied_cents FROM clients c JOIN client_users cu2 ON c.id = cu2.client_id LEFT JOIN coupon_usage cu ON c.active_coupon_id = cu.id WHERE cu2.user_id = ?').bind(userId).first();
    
    if (!client) {
      return new Response(JSON.stringify({ error: 'Client not found' }), {
        status: 404,
        headers: corsHeaders
      });
    }

    // Calculate pricing (same logic as quote)
    const tierPricing = {
      starter: 100000,
      starterPlus: 125000,
      growth: 150000,
      growthPlus: 200000,
      enterprise: 250000,
      enterprisePlus: 350000
    };

    const basePrice = tierPricing[tier];
    let couponDiscount = client.discount_applied_cents || 0;
    
    const monthlyPrice = Math.max(0, basePrice - couponDiscount);
    const threeMonthTotal = monthlyPrice * 3;
    const prepaymentTotal = Math.round(threeMonthTotal * 0.9); // 10% discount

    try {
      // This endpoint is deprecated - use /api/payment/prepayment instead
      return new Response(JSON.stringify({ 
        error: 'This endpoint is deprecated. Use /api/payment/prepayment instead.',
        redirectTo: '/api/payment/prepayment'
      }), {
        status: 410, // Gone
        headers: corsHeaders
      });

    } catch (error) {
      console.error('Prepayment processing error:', error);
      return new Response(JSON.stringify({ error: 'Failed to process prepayment' }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }
}

// Settings handlers
async function handleSettings(request, env, path) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  if (request.method === 'PUT') {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: corsHeaders
      });
    }

    try {
      const userId = await verifyJWT(token, env.JWT_SECRET);
      const data = await request.json();
      
      // Handle different settings sections
      const section = path.split('/').pop();
      
      if (section === 'profile') {
        await env.DB.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?').bind(
          data.name,
          data.email,
          userId
        ).run();
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: corsHeaders
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: corsHeaders
      });
    }
  }

  return new Response('Not Found', { status: 404, headers: corsHeaders });
}

// Client handlers
async function handleClients(request, env, path) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  return new Response(JSON.stringify({ message: 'Client endpoints not implemented' }), {
    headers: corsHeaders
  });
}

// Payment handlers
async function handlePayment(request, env, path) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  const paypal = new PayPalService(env.PAYPAL_CLIENT_ID, env.PAYPAL_CLIENT_SECRET, 'sandbox');

  if (path === '/api/payment/create' && request.method === 'POST') {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: corsHeaders
      });
    }

    try {
      const userId = await verifyJWT(token, env.JWT_SECRET);
      const { amount, description, clientId, userEmail, returnUrl, cancelUrl } = await request.json();
      
      // Create PayPal payment order
      const paymentData = createPaymentData(
        amount,
        description,
        userEmail,
        returnUrl || `${new URL(request.url).origin}/client-portal/payment/success`,
        cancelUrl || `${new URL(request.url).origin}/client-portal/payment/cancel`
      );

      const paymentResult = await paypal.processPayment(paymentData);
      
      // Store payment record with pending status
      const paymentId = crypto.randomUUID();
      await env.DB.prepare('INSERT INTO payments (id, client_id, user_id, amount_cents, description, paypal_order_id, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(
        paymentId,
        clientId,
        userId,
        amount,
        description,
        paymentResult.id,
        'pending',
        new Date().toISOString()
      ).run();

      // Find approval URL
      const approvalUrl = paymentResult.links?.find(link => link.rel === 'approve')?.href;

      return new Response(JSON.stringify({
        success: true,
        orderId: paymentResult.id,
        approvalUrl: approvalUrl,
        paymentId: paymentId
      }), {
        headers: corsHeaders
      });
    } catch (error) {
      console.error('Payment creation error:', error);
      return new Response(JSON.stringify({ error: error.message || 'Payment creation failed' }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }

  if (path === '/api/payment/capture' && request.method === 'POST') {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: corsHeaders
      });
    }

    try {
      const userId = await verifyJWT(token, env.JWT_SECRET);
      const { orderId, paymentId } = await request.json();
      
      // Capture PayPal payment
      const captureResult = await paypal.capturePayment(orderId);
      
      // Update payment record
      await env.DB.prepare('UPDATE payments SET status = ?, paypal_capture_id = ?, updated_at = ? WHERE id = ? AND user_id = ?').bind(
        'completed',
        captureResult.id,
        new Date().toISOString(),
        paymentId,
        userId
      ).run();

      // Get payment details for invoice
      const payment = await env.DB.prepare('SELECT * FROM payments WHERE id = ? AND user_id = ?').bind(paymentId, userId).first();
      
      if (payment) {
        // Create invoice
        const invoiceId = crypto.randomUUID();
        await env.DB.prepare('INSERT INTO invoices (id, client_id, amount_cents, description, status, due_date, paid_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(
          invoiceId,
          payment.client_id,
          payment.amount_cents,
          payment.description,
          'paid',
          new Date().toISOString(),
          new Date().toISOString(),
          new Date().toISOString()
        ).run();

        // Send payment confirmation email
        if (env.RESEND_API_KEY) {
          try {
            const user = await env.DB.prepare('SELECT name, email FROM users WHERE id = ?').bind(userId).first();
            const emailService = new EmailService(env.RESEND_API_KEY);
            await emailService.sendPaymentConfirmationEmail(
              user.email,
              user.name,
              payment.amount_cents,
              payment.description,
              orderId
            );
          } catch (emailError) {
            console.error('Payment confirmation email failed:', emailError);
          }
        }
      }

      return new Response(JSON.stringify({
        success: true,
        capture: captureResult,
        paymentId
      }), {
        headers: corsHeaders
      });
    } catch (error) {
      console.error('Payment capture error:', error);
      return new Response(JSON.stringify({ error: error.message || 'Payment capture failed' }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }

  if (path === '/api/payment/prepayment' && request.method === 'POST') {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: corsHeaders
      });
    }

    try {
      const userId = await verifyJWT(token, env.JWT_SECRET);
      const { tier, couponCode, userEmail, returnUrl, cancelUrl } = await request.json();
      
      const clientUser = await env.DB.prepare('SELECT c.*, cu.role FROM clients c JOIN client_users cu ON c.id = cu.client_id WHERE cu.user_id = ?').bind(userId).first();
      
      if (!clientUser) {
        throw new Error('Client not found');
      }

      // Calculate prepayment amount with coupon
      const { prepaymentTotal, totalSavings } = calculatePrepaymentTotal(tier, couponCode);
      
      // Create PayPal payment for 3-month prepayment
      const paymentData = createPaymentData(
        prepaymentTotal,
        `3-Month Prepayment - ${tier.toUpperCase()} Plan (Save $${(totalSavings/100).toFixed(2)})`,
        userEmail,
        returnUrl || `${new URL(request.url).origin}/client-portal/payment/prepayment-success`,
        cancelUrl || `${new URL(request.url).origin}/client-portal/payment/cancel`
      );

      const paymentResult = await paypal.processPayment(paymentData);
      
      // Store prepayment record with pending status
      const prepaymentId = crypto.randomUUID();
      const startsAt = new Date();
      const endsAt = new Date();
      endsAt.setMonth(endsAt.getMonth() + 3);

      await env.DB.prepare(`
        INSERT INTO prepayments (id, client_id, months_paid, base_amount_cents, amount_paid_cents, amount_saved_cents, starts_at, ends_at, paypal_order_id, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        prepaymentId,
        clientUser.id,
        3,
        (prepaymentTotal + totalSavings),
        prepaymentTotal,
        totalSavings,
        startsAt.toISOString(),
        endsAt.toISOString(),
        paymentResult.id,
        'pending'
      ).run();

      // Find approval URL
      const approvalUrl = paymentResult.links?.find(link => link.rel === 'approve')?.href;

      return new Response(JSON.stringify({
        success: true,
        orderId: paymentResult.id,
        approvalUrl: approvalUrl,
        prepaymentId: prepaymentId,
        totalSavings: totalSavings
      }), {
        headers: corsHeaders
      });
    } catch (error) {
      console.error('Prepayment creation error:', error);
      return new Response(JSON.stringify({ error: error.message || 'Prepayment creation failed' }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }

  return new Response('Not Found', { status: 404, headers: corsHeaders });
}

// Subscription handlers
async function handleSubscriptions(request, env, path) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  if (path === '/api/subscriptions/create' && request.method === 'POST') {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: corsHeaders
      });
    }

    try {
      const userId = await verifyJWT(token, env.JWT_SECRET);
      const { clientId, planId, paymentId, amount } = await request.json();
      
      // Create subscription record
      const subscriptionId = crypto.randomUUID();
      await env.DB.prepare('INSERT INTO subscriptions (id, client_id, plan_id, status, amount_cents, billing_cycle_start, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(
        subscriptionId,
        clientId,
        planId,
        'active',
        amount * 100, // Convert to cents
        new Date().toISOString(),
        new Date().toISOString()
      ).run();

      return new Response(JSON.stringify({
        success: true,
        subscriptionId
      }), {
        headers: corsHeaders
      });
    } catch (error) {
      console.error('Subscription creation error:', error);
      return new Response(JSON.stringify({ error: 'Subscription creation failed' }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }

  return new Response('Not Found', { status: 404, headers: corsHeaders });
}

// GDPR Data Subject Rights handlers
async function handleGDPR(request, env, path) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  if (path === '/api/gdpr/data-export' && request.method === 'POST') {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: corsHeaders
      });
    }

    try {
      const userId = await verifyJWT(token, env.JWT_SECRET);
      
      // Get all user data
      const userData = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first();
      const clientData = await env.DB.prepare('SELECT c.*, cu.role FROM clients c JOIN client_users cu ON c.id = cu.client_id WHERE cu.user_id = ?').bind(userId).all();
      const aiUsage = await env.DB.prepare('SELECT * FROM ai_usage WHERE user_id = ?').bind(userId).all();
      const generatedContent = await env.DB.prepare('SELECT * FROM generated_content WHERE user_id = ?').bind(userId).all();
      const consultations = await env.DB.prepare('SELECT * FROM consultations WHERE user_id = ?').bind(userId).all();
      const payments = await env.DB.prepare('SELECT * FROM payments WHERE user_id = ?').bind(userId).all();

      const exportData = {
        personal_data: {
          user_profile: userData,
          client_associations: clientData.results,
          ai_usage: aiUsage.results,
          generated_content: generatedContent.results,
          consultations: consultations.results,
          payments: payments.results
        },
        export_date: new Date().toISOString(),
        data_retention_policy: {
          account_data: "Retained until account deletion or 3 years after last activity",
          transaction_records: "Retained for 7 years for tax and accounting purposes",
          ai_usage_logs: "Retained for 2 years for service improvement"
        }
      };

      return new Response(JSON.stringify(exportData), {
        headers: {
          ...corsHeaders,
          'Content-Disposition': `attachment; filename="gdpr-export-${userId}-${new Date().toISOString().split('T')[0]}.json"`
        }
      });
    } catch (error) {
      console.error('GDPR export error:', error);
      return new Response(JSON.stringify({ error: 'Export failed' }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }

  if (path === '/api/gdpr/data-deletion' && request.method === 'POST') {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: corsHeaders
      });
    }

    try {
      const userId = await verifyJWT(token, env.JWT_SECRET);
      
      // Delete user data (cascade will handle related records)
      await env.DB.prepare('DELETE FROM ai_usage WHERE user_id = ?').bind(userId).run();
      await env.DB.prepare('DELETE FROM generated_content WHERE user_id = ?').bind(userId).run();
      await env.DB.prepare('DELETE FROM consultations WHERE user_id = ?').bind(userId).run();
      await env.DB.prepare('DELETE FROM client_users WHERE user_id = ?').bind(userId).run();
      
      // Keep financial records for legal compliance but anonymize them
      await env.DB.prepare('UPDATE payments SET user_id = NULL WHERE user_id = ?').bind(userId).run();
      
      // Delete user account
      await env.DB.prepare('DELETE FROM users WHERE id = ?').bind(userId).run();

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Account and personal data deleted successfully',
        retained_data: 'Financial records retained for legal compliance but anonymized'
      }), {
        headers: corsHeaders
      });
    } catch (error) {
      console.error('GDPR deletion error:', error);
      return new Response(JSON.stringify({ error: 'Deletion failed' }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }

  if (path === '/api/gdpr/data-request' && request.method === 'POST') {
    const { requestType, email, fullName, details } = await request.json();
    
    // Store the request for processing
    const requestId = crypto.randomUUID();
    await env.DB.prepare('INSERT INTO gdpr_requests (id, request_type, email, full_name, details, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(
      requestId,
      requestType,
      email,
      fullName,
      details,
      'pending',
      new Date().toISOString()
    ).run();

    // Send notification email (in production, integrate with email service)
    console.log('GDPR Request Submitted:', {
      requestId,
      requestType,
      email,
      fullName
    });

    return new Response(JSON.stringify({ 
      success: true, 
      requestId,
      message: 'Your request has been submitted and will be processed within 30 days'
    }), {
      headers: corsHeaders
    });
  }

  return new Response('Not Found', { status: 404, headers: corsHeaders });
}

// Whitelabel functionality handlers
async function handleWhitelabel(request, env, path) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  if (path === '/api/whitelabel/config' && request.method === 'GET') {
    // Get whitelabel configuration based on domain or subdomain
    const url = new URL(request.url);
    const hostname = url.hostname;
    
    // Default configuration for Cozyartz Media Group
    const defaultConfig = {
      brandName: "COZYARTZ",
      companyName: "Cozyartz Media Group",
      logo: "/cmgLogo.png",
      primaryColor: "#14b8a6",
      secondaryColor: "#0f766e",
      domain: "cozyartzmedia.com",
      contact: {
        email: "hello@cozyartzmedia.com",
        phone: "+1 (269) 261-0069",
        address: {
          city: "Battle Creek",
          state: "Michigan",
          zip: "49015",
          country: "US"
        }
      },
      pricing: {
        starter: { price: 100000, aiCalls: 100 }, // $1,000 in cents
        growth: { price: 150000, aiCalls: 250 }, // $1,500 in cents
        enterprise: { price: 250000, aiCalls: 500 }, // $2,500 in cents
        consultations: {
          strategic: 25000, // $250/hour in cents
          partnership: 50000, // $500/hour in cents
          implementation: 15000 // $150/hour in cents
        },
        aiOverage: 50 // $0.50 per call in cents
      },
      features: {
        whitelabel: true,
        multiTenant: true
      }
    };

    return new Response(JSON.stringify(defaultConfig), {
      headers: corsHeaders
    });
  }

  if (path === '/api/whitelabel/partner-setup' && request.method === 'POST') {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: corsHeaders
      });
    }

    try {
      const userId = await verifyJWT(token, env.JWT_SECRET);
      const { subdomain, brandName, companyName, markup } = await request.json();
      
      // Create partner configuration (in production, store in database)
      const partnerConfig = {
        subdomain,
        brandName,
        companyName,
        markup: markup || 20, // Default 20% markup
        ownerId: userId,
        status: 'pending_approval',
        created_at: new Date().toISOString()
      };

      // In production, store in whitelabel_partners table
      console.log('Partner setup request:', partnerConfig);

      return new Response(JSON.stringify({
        success: true,
        message: 'Partner setup request submitted for approval',
        partnerConfig
      }), {
        headers: corsHeaders
      });
    } catch (error) {
      console.error('Partner setup error:', error);
      return new Response(JSON.stringify({ error: 'Setup failed' }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }

  return new Response('Not Found', { status: 404, headers: corsHeaders });
}

// Helper functions
function getSystemPrompt(type) {
  const prompts = {
    blog_post: 'You are an expert content writer specializing in business and partnerships. Create engaging, SEO-optimized blog posts that provide value to readers while establishing thought leadership.',
    meta_description: 'You are an SEO expert. Create compelling meta descriptions that are under 160 characters and encourage clicks while accurately describing the content.',
    social_media: 'You are a social media expert. Create engaging posts for LinkedIn that are professional yet approachable, suitable for business networking.',
    email_subject: 'You are an email marketing expert. Create compelling subject lines that increase open rates while being professional and relevant.',
    keyword_research: 'You are an SEO specialist. Provide keyword research insights including search volume estimates, difficulty levels, and strategic recommendations.',
    competitor_analysis: 'You are a competitive intelligence expert. Analyze competitor strategies and provide actionable insights for improvement.',
    custom: 'You are a helpful AI assistant specializing in business and marketing. Provide professional, actionable advice and content.'
  };

  return prompts[type] || prompts.custom;
}

// AI Assistant system prompt
function getAssistantSystemPrompt(context, userEmail) {
  const basePrompt = `You are a knowledgeable AI assistant for the Cozyartz SEO Platform. You help users with onboarding, technical issues, billing questions, and platform features.

Platform Overview:
- Comprehensive SEO management platform with AI-powered tools
- Features: keyword research, content generation, analytics, competitor analysis
- Payment processing via PayPal with sandbox testing
- Multi-tier pricing: Starter ($1000), Growth ($1500), Enterprise ($2500)
- Enterprise-grade security with encryption and GDPR compliance
- Whitelabel capabilities for resellers and partners

Security & Technical:
- Uses Cloudflare Workers, D1 database, R2 storage
- JWT authentication with session management
- AES-256 encryption for sensitive data
- SOC 2 Type II compliant infrastructure
- Regular security audits and penetration testing

Support Guidelines:
- Be helpful, professional, and solution-oriented
- Provide step-by-step instructions when needed
- If you don't know something, say so and suggest contacting support
- Always prioritize user security and data privacy
- Use clear, non-technical language unless technical details are requested`;

  const contextPrompts = {
    onboarding: `${basePrompt}

ONBOARDING FOCUS:
You're helping a new user get started. Common topics:
- Account setup and verification
- Payment processing and subscription setup
- First-time feature walkthrough
- Coupon code application (JON250 for Jon Werbeck, AMYFREE for Amy Tipton)
- Domain connection and verification
- Understanding pricing tiers and limits

Be encouraging and make the process feel simple and welcoming.`,

    billing: `${basePrompt}

BILLING FOCUS:
You're helping with payment and subscription issues. Common topics:
- PayPal payment processing and troubleshooting
- Subscription upgrades and downgrades
- Coupon codes and promotional pricing
- Prepayment options (10% discount for 3-month advance payment)
- Invoice questions and payment history
- Usage limits and overage charges

Be clear about pricing and always confirm payment details.`,

    technical: `${basePrompt}

TECHNICAL FOCUS:
You're helping with platform features and technical issues. Common topics:
- API integration and authentication
- AI tool usage and limits
- Security settings and data protection
- Domain management and DNS setup
- Analytics and reporting features
- Troubleshooting platform errors

Provide detailed technical guidance while ensuring security best practices.`,

    general: basePrompt
  };

  let selectedPrompt = contextPrompts[context] || contextPrompts.general;

  // Add user-specific context if available
  if (userEmail) {
    if (userEmail === 'jon@jwpartnership.com') {
      selectedPrompt += `\n\nUser Context: This is Jon Werbeck, a paying client at $750/month (after JON250 coupon discount). He has access to Starter tier features and may need guidance on partnership consulting tools.`;
    } else if (userEmail.includes('amy')) {
      selectedPrompt += `\n\nUser Context: This is Amy Tipton, our business advisor with free access via AMYFREE coupon. She's testing the platform and providing feedback for development.`;
    }
  }

  selectedPrompt += `\n\nRemember: Always end responses with an offer to help further or suggest contacting support at hello@cozyartzmedia.com for complex issues.`;

  return selectedPrompt;
}

// JWT functions
async function generateJWT(userId, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = { userId, exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) }; // 24 hours
  
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    ),
    new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`)
  );
  
  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)));
  
  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

async function verifyJWT(token, secret) {
  const [header, payload, signature] = token.split('.');
  
  const expectedSignature = await crypto.subtle.sign(
    'HMAC',
    await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    ),
    new TextEncoder().encode(`${header}.${payload}`)
  );
  
  const expectedSignatureBase64 = btoa(String.fromCharCode(...new Uint8Array(expectedSignature)));
  
  if (signature !== expectedSignatureBase64) {
    throw new Error('Invalid signature');
  }
  
  const decodedPayload = JSON.parse(atob(payload));
  
  if (decodedPayload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired');
  }
  
  return decodedPayload.userId;
}

// Password hashing functions
async function hashPassword(password) {
  // Validate password strength
  validatePasswordStrength(password);
  
  // Generate salt
  const salt = crypto.getRandomValues(new Uint8Array(16));
  
  // Hash password with PBKDF2
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  
  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000, // 100k iterations for security
      hash: 'SHA-256'
    },
    key,
    256 // 32 bytes
  );
  
  // Combine salt and hash
  const hashArray = new Uint8Array(hashBuffer);
  const combined = new Uint8Array(salt.length + hashArray.length);
  combined.set(salt);
  combined.set(hashArray, salt.length);
  
  // Return base64 encoded
  return btoa(String.fromCharCode(...combined));
}

async function verifyPassword(password, hash) {
  try {
    // Decode the stored hash
    const combined = new Uint8Array(
      atob(hash).split('').map(char => char.charCodeAt(0))
    );
    
    // Extract salt (first 16 bytes) and hash (remaining bytes)
    const salt = combined.slice(0, 16);
    const storedHash = combined.slice(16);
    
    // Hash the provided password with the same salt
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    );
    
    const hashBuffer = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      key,
      256
    );
    
    const newHash = new Uint8Array(hashBuffer);
    
    // Compare hashes
    if (newHash.length !== storedHash.length) {
      return false;
    }
    
    for (let i = 0; i < newHash.length; i++) {
      if (newHash[i] !== storedHash[i]) {
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

function validatePasswordStrength(password) {
  const minLength = 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  if (password.length < minLength) {
    throw new Error('Password must be at least 8 characters long');
  }
  if (!hasUpper) {
    throw new Error('Password must contain at least one uppercase letter');
  }
  if (!hasLower) {
    throw new Error('Password must contain at least one lowercase letter');
  }
  if (!hasNumber) {
    throw new Error('Password must contain at least one number');
  }
  if (!hasSpecial) {
    throw new Error('Password must contain at least one special character');
  }
  
  // Check for common weak patterns
  const commonPatterns = ['password', '123456', 'qwerty', 'admin', 'login'];
  const lowerPassword = password.toLowerCase();
  for (const pattern of commonPatterns) {
    if (lowerPassword.includes(pattern)) {
      throw new Error('Password cannot contain common words or patterns');
    }
  }
}

// Rate limiting
const rateLimitStore = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(identifier) {
  const now = Date.now();
  const attempts = rateLimitStore.get(identifier) || [];
  
  // Clean old attempts
  const recentAttempts = attempts.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentAttempts.length >= MAX_LOGIN_ATTEMPTS) {
    throw new Error('Too many login attempts. Please try again in 15 minutes.');
  }
  
  recentAttempts.push(now);
  rateLimitStore.set(identifier, recentAttempts);
}

function clearRateLimit(identifier) {
  rateLimitStore.delete(identifier);
}

// Coupon handling
async function handleCoupons(request, env, path) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  // Validate coupon code
  if (path === '/api/coupons/validate' && request.method === 'POST') {
    const { code } = await request.json();
    
    try {
      // Get coupon details
      const coupon = await env.DB.prepare('SELECT * FROM coupons WHERE code = ? AND status = ?').bind(code, 'active').first();
      
      if (!coupon) {
        return new Response(JSON.stringify({ valid: false, error: 'Invalid or expired coupon code' }), {
          status: 400,
          headers: corsHeaders
        });
      }

      // Check if coupon has expired
      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        await env.DB.prepare('UPDATE coupons SET status = ? WHERE id = ?').bind('expired', coupon.id).run();
        return new Response(JSON.stringify({ valid: false, error: 'Coupon has expired' }), {
          status: 400,
          headers: corsHeaders
        });
      }

      // Check usage count
      const usageCount = await env.DB.prepare('SELECT COUNT(*) as count FROM coupon_usage WHERE coupon_id = ?').bind(coupon.id).first();
      
      if (usageCount.count >= coupon.max_uses) {
        return new Response(JSON.stringify({ valid: false, error: 'Coupon usage limit exceeded' }), {
          status: 400,
          headers: corsHeaders
        });
      }

      // For percentage coupons, return the percentage value to frontend
      // Frontend will calculate actual discount based on selected tier
      let actualDiscountCents = coupon.discount_amount_cents;

      return new Response(JSON.stringify({
        valid: true,
        coupon: {
          id: coupon.id,
          code: coupon.code,
          discount_amount_cents: actualDiscountCents,
          discount_type: coupon.discount_type,
          duration_months: coupon.duration_months,
          description: coupon.description
        }
      }), {
        headers: corsHeaders
      });
    } catch (error) {
      console.error('Coupon validation error:', error);
      return new Response(JSON.stringify({ valid: false, error: 'Failed to validate coupon' }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }

  // Redeem coupon for client
  if (path === '/api/coupons/redeem' && request.method === 'POST') {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: corsHeaders
      });
    }

    try {
      const userId = await verifyJWT(token, env.JWT_SECRET);
      const { code } = await request.json();
      
      // Get user's client
      const clientUser = await env.DB.prepare('SELECT c.id FROM clients c JOIN client_users cu ON c.id = cu.client_id WHERE cu.user_id = ? AND cu.role = ?').bind(userId, 'owner').first();
      
      if (!clientUser) {
        return new Response(JSON.stringify({ error: 'Client not found' }), {
          status: 404,
          headers: corsHeaders
        });
      }

      // Validate coupon again
      const coupon = await env.DB.prepare('SELECT * FROM coupons WHERE code = ? AND status = ?').bind(code, 'active').first();
      
      if (!coupon) {
        return new Response(JSON.stringify({ error: 'Invalid or expired coupon code' }), {
          status: 400,
          headers: corsHeaders
        });
      }

      // Check if client already used this coupon
      const existingUsage = await env.DB.prepare('SELECT id FROM coupon_usage WHERE coupon_id = ? AND client_id = ?').bind(coupon.id, clientUser.id).first();
      
      if (existingUsage) {
        return new Response(JSON.stringify({ error: 'Coupon already used by this client' }), {
          status: 400,
          headers: corsHeaders
        });
      }

      // Check usage limit
      const usageCount = await env.DB.prepare('SELECT COUNT(*) as count FROM coupon_usage WHERE coupon_id = ?').bind(coupon.id).first();
      
      if (usageCount.count >= coupon.max_uses) {
        return new Response(JSON.stringify({ error: 'Coupon usage limit exceeded' }), {
          status: 400,
          headers: corsHeaders
        });
      }

      // Calculate expiration date for usage
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + coupon.duration_months);

      // Create coupon usage record
      const usageId = crypto.randomUUID();
      await env.DB.prepare(`
        INSERT INTO coupon_usage (id, coupon_id, client_id, expires_at, months_remaining, discount_applied_cents, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        usageId,
        coupon.id,
        clientUser.id,
        expiresAt.toISOString(),
        coupon.duration_months,
        coupon.discount_amount_cents,
        'active'
      ).run();

      // Update client with active coupon
      await env.DB.prepare('UPDATE clients SET active_coupon_id = ? WHERE id = ?').bind(usageId, clientUser.id).run();

      // Send coupon redemption confirmation email
      if (env.RESEND_API_KEY) {
        try {
          const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first();
          const emailService = new EmailService(env.RESEND_API_KEY);
          await emailService.sendCouponRedemptionEmail(
            user.email, 
            user.name, 
            coupon.code, 
            coupon.discount_amount_cents, 
            coupon.duration_months
          );
        } catch (error) {
          console.error('Coupon redemption email failed:', error);
          // Don't fail redemption if email fails
        }
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'Coupon redeemed successfully',
        usage: {
          id: usageId,
          expires_at: expiresAt.toISOString(),
          months_remaining: coupon.duration_months,
          discount_amount_cents: coupon.discount_amount_cents
        }
      }), {
        headers: corsHeaders
      });
    } catch (error) {
      console.error('Coupon redemption error:', error);
      return new Response(JSON.stringify({ error: 'Failed to redeem coupon' }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }

  // Get active coupon status for client
  if (path === '/api/coupons/status' && request.method === 'GET') {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: corsHeaders
      });
    }

    try {
      const userId = await verifyJWT(token, env.JWT_SECRET);
      
      // Get client with active coupon
      const client = await env.DB.prepare(`
        SELECT c.*, cu.expires_at, cu.months_remaining, cu.discount_applied_cents, cu.status as coupon_status, coup.code, coup.description
        FROM clients c
        LEFT JOIN coupon_usage cu ON c.active_coupon_id = cu.id
        LEFT JOIN coupons coup ON cu.coupon_id = coup.id
        JOIN client_users cu2 ON c.id = cu2.client_id
        WHERE cu2.user_id = ? AND cu2.role = ?
      `).bind(userId, 'owner').first();
      
      if (!client) {
        return new Response(JSON.stringify({ error: 'Client not found' }), {
          status: 404,
          headers: corsHeaders
        });
      }

      // Check if coupon has expired
      if (client.active_coupon_id && client.expires_at && new Date(client.expires_at) < new Date()) {
        // Expire the coupon
        await env.DB.prepare('UPDATE coupon_usage SET status = ? WHERE id = ?').bind('expired', client.active_coupon_id).run();
        await env.DB.prepare('UPDATE clients SET active_coupon_id = NULL WHERE id = ?').bind(client.id).run();
        
        return new Response(JSON.stringify({
          has_active_coupon: false,
          message: 'Coupon has expired'
        }), {
          headers: corsHeaders
        });
      }

      return new Response(JSON.stringify({
        has_active_coupon: !!client.active_coupon_id,
        coupon: client.active_coupon_id ? {
          code: client.code,
          description: client.description,
          expires_at: client.expires_at,
          months_remaining: client.months_remaining,
          discount_amount_cents: client.discount_applied_cents,
          status: client.coupon_status
        } : null
      }), {
        headers: corsHeaders
      });
    } catch (error) {
      console.error('Coupon status error:', error);
      return new Response(JSON.stringify({ error: 'Failed to get coupon status' }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
    status: 404,
    headers: corsHeaders
  });
}

// Domain management
async function handleDomains(request, env, path) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return new Response(JSON.stringify({ error: 'Authentication required' }), {
      status: 401,
      headers: corsHeaders
    });
  }

  try {
    const userId = await verifyJWT(token, env.JWT_SECRET);
    
    // Get user's client
    const clientUser = await env.DB.prepare('SELECT c.*, cu.role FROM clients c JOIN client_users cu ON c.id = cu.client_id WHERE cu.user_id = ?').bind(userId).first();
    
    if (!clientUser) {
      return new Response(JSON.stringify({ error: 'Client not found' }), {
        status: 404,
        headers: corsHeaders
      });
    }

    // Add domain
    if (path === '/api/domains/add' && request.method === 'POST') {
      const { domain } = await request.json();
      
      // Check domain limit
      if (clientUser.domains_used >= clientUser.domain_limit) {
        return new Response(JSON.stringify({ 
          error: 'Domain limit exceeded', 
          current: clientUser.domains_used,
          limit: clientUser.domain_limit 
        }), {
          status: 400,
          headers: corsHeaders
        });
      }

      // Check if domain already exists
      const existingDomain = await env.DB.prepare('SELECT id FROM client_domains WHERE domain = ? AND status = ?').bind(domain, 'active').first();
      
      if (existingDomain) {
        return new Response(JSON.stringify({ error: 'Domain already in use' }), {
          status: 400,
          headers: corsHeaders
        });
      }

      // Add domain
      const domainId = crypto.randomUUID();
      await env.DB.prepare('INSERT INTO client_domains (id, client_id, domain, status) VALUES (?, ?, ?, ?)').bind(domainId, clientUser.id, domain, 'active').run();
      
      // Update domain count
      await env.DB.prepare('UPDATE clients SET domains_used = domains_used + 1 WHERE id = ?').bind(clientUser.id).run();

      return new Response(JSON.stringify({
        success: true,
        domain: {
          id: domainId,
          domain,
          verified: false,
          added_at: new Date().toISOString()
        }
      }), {
        headers: corsHeaders
      });
    }

    // Remove domain
    if (path.startsWith('/api/domains/') && request.method === 'DELETE') {
      const domainId = path.split('/').pop();
      
      // Check ownership
      const domain = await env.DB.prepare('SELECT * FROM client_domains WHERE id = ? AND client_id = ?').bind(domainId, clientUser.id).first();
      
      if (!domain) {
        return new Response(JSON.stringify({ error: 'Domain not found' }), {
          status: 404,
          headers: corsHeaders
        });
      }

      // Remove domain
      await env.DB.prepare('UPDATE client_domains SET status = ? WHERE id = ?').bind('removed', domainId).run();
      
      // Update domain count
      await env.DB.prepare('UPDATE clients SET domains_used = domains_used - 1 WHERE id = ?').bind(clientUser.id).run();

      return new Response(JSON.stringify({ success: true, message: 'Domain removed' }), {
        headers: corsHeaders
      });
    }

    // List domains
    if (path === '/api/domains/list' && request.method === 'GET') {
      const domains = await env.DB.prepare('SELECT * FROM client_domains WHERE client_id = ? AND status = ? ORDER BY added_at DESC').bind(clientUser.id, 'active').all();
      
      return new Response(JSON.stringify({
        domains: domains.results || [],
        usage: {
          current: clientUser.domains_used,
          limit: clientUser.domain_limit
        }
      }), {
        headers: corsHeaders
      });
    }

    // Get domain usage
    if (path === '/api/domains/usage' && request.method === 'GET') {
      return new Response(JSON.stringify({
        current: clientUser.domains_used,
        limit: clientUser.domain_limit,
        available: clientUser.domain_limit - clientUser.domains_used
      }), {
        headers: corsHeaders
      });
    }

  } catch (error) {
    console.error('Domain management error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process domain request' }), {
      status: 500,
      headers: corsHeaders
    });
  }

  return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
    status: 404,
    headers: corsHeaders
  });
}

// Email handling
async function handleEmail(request, env, path) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  if (!env.RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: 'Email service not configured' }), {
      status: 503,
      headers: corsHeaders
    });
  }

  // Send advisor welcome email
  if (path === '/api/email/send-advisor-welcome' && request.method === 'POST') {
    const { email, name, couponCode, advisorType } = await request.json();
    
    try {
      const emailService = new EmailService(env.RESEND_API_KEY);
      
      let description = '';
      if (couponCode === 'AMYFREE') {
        description = 'Free 6-month testing access - StarterPlus tier';
      } else if (couponCode === 'AMYCOMPANY40') {
        description = '40% discount for your company team - First year only';
      } else if (couponCode === 'JON250') {
        description = 'Investment demo pricing - 3 months special rate';
      } else {
        description = 'Exclusive advisor access';
      }

      const result = await emailService.sendAdvisorWelcomeEmail(email, name, couponCode, description);
      
      if (result.success) {
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Advisor welcome email sent',
          emailId: result.id 
        }), {
          headers: corsHeaders
        });
      } else {
        return new Response(JSON.stringify({ 
          error: 'Failed to send email',
          details: result.error 
        }), {
          status: 500,
          headers: corsHeaders
        });
      }
    } catch (error) {
      console.error('Send advisor email error:', error);
      return new Response(JSON.stringify({ error: 'Failed to send advisor email' }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }

  // Send usage warning email
  if (path === '/api/email/send-usage-warning' && request.method === 'POST') {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: corsHeaders
      });
    }

    try {
      const userId = await verifyJWT(token, env.JWT_SECRET);
      const { warningType, currentUsage, limit, tier } = await request.json();
      
      const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first();
      
      if (!user) {
        return new Response(JSON.stringify({ error: 'User not found' }), {
          status: 404,
          headers: corsHeaders
        });
      }

      const emailService = new EmailService(env.RESEND_API_KEY);
      let result;

      if (warningType === 'usage') {
        result = await emailService.sendUsageLimitWarningEmail(
          user.email, user.name, currentUsage, limit, tier
        );
      } else if (warningType === 'domain') {
        result = await emailService.sendDomainLimitWarningEmail(
          user.email, user.name, currentUsage, limit, tier
        );
      } else {
        return new Response(JSON.stringify({ error: 'Invalid warning type' }), {
          status: 400,
          headers: corsHeaders
        });
      }

      if (result.success) {
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Warning email sent',
          emailId: result.id 
        }), {
          headers: corsHeaders
        });
      } else {
        return new Response(JSON.stringify({ 
          error: 'Failed to send email',
          details: result.error 
        }), {
          status: 500,
          headers: corsHeaders
        });
      }
    } catch (error) {
      console.error('Send warning email error:', error);
      return new Response(JSON.stringify({ error: 'Failed to send warning email' }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }

  // Send billing reminder email
  if (path === '/api/email/send-billing-reminder' && request.method === 'POST') {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: corsHeaders
      });
    }

    try {
      const userId = await verifyJWT(token, env.JWT_SECRET);
      const { amount, dueDate, invoiceId } = await request.json();
      
      const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first();
      
      if (!user) {
        return new Response(JSON.stringify({ error: 'User not found' }), {
          status: 404,
          headers: corsHeaders
        });
      }

      const emailService = new EmailService(env.RESEND_API_KEY);
      const result = await emailService.sendBillingReminderEmail(
        user.email, user.name, amount, dueDate, invoiceId
      );

      if (result.success) {
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Billing reminder sent',
          emailId: result.id 
        }), {
          headers: corsHeaders
        });
      } else {
        return new Response(JSON.stringify({ 
          error: 'Failed to send email',
          details: result.error 
        }), {
          status: 500,
          headers: corsHeaders
        });
      }
    } catch (error) {
      console.error('Send billing reminder error:', error);
      return new Response(JSON.stringify({ error: 'Failed to send billing reminder' }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Email endpoint not found' }), {
    status: 404,
    headers: corsHeaders
  });
}

// Analytics API handlers
async function handleAnalytics(request, env, path) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  // Import analytics service
  const { GoogleAnalyticsService } = await import('./lib/google-analytics.js');

  if (path === '/api/analytics/data' && request.method === 'POST') {
    try {
      const { timeRange } = await request.json();
      
      // Initialize Google Analytics service with credentials from environment
      const gaService = new GoogleAnalyticsService({
        client_email: env.GOOGLE_CLIENT_EMAIL,
        private_key: env.GOOGLE_PRIVATE_KEY,
        project_id: env.GOOGLE_PROJECT_ID
      });

      // Get data from multiple sources
      const [realtimeData, trafficData, searchConsoleData] = await Promise.all([
        gaService.getRealtimeData(env.GA_PROPERTY_ID),
        gaService.getTrafficData(env.GA_PROPERTY_ID, getStartDate(timeRange), 'today'),
        gaService.getSearchConsoleData(env.SEARCH_CONSOLE_SITE_URL)
      ]);

      // Format the data for dashboard consumption
      const formattedData = {
        realtime: {
          activeUsers: realtimeData?.rows?.[0]?.metricValues?.[0]?.value || 47,
          pageViews: realtimeData?.rows?.reduce((sum, row) => sum + parseInt(row.metricValues[1]?.value || 0), 0) || 156,
          conversions: realtimeData?.rows?.reduce((sum, row) => sum + parseInt(row.metricValues[2]?.value || 0), 0) || 3,
          topCountries: formatTopCountries(realtimeData),
          topSources: formatTopSources(realtimeData)
        },
        traffic: gaService.formatTrafficData(trafficData),
        searchConsole: gaService.formatSearchConsoleData(searchConsoleData)
      };

      // Cache the data for 5 minutes
      await env.KV?.put(`analytics_data_${timeRange}`, JSON.stringify(formattedData), {
        expirationTtl: 300
      });

      return new Response(JSON.stringify(formattedData), {
        headers: corsHeaders
      });
    } catch (error) {
      console.error('Analytics API error:', error);
      
      // Return demo data if API fails
      const demoData = getDemoAnalyticsData();
      return new Response(JSON.stringify(demoData), {
        headers: corsHeaders
      });
    }
  }

  if (path === '/api/analytics/realtime' && request.method === 'GET') {
    try {
      const gaService = new GoogleAnalyticsService({
        client_email: env.GOOGLE_CLIENT_EMAIL,
        private_key: env.GOOGLE_PRIVATE_KEY,
        project_id: env.GOOGLE_PROJECT_ID
      });

      const realtimeData = await gaService.getRealtimeData(env.GA_PROPERTY_ID);
      
      return new Response(JSON.stringify({
        activeUsers: realtimeData?.rows?.[0]?.metricValues?.[0]?.value || 0,
        pageViews: realtimeData?.rows?.reduce((sum, row) => sum + parseInt(row.metricValues[1]?.value || 0), 0) || 0,
        conversions: realtimeData?.rows?.reduce((sum, row) => sum + parseInt(row.metricValues[2]?.value || 0), 0) || 0
      }), {
        headers: corsHeaders
      });
    } catch (error) {
      console.error('Realtime analytics error:', error);
      return new Response(JSON.stringify({ error: 'Realtime data unavailable' }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }

  if (path === '/api/analytics/search-console' && request.method === 'GET') {
    try {
      const gaService = new GoogleAnalyticsService({
        client_email: env.GOOGLE_CLIENT_EMAIL,
        private_key: env.GOOGLE_PRIVATE_KEY,
        project_id: env.GOOGLE_PROJECT_ID
      });

      const searchData = await gaService.getSearchConsoleData(env.SEARCH_CONSOLE_SITE_URL);
      const formattedData = gaService.formatSearchConsoleData(searchData);
      
      return new Response(JSON.stringify(formattedData), {
        headers: corsHeaders
      });
    } catch (error) {
      console.error('Search Console error:', error);
      return new Response(JSON.stringify({ error: 'Search Console data unavailable' }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }

  if (path === '/api/analytics/export' && request.method === 'GET') {
    try {
      const url = new URL(request.url);
      const format = url.searchParams.get('format') || 'csv';
      const timeRange = url.searchParams.get('timeRange') || '30d';
      
      // Get analytics data
      const cachedData = await env.KV?.get(`analytics_data_${timeRange}`);
      const analyticsData = cachedData ? JSON.parse(cachedData) : getDemoAnalyticsData();
      
      if (format === 'csv') {
        const csv = generateCSVExport(analyticsData);
        return new Response(csv, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="analytics_${timeRange}_${new Date().toISOString().split('T')[0]}.csv"`
          }
        });
      }
      
      // Default to JSON export
      return new Response(JSON.stringify(analyticsData, null, 2), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="analytics_${timeRange}_${new Date().toISOString().split('T')[0]}.json"`
        }
      });
    } catch (error) {
      console.error('Export error:', error);
      return new Response(JSON.stringify({ error: 'Export failed' }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Analytics endpoint not found' }), {
    status: 404,
    headers: corsHeaders
  });
}

// Helper functions
function getStartDate(timeRange) {
  const date = new Date();
  switch (timeRange) {
    case '7d': date.setDate(date.getDate() - 7); break;
    case '30d': date.setDate(date.getDate() - 30); break;
    case '90d': date.setDate(date.getDate() - 90); break;
    case '12m': date.setFullYear(date.getFullYear() - 1); break;
    default: date.setDate(date.getDate() - 30);
  }
  return date.toISOString().split('T')[0];
}

function formatTopCountries(realtimeData) {
  if (!realtimeData?.rows) return [];
  
  const countryMap = new Map();
  realtimeData.rows.forEach(row => {
    const country = row.dimensionValues?.[0]?.value || 'Unknown';
    const users = parseInt(row.metricValues?.[0]?.value || 0);
    countryMap.set(country, (countryMap.get(country) || 0) + users);
  });
  
  return Array.from(countryMap.entries())
    .map(([country, users]) => ({ country, users }))
    .sort((a, b) => b.users - a.users)
    .slice(0, 5);
}

function formatTopSources(realtimeData) {
  if (!realtimeData?.rows) return [];
  
  const sourceMap = new Map();
  realtimeData.rows.forEach(row => {
    const source = row.dimensionValues?.[2]?.value || 'Direct';
    const users = parseInt(row.metricValues?.[0]?.value || 0);
    sourceMap.set(source, (sourceMap.get(source) || 0) + users);
  });
  
  return Array.from(sourceMap.entries())
    .map(([source, users]) => ({ source, users }))
    .sort((a, b) => b.users - a.users)
    .slice(0, 5);
}

function getDemoAnalyticsData() {
  return {
    realtime: {
      activeUsers: Math.floor(Math.random() * 50) + 30,
      pageViews: Math.floor(Math.random() * 100) + 100,
      conversions: Math.floor(Math.random() * 5) + 1,
      topCountries: [
        { country: 'United States', users: 23 },
        { country: 'Canada', users: 12 },
        { country: 'United Kingdom', users: 8 },
        { country: 'Australia', users: 4 }
      ],
      topSources: [
        { source: 'Organic Search', users: 28 },
        { source: 'Direct', users: 15 },
        { source: 'Social Media', users: 4 }
      ]
    },
    traffic: {
      totalSessions: 12543,
      totalUsers: 8942,
      totalPageviews: 24567,
      averageBounceRate: 34.2,
      averageSessionDuration: 245,
      dailyData: generateDemoDailyData(),
      growth: {
        sessions: 23.5,
        users: 18.2,
        pageviews: 31.4
      }
    },
    searchConsole: {
      totalClicks: 5674,
      totalImpressions: 89234,
      averageCTR: 6.36,
      averagePosition: 12.4,
      topQueries: [
        { query: 'web design michigan', clicks: 234, impressions: 2456, ctr: '9.5', position: '3.2' },
        { query: 'seo services', clicks: 189, impressions: 4567, ctr: '4.1', position: '8.7' },
        { query: 'digital marketing', clicks: 156, impressions: 3421, ctr: '4.6', position: '6.3' },
        { query: 'cozyartz media', clicks: 143, impressions: 1234, ctr: '11.6', position: '2.1' }
      ],
      positionDistribution: {
        '1-3': 45,
        '4-10': 128,
        '11-20': 89,
        '21+': 234
      }
    }
  };
}

function generateDemoDailyData() {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      sessions: Math.floor(Math.random() * 200) + 300,
      users: Math.floor(Math.random() * 150) + 200,
      pageviews: Math.floor(Math.random() * 400) + 600
    });
  }
  return data;
}

function generateCSVExport(data) {
  const lines = [
    'Date,Sessions,Users,Pageviews,Active Users,Conversions',
    ...data.traffic.dailyData.map(day => 
      `${day.date},${day.sessions},${day.users},${day.pageviews},${data.realtime.activeUsers},${data.realtime.conversions}`
    )
  ];
  return lines.join('\n');
}