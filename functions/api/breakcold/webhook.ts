/**
 * Breakcold Webhook Endpoint
 * Handles incoming webhooks from Breakcold CRM
 */

interface Env {
  BREAKCOLD_WEBHOOK_SECRET?: string;
  BREAKCOLD_API_KEY?: string;
  BREAKCOLD_WORKSPACE_ID?: string;
}

interface BreakcoldWebhookPayload {
  id_space: string;
  event: string;
  secret: string;
  payload: {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    status?: string;
    tags?: string[];
    customAttributes?: Record<string, any>;
    createdAt?: string;
    updatedAt?: string;
    // Additional fields that might be present
    phone?: string;
    website?: string;
    title?: string;
    notes?: string;
    source?: string;
    leadScore?: number;
  };
}

// Webhook event handlers
const handleLeadCreated = (data: BreakcoldWebhookPayload['payload']) => {
  console.log('Lead created:', data);
  // Here you could trigger additional automations:
  // - Send welcome email
  // - Add to marketing automation
  // - Notify sales team
  // - Update internal systems
  
  // Example: Send notification to team
  if (data.email) {
    console.log(`New lead captured: ${data.firstName} ${data.lastName} (${data.email}) from ${data.source || 'unknown source'}`);
  }
};

const handleLeadUpdated = (data: BreakcoldWebhookPayload['payload']) => {
  console.log('Lead updated:', data);
  // Handle lead status changes:
  // - If status changed to "Qualified" -> trigger follow-up sequence
  // - If status changed to "Customer" -> update billing system
  // - If tags added -> trigger relevant automations
  
  if (data.status === 'Qualified') {
    console.log(`Lead ${data.id} has been qualified - triggering follow-up sequence`);
    // Trigger automated follow-up
  }
};

const handleLeadDeleted = (data: BreakcoldWebhookPayload['payload']) => {
  console.log('Lead deleted:', data);
  // Clean up related data:
  // - Remove from email lists
  // - Cancel automations
  // - Archive conversation history
  
  console.log(`Cleaning up data for deleted lead: ${data.id}`);
};

// Verify webhook secret from payload
const verifyWebhookSecret = (
  payloadSecret: string,
  expectedSecret: string
): boolean => {
  try {
    // Breakcold includes the secret directly in the payload
    // Simple string comparison for verification
    return payloadSecret === expectedSecret;
  } catch (error) {
    console.error('Webhook secret verification failed:', error);
    return false;
  }
};

// Verify workspace ID
const verifyWorkspace = (
  payloadWorkspace: string,
  expectedWorkspace?: string
): boolean => {
  // If no workspace restriction configured, allow all
  if (!expectedWorkspace) return true;
  
  try {
    return payloadWorkspace === expectedWorkspace;
  } catch (error) {
    console.error('Workspace verification failed:', error);
    return false;
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    // Get webhook secret and workspace ID
    const webhookSecret = env.BREAKCOLD_WEBHOOK_SECRET;
    const workspaceId = env.BREAKCOLD_WORKSPACE_ID;
    
    // If no webhook secret configured, skip verification (for development)
    const skipVerification = !webhookSecret;
    if (skipVerification) {
      console.warn('BREAKCOLD_WEBHOOK_SECRET not configured - skipping verification (development mode)');
    }

    // Parse request body
    const body = await request.text();
    let payload: BreakcoldWebhookPayload;

    try {
      payload = JSON.parse(body);
    } catch (error) {
      console.error('Invalid JSON payload:', error);
      return new Response('Invalid JSON payload', { status: 400 });
    }

    // Validate payload structure
    if (!payload.id_space || !payload.event || !payload.secret || !payload.payload) {
      console.error('Invalid webhook payload structure:', payload);
      return new Response('Invalid payload structure', { status: 400 });
    }

    // Verify webhook secret from payload (only if configured)
    if (!skipVerification && !verifyWebhookSecret(payload.secret, webhookSecret!)) {
      console.error('Webhook secret verification failed');
      return new Response('Unauthorized', { status: 401 });
    }

    // Verify workspace if configured
    if (!verifyWorkspace(payload.id_space, workspaceId)) {
      console.error('Workspace verification failed:', {
        received: payload.id_space,
        expected: workspaceId
      });
      return new Response('Invalid workspace', { status: 403 });
    }

    console.log('Received Breakcold webhook:', {
      event: payload.event,
      workspace: payload.id_space,
      leadId: payload.payload.id,
      timestamp: new Date().toISOString()
    });

    // Route webhook events (using correct event names)
    switch (payload.event) {
      case 'lead.create':
        handleLeadCreated(payload.payload);
        break;
        
      case 'lead.update':
        handleLeadUpdated(payload.payload);
        break;
        
      case 'lead.delete':
        handleLeadDeleted(payload.payload);
        break;
        
      // Additional events that might be configured
      case 'lead.status_changed':
        console.log('Lead status changed:', {
          id: payload.payload.id,
          status: payload.payload.status
        });
        handleLeadUpdated(payload.payload);
        break;
        
      case 'lead.tags_updated':
        console.log('Lead tags updated:', {
          id: payload.payload.id,
          tags: payload.payload.tags
        });
        handleLeadUpdated(payload.payload);
        break;
        
      default:
        console.log('Unhandled webhook event:', payload.event);
        return new Response(JSON.stringify({
          success: true,
          message: 'Event acknowledged but not handled',
          event: payload.event
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
    }

    // Return success response
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Webhook processed successfully',
      event: payload.event,
      workspace: payload.id_space,
      leadId: payload.payload.id,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

// Handle webhook verification/ping requests
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request } = context;
  const url = new URL(request.url);
  
  // Handle webhook verification challenge (common pattern)
  const challenge = url.searchParams.get('challenge');
  if (challenge) {
    return new Response(challenge, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }

  // Return webhook endpoint info
  return new Response(JSON.stringify({
    service: 'Breakcold Webhook Endpoint',
    status: 'active',
    timestamp: new Date().toISOString(),
    supportedEvents: [
      'lead.create',
      'lead.update', 
      'lead.delete',
      'lead.status_changed',
      'lead.tags_updated'
    ]
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};