// Usage tracking and analytics service
import { supabase } from './supabase';
import { TierService, UsageMetrics } from './tiers';

export interface AIUsageLog {
  id?: string;
  user_id: string;
  feature_type: string;
  action_type: string;
  tokens_used: number;
  cost_cents: number;
  success: boolean;
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface UserAnalytics {
  user_id: string;
  event_type: string;
  event_data: Record<string, any>;
  created_at: string;
}

export class AnalyticsService {
  // Track AI usage with detailed logging
  static async trackAIUsage(
    userId: string,
    featureType: string,
    actionType: string,
    tokensUsed: number,
    costCents: number,
    success: boolean,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      // Log the usage
      const { error: logError } = await supabase
        .from('ai_usage_logs')
        .insert([{
          user_id: userId,
          feature_type: featureType,
          action_type: actionType,
          tokens_used: tokensUsed,
          cost_cents: costCents,
          success,
          metadata,
          created_at: new Date().toISOString()
        }]);

      if (logError) {
        console.error('Failed to log AI usage:', logError);
      }

      // Update user's current usage count if successful
      if (success) {
        await this.incrementUserAIUsage(userId);
      }

      // Track analytics event
      await this.trackEvent(userId, 'ai_usage', {
        feature_type: featureType,
        action_type: actionType,
        success,
        tokens_used: tokensUsed
      });

    } catch (error) {
      console.error('Error tracking AI usage:', error);
    }
  }

