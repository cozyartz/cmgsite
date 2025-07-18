/**
 * Cloudflare Turnstile Verification
 * Server-side verification for Turnstile tokens
 */

export async function verifyTurnstileToken(token, secretKey, remoteIp = null) {
  if (!token || !secretKey) {
    return {
      success: false,
      error: 'Missing token or secret key'
    };
  }

  try {
    const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    
    const body = {
      secret: secretKey,
      response: token
    };
    
    // Add IP if provided (optional but recommended)
    if (remoteIp) {
      body.remoteip = remoteIp;
    }

    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return {
      success: data.success,
      challenge_ts: data.challenge_ts,
      hostname: data.hostname,
      error_codes: data['error-codes'] || [],
      action: data.action,
      cdata: data.cdata
    };
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return {
      success: false,
      error: 'Verification request failed'
    };
  }
}

/**
 * Middleware for Cloudflare Workers
 * Add this to your auth endpoints
 */
export function createTurnstileMiddleware(env) {
  return async function verifyTurnstile(request) {
    // Extract token from request body
    const contentType = request.headers.get('content-type') || '';
    
    if (!contentType.includes('application/json')) {
      return {
        success: true, // Skip verification for non-JSON requests
        skip: true
      };
    }

    try {
      const body = await request.clone().json();
      const turnstileToken = body.turnstileToken || body.turnstile_token;
      
      if (!turnstileToken) {
        return {
          success: false,
          error: 'Missing Turnstile token'
        };
      }

      // Get client IP from Cloudflare headers
      const clientIp = request.headers.get('CF-Connecting-IP') || 
                      request.headers.get('X-Forwarded-For') || 
                      null;

      // Verify token
      const result = await verifyTurnstileToken(
        turnstileToken,
        env.TURNSTILE_SECRET_KEY,
        clientIp
      );

      return result;
    } catch (error) {
      console.error('Turnstile middleware error:', error);
      return {
        success: true, // Don't block on errors
        skip: true,
        error: error.message
      };
    }
  };
}

/**
 * Example usage in worker:
 * 
 * const turnstileMiddleware = createTurnstileMiddleware(env);
 * 
 * // In your auth handler
 * const turnstileResult = await turnstileMiddleware(request);
 * 
 * if (!turnstileResult.success && !turnstileResult.skip) {
 *   return new Response(JSON.stringify({ 
 *     error: 'Security verification failed',
 *     details: turnstileResult.error_codes 
 *   }), {
 *     status: 403,
 *     headers: { 'Content-Type': 'application/json' }
 *   });
 * }
 */