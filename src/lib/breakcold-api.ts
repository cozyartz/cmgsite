/**
 * Breakcold CRM API Client
 * Handles lead management, contact creation, and CRM integration
 */

import { config, createLogger } from '../config/environment';

const logger = createLogger('BreakcoldAPI');

// Breakcold API Error types
export class BreakcoldApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: Response,
    public data?: any
  ) {
    super(message);
    this.name = 'BreakcoldApiError';
  }
}

// Breakcold types
export interface BreakcoldLead {
  id?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  title?: string;
  source?: string;
  status?: string;
  tags?: string[];
  customAttributes?: Record<string, any>;
  notes?: string;
  assignedTo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BreakcoldLeadResponse {
  success: boolean;
  data?: BreakcoldLead;
  error?: string;
  message?: string;
}

export interface BreakcoldLeadsListResponse {
  success: boolean;
  data?: {
    leads: BreakcoldLead[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
    };
  };
  error?: string;
}

export interface CreateLeadRequest {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  title?: string;
  source?: string;
  tags?: string[];
  customAttributes?: Record<string, any>;
  notes?: string;
  assignedTo?: string;
}

export interface LeadFilters {
  status?: string;
  source?: string;
  assignedTo?: string;
  tags?: string[];
  createdAfter?: string;
  createdBefore?: string;
}

export interface ListLeadsOptions {
  page?: number;
  limit?: number;
  filters?: LeadFilters;
}

class BreakcoldAPI {
  private baseUrl = 'https://api.breakcold.com/v3';
  private apiKey: string;

  constructor(apiKey?: string) {
    // Try multiple sources for API key
    this.apiKey = apiKey || 
                  process.env.BREAKCOLD_API_KEY || 
                  (typeof window !== 'undefined' ? '' : process.env.VITE_BREAKCOLD_API_KEY) || 
                  '';
    
    if (!this.apiKey) {
      logger.warn('Breakcold API key not configured - some operations may fail');
    }
  }

  // Method to update API key at runtime (useful for retrieving from secret store)
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    logger.info('Breakcold API key updated');
  }