  // Increment user's AI usage count
  static async incrementUserAIUsage(userId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('increment_ai_usage', {
        user_id: userId
      });

      if (error) {
        console.error('Failed to increment AI usage:', error);
      }
    } catch (error) {
      console.error('Error incrementing AI usage:', error);
    }
  }

  // Get user's current usage metrics
  static async getUserUsageMetrics(userId: string): Promise<UsageMetrics | null> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          id,
          subscription_tier,
          ai_calls_used,
          ai_calls_limit,
          projects_count,
          team_members_count,
          storage_used_gb,
          usage_reset_date,
          created_at
        `)
        .eq('id', userId)
        .single();

      if (error || !profile) {
        console.error('Failed to get user metrics:', error);
        return null;
      }

      return {
        userId,
        tierName: profile.subscription_tier || 'free',
        aiCallsUsed: profile.ai_calls_used || 0,
        projectsCount: profile.projects_count || 0,
        teamMembersCount: profile.team_members_count || 1,
        storageUsedGB: profile.storage_used_gb || 0,
        lastResetDate: profile.usage_reset_date || profile.created_at,
        monthlyResetDate: profile.usage_reset_date || profile.created_at
      };
    } catch (error) {
      console.error('Error getting user usage metrics:', error);
      return null;
    }
  }

  // Get user's usage limits based on their tier
  static async getUserUsageLimits(userId: string) {
    try {
      const metrics = await this.getUserUsageMetrics(userId);
      if (!metrics) {
        return {
          hasUnlimitedAccess: false,
          aiCallsUsed: 0,
          aiCallsLimit: 10,
          canMakeRequest: true,
          tierName: 'free'
        };
      }

      const tier = TierService.getTierLimits(metrics.tierName);
      const hasUnlimitedAccess = tier.aiCallsPerMonth === -1;
      const canMakeRequest = hasUnlimitedAccess || metrics.aiCallsUsed < tier.aiCallsPerMonth;

      return {
        hasUnlimitedAccess,
        aiCallsUsed: metrics.aiCallsUsed,
        aiCallsLimit: tier.aiCallsPerMonth,
        canMakeRequest,
        tierName: metrics.tierName,
        usagePercentage: TierService.getUsagePercentage(metrics.tierName, metrics.aiCallsUsed),
        remainingCalls: TierService.getRemainingAICalls(metrics.tierName, metrics.aiCallsUsed),
        recommendedUpgrade: TierService.getUpgradeRecommendation(metrics.tierName, metrics.aiCallsUsed)
      };
    } catch (error) {
      console.error('Error getting user usage limits:', error);
      return {
        hasUnlimitedAccess: false,
        aiCallsUsed: 0,
        aiCallsLimit: 10,
        canMakeRequest: true,
        tierName: 'free'
      };
    }
  }

  // Track general analytics events
  static async trackEvent(
    userId: string,
    eventType: string,
    eventData: Record<string, any>
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_analytics')
        .insert([{
          user_id: userId,
          event_type: eventType,
          event_data: eventData,
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Failed to track event:', error);
      }
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  // Get user's usage history
  static async getUsageHistory(userId: string, days: number = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('ai_usage_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to get usage history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting usage history:', error);
      return [];
    }
  }

  // Get usage analytics for dashboard
  static async getUserAnalytics(userId: string, days: number = 30) {
    try {
      const [usageHistory, metrics] = await Promise.all([
        this.getUsageHistory(userId, days),
        this.getUserUsageMetrics(userId)
      ]);

      if (!metrics) return null;

      // Calculate daily usage
      const dailyUsage = usageHistory.reduce((acc, log) => {
        const date = new Date(log.created_at).toDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Calculate feature usage
      const featureUsage = usageHistory.reduce((acc, log) => {
        acc[log.feature_type] = (acc[log.feature_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Calculate success rate
      const successfulCalls = usageHistory.filter(log => log.success).length;
      const successRate = usageHistory.length > 0 ? (successfulCalls / usageHistory.length) * 100 : 100;

      const tier = TierService.getTierLimits(metrics.tierName);

      return {
        currentUsage: metrics.aiCallsUsed,
        usageLimit: tier.aiCallsPerMonth,
        usagePercentage: TierService.getUsagePercentage(metrics.tierName, metrics.aiCallsUsed),
        remainingCalls: TierService.getRemainingAICalls(metrics.tierName, metrics.aiCallsUsed),
        dailyUsage,
        featureUsage,
        successRate,
        totalCalls: usageHistory.length,
        tierInfo: tier,
        recommendedUpgrade: TierService.getUpgradeRecommendation(metrics.tierName, metrics.aiCallsUsed)
      };
    } catch (error) {
      console.error('Error getting user analytics:', error);
      return null;
    }
  }

  // Check if user needs usage reset (monthly)
  static async checkAndResetMonthlyUsage(userId: string): Promise<void> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('usage_reset_date, created_at')
        .eq('id', userId)
        .single();

      if (error || !profile) return;

      const lastReset = profile.usage_reset_date || profile.created_at;
      const resetDay = new Date(profile.created_at).getDate();
      
      if (UsageTracker.shouldResetMonthlyUsage(lastReset, resetDay)) {
        await this.resetUserUsage(userId);
      }
    } catch (error) {
      console.error('Error checking monthly usage reset:', error);
    }
  }

  // Reset user's monthly usage
  static async resetUserUsage(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ai_calls_used: 0,
          usage_reset_date: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Failed to reset user usage:', error);
      } else {
        console.log('✅ Monthly usage reset for user:', userId);
        
        // Track the reset event
        await this.trackEvent(userId, 'usage_reset', {
          reset_date: new Date().toISOString(),
          reset_type: 'monthly'
        });
      }
    } catch (error) {
      console.error('Error resetting user usage:', error);
    }
  }

  // Check feature access based on tier
  static async checkFeatureAccess(userId: string, feature: string): Promise<boolean> {
    try {
      const metrics = await this.getUserUsageMetrics(userId);
      if (!metrics) return false;

      return TierService.hasFeature(metrics.tierName, feature as any);
    } catch (error) {
      console.error('Error checking feature access:', error);
      return false;
    }
  }

  // Get tier comparison for upgrade suggestions
  static getTierComparison(currentTier: string) {
    const current = TierService.getTierLimits(currentTier);
    const upgradePath = TierService.getUpgradePath(currentTier);
    
    return {
      current,
      upgrades: upgradePath,
      canUpgrade: upgradePath.length > 0
    };
  }

  // Fallback methods for SuperAdmin dashboard
  static getFallbackDashboardStats() {
    return {
      totalUsers: 0,
      activeUsers: 0,
      totalRevenue: 0,
      mrr: 0,
      churnRate: 0,
      newSignups: 0,
      conversionRate: 0,
      averageRevenue: 0
    };
  }

  static getFallbackUserActivity() {
    return {
      daily: [],
      weekly: [],
      monthly: []
    };
  }

  static getFallbackRevenueData() {
    return {
      monthly: [],
      quarterly: [],
      yearly: [],
      byPlan: {},
      growth: 0
    };
  }

  static getFallbackSystemHealth() {
    return {
      uptime: 99.9,
      responseTime: 150,
      errorRate: 0.1,
      activeConnections: 0,
      queueSize: 0,
      cpuUsage: 10,
      memoryUsage: 20
    };
  }

  static async exportData(dataType: string, format: string) {
    // Placeholder for export functionality
    console.log(`Exporting ${dataType} in ${format} format`);
    return { success: true, message: 'Export feature coming soon' };
  }
}

export default AnalyticsService;