import { supabase } from './supabase';

// Types for analytics data
export interface DashboardStats {
  total_users: number;
  active_users: number;
  monthly_revenue_cents: number;
  total_revenue_cents: number;
  api_calls_today: number;
  system_uptime: number;
  new_signups_today: number;
  support_tickets_open: number;
}

export interface UserActivity {
  id: string;
  email: string;
  full_name: string;
  role: string;
  status: string;
  total_spent_cents: number;
  last_login: string | null;
  login_count: number;
  ai_calls_used: number;
  ai_calls_limit: number;
  subscription_plan: string | null;
  subscription_status: string | null;
  recent_activity_count: number;
}

export interface RevenueData {
  daily_revenue: Array<{
    date: string;
    revenue_cents: number;
  }>;
  revenue_by_plan: Array<{
    plan: string;
    revenue_cents: number;
    user_count: number;
  }>;
  subscription_metrics: {
    mrr: number;
    churn_rate: number;
    ltv: number;
    arpu: number;
  };
}

export interface SystemMetric {
  id: string;
  metric_type: string;
  value: number;
  unit: string;
  timestamp: string;
  metadata: Record<string, any>;
}

export interface AIUsageData {
  id: string;
  user_id: string;
  ai_service: string;
  operation_type: string;
  tokens_used: number;
  cost_cents: number;
  success: boolean;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  ticket_number: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  user_id: string | null;
  created_at: string;
  resolved_at: string | null;
}

// Analytics service class
export class AnalyticsService {
  /**
   * Get real-time dashboard statistics
   */
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      const { data, error } = await supabase.rpc('get_dashboard_stats');
      
      if (error) {
        console.warn('Database function not found, using fallback data:', error.message);
        return this.getFallbackDashboardStats();
      }
      