  private async makeRequest<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      body?: any;
      headers?: Record<string, string>;
    } = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const { method = 'GET', body, headers = {} } = options;

    if (!this.apiKey) {
      throw new BreakcoldApiError('Breakcold API key not configured');
    }

    const requestHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      ...headers
    };

    try {
      logger.debug(`Making ${method} request to ${url}`);

      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
      });

      const responseData = await response.json();

      if (!response.ok) {
        logger.error(`Breakcold API error: ${response.status} ${response.statusText}`, responseData);
        throw new BreakcoldApiError(
          responseData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          response,
          responseData
        );
      }

      logger.debug(`Request successful:`, responseData);
      return responseData;
    } catch (error) {
      if (error instanceof BreakcoldApiError) {
        throw error;
      }
      logger.error('Network error making request to Breakcold API:', error);
      throw new BreakcoldApiError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        undefined,
        error
      );
    }
  }

  /**
   * Create a new lead in Breakcold CRM
   */
  async createLead(leadData: CreateLeadRequest): Promise<BreakcoldLeadResponse> {
    try {
      logger.info('Creating new lead:', { email: leadData.email, company: leadData.company });

      // Add default source if not provided
      const enrichedLeadData = {
        source: 'Website Chatbot',
        ...leadData,
      };

      const response = await this.makeRequest<BreakcoldLead>('/leads', {
        method: 'POST',
        body: enrichedLeadData,
      });

      return {
        success: true,
        data: response,
        message: 'Lead created successfully'
      };
    } catch (error) {
      logger.error('Failed to create lead:', error);
      return {
        success: false,
        error: error instanceof BreakcoldApiError ? error.message : 'Failed to create lead'
      };
    }
  }

  /**
   * Get a lead by ID
   */
  async getLeadById(leadId: string): Promise<BreakcoldLeadResponse> {
    try {
      logger.info('Getting lead by ID:', leadId);

      const response = await this.makeRequest<BreakcoldLead>(`/leads/${leadId}`);

      return {
        success: true,
        data: response
      };
    } catch (error) {
      logger.error('Failed to get lead:', error);
      return {
        success: false,
        error: error instanceof BreakcoldApiError ? error.message : 'Failed to get lead'
      };
    }
  }

  /**
   * Update an existing lead
   */
  async updateLead(leadId: string, updateData: Partial<CreateLeadRequest>): Promise<BreakcoldLeadResponse> {
    try {
      logger.info('Updating lead:', leadId);

      const response = await this.makeRequest<BreakcoldLead>(`/leads/${leadId}`, {
        method: 'PUT',
        body: updateData,
      });

      return {
        success: true,
        data: response,
        message: 'Lead updated successfully'
      };
    } catch (error) {
      logger.error('Failed to update lead:', error);
      return {
        success: false,
        error: error instanceof BreakcoldApiError ? error.message : 'Failed to update lead'
      };
    }
  }

  /**
   * Delete a lead
   */
  async deleteLead(leadId: string): Promise<BreakcoldLeadResponse> {
    try {
      logger.info('Deleting lead:', leadId);

      await this.makeRequest(`/leads/${leadId}`, {
        method: 'DELETE',
      });

      return {
        success: true,
        message: 'Lead deleted successfully'
      };
    } catch (error) {
      logger.error('Failed to delete lead:', error);
      return {
        success: false,
        error: error instanceof BreakcoldApiError ? error.message : 'Failed to delete lead'
      };
    }
  }

  /**
   * List leads with filtering and pagination
   */
  async listLeads(options: ListLeadsOptions = {}): Promise<BreakcoldLeadsListResponse> {
    try {
      const { page = 1, limit = 50, filters = {} } = options;
      
      // Build query parameters
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(key, v.toString()));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });

      logger.info('Listing leads with options:', options);

      const response = await this.makeRequest<{
        leads: BreakcoldLead[];
        pagination?: {
          page: number;
          limit: number;
          total: number;
        };
      }>(`/leads?${queryParams.toString()}`);

      return {
        success: true,
        data: response
      };
    } catch (error) {
      logger.error('Failed to list leads:', error);
      return {
        success: false,
        error: error instanceof BreakcoldApiError ? error.message : 'Failed to list leads'
      };
    }
  }

  /**
   * Find leads by email
   */
  async findLeadByEmail(email: string): Promise<BreakcoldLeadResponse> {
    try {
      logger.info('Finding lead by email:', email);

      const response = await this.listLeads({
        limit: 1,
        filters: { email } as any // Assuming email filtering is supported
      });

      if (response.success && response.data?.leads.length) {
        return {
          success: true,
          data: response.data.leads[0]
        };
      }

      return {
        success: false,
        error: 'Lead not found'
      };
    } catch (error) {
      logger.error('Failed to find lead by email:', error);
      return {
        success: false,
        error: error instanceof BreakcoldApiError ? error.message : 'Failed to find lead'
      };
    }
  }

  /**
   * Add tags to a lead
   */
  async addTagsToLead(leadId: string, tags: string[]): Promise<BreakcoldLeadResponse> {
    try {
      logger.info('Adding tags to lead:', { leadId, tags });

      // Get current lead data first
      const currentLead = await this.getLeadById(leadId);
      if (!currentLead.success || !currentLead.data) {
        return currentLead;
      }

      // Merge existing tags with new tags
      const existingTags = currentLead.data.tags || [];
      const allTags = [...new Set([...existingTags, ...tags])];

      return await this.updateLead(leadId, { tags: allTags });
    } catch (error) {
      logger.error('Failed to add tags to lead:', error);
      return {
        success: false,
        error: error instanceof BreakcoldApiError ? error.message : 'Failed to add tags'
      };
    }
  }

  /**
   * Create or update lead (upsert functionality)
   */
  async upsertLead(leadData: CreateLeadRequest): Promise<BreakcoldLeadResponse> {
    try {
      // First try to find existing lead by email
      const existingLead = await this.findLeadByEmail(leadData.email);

      if (existingLead.success && existingLead.data) {
        // Update existing lead
        logger.info('Updating existing lead:', leadData.email);
        return await this.updateLead(existingLead.data.id!, leadData);
      } else {
        // Create new lead
        logger.info('Creating new lead:', leadData.email);
        return await this.createLead(leadData);
      }
    } catch (error) {
      logger.error('Failed to upsert lead:', error);
      return {
        success: false,
        error: error instanceof BreakcoldApiError ? error.message : 'Failed to upsert lead'
      };
    }
  }
}

// Export singleton instance
export const breakcoldAPI = new BreakcoldAPI();
export default breakcoldAPI;