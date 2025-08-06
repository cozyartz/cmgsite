/**
 * GDPR/CCPA Data Export API
 * Handles user requests to export personal data
 */

export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    const requestData = await request.json();
    const { user_id, email, data_types, format } = requestData;

    // Get user IP and location for compliance logging
    const userIP = request.headers.get('CF-Connecting-IP') || 'unknown';
    const userCountry = request.headers.get('CF-IPCountry') || 'unknown';
    
    const exportLog = {
      timestamp: new Date().toISOString(),
      action: 'data_export_request',
      user_id: user_id || 'anonymous',
      email: email || 'not_provided',
      ip: userIP,
      country: userCountry,
      format: format || 'json'
    };

    // Log the export request for compliance
    try {
      await env.AI_ANALYTICS?.put(
        `export_log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        JSON.stringify(exportLog),
        { expirationTtl: 2592000 } // Keep logs for 30 days
      );
    } catch (error) {
      console.warn('Failed to log export request:', error);
    }

    // Collect user data from various sources
    const userData = {
      export_info: {
        generated_at: new Date().toISOString(),
        user_id: user_id || 'anonymous',
        email: email || 'not_provided',
        format: format || 'json',
        compliance_framework: userCountry === 'US' ? 'CCPA' : 'GDPR',
        data_controller: {
          name: 'Cozyartz Media Group',
          email: 'privacy@cozyartzmedia.com',
          address: 'Michigan, USA'
        }
      },
      conversations: [],
      analytics: [],
      preferences: {},
      ai_interactions: []
    };

    try {
      // 1. Export conversation data
      if (env.AI_CONVERSATIONS) {
        const conversationKeys = await env.AI_CONVERSATIONS.list();
        for (const key of conversationKeys.keys) {
          try {
            const conversationData = await env.AI_CONVERSATIONS.get(key.name);
            if (conversationData) {
              const data = JSON.parse(conversationData);
              
              // Check if this conversation belongs to the user
              const isUserData = (user_id && data.userId === user_id) ||
                               (email && data.leadData?.email === email) ||
                               (!user_id && !email); // Anonymous export includes recent sessions
              
              if (isUserData) {
                userData.conversations.push({
                  session_id: data.sessionId,
                  created_at: data.lastActive,
                  message_count: data.messages?.length || 0,
                  lead_score: data.leadScore || 0,
                  intent: data.intent || 'general',
                  sentiment: data.sentiment || 'neutral',
                  messages: data.messages?.map((msg: any) => ({
                    timestamp: msg.timestamp,
                    role: msg.role,
                    content: msg.role === 'user' ? msg.content : '[AI_RESPONSE_REDACTED]', // Only include user messages for privacy
                  })) || [],
                  lead_data: {
                    first_name: data.leadData?.firstName || null,
                    last_name: data.leadData?.lastName || null,
                    company: data.leadData?.company || null,
                    interest: data.leadData?.interest || null,
                    budget: data.leadData?.budget || null
                    // Email excluded from export for security
                  }
                });
              }
            }
          } catch (error) {
            console.warn(`Failed to export conversation ${key.name}:`, error);
          }
        }
      }

      // 2. Export analytics data
      if (env.AI_ANALYTICS) {
        const analyticsKeys = await env.AI_ANALYTICS.list();
        for (const key of analyticsKeys.keys) {
          try {
            const analyticsData = await env.AI_ANALYTICS.get(key.name);
            if (analyticsData && (key.name.includes('user_analytics') || key.name.includes('usage'))) {
              const data = JSON.parse(analyticsData);
              
              const isUserData = (user_id && data.user_id === user_id) ||
                               (email && data.email === email);
              
              if (isUserData) {
                userData.analytics.push({
                  type: 'ai_usage',
                  timestamp: data.timestamp,
                  session_id: data.session_id,
                  model_used: data.model_used,
                  tokens_used: data.tokens_used,
                  cost_estimate: data.cost_estimate,
                  intent: data.intent,
                  sentiment: data.sentiment,
                  lead_score: data.lead_score
                });
              }
            }
          } catch (error) {
            console.warn(`Failed to export analytics ${key.name}:`, error);
          }
        }
      }

      // 3. Export from D1 database if available
      if (env.DB) {
        try {
          // Export AI usage logs
          let dbResults = [];
          
          if (user_id) {
            const result1 = await env.DB.prepare(
              'SELECT * FROM ai_usage_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 100'
            ).bind(user_id).all();
            dbResults = dbResults.concat(result1.results || []);
          }

          if (email) {
            const result2 = await env.DB.prepare(
              'SELECT * FROM ai_usage_logs WHERE user_email = ? ORDER BY created_at DESC LIMIT 100'
            ).bind(email).all();
            dbResults = dbResults.concat(result2.results || []);
          }

          userData.ai_interactions = dbResults.map(row => ({
            timestamp: row.created_at,
            session_id: row.session_id,
            message_type: row.message_type,
            model_used: row.model_used,
            tokens_used: row.tokens_used,
            intent: row.intent,
            sentiment: row.sentiment,
            lead_score: row.lead_score,
            // User messages excluded for privacy
          }));

          // Export user preferences if available
          if (user_id) {
            const prefsResult = await env.DB.prepare(
              'SELECT * FROM conversation_memory WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1'
            ).bind(user_id).first();
            
            if (prefsResult) {
              userData.preferences = {
                conversation_memory_enabled: true,
                lead_capture_enabled: prefsResult.lead_capture_enabled || false,
                last_interaction: prefsResult.updated_at,
                total_conversations: prefsResult.conversation_count || 0
              };
            }
          }

        } catch (dbError) {
          console.warn('Database export failed:', dbError);
          userData.analytics.push({
            note: 'Some database records may be unavailable',
            error: 'Database query failed'
          });
        }
      }

      // 4. Add cookie preferences from local storage simulation
      userData.privacy_settings = {
        cookie_consent_given: true,
        consent_timestamp: exportLog.timestamp,
        analytics_cookies: 'Check your browser settings',
        marketing_cookies: 'Check your browser settings',
        functional_cookies: 'Check your browser settings',
        note: 'Cookie preferences are stored locally in your browser'
      };

      // 5. Create summary statistics
      userData.summary = {
        total_conversations: userData.conversations.length,
        total_ai_interactions: userData.ai_interactions.length,
        date_range: {
          earliest_interaction: userData.conversations.length > 0 ? 
            Math.min(...userData.conversations.map(c => new Date(c.created_at).getTime())) : null,
          latest_interaction: userData.conversations.length > 0 ? 
            Math.max(...userData.conversations.map(c => new Date(c.created_at).getTime())) : null
        },
        data_retention: {
          conversations: '24 hours (unless consented)',
          analytics: '12 months (aggregated)',
          logs: '30-90 days (compliance)',
          cookies: 'As per your browser settings'
        }
      };

      // Log successful export
      const completionLog = {
        ...exportLog,
        action: 'data_export_completed',
        records_exported: {
          conversations: userData.conversations.length,
          analytics: userData.analytics.length,
          ai_interactions: userData.ai_interactions.length
        },
        completed_at: new Date().toISOString()
      };

      await env.AI_ANALYTICS?.put(
        `export_completed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        JSON.stringify(completionLog),
        { expirationTtl: 7776000 } // Keep completion logs for 90 days
      );

      // Return data as JSON file download
      const filename = `cozyartz-data-export-${Date.now()}.json`;
      const jsonData = JSON.stringify(userData, null, 2);

      return new Response(jsonData, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Length': new TextEncoder().encode(jsonData).length.toString()
        }
      });

    } catch (error) {
      console.error('Data export error:', error);
      
      // Log the error
      const errorLog = {
        ...exportLog,
        action: 'data_export_failed',
        error: error.message,
        failed_at: new Date().toISOString()
      };

      try {
        await env.AI_ANALYTICS?.put(
          `export_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          JSON.stringify(errorLog),
          { expirationTtl: 2592000 }
        );
      } catch (logError) {
        console.error('Failed to log export error:', logError);
      }

      return new Response(JSON.stringify({
        success: false,
        error: 'Data export failed. Please contact our privacy team.',
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