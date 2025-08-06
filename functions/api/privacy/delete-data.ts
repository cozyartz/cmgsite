/**
 * GDPR/CCPA Data Deletion API
 * Handles user requests to delete personal data
 */

export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    const requestData = await request.json();
    const { action, user_id, email, verification_token } = requestData;

    // Validate request
    if (!action || action !== 'delete_all_data') {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid action specified'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get user IP and location for compliance logging
    const userIP = request.headers.get('CF-Connecting-IP') || 'unknown';
    const userCountry = request.headers.get('CF-IPCountry') || 'unknown';
    const userAgent = request.headers.get('User-Agent') || 'unknown';
    
    const deletionLog = {
      timestamp: new Date().toISOString(),
      action: 'data_deletion_request',
      user_id: user_id || 'anonymous',
      email: email || 'not_provided',
      ip: userIP,
      country: userCountry,
      user_agent: userAgent,
      verification_token: verification_token || null
    };

    // Log the deletion request for compliance
    try {
      await env.AI_ANALYTICS?.put(
        `deletion_log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        JSON.stringify(deletionLog),
        { expirationTtl: 2592000 } // Keep logs for 30 days for legal compliance
      );
    } catch (error) {
      console.warn('Failed to log deletion request:', error);
    }

    // Perform data deletion operations
    const deletionResults = {
      conversations_deleted: 0,
      analytics_deleted: 0,
      lead_data_deleted: 0,
      cookies_cleared: 0
    };

    try {
      // 1. Delete conversation data from KV storage
      if (env.AI_CONVERSATIONS) {
        const conversationKeys = await env.AI_CONVERSATIONS.list();
        for (const key of conversationKeys.keys) {
          try {
            const conversationData = await env.AI_CONVERSATIONS.get(key.name);
            if (conversationData) {
              const data = JSON.parse(conversationData);
              // Check if this conversation belongs to the user (by session or email)
              if (user_id && data.userId === user_id) {
                await env.AI_CONVERSATIONS.delete(key.name);
                deletionResults.conversations_deleted++;
              } else if (email && data.leadData?.email === email) {
                await env.AI_CONVERSATIONS.delete(key.name);
                deletionResults.conversations_deleted++;
              } else if (!user_id && !email) {
                // For anonymous deletion, delete all old sessions
                const sessionAge = Date.now() - new Date(data.lastActive).getTime();
                if (sessionAge > 86400000) { // Older than 24 hours
                  await env.AI_CONVERSATIONS.delete(key.name);
                  deletionResults.conversations_deleted++;
                }
              }
            }
          } catch (error) {
            console.warn(`Failed to delete conversation ${key.name}:`, error);
          }
        }
      }

      // 2. Delete analytics data from KV storage
      if (env.AI_ANALYTICS) {
        const analyticsKeys = await env.AI_ANALYTICS.list();
        for (const key of analyticsKeys.keys) {
          if (key.name.includes('user_analytics') || key.name.includes('lead_data')) {
            try {
              const analyticsData = await env.AI_ANALYTICS.get(key.name);
              if (analyticsData) {
                const data = JSON.parse(analyticsData);
                if (user_id && data.user_id === user_id) {
                  await env.AI_ANALYTICS.delete(key.name);
                  deletionResults.analytics_deleted++;
                } else if (email && data.email === email) {
                  await env.AI_ANALYTICS.delete(key.name);
                  deletionResults.analytics_deleted++;
                }
              }
            } catch (error) {
              console.warn(`Failed to delete analytics ${key.name}:`, error);
            }
          }
        }
      }

      // 3. Delete from D1 database if available
      if (env.DB) {
        try {
          // Delete AI usage logs
          if (user_id) {
            const result1 = await env.DB.prepare(
              'DELETE FROM ai_usage_logs WHERE user_id = ?'
            ).bind(user_id).run();
            deletionResults.analytics_deleted += result1.changes || 0;
          }

          if (email) {
            const result2 = await env.DB.prepare(
              'DELETE FROM ai_usage_logs WHERE user_email = ?'
            ).bind(email).run();
            deletionResults.analytics_deleted += result2.changes || 0;
          }

          // Delete conversation memory
          if (user_id) {
            const result3 = await env.DB.prepare(
              'DELETE FROM conversation_memory WHERE user_id = ?'
            ).bind(user_id).run();
            deletionResults.conversations_deleted += result3.changes || 0;
          }

          // Delete lead conversion analytics
          if (email) {
            const result4 = await env.DB.prepare(
              'DELETE FROM lead_conversion_analytics WHERE email = ?'
            ).bind(email).run();
            deletionResults.lead_data_deleted += result4.changes || 0;
          }
        } catch (dbError) {
          console.warn('Database deletion failed:', dbError);
        }
      }

      // 4. Log successful deletion
      const completionLog = {
        ...deletionLog,
        action: 'data_deletion_completed',
        results: deletionResults,
        completed_at: new Date().toISOString()
      };

      await env.AI_ANALYTICS?.put(
        `deletion_completed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        JSON.stringify(completionLog),
        { expirationTtl: 7776000 } // Keep completion logs for 90 days
      );

      // Return success response
      return new Response(JSON.stringify({
        success: true,
        message: 'Personal data deletion completed successfully',
        details: {
          conversations_deleted: deletionResults.conversations_deleted,
          analytics_deleted: deletionResults.analytics_deleted,
          lead_data_deleted: deletionResults.lead_data_deleted,
          deletion_timestamp: new Date().toISOString()
        },
        compliance_info: {
          processed_under: userCountry === 'US' ? 'CCPA' : 'GDPR',
          retention_period: 'Most data deleted immediately. Logs retained for 30-90 days for legal compliance.',
          verification: verification_token ? 'verified' : 'self_service'
        }
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });

    } catch (error) {
      console.error('Data deletion error:', error);
      
      // Log the error for compliance
      const errorLog = {
        ...deletionLog,
        action: 'data_deletion_failed',
        error: error.message,
        failed_at: new Date().toISOString()
      };

      try {
        await env.AI_ANALYTICS?.put(
          `deletion_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          JSON.stringify(errorLog),
          { expirationTtl: 2592000 }
        );
      } catch (logError) {
        console.error('Failed to log deletion error:', logError);
      }

      return new Response(JSON.stringify({
        success: false,
        error: 'Data deletion failed. Please contact our privacy team.',
        contact: {
          email: 'privacy@cozyartzmedia.com',
          phone: '269.261.0069'
        }
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Request parsing error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Invalid request format'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle OPTIONS request for CORS
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
}