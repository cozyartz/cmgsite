// Simplified Cloudflare Worker for authentication
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
      // Simple auth login endpoint
      if (path === '/api/auth/login' && request.method === 'POST') {
        const { email, password } = await request.json();
        
        // Mock authentication - accept test credentials
        if (email === 'test@cozyartzmedia.com' && password === 'TestPass123@') {
          const mockToken = 'mock-jwt-token-' + Date.now();
          const mockUser = {
            id: 'user_test_001',
            email: 'test@cozyartzmedia.com',
            name: 'Test User',
            avatar_url: '',
            provider: 'email',
            role: 'user'
          };
          const mockClient = {
            id: 'client_test_001',
            name: 'Test Client',
            subscription_tier: 'starter',
            ai_calls_limit: 100,
            ai_calls_used: 0,
            status: 'active',
            role: 'owner'
          };
          
          return new Response(JSON.stringify({
            token: mockToken,
            user: mockUser,
            client: mockClient
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

      // GitHub OAuth endpoint - return error message for now
      if (path === '/api/auth/github' && request.method === 'GET') {
        return Response.redirect('https://72e33a23.cmgsite.pages.dev/auth?error=github_oauth_not_configured', 302);
      }

      // Google OAuth endpoint - return error message for now  
      if (path === '/api/auth/google' && request.method === 'GET') {
        return Response.redirect('https://72e33a23.cmgsite.pages.dev/auth?error=google_oauth_not_configured', 302);
      }

      // Simple auth verify endpoint
      if (path === '/api/auth/verify' && request.method === 'GET') {
        const token = request.headers.get('Authorization')?.replace('Bearer ', '');
        
        if (!token || !token.startsWith('mock-jwt-token')) {
          return new Response(JSON.stringify({ error: 'Invalid token' }), {
            status: 401,
            headers: corsHeaders
          });
        }

        const mockUser = {
          id: 'user_test_001',
          email: 'test@cozyartzmedia.com',
          name: 'Test User',
          avatar_url: '',
          provider: 'email',
          role: 'user'
        };
        const mockClient = {
          id: 'client_test_001',
          name: 'Test Client',
          subscription_tier: 'starter',
          ai_calls_limit: 100,
          ai_calls_used: 0,
          status: 'active',
          role: 'owner'
        };
        
        return new Response(JSON.stringify({
          user: mockUser,
          client: mockClient
        }), {
          headers: corsHeaders
        });
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