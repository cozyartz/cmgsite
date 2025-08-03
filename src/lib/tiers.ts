// Comprehensive tier control system for Cozyartz Media

export interface TierLimits {
  id: string;
  name: string;
  displayName: string;
  price: number;
  priceInCents: number;
  aiCallsPerMonth: number;
  features: {
    basicAI: boolean;
    advancedAI: boolean;
    premiumAI: boolean;
    realTimeAnalytics: boolean;
    customTemplates: boolean;
    prioritySupport: boolean;
    whiteLabel: boolean;
    customIntegrations: boolean;
    monthlyConsultation: boolean;
    competitorTracking: boolean;
    bulkOperations: boolean;
    exportData: boolean;
    apiAccess: boolean;
    customReports: boolean;
  };
  limits: {
    projectsMax: number;
    teamMembersMax: number;
    storageGB: number;
    emailReportsPerMonth: number;
    customDomainsMax: number;
    integrations: string[];
  };
}

export const TIER_DEFINITIONS: Record<string, TierLimits> = {
  free: {
    id: 'free',
    name: 'free',
    displayName: 'Free',
    price: 0,
    priceInCents: 0,
    aiCallsPerMonth: 10,
    features: {
      basicAI: true,
      advancedAI: false,
      premiumAI: false,
      realTimeAnalytics: false,
      customTemplates: false,
      prioritySupport: false,
      whiteLabel: false,
      customIntegrations: false,
      monthlyConsultation: false,
      competitorTracking: false,
      bulkOperations: false,
      exportData: false,
      apiAccess: false,
      customReports: false,
    },
    limits: {
      projectsMax: 1,
      teamMembersMax: 1,
      storageGB: 0.5,
      emailReportsPerMonth: 2,
      customDomainsMax: 1,
      integrations: ['google-analytics'],
    },
  },
  starter: {
    id: 'starter',
    name: 'starter',
    displayName: 'Starter',
    price: 29,
    priceInCents: 2900,
    aiCallsPerMonth: 100,
    features: {
      basicAI: true,
      advancedAI: true,
      premiumAI: false,
      realTimeAnalytics: true,
      customTemplates: true,
      prioritySupport: false,
      whiteLabel: false,
      customIntegrations: false,
      monthlyConsultation: false,
      competitorTracking: false,
      bulkOperations: false,
      exportData: true,
      apiAccess: false,
      customReports: false,
    },
    limits: {
      projectsMax: 3,
      teamMembersMax: 2,
      storageGB: 5,
      emailReportsPerMonth: 10,
      customDomainsMax: 3,
      integrations: ['google-analytics', 'google-search-console', 'mailchimp'],
    },
  },
  growth: {
    id: 'growth',
    name: 'growth',
    displayName: 'Growth',
    price: 99,
    priceInCents: 9900,
    aiCallsPerMonth: 500,
    features: {
      basicAI: true,
      advancedAI: true,
      premiumAI: true,
      realTimeAnalytics: true,
      customTemplates: true,
      prioritySupport: true,
      whiteLabel: false,
      customIntegrations: false,
      monthlyConsultation: false,
      competitorTracking: true,
      bulkOperations: true,
      exportData: true,
      apiAccess: true,
      customReports: true,
    },
    limits: {
      projectsMax: 10,
      teamMembersMax: 5,
      storageGB: 25,
      emailReportsPerMonth: 50,
      customDomainsMax: 10,
      integrations: ['google-analytics', 'google-search-console', 'mailchimp', 'facebook-ads', 'hubspot'],
    },
  },
  professional: {
    id: 'professional',
    name: 'professional',
    displayName: 'Professional',
    price: 199,
    priceInCents: 19900,
    aiCallsPerMonth: 1000,
    features: {
      basicAI: true,
      advancedAI: true,
      premiumAI: true,
      realTimeAnalytics: true,
      customTemplates: true,
      prioritySupport: true,
      whiteLabel: true,
      customIntegrations: false,
      monthlyConsultation: false,
      competitorTracking: true,
      bulkOperations: true,
      exportData: true,
      apiAccess: true,
      customReports: true,
    },
    limits: {
      projectsMax: 25,
      teamMembersMax: 10,
      storageGB: 100,
      emailReportsPerMonth: 100,
      customDomainsMax: 25,
      integrations: ['google-analytics', 'google-search-console', 'mailchimp', 'facebook-ads', 'hubspot', 'zapier'],
    },
  },
  enterprise: {
    id: 'enterprise',
    name: 'enterprise',
    displayName: 'Enterprise',
    price: 299,
    priceInCents: 29900,
    aiCallsPerMonth: -1, // Unlimited
    features: {
      basicAI: true,
      advancedAI: true,
      premiumAI: true,
      realTimeAnalytics: true,
      customTemplates: true,
      prioritySupport: true,
      whiteLabel: true,
      customIntegrations: true,
      monthlyConsultation: true,
      competitorTracking: true,
      bulkOperations: true,
      exportData: true,
      apiAccess: true,
      customReports: true,
    },
    limits: {
      projectsMax: -1, // Unlimited
      teamMembersMax: -1, // Unlimited
      storageGB: 500,
      emailReportsPerMonth: -1, // Unlimited
      customDomainsMax: -1, // Unlimited
      integrations: ['all'],
    },
  },
  legacyEnterprise: {
    id: 'legacyEnterprise',
    name: 'legacyEnterprise',
    displayName: 'Legacy Enterprise',
    price: 1000,
    priceInCents: 100000,
    aiCallsPerMonth: -1, // Unlimited
    features: {
      basicAI: true,
      advancedAI: true,
      premiumAI: true,
      realTimeAnalytics: true,
      customTemplates: true,
      prioritySupport: true,
      whiteLabel: true,
      customIntegrations: true,
      monthlyConsultation: true,
      competitorTracking: true,
      bulkOperations: true,
      exportData: true,
      apiAccess: true,
      customReports: true,
    },
    limits: {
      projectsMax: -1, // Unlimited
      teamMembersMax: -1, // Unlimited
      storageGB: 1000,
      emailReportsPerMonth: -1, // Unlimited
      customDomainsMax: -1, // Unlimited
      integrations: ['all'],
    },
  },
};

