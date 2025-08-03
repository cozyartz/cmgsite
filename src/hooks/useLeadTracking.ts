import { useState, useCallback, useEffect } from 'react';
import { breakcoldAPI, CreateLeadRequest, BreakcoldLead } from '../lib/breakcold-api';

export interface LeadData {
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
  message?: string;
}

export interface LeadTrackingState {
  leadData: LeadData;
  leadScore: number;
  isQualified: boolean;
  conversationHistory: string[];
  lastUpdated: Date | null;
}

export interface UseLeadTrackingOptions {
  enableTracking?: boolean;
  autoQualifyThreshold?: number;
  context?: string;
  userId?: string;
  userEmail?: string;
}

export interface UseLeadTrackingReturn {
  // State
  leadData: LeadData;
  leadScore: number;
  isQualified: boolean;
  conversationHistory: string[];
  
  // Actions
  updateLeadData: (data: Partial<LeadData>) => void;
  addToConversation: (message: string, isBot?: boolean) => void;
  calculateScore: (message: string) => number;
  qualifyLead: () => boolean;
  resetLead: () => void;
  
  // CRM Integration
  createLead: () => Promise<{ success: boolean; lead?: BreakcoldLead; error?: string }>;
  updateLead: (leadId: string) => Promise<{ success: boolean; lead?: BreakcoldLead; error?: string }>;
  findExistingLead: () => Promise<{ success: boolean; lead?: BreakcoldLead; error?: string }>;
  
  // Utilities
  getLeadSummary: () => string;
  exportLeadData: () => string;
  isReadyForCapture: () => boolean;
}

