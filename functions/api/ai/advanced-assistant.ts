/**
 * Advanced AI Assistant API Endpoint
 * Uses real Cloudflare Workers AI models with conversation intelligence
 */

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

interface LeadData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  website?: string;
  title?: string;
  interest?: string;
  budget?: string;
  timeline?: string;
}

interface AdvancedAssistantRequest {
  message: string;
  context: 'onboarding' | 'billing' | 'technical' | 'general' | 'sales';
  userId?: string;
  userEmail?: string;
  messageHistory?: Message[];
  leadScore?: number;
  leadData?: LeadData;
  enableLeadCapture?: boolean;
  sessionId?: string;
}

interface ConversationMemory {
  sessionId: string;
  messages: Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;
  leadData: LeadData;
  leadScore: number;
  intent: string;
  sentiment: string;
  lastActive: string;
}

// Security and validation functions
function containsRestrictedContent(query: string): boolean {
  const restrictedTopics = [
    "server configuration", "database schemas", "API keys", "authentication tokens", "code repositories",
    "development workflows", "internal tools", "competitor pricing details", "proprietary algorithms",
    "client confidential information", "cloudflare configuration", "wrangler secrets", "environment variables",
    "production credentials", "admin passwords", "system architecture", "deployment keys", "worker bindings",
    "kv namespace ids", "d1 database ids", "internal apis", "security tokens", "webhook secrets",
    "oauth secrets", "internal dashboards", "admin interfaces", "system logs", "error messages",
    "debug information", "technical specifications", "infrastructure details", "source code",
    "git repositories", "development environments", "staging systems", "internal processes",
    "business strategies", "financial information", "legal matters", "employee information",
    "contractor details", "vendor relationships", "partnership agreements", "competitive intelligence",
    "market research", "internal communications", "strategic planning"
  ];
  
  const lowerQuery = query.toLowerCase();
  return restrictedTopics.some(topic => lowerQuery.includes(topic));
}

function sanitizeUserInput(input: string): string {
  const dangerousPatterns = [
    /ignore\s+(previous|all)\s+(instructions?|prompts?|context)/gi,
    /system\s*[:=]\s*["']?[^"'\n]*["']?/gi,
    /assistant\s*[:=]\s*["']?[^"'\n]*["']?/gi,
    /\[SYSTEM\]/gi, /\[\/SYSTEM\]/gi, /\[ASSISTANT\]/gi, /\[\/ASSISTANT\]/gi,
    /\[USER\]/gi, /\[\/USER\]/gi, /<\s*system\s*>/gi, /<\/\s*system\s*>/gi,
    /roleplay\s+as/gi, /pretend\s+(you\s+are|to\s+be)/gi, /act\s+as\s+(if\s+you\s+are|a)/gi,
    /forget\s+(everything|all|previous)/gi, /new\s+(instructions?|prompts?|context)/gi
  ];

  let sanitized = input;
  dangerousPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '[FILTERED]');
  });

  sanitized = sanitized.replace(/(.)\1{50,}/g, '$1[REPETITION_FILTERED]');
  
  if (sanitized.length > 2000) {
    sanitized = sanitized.substring(0, 2000) + '[TRUNCATED]';
  }

  return sanitized;
}

function validateAIResponse(response: string): { isValid: boolean; sanitized: string; issues: string[] } {
  const issues: string[] = [];
  let sanitized = response;

  if (containsRestrictedContent(response)) {
    issues.push('Contains restricted technical information');
    sanitized = sanitized.replace(/\b(server|database|api|key|token|config|admin|internal)\b/gi, '[REDACTED]');
  }

  const sensitivePatterns = [
    /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}/gi,
    /[A-Za-z0-9]{64}/g, /sk-[A-Za-z0-9]{32,}/gi, /pk_[A-Za-z0-9]{32,}/gi,
    /ey[A-Za-z0-9]{10,}\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+/g,
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
  ];

  sensitivePatterns.forEach(pattern => {
    if (pattern.test(sanitized)) {
      issues.push('Contains potentially sensitive data patterns');
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    }
  });

  return { isValid: issues.length === 0, sanitized, issues };
}