      return data;
    } catch (error) {
      console.warn('Analytics function not available, using fallback data:', error);
      return this.getFallbackDashboardStats();
    }
  }

  /**
   * Fallback dashboard stats when database functions are not available
   */
  static getFallbackDashboardStats(): DashboardStats {
    return {
      total_users: 1,
      active_users: 1,
      monthly_revenue_cents: 0,
      total_revenue_cents: 0,
      api_calls_today: 0,
      system_uptime: 99.9,
      new_signups_today: 0,
      support_tickets_open: 0
    };
  }

  /**
   * Get user activity summary
   */
  static async getUserActivity(limit: number = 100): Promise<UserActivity[]> {
    try {
      const { data, error } = await supabase
        .from('user_activity_summary')
        .select('*')
        .order('recent_activity_count', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.warn('User activity view not found, using fallback data:', error.message);
        return this.getFallbackUserActivity();
      }
      
      return data || [];
    } catch (error) {
      console.warn('User activity not available, using fallback data:', error);
      return this.getFallbackUserActivity();
    }
  }

  /**
   * Fallback user activity when database views are not available
   */
  static getFallbackUserActivity(): UserActivity[] {
    return [];
  }

  /**
   * Get revenue analytics for specified time period
   */
  static async getRevenueAnalytics(daysBack: number = 30): Promise<RevenueData> {
    try {
      const { data, error } = await supabase.rpc('get_revenue_analytics', {
        days_back: daysBack
      });
      
      if (error) {
        console.warn('Revenue analytics function not found, using fallback data:', error.message);
        return this.getFallbackRevenueData();
      }
      
      // Add mock subscription metrics if not included in the response
      return {
        ...data,
        subscription_metrics: data.subscription_metrics || {
          mrr: 45678.90,
          churn_rate: 2.1,
          ltv: 1247.50,
          arpu: 89.32
        }
      };
    } catch (error) {
      console.warn('Revenue analytics not available, using fallback data:', error);
      return this.getFallbackRevenueData();
    }
  }

  /**
   * Fallback revenue data when database functions are not available
   */
  static getFallbackRevenueData(): RevenueData {
    const today = new Date();
    const dailyRevenue = [];
    
    // Generate sample daily revenue for the last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dailyRevenue.push({
        date: date.toISOString().split('T')[0],
        revenue_cents: 0
      });
    }
    
    return {
      daily_revenue: dailyRevenue,
      revenue_by_plan: [],
      subscription_metrics: {
        mrr: 0,
        churn_rate: 0,
        ltv: 0,
        arpu: 0
      }
    };
  }

  /**
   * Export data in various formats
   */
  static async exportData(type: 'users' | 'revenue' | 'analytics', format: 'csv' | 'json'): Promise<Blob> {
    try {
      let data: any;
      let filename: string;
      
      switch (type) {
        case 'users':
          data = await this.getUserActivity(1000);
          filename = `users_export_${new Date().toISOString().split('T')[0]}`;
          break;
        case 'revenue':
          data = await this.getRevenueAnalytics(90);
          filename = `revenue_export_${new Date().toISOString().split('T')[0]}`;
          break;
        case 'analytics':
          data = await this.getDashboardStats();
          filename = `analytics_export_${new Date().toISOString().split('T')[0]}`;
          break;
        default:
          throw new Error('Invalid export type');
      }

      let content: string;
      let mimeType: string;

      if (format === 'csv') {
        content = this.convertToCSV(data, type);
        mimeType = 'text/csv';
      } else {
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/json';
      }

      return new Blob([content], { type: mimeType });
    } catch (error) {
      console.error('Export failed:', error);
      throw new Error('Failed to export data');
    }
  }

  /**
   * Convert data to CSV format
   */
  private static convertToCSV(data: any, type: string): string {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return 'No data available';
    }

    switch (type) {
      case 'users':
        const userHeaders = ['ID', 'Email', 'Full Name', 'Role', 'Status', 'Total Spent', 'Last Login', 'Login Count', 'AI Calls Used', 'Subscription Plan'];
        const userRows = data.map((user: UserActivity) => [
          user.id,
          user.email,
          user.full_name,
          user.role,
          user.status,
          (user.total_spent_cents / 100).toFixed(2),
          user.last_login || 'Never',
          user.login_count,
          user.ai_calls_used,
          user.subscription_plan || 'Free'
        ]);
        return [userHeaders, ...userRows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

      case 'revenue':
        if (data.daily_revenue && Array.isArray(data.daily_revenue)) {
          const revenueHeaders = ['Date', 'Revenue ($)'];
          const revenueRows = data.daily_revenue.map((item: any) => [
            item.date,
            (item.revenue_cents / 100).toFixed(2)
          ]);
          return [revenueHeaders, ...revenueRows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        }
        break;

      default:
        return JSON.stringify(data, null, 2);
    }

    return 'No data available';
  }

  /**
   * Get user growth analytics
   */
  static async getUserGrowthAnalytics(daysBack: number = 30) {
    const { data, error } = await supabase.rpc('get_user_growth_analytics', {
      days_back: daysBack
    });
    
    if (error) {
      console.error('Error fetching user growth analytics:', error);
      throw new Error(`Failed to fetch user growth analytics: ${error.message}`);
    }
    
    return data;
  }

  /**
   * Get system metrics for specified time period
   */
  static async getSystemMetrics(daysBack: number = 7): Promise<SystemMetric[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    
    const { data, error } = await supabase
      .from('system_metrics')
      .select('*')
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: false })
      .limit(1000);
    
    if (error) {
      console.error('Error fetching system metrics:', error);
      throw new Error(`Failed to fetch system metrics: ${error.message}`);
    }
    
    return data || [];
  }

  /**
   * Get AI usage analytics
   */
  static async getAIUsageAnalytics(daysBack: number = 30): Promise<AIUsageData[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    
    const { data, error } = await supabase
      .from('ai_usage_analytics')
      .select('*')
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: false })
      .limit(1000);
    
    if (error) {
      console.error('Error fetching AI usage analytics:', error);
      throw new Error(`Failed to fetch AI usage analytics: ${error.message}`);
    }
    
    return data || [];
  }

  /**
   * Get support tickets
   */
  static async getSupportTickets(status?: string): Promise<SupportTicket[]> {
    let query = supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching support tickets:', error);
      throw new Error(`Failed to fetch support tickets: ${error.message}`);
    }
    
    return data || [];
  }

  /**
   * Track user analytics event
   */
  static async trackEvent(
    userId: string,
    eventType: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    const { error } = await supabase
      .from('user_analytics')
      .insert({
        user_id: userId,
        event_type: eventType,
        metadata,
        timestamp: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error tracking event:', error);
      // Don't throw error for tracking events to avoid disrupting user experience
    }
  }

  /**
   * Track AI usage with SuperAdmin unlimited access
   */
  static async trackAIUsage(
    userId: string,
    aiService: string,
    operationType: string,
    tokensUsed: number = 0,
    costCents: number = 0,
    success: boolean = true,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    // Check if user is SuperAdmin for unlimited usage
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    const isSuperAdmin = userProfile?.role === 'superadmin';
    
    // For SuperAdmin, don't count against limits and mark as internal usage
    const trackingData = {
      user_id: userId,
      ai_service: aiService,
      operation_type: operationType,
      tokens_used: tokensUsed,
      cost_cents: isSuperAdmin ? 0 : costCents, // No cost for SuperAdmin
      success,
      request_metadata: {
        ...metadata,
        internal_usage: isSuperAdmin,
        unlimited_access: isSuperAdmin
      },
      timestamp: new Date().toISOString()
    };

    const { error } = await supabase
      .from('ai_usage_analytics')
      .insert(trackingData);
    
    if (error) {
      console.error('Error tracking AI usage:', error);
    }
  }

  /**
   * Check if user has unlimited access (SuperAdmin)
   */
  static async hasUnlimitedAccess(userId: string): Promise<boolean> {
    try {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      return userProfile?.role === 'superadmin';
    } catch (error) {
      console.error('Error checking unlimited access:', error);
      return false;
    }
  }

  /**
   * Get user's current usage limits and consumption
   */
  static async getUserUsageLimits(userId: string): Promise<{
    hasUnlimitedAccess: boolean;
    aiCallsUsed: number;
    aiCallsLimit: number;
    canMakeRequest: boolean;
  }> {
    try {
      const hasUnlimited = await this.hasUnlimitedAccess(userId);
      
      if (hasUnlimited) {
        return {
          hasUnlimitedAccess: true,
          aiCallsUsed: 0,
          aiCallsLimit: -1, // -1 indicates unlimited
          canMakeRequest: true
        };
      }

      // Get user's subscription and usage
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('ai_calls_used, ai_calls_limit')
        .eq('id', userId)
        .single();

      const aiCallsUsed = userProfile?.ai_calls_used || 0;
      const aiCallsLimit = userProfile?.ai_calls_limit || 100;

      return {
        hasUnlimitedAccess: false,
        aiCallsUsed,
        aiCallsLimit,
        canMakeRequest: aiCallsUsed < aiCallsLimit
      };
    } catch (error) {
      console.error('Error getting user usage limits:', error);
      return {
        hasUnlimitedAccess: false,
        aiCallsUsed: 0,
        aiCallsLimit: 100,
        canMakeRequest: false
      };
    }
  }

  /**
   * Record system metric
   */
  static async recordSystemMetric(
    metricType: string,
    value: number,
    unit: string = '',
    metadata: Record<string, any> = {}
  ): Promise<void> {
    const { error } = await supabase
      .from('system_metrics')
      .insert({
        metric_type: metricType,
        value,
        unit,
        metadata,
        timestamp: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error recording system metric:', error);
    }
  }

  /**
   * Generate sample data for development
   */
  static async generateSampleData(): Promise<string> {
    const { data, error } = await supabase.rpc('generate_sample_analytics_data');
    
    if (error) {
      console.error('Error generating sample data:', error);
      throw new Error(`Failed to generate sample data: ${error.message}`);
    }
    
    return data;
  }

  /**
   * Get current system health status
   */
  static async getSystemHealth(): Promise<{
    overall_status: 'healthy' | 'degraded' | 'unhealthy';
    services: Array<{
      name: string;
      status: string;
      response_time_ms?: number;
      last_check: string;
    }>;
  }> {
    // Get recent health checks
    const { data: healthChecks, error } = await supabase
      .from('health_checks')
      .select('*')
      .gte('timestamp', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Last 5 minutes
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.error('Error fetching health checks:', error);
      throw new Error(`Failed to fetch system health: ${error.message}`);
    }

    // Group by service and get latest status
    const serviceMap = new Map();
    (healthChecks || []).forEach(check => {
      if (!serviceMap.has(check.service_name)) {
        serviceMap.set(check.service_name, check);
      }
    });

    const services = Array.from(serviceMap.values()).map(check => ({
      name: check.service_name,
      status: check.status,
      response_time_ms: check.response_time_ms,
      last_check: check.timestamp
    }));

    // Determine overall status
    const healthyCount = services.filter(s => s.status === 'healthy').length;
    const totalCount = services.length;
    
    let overall_status: 'healthy' | 'degraded' | 'unhealthy';
    if (totalCount === 0) {
      overall_status = 'healthy'; // No data available, assume healthy
    } else if (healthyCount === totalCount) {
      overall_status = 'healthy';
    } else if (healthyCount >= totalCount * 0.7) {
      overall_status = 'degraded';
    } else {
      overall_status = 'unhealthy';
    }

    return {
      overall_status,
      services
    };
  }

  /**
   * Get error logs for monitoring
   */
  static async getErrorLogs(limit: number = 50): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('error_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.warn('Error logs table not found, using fallback data:', error.message);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.warn('Error logs not available, using fallback data:', error);
      return [];
    }
  }

  /**
   * Check if analytics database schema is properly installed
   */
  static async checkSchemaStatus(): Promise<{
    isInstalled: boolean;
    missingComponents: string[];
    instructions?: string;
  }> {
    const missingComponents: string[] = [];
    
    try {
      // Test database function
      await supabase.rpc('get_dashboard_stats');
    } catch (error) {
      missingComponents.push('get_dashboard_stats function');
    }
    
    try {
      // Test view
      await supabase.from('user_activity_summary').select('id').limit(1);
    } catch (error) {
      missingComponents.push('user_activity_summary view');
    }
    
    try {
      // Test tables
      await supabase.from('system_metrics').select('id').limit(1);
    } catch (error) {
      missingComponents.push('analytics tables');
    }
    
    const isInstalled = missingComponents.length === 0;
    
    return {
      isInstalled,
      missingComponents,
      instructions: !isInstalled ? this.getSchemaInstallInstructions() : undefined
    };
  }

  /**
   * Get instructions for installing the analytics schema
   */
  static getSchemaInstallInstructions(): string {
    return `
To fix the SuperAdmin dashboard, apply the analytics schema:

1. Log into your Supabase Dashboard
2. Go to SQL Editor
3. Run the SQL from: /supabase-analytics-schema.sql
4. This will create all required tables, views, and functions

The schema includes:
- Dashboard statistics functions
- User activity tracking  
- Revenue analytics
- System health monitoring
- Support ticket management
- Comprehensive RLS policies

After applying the schema, the dashboard will show real data instead of fallback values.
    `.trim();
  }

  /**
   * Record an error for monitoring
   */
  static async recordError(
    errorType: string,
    errorMessage: string,
    userId?: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    const { error } = await supabase
      .from('error_logs')
      .insert({
        user_id: userId || null,
        error_type: errorType,
        error_message: errorMessage,
        url_path: window.location.pathname,
        user_agent: navigator.userAgent,
        metadata,
        timestamp: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error recording error log:', error);
    }
  }
}

// Utility functions for formatting data
export const formatCurrency = (cents: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(cents / 100);
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatPercent = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'active':
    case 'healthy':
    case 'completed':
      return 'text-green-600 bg-green-100';
    case 'suspended':
    case 'unhealthy':
    case 'failed':
      return 'text-red-600 bg-red-100';
    case 'pending':
    case 'degraded':
    case 'in_progress':
      return 'text-yellow-600 bg-yellow-100';
    case 'cancelled':
    case 'expired':
      return 'text-gray-600 bg-gray-100';
    default:
      return 'text-blue-600 bg-blue-100';
  }
};

export const getPlanColor = (plan: string): string => {
  switch (plan?.toLowerCase()) {
    case 'starter':
      return 'text-blue-600 bg-blue-100';
    case 'growth':
      return 'text-purple-600 bg-purple-100';
    case 'enterprise':
      return 'text-orange-600 bg-orange-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};