export const useLeadTracking = (options: UseLeadTrackingOptions = {}): UseLeadTrackingReturn => {
  const {
    enableTracking = true,
    autoQualifyThreshold = 50,
    context = 'general',
    userId,
    userEmail
  } = options;

  const [leadData, setLeadData] = useState<LeadData>({});
  const [leadScore, setLeadScore] = useState(0);
  const [isQualified, setIsQualified] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Update lead data
  const updateLeadData = useCallback((data: Partial<LeadData>) => {
    if (!enableTracking) return;
    
    setLeadData(prev => {
      const updated = { ...prev, ...data };
      setLastUpdated(new Date());
      return updated;
    });
  }, [enableTracking]);

  // Add message to conversation history
  const addToConversation = useCallback((message: string, isBot = false) => {
    if (!enableTracking) return;
    
    const prefix = isBot ? 'Bot: ' : 'User: ';
    setConversationHistory(prev => [...prev, `${prefix}${message}`]);
  }, [enableTracking]);

  // Calculate lead score based on message content
  const calculateScore = useCallback((message: string): number => {
    if (!enableTracking) return 0;
    
    let score = 0;
    const lowerMessage = message.toLowerCase();
    
    // Interest indicators
    const interestTerms = [
      { terms: ['price', 'cost', 'budget', 'pricing'], score: 15 },
      { terms: ['quote', 'estimate', 'proposal'], score: 20 },
      { terms: ['when can', 'timeline', 'how soon', 'schedule'], score: 15 },
      { terms: ['website', 'web design', 'seo'], score: 10 },
      { terms: ['business', 'company'], score: 10 },
      { terms: ['need help', 'looking for', 'interested in'], score: 10 },
      { terms: ['hire', 'work with', 'partner'], score: 15 }
    ];

    interestTerms.forEach(({ terms, score: termScore }) => {
      if (terms.some(term => lowerMessage.includes(term))) {
        score += termScore;
      }
    });

    // Urgency indicators
    const urgencyTerms = [
      { terms: ['urgent', 'asap', 'immediately'], score: 25 },
      { terms: ['deadline', 'launch date', 'go live'], score: 20 },
      { terms: ['this week', 'this month', 'soon'], score: 15 }
    ];

    urgencyTerms.forEach(({ terms, score: termScore }) => {
      if (terms.some(term => lowerMessage.includes(term))) {
        score += termScore;
      }
    });

    // Engagement indicators
    if (message.length > 100) score += 5; // Detailed messages
    if (conversationHistory.length > 5) score += 10; // Sustained conversation
    
    // Contact information provided
    if (lowerMessage.includes('@')) score += 20; // Email mentioned
    if (/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(message)) score += 15; // Phone number

    // Qualification questions
    if (lowerMessage.includes('what do you charge') || lowerMessage.includes('rates')) score += 20;
    if (lowerMessage.includes('portfolio') || lowerMessage.includes('examples')) score += 10;
    if (lowerMessage.includes('experience') || lowerMessage.includes('how long')) score += 10;

    const newScore = Math.min(score, 100);
    setLeadScore(prev => Math.max(prev, newScore));
    
    return newScore;
  }, [enableTracking, conversationHistory.length]);

  // Qualify lead based on score and data completeness
  const qualifyLead = useCallback((): boolean => {
    if (!enableTracking) return false;
    
    const hasEmail = !!leadData.email;
    const hasBasicInfo = !!(leadData.firstName || leadData.lastName);
    const meetsScoreThreshold = leadScore >= autoQualifyThreshold;
    
    const qualified = hasEmail && (hasBasicInfo || meetsScoreThreshold);
    setIsQualified(qualified);
    
    return qualified;
  }, [enableTracking, leadData, leadScore, autoQualifyThreshold]);

  // Reset lead data
  const resetLead = useCallback(() => {
    setLeadData({});
    setLeadScore(0);
    setIsQualified(false);
    setConversationHistory([]);
    setLastUpdated(null);
  }, []);

  // Create lead in CRM
  const createLead = useCallback(async () => {
    if (!enableTracking || !leadData.email) {
      return { success: false, error: 'Email required for lead creation' };
    }

    try {
      const leadRequest: CreateLeadRequest = {
        firstName: leadData.firstName,
        lastName: leadData.lastName,
        email: leadData.email,
        phone: leadData.phone,
        company: leadData.company,
        website: leadData.website,
        title: leadData.title,
        source: `Website Chatbot - ${context}`,
        tags: [
          'Website Lead',
          context.charAt(0).toUpperCase() + context.slice(1),
          leadData.interest || 'General Inquiry'
        ].filter(Boolean),
        customAttributes: {
          leadScore,
          interest: leadData.interest,
          budget: leadData.budget,
          timeline: leadData.timeline,
          conversationContext: conversationHistory.slice(-10).join('\n'),
          capturedAt: new Date().toISOString(),
          userId,
          userEmail
        },
        notes: [
          `Lead captured via AI chatbot.`,
          `Interest: ${leadData.interest || 'General'}`,
          `Lead score: ${leadScore}/100`,
          `Budget: ${leadData.budget || 'Not specified'}`,
          `Timeline: ${leadData.timeline || 'Not specified'}`,
          leadData.message ? `Message: ${leadData.message}` : '',
          `Conversation summary: ${conversationHistory.slice(-3).join(' | ')}`
        ].filter(Boolean).join(' ')
      };

      const result = await breakcoldAPI.createLead(leadRequest);
      
      if (result.success) {
        return { success: true, lead: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Failed to create lead:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }, [enableTracking, leadData, leadScore, context, conversationHistory, userId, userEmail]);

  // Update existing lead
  const updateLead = useCallback(async (leadId: string) => {
    if (!enableTracking) {
      return { success: false, error: 'Lead tracking disabled' };
    }

    try {
      const updateData: Partial<CreateLeadRequest> = {
        ...leadData,
        customAttributes: {
          leadScore: Math.max(leadScore, 0),
          interest: leadData.interest,
          budget: leadData.budget,
          timeline: leadData.timeline,
          lastConversation: new Date().toISOString(),
          conversationContext: conversationHistory.slice(-10).join('\n')
        }
      };

      const result = await breakcoldAPI.updateLead(leadId, updateData);
      
      if (result.success) {
        return { success: true, lead: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Failed to update lead:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }, [enableTracking, leadData, leadScore, conversationHistory]);

  // Find existing lead by email
  const findExistingLead = useCallback(async () => {
    if (!enableTracking || !leadData.email) {
      return { success: false, error: 'Email required for lead search' };
    }

    try {
      const result = await breakcoldAPI.findLeadByEmail(leadData.email);
      
      if (result.success) {
        return { success: true, lead: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Failed to find lead:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }, [enableTracking, leadData.email]);

  // Get lead summary
  const getLeadSummary = useCallback((): string => {
    const parts = [];
    
    if (leadData.firstName || leadData.lastName) {
      parts.push(`Name: ${[leadData.firstName, leadData.lastName].filter(Boolean).join(' ')}`);
    }
    
    if (leadData.email) parts.push(`Email: ${leadData.email}`);
    if (leadData.phone) parts.push(`Phone: ${leadData.phone}`);
    if (leadData.company) parts.push(`Company: ${leadData.company}`);
    if (leadData.interest) parts.push(`Interest: ${leadData.interest}`);
    if (leadData.budget) parts.push(`Budget: ${leadData.budget}`);
    if (leadScore > 0) parts.push(`Score: ${leadScore}/100`);
    
    return parts.join(', ');
  }, [leadData, leadScore]);

  // Export lead data as JSON string
  const exportLeadData = useCallback((): string => {
    return JSON.stringify({
      leadData,
      leadScore,
      isQualified,
      conversationHistory,
      lastUpdated,
      context,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }, [leadData, leadScore, isQualified, conversationHistory, lastUpdated, context]);

  // Check if lead is ready for capture
  const isReadyForCapture = useCallback((): boolean => {
    return !!(leadData.email && (leadScore >= 30 || leadData.firstName));
  }, [leadData, leadScore]);

  // Auto-qualify when conditions are met
  useEffect(() => {
    if (enableTracking) {
      qualifyLead();
    }
  }, [enableTracking, qualifyLead]);

  return {
    // State
    leadData,
    leadScore,
    isQualified,
    conversationHistory,
    
    // Actions
    updateLeadData,
    addToConversation,
    calculateScore,
    qualifyLead,
    resetLead,
    
    // CRM Integration
    createLead,
    updateLead,
    findExistingLead,
    
    // Utilities
    getLeadSummary,
    exportLeadData,
    isReadyForCapture
  };
};