/**
 * Session Management Endpoint
 * 
 * Handles session pickup after OAuth redirects and session validation
 */

interface Env {
  SESSIONS: KVNamespace;
}

interface SessionRequest {
  session_key?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const body: SessionRequest = await request.json();
    
    if (!body.session_key) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Session key is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get session data from KV
    const sessionDataJson = await env.SESSIONS.get(`auth_session:${body.session_key}`);
    
    if (!sessionDataJson) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid or expired session key'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const sessionData = JSON.parse(sessionDataJson);

    // Delete the temporary session key
    await env.SESSIONS.delete(`auth_session:${body.session_key}`);

    console.log('Session retrieved successfully for:', sessionData.user?.email);

    return new Response(JSON.stringify(sessionData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Session retrieval error:', error);

    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to retrieve session',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

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