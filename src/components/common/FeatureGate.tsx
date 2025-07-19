import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import { TierService } from '../../lib/tiers';
import { AnalyticsService } from '../../lib/analytics';
import { Lock, Crown, Zap, ArrowRight } from 'lucide-react';

interface FeatureGateProps {
  feature: string;
  tier?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
  showUpgrade?: boolean;
  customMessage?: string;
}

const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  tier,
  fallback,
  children,
  showUpgrade = true,
  customMessage
}) => {
  const { user, profile } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tierLimits, setTierLimits] = useState<any>(null);

  useEffect(() => {
    checkAccess();
  }, [user, profile, feature, tier]);

  const checkAccess = async () => {
    if (!user || !profile) {
      setHasAccess(false);
      setLoading(false);
      return;
    }

    try {
      const userTier = profile.role === 'admin' ? 'enterprise' : (profile.subscription_tier || 'free');
      const limits = TierService.getTierLimits(userTier);
      setTierLimits(limits);

      // Check if user has access to this feature
      let access = false;
      
      if (tier) {
        // Check if user's tier is at least the required tier
        const tierHierarchy = ['free', 'starter', 'growth', 'enterprise'];
        const userTierIndex = tierHierarchy.indexOf(userTier);
        const requiredTierIndex = tierHierarchy.indexOf(tier);
        access = userTierIndex >= requiredTierIndex;
      } else {
        // Check specific feature access
        access = TierService.hasFeature(userTier, feature as any);
      }

      setHasAccess(access);
    } catch (error) {
      console.error('Error checking feature access:', error);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  const getUpgradeMessage = () => {
    if (customMessage) return customMessage;
    
    const userTier = profile?.subscription_tier || 'free';
    const recommendation = TierService.getUpgradeRecommendation(userTier, 0);
    
    if (tier) {
      const tierInfo = TierService.getTierLimits(tier);
      return `This feature requires the ${tierInfo.displayName} plan or higher.`;
    }
    
    return `This feature is not available in your current plan. ${recommendation ? `Consider upgrading to ${TierService.getTierLimits(recommendation).displayName}.` : ''}`;
  };

  const handleUpgradeClick = () => {
    // Track upgrade intent
    if (user) {
      AnalyticsService.trackEvent(user.id, 'upgrade_intent', {
        feature,
        current_tier: profile?.subscription_tier || 'free',
        required_tier: tier
      });
    }
    
    // Navigate to pricing page
    window.location.href = '/pricing';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (!showUpgrade) {
      return null;
    }

    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4">
            <Lock className="h-6 w-6 text-orange-600" />
          </div>
          
          <h3 className="text-lg font-medium text-white mb-2">
            Feature Locked
          </h3>
          
          <p className="text-slate-400 mb-4">
            {getUpgradeMessage()}
          </p>

          {tier && (
            <div className="bg-slate-700 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <span className="text-white font-medium">
                  {TierService.getTierLimits(tier).displayName} Plan
                </span>
              </div>
              <p className="text-slate-300 text-sm">
                Starting at ${TierService.getTierLimits(tier).price}/month
              </p>
            </div>
          )}

          <button
            onClick={handleUpgradeClick}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            <Zap className="h-4 w-4 mr-2" />
            Upgrade Now
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default FeatureGate;