export class TierService {
  static getTierLimits(tierName: string): TierLimits {
    return TIER_DEFINITIONS[tierName] || TIER_DEFINITIONS.free;
  }

  static hasFeature(tierName: string, feature: keyof TierLimits['features']): boolean {
    const tier = this.getTierLimits(tierName);
    return tier.features[feature];
  }

  static canUseAI(tierName: string, currentUsage: number): boolean {
    const tier = this.getTierLimits(tierName);
    if (tier.aiCallsPerMonth === -1) return true; // Unlimited
    return currentUsage < tier.aiCallsPerMonth;
  }

  static getRemainingAICalls(tierName: string, currentUsage: number): number {
    const tier = this.getTierLimits(tierName);
    if (tier.aiCallsPerMonth === -1) return -1; // Unlimited
    return Math.max(0, tier.aiCallsPerMonth - currentUsage);
  }

  static canCreateProject(tierName: string, currentCount: number): boolean {
    const tier = this.getTierLimits(tierName);
    if (tier.limits.projectsMax === -1) return true; // Unlimited
    return currentCount < tier.limits.projectsMax;
  }

  static canAddTeamMember(tierName: string, currentCount: number): boolean {
    const tier = this.getTierLimits(tierName);
    if (tier.limits.teamMembersMax === -1) return true; // Unlimited
    return currentCount < tier.limits.teamMembersMax;
  }

  static getUsagePercentage(tierName: string, currentUsage: number): number {
    const tier = this.getTierLimits(tierName);
    if (tier.aiCallsPerMonth === -1) return 0; // Unlimited
    return Math.min(100, (currentUsage / tier.aiCallsPerMonth) * 100);
  }

  static getUpgradeRecommendation(tierName: string, currentUsage: number): string | null {
    const tier = this.getTierLimits(tierName);
    const usagePercentage = this.getUsagePercentage(tierName, currentUsage);
    
    if (usagePercentage >= 80 && tierName === 'free') {
      return 'starter';
    } else if (usagePercentage >= 80 && tierName === 'starter') {
      return 'growth';
    } else if (usagePercentage >= 80 && tierName === 'growth') {
      return 'enterprise';
    }
    
    return null;
  }

  static formatUsageDisplay(tierName: string, currentUsage: number): string {
    const tier = this.getTierLimits(tierName);
    if (tier.aiCallsPerMonth === -1) {
      return `${currentUsage} / Unlimited`;
    }
    return `${currentUsage} / ${tier.aiCallsPerMonth}`;
  }

  static getAllTiers(): TierLimits[] {
    return Object.values(TIER_DEFINITIONS);
  }

  static getUpgradePath(currentTier: string): TierLimits[] {
    const tiers = this.getAllTiers();
    const currentIndex = tiers.findIndex(t => t.id === currentTier);
    return tiers.slice(currentIndex + 1);
  }
}

// Usage tracking types and utilities
export interface UsageMetrics {
  userId: string;
  tierName: string;
  aiCallsUsed: number;
  projectsCount: number;
  teamMembersCount: number;
  storageUsedGB: number;
  lastResetDate: string;
  monthlyResetDate: string;
}

export class UsageTracker {
  static shouldResetMonthlyUsage(lastReset: string, resetDay: number): boolean {
    const lastResetDate = new Date(lastReset);
    const now = new Date();
    
    // Calculate next reset date
    const nextReset = new Date(lastResetDate);
    nextReset.setMonth(nextReset.getMonth() + 1);
    nextReset.setDate(resetDay);
    
    return now >= nextReset;
  }

  static getNextResetDate(resetDay: number): Date {
    const now = new Date();
    const nextReset = new Date(now.getFullYear(), now.getMonth(), resetDay);
    
    // If we've passed this month's reset day, move to next month
    if (now.getDate() >= resetDay) {
      nextReset.setMonth(nextReset.getMonth() + 1);
    }
    
    return nextReset;
  }

  static calculateDaysUntilReset(resetDay: number): number {
    const now = new Date();
    const nextReset = this.getNextResetDate(resetDay);
    const diffTime = nextReset.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

export default TierService;