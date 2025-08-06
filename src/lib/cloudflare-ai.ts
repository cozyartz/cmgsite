/**
 * Cloudflare Workers AI Integration
 * Provides real AI model inference with fallback and cost optimization
 */

export interface AIModelRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  model?: string;
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
}

export interface AIModelResponse {
  success: boolean;
  response: string;
  model_used: string;
  tokens_used?: number;
  cost_estimate?: number;
  error?: string;
  fallback_used?: boolean;
}

export interface ConversationContext {
  user_id?: string;
  lead_score?: number;
  conversation_history?: Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;
  user_data?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    company?: string;
    interest?: string;
    budget?: string;
  };
  intent?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

// Available Cloudflare Workers AI models
export const AI_MODELS = {
  primary: '@cf/meta/llama-3.3-70b-instruct',
  secondary: '@cf/meta/llama-3.1-8b-instruct', 
  multimodal: '@cf/meta/llama-4-scout',
  fallback: '@cf/meta/llama-2-7b-chat-fp16'
} as const;

export class CloudflareAIService {
  private baseUrl: string;
  private apiToken: string;
  private accountId: string;

  constructor(apiToken: string, accountId: string) {
    this.apiToken = apiToken;
    this.accountId = accountId;
    this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run`;
  }

  /**
   * Generate AI response with automatic model fallback
   */
  async generateResponse(
    request: AIModelRequest,
    context?: ConversationContext
  ): Promise<AIModelResponse> {
    // Add system context for business-specific responses
    const systemMessage = this.buildSystemPrompt(context);
    const enhancedRequest = {
      ...request,
      messages: [
        { role: 'system' as const, content: systemMessage },
        ...request.messages
      ]
    };

    // Try primary model first
    try {
      const response = await this.callModel(AI_MODELS.primary, enhancedRequest);
      if (response.success) {
        return {
          ...response,
          model_used: AI_MODELS.primary,
          fallback_used: false
        };
      }
    } catch (error) {
      console.warn('Primary model failed, trying fallback:', error);
    }

    // Fallback to secondary model
    try {
      const response = await this.callModel(AI_MODELS.secondary, enhancedRequest);
      return {
        ...response,
        model_used: AI_MODELS.secondary,
        fallback_used: true
      };
    } catch (error) {
      console.error('All models failed:', error);
      return {
        success: false,
        response: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment, or contact our team directly at hello@cozyartzmedia.com.",
        model_used: 'none',
        error: 'All models failed',
        fallback_used: true
      };
    }
  }

  /**
   * Analyze user intent from conversation
   */
  async analyzeIntent(
    message: string,
    context?: ConversationContext
  ): Promise<{
    intent: string;
    confidence: number;
    entities: Record<string, string>;
    sentiment: 'positive' | 'neutral' | 'negative';
  }> {
    const intentPrompt = {
      messages: [{
        role: 'user' as const,
        content: `Analyze this customer message for intent, entities, and sentiment. Return JSON format.

Customer message: "${message}"

Context: ${context?.user_data?.interest || 'general inquiry'}
Lead score: ${context?.lead_score || 0}

Return format:
{
  "intent": "pricing|consultation|web_design|seo|ai_integration|support|general",
  "confidence": 0.0-1.0,
  "entities": {
    "budget": "extracted budget if mentioned",
    "timeline": "extracted timeline if mentioned", 
    "company": "company name if mentioned",
    "service_interest": "specific service mentioned"
  },
  "sentiment": "positive|neutral|negative"
}`
      }],
      max_tokens: 200,
      temperature: 0.1
    };

    try {
      const response = await this.callModel(AI_MODELS.secondary, intentPrompt);
      if (response.success) {
        try {
          return JSON.parse(response.response);
        } catch {
          // Fallback if JSON parsing fails
          return {
            intent: 'general',
            confidence: 0.5,
            entities: {},
            sentiment: 'neutral'
          };
        }
      }
    } catch (error) {
      console.error('Intent analysis failed:', error);
    }

    // Fallback intent analysis
    return {
      intent: this.detectIntentFallback(message),
      confidence: 0.6,
      entities: this.extractEntitiesFallback(message),
      sentiment: this.detectSentimentFallback(message)
    };
  }

  /**
   * Generate personalized conversation suggestions
   */
  async generateSuggestions(
    context: ConversationContext
  ): Promise<string[]> {
    const suggestionPrompt = {
      messages: [{
        role: 'user' as const,
        content: `Generate 4 helpful conversation suggestions for a potential client.

Context:
- Interest: ${context.user_data?.interest || 'general'}
- Lead score: ${context.lead_score || 0}
- Company: ${context.user_data?.company || 'unknown'}
- Intent: ${context.intent || 'general'}

Return 4 suggestions as a JSON array of strings, each 4-8 words max.
Example: ["Tell me about pricing", "Book a consultation", "See your portfolio", "Compare your services"]`
      }],
      max_tokens: 150,
      temperature: 0.7
    };

    try {
      const response = await this.callModel(AI_MODELS.secondary, suggestionPrompt);
      if (response.success) {
        try {
          const suggestions = JSON.parse(response.response);
          if (Array.isArray(suggestions)) {
            return suggestions.slice(0, 4);
          }
        } catch (error) {
          console.warn('Failed to parse suggestions JSON:', error);
        }
      }
    } catch (error) {
      console.error('Suggestion generation failed:', error);
    }

    // Fallback suggestions based on context
    return this.getFallbackSuggestions(context);
  }

  /**
   * Call specific Cloudflare AI model
   */
  private async callModel(
    modelId: string,
    request: AIModelRequest
  ): Promise<AIModelResponse> {
    const response = await fetch(`${this.baseUrl}/${modelId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: request.messages,
        max_tokens: request.max_tokens || 500,
        temperature: request.temperature || 0.7,
        stream: request.stream || false
      })
    });

    if (!response.ok) {
      throw new Error(`Model ${modelId} failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Handle Cloudflare AI response format
    let responseText = '';
    if (data.result?.response) {
      responseText = data.result.response;
    } else if (data.result?.choices?.[0]?.message?.content) {
      responseText = data.result.choices[0].message.content;
    } else if (typeof data.result === 'string') {
      responseText = data.result;
    } else {
      throw new Error('Unexpected response format from AI model');
    }

    return {
      success: true,
      response: responseText.trim(),
      model_used: modelId,
      tokens_used: data.result?.usage?.total_tokens,
      cost_estimate: this.calculateCost(data.result?.usage?.total_tokens || 100)
    };
  }

  /**
   * Build system prompt with business context
   */
  private buildSystemPrompt(context?: ConversationContext): string {
    const basePrompt = `You are an AI assistant for Cozyartz Media Group, a creative agency specializing in web design, SEO, AI integration, and digital marketing since 2016.

Company Info:
- Founded: 2016 (8+ years experience)
- Clients: 200+ satisfied clients  
- Location: Michigan, USA (serving nationwide)
- Certified: Women-Owned Small Business (WOSB)
- Contact: hello@cozyartzmedia.com, 269.261.0069
- Website: https://cozyartzmedia.com

Services & Pricing:
- Web Design: $2,500 - $15,000 (4-8 weeks)
- SEO Services: $59 - $299/month (results in 3-6 months)  
- AI Integration: $1,500 - $10,000 (2-8 weeks)
- Digital Marketing: $800 - $5,000/month (ongoing)
- E-commerce: $5,000 - $25,000 (6-12 weeks)

Your personality: Professional, knowledgeable, enthusiastic about helping businesses grow. Use emojis sparingly. Focus on understanding client needs and guiding them toward appropriate solutions.

NEVER discuss: Technical implementation details, code, server configurations, database schemas, API keys, internal processes, competitor sensitive information.

ALWAYS: Ask follow-up questions, provide specific next steps, offer consultations, capture lead information when appropriate.`;

    if (context) {
      const contextInfo = [];
      if (context.user_data?.firstName) contextInfo.push(`Client: ${context.user_data.firstName}`);
      if (context.user_data?.company) contextInfo.push(`Company: ${context.user_data.company}`);
      if (context.user_data?.interest) contextInfo.push(`Interest: ${context.user_data.interest}`);
      if (context.lead_score && context.lead_score > 30) contextInfo.push(`High-intent lead (${context.lead_score}% interest)`);
      
      if (contextInfo.length > 0) {
        return basePrompt + `\n\nCurrent Context: ${contextInfo.join(', ')}`;
      }
    }

    return basePrompt;
  }

  /**
   * Calculate estimated cost for AI usage
   */
  private calculateCost(tokens: number): number {
    // Cloudflare pricing: $0.011 per 1,000 neurons
    // Approximate: 1 token ≈ 1 neuron for text models
    return (tokens / 1000) * 0.011;
  }

  /**
   * Fallback intent detection using keywords
   */
  private detectIntentFallback(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('budget')) {
      return 'pricing';
    }
    if (lowerMessage.includes('consult') || lowerMessage.includes('meeting') || lowerMessage.includes('call')) {
      return 'consultation';
    }
    if (lowerMessage.includes('website') || lowerMessage.includes('web design')) {
      return 'web_design';
    }
    if (lowerMessage.includes('seo') || lowerMessage.includes('search engine')) {
      return 'seo';
    }
    if (lowerMessage.includes('ai') || lowerMessage.includes('chatbot') || lowerMessage.includes('automation')) {
      return 'ai_integration';
    }
    if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('problem')) {
      return 'support';
    }
    
    return 'general';
  }

  /**
   * Fallback entity extraction
   */
  private extractEntitiesFallback(message: string): Record<string, string> {
    const entities: Record<string, string> = {};
    
    // Budget detection
    const budgetMatch = message.match(/\$[\d,]+/);
    if (budgetMatch) entities.budget = budgetMatch[0];
    
    // Timeline detection
    const timelinePatterns = [
      /\b\d+\s*(weeks?|months?|days?)\b/i,
      /\b(asap|immediately|urgent|soon)\b/i
    ];
    for (const pattern of timelinePatterns) {
      const match = message.match(pattern);
      if (match) {
        entities.timeline = match[0];
        break;
      }
    }
    
    // Company detection
    const companyMatch = message.match(/(?:company|business)(?:\s+is|\s+called|\s+name)?\s+([A-Za-z0-9\s&.-]+)/i);
    if (companyMatch) entities.company = companyMatch[1].trim();
    
    return entities;
  }

  /**
   * Fallback sentiment detection
   */
  private detectSentimentFallback(message: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['great', 'awesome', 'excellent', 'love', 'perfect', 'amazing', 'fantastic'];
    const negativeWords = ['terrible', 'awful', 'hate', 'horrible', 'worst', 'frustrated', 'disappointed'];
    
    const lowerMessage = message.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  /**
   * Fallback suggestions based on context
   */
  private getFallbackSuggestions(context: ConversationContext): string[] {
    const leadScore = context.lead_score || 0;
    const intent = context.intent || 'general';
    
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
    
    if (intent === 'web_design') {
      return [
        "See website examples",
        "Web design process",
        "Get project quote",
        "Schedule design call"
      ];
    }
    
    // Default suggestions
    return [
      "Tell me about services",
      "What are your prices?",
      "Book a consultation",
      "See your portfolio"
    ];
  }
}

export default CloudflareAIService;