export async function onRequestPost(context: EventContext<{}, any, {}>) {
  const { request, env } = context;

  try {
    const requestData: AdvancedAssistantRequest = await request.json();
    const { 
      message, 
      context: chatContext, 
      messageHistory = [], 
      leadScore = 0,
      leadData = {},
      enableLeadCapture = true,
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    } = requestData;

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({
        success: false,
        error: 'Message is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 🔒 SECURITY: Sanitize input to prevent prompt injection
    const sanitizedMessage = sanitizeUserInput(message);
    
    // 🔒 SECURITY: Check for restricted content
    if (containsRestrictedContent(sanitizedMessage)) {
      return new Response(JSON.stringify({
        success: true,
        response: "I can only provide information about our public services and how we can help your business grow. For technical discussions, I'd be happy to connect you with our technical team. Would you like me to help you book a consultation?",
        leadScore: leadScore,
        intent: 'restricted',
        sentiment: 'neutral',
        suggestions: ['Tell me about your services', 'See pricing information', 'Book a consultation', 'Contact your team']
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Initialize AI service
    const aiService = new CloudflareAIService(
      env.CF_AI_API_TOKEN || env.CLOUDFLARE_API_TOKEN,
      env.CF_ACCOUNT_ID || env.CLOUDFLARE_ACCOUNT_ID
    );

    // Load conversation memory
    let conversationMemory: ConversationMemory | null = null;
    try {
      const memoryData = await env.CONVERSATIONS?.get(sessionId);
      if (memoryData) {
        conversationMemory = JSON.parse(memoryData);
      }
    } catch (error) {
      console.warn('Failed to load conversation memory:', error);
    }

    // Build conversation context
    const conversationContext = {
      user_id: requestData.userId,
      lead_score: leadScore,
      conversation_history: conversationMemory?.messages || messageHistory.slice(-10).map(m => ({
        role: m.isBot ? 'assistant' : 'user',
        content: m.content,
        timestamp: m.timestamp.toISOString()
      })),
      user_data: { ...conversationMemory?.leadData, ...leadData },
      intent: conversationMemory?.intent || 'general',
      sentiment: conversationMemory?.sentiment || 'neutral'
    };

    // Analyze current message intent and sentiment
    const intentAnalysis = await aiService.analyzeIntent(message, conversationContext);
    
    // Update lead score based on AI analysis
    let updatedLeadScore = Math.max(leadScore, calculateAILeadScore(message, intentAnalysis, conversationContext));
    
    // Extract entities and update lead data
    const updatedLeadData = {
      ...conversationContext.user_data,
      ...extractLeadDataFromEntities(intentAnalysis.entities),
      interest: intentAnalysis.entities.service_interest || conversationContext.user_data?.interest
    };

    // Generate AI response
    const aiMessages = [
      ...conversationContext.conversation_history.slice(-6).map(h => ({
        role: h.role as 'user' | 'assistant',
        content: h.content
      })),
      {
        role: 'user' as const,
        content: message
      }
    ];

    const aiResponse = await aiService.generateResponse(
      { messages: aiMessages },
      {
        ...conversationContext,
        user_data: updatedLeadData,
        lead_score: updatedLeadScore,
        intent: intentAnalysis.intent,
        sentiment: intentAnalysis.sentiment
      }
    );

    if (!aiResponse.success) {
      throw new Error(aiResponse.error || 'AI service failed');
    }

    // 🔒 SECURITY: Validate AI response for compliance
    const responseValidation = validateAIResponse(aiResponse.response);
    let finalResponse = responseValidation.sanitized;
    
    if (!responseValidation.isValid) {
      console.warn('AI response validation issues:', responseValidation.issues);
      
      // If response contains restricted content, provide safe fallback
      if (responseValidation.issues.includes('Contains restricted technical information')) {
        finalResponse = "I can only provide information about our public services and how we can help your business grow. For detailed technical discussions, I'd be happy to connect you with our technical team. Would you like me to help you book a consultation?";
      }
    }

    // Generate contextual suggestions
    const suggestions = await aiService.generateSuggestions({
      ...conversationContext,
      user_data: updatedLeadData,
      lead_score: updatedLeadScore,
      intent: intentAnalysis.intent,
      sentiment: intentAnalysis.sentiment
    });

    // Update conversation memory
    const updatedMemory: ConversationMemory = {
      sessionId,
      messages: [
        ...(conversationMemory?.messages || []).slice(-10),
        {
          role: 'user',
          content: message,
          timestamp: new Date().toISOString()
        },
        {
          role: 'assistant', 
          content: finalResponse,
          timestamp: new Date().toISOString()
        }
      ],
      leadData: updatedLeadData,
      leadScore: updatedLeadScore,
      intent: intentAnalysis.intent,
      sentiment: intentAnalysis.sentiment,
      lastActive: new Date().toISOString()
    };

    // Save to KV storage with 24-hour expiration
    try {
      await env.CONVERSATIONS?.put(
        sessionId,
        JSON.stringify(updatedMemory),
        { expirationTtl: 86400 } // 24 hours
      );
    } catch (error) {
      console.warn('Failed to save conversation memory:', error);
    }

    // Log AI usage for analytics
    try {
      await logAIUsage(env, {
        sessionId,
        model_used: aiResponse.model_used,
        tokens_used: aiResponse.tokens_used || 0,
        cost_estimate: aiResponse.cost_estimate || 0,
        intent: intentAnalysis.intent,
        lead_score: updatedLeadScore,
        context: chatContext
      });
    } catch (error) {
      console.warn('Failed to log AI usage:', error);
    }

    return new Response(JSON.stringify({
      success: true,
      response: finalResponse,
      suggestions,
      sessionId,
      leadScore: updatedLeadScore,
      intent: intentAnalysis.intent,
      sentiment: intentAnalysis.sentiment,
      confidence: intentAnalysis.confidence,
      model_used: aiResponse.model_used,
      fallback_used: aiResponse.fallback_used,
      cost_estimate: aiResponse.cost_estimate
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });

  } catch (error) {
    console.error('Advanced AI Assistant API error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error',
      response: "I apologize for the technical difficulty! Our team is here to help directly at hello@cozyartzmedia.com or 269.261.0069."
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

/**
 * Calculate lead score using AI analysis
 */
function calculateAILeadScore(
  message: string,
  intentAnalysis: any,
  context: any
): number {
  let score = context.lead_score || 0;
  
  // Intent-based scoring
  const intentScores = {
    pricing: 25,
    consultation: 30,
    web_design: 20,
    seo: 15,
    ai_integration: 20,
    support: 5,
    general: 5
  };
  
  score += intentScores[intentAnalysis.intent as keyof typeof intentScores] || 0;
  
  // Confidence multiplier
  score *= Math.min(intentAnalysis.confidence + 0.3, 1.0);
  
  // Sentiment bonus
  if (intentAnalysis.sentiment === 'positive') score += 10;
  else if (intentAnalysis.sentiment === 'negative') score -= 5;
  
  // Entity-based scoring
  if (intentAnalysis.entities.budget) score += 20;
  if (intentAnalysis.entities.timeline) score += 15;
  if (intentAnalysis.entities.company) score += 10;
  
  // Conversation length bonus
  const historyLength = context.conversation_history?.length || 0;
  if (historyLength > 5) score += 10;
  if (historyLength > 10) score += 10;
  
  // Message quality indicators
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('quote') || lowerMessage.includes('proposal')) score += 25;
  if (lowerMessage.includes('urgent') || lowerMessage.includes('asap')) score += 20;
  if (lowerMessage.includes('interested') || lowerMessage.includes('need')) score += 15;
  
  return Math.min(Math.round(score), 100);
}

/**
 * Extract lead data from AI-detected entities
 */
function extractLeadDataFromEntities(entities: Record<string, string>): Partial<LeadData> {
  const leadData: Partial<LeadData> = {};
  
  if (entities.budget) leadData.budget = entities.budget;
  if (entities.timeline) leadData.timeline = entities.timeline;
  if (entities.company) leadData.company = entities.company;
  if (entities.service_interest) leadData.interest = entities.service_interest;
  
  return leadData;
}

/**
 * Log AI usage for analytics and cost tracking
 */
async function logAIUsage(env: any, usage: {
  sessionId: string;
  model_used: string;
  tokens_used: number;
  cost_estimate: number;
  intent: string;
  lead_score: number;
  context: string;
}) {
  // Store in D1 database if available
  if (env.DB) {
    try {
      await env.DB.prepare(`
        INSERT INTO ai_usage_logs (
          session_id, model_used, tokens_used, cost_estimate,
          intent, lead_score, context, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        usage.sessionId,
        usage.model_used,
        usage.tokens_used,
        usage.cost_estimate,
        usage.intent,
        usage.lead_score,
        usage.context,
        new Date().toISOString()
      ).run();
    } catch (error) {
      console.error('Failed to log AI usage to D1:', error);
    }
  }
  
  // Also log to KV for quick access
  const dailyKey = `ai_usage_${new Date().toISOString().split('T')[0]}`;
  try {
    const existingData = await env.AI_ANALYTICS?.get(dailyKey);
    const dailyStats = existingData ? JSON.parse(existingData) : {
      total_requests: 0,
      total_tokens: 0,
      total_cost: 0,
      by_model: {},
      by_intent: {}
    };
    
    dailyStats.total_requests += 1;
    dailyStats.total_tokens += usage.tokens_used;
    dailyStats.total_cost += usage.cost_estimate;
    dailyStats.by_model[usage.model_used] = (dailyStats.by_model[usage.model_used] || 0) + 1;
    dailyStats.by_intent[usage.intent] = (dailyStats.by_intent[usage.intent] || 0) + 1;
    
    await env.AI_ANALYTICS?.put(dailyKey, JSON.stringify(dailyStats), {
      expirationTtl: 2592000 // 30 days
    });
  } catch (error) {
    console.error('Failed to update daily AI analytics:', error);
  }
}

// Import CloudflareAIService (this would be bundled by the build process)
// For now, we'll include a simplified version in this file
class CloudflareAIService {
  private baseUrl: string;
  private apiToken: string;

  constructor(apiToken: string, accountId: string) {
    this.apiToken = apiToken;
    this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run`;
  }

  async generateResponse(request: any, context?: any): Promise<any> {
    const model = '@cf/meta/llama-3.1-8b-instruct';
    
    try {
      const response = await fetch(`${this.baseUrl}/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: request.messages,
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`AI model failed: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.result?.response || data.result?.choices?.[0]?.message?.content || 'I apologize, but I couldn\'t generate a proper response.';

      return {
        success: true,
        response: responseText.trim(),
        model_used: model,
        tokens_used: responseText.length / 4, // Rough estimate
        cost_estimate: (responseText.length / 4) / 1000 * 0.011
      };
    } catch (error) {
      return {
        success: false,
        response: "I apologize, but I'm having trouble processing your request right now. Please contact our team at hello@cozyartzmedia.com for immediate assistance.",
        model_used: 'fallback',
        error: error.message
      };
    }
  }

  async analyzeIntent(message: string, context?: any): Promise<any> {
    // Simplified intent analysis
    const lowerMessage = message.toLowerCase();
    
    let intent = 'general';
    let confidence = 0.7;
    const entities: Record<string, string> = {};
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      intent = 'pricing';
      confidence = 0.9;
    } else if (lowerMessage.includes('consult') || lowerMessage.includes('meeting')) {
      intent = 'consultation';
      confidence = 0.9;
    } else if (lowerMessage.includes('website') || lowerMessage.includes('web design')) {
      intent = 'web_design';
      confidence = 0.8;
    } else if (lowerMessage.includes('seo')) {
      intent = 'seo';
      confidence = 0.8;
    } else if (lowerMessage.includes('ai') || lowerMessage.includes('chatbot')) {
      intent = 'ai_integration';
      confidence = 0.8;
    }
    
    // Extract entities
    const budgetMatch = message.match(/\$[\d,]+/);
    if (budgetMatch) entities.budget = budgetMatch[0];
    
    const companyMatch = message.match(/(?:company|business)(?:\s+is|\s+called)?\s+([A-Za-z0-9\s]+)/i);
    if (companyMatch) entities.company = companyMatch[1].trim();
    
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    if (/great|awesome|excellent|love|perfect/.test(lowerMessage)) sentiment = 'positive';
    if (/terrible|awful|hate|horrible|worst/.test(lowerMessage)) sentiment = 'negative';
    
    return {
      intent,
      confidence,
      entities,
      sentiment
    };
  }

  async generateSuggestions(context: any): Promise<string[]> {
    const intent = context.intent;
    const leadScore = context.lead_score || 0;
    
    if (leadScore >= 60) {
      return [
        "Book consultation now",
        "Get custom quote",
        "Start my project", 
        "See pricing options"
      ];
    }
    
    if (intent === 'pricing') {
      return [
        "Web design pricing",
        "SEO service costs",
        "AI integration rates",
        "Custom quote request"
      ];
    }
    
    return [
      "Tell me about services",
      "What are your prices?",
      "Book a consultation",
      "See your portfolio"
    ];
  }
}