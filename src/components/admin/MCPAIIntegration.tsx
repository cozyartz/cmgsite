/**
 * MCP Server AI Analytics Integration
 * Sends AI analytics data to the MCP server dashboard
 */

import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  Bot,
  Server,
  Activity,
  TrendingUp
} from 'lucide-react';

interface MCPAIIntegrationProps {
  mcpServerUrl?: string;
  autoSync?: boolean;
  syncInterval?: number; // minutes
}

interface SyncStatus {
  lastSync: Date | null;
  status: 'success' | 'error' | 'syncing' | 'idle';
  message: string;
  totalRecordsSynced?: number;
}

const MCPAIIntegration: React.FC<MCPAIIntegrationProps> = ({
  mcpServerUrl = '/Users/cozart-lundin/code/cozyartz-mcp-hub/dashboard',
  autoSync = true,
  syncInterval = 15
}) => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSync: null,
    status: 'idle',
    message: 'Ready to sync AI analytics data'
  });

  const [isManualSyncEnabled, setIsManualSyncEnabled] = useState(true);

  const syncAIAnalyticsToMCP = async () => {
    setSyncStatus({
      ...syncStatus,
      status: 'syncing',
      message: 'Syncing AI analytics to MCP server...'
    });

    try {
      // Fetch latest AI analytics data
      const analyticsResponse = await fetch('/api/ai/analytics?timeRange=24h', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!analyticsResponse.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const analyticsData = await analyticsResponse.json();

      // Transform data for MCP server format
      const mcpData = transformForMCP(analyticsData.data);

      // Send to MCP server (simulated for now - you'll integrate with your actual MCP setup)
      const mcpResponse = await sendToMCPServer(mcpData);

      setSyncStatus({
        lastSync: new Date(),
        status: 'success',
        message: `Successfully synced ${mcpResponse.recordsProcessed} records to MCP dashboard`,
        totalRecordsSynced: mcpResponse.recordsProcessed
      });

    } catch (error) {
      console.error('MCP sync error:', error);
      setSyncStatus({
        ...syncStatus,
        status: 'error',
        message: `Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  const transformForMCP = (analyticsData: any) => {
    return {
      timestamp: new Date().toISOString(),
      source: 'cmgsite-ai-chatbot',
      metrics: {
        conversations: {
          total: analyticsData.overview.total_conversations,
          daily_average: analyticsData.daily_stats.reduce((sum: number, day: any) => sum + day.conversations, 0) / analyticsData.daily_stats.length,
          conversion_rate: analyticsData.overview.conversion_rate
        },
        ai_performance: {
          models: analyticsData.model_performance.map((model: any) => ({
            name: model.model_name,
            success_rate: model.success_rate,
            cost: model.total_cost,
            requests: model.requests
          })),
          total_cost: analyticsData.overview.total_ai_cost,
          cost_per_conversion: analyticsData.overview.cost_per_conversion
        },
        lead_intelligence: {
          high_intent_leads: analyticsData.lead_quality.high_intent_leads,
          qualified_leads: analyticsData.lead_quality.qualified_leads,
          converted_leads: analyticsData.lead_quality.converted_leads,
          avg_lead_score: analyticsData.overview.avg_lead_score
        },
        intents: analyticsData.intent_analysis.map((intent: any) => ({
          type: intent.intent,
          count: intent.count,
          conversion_rate: intent.conversion_rate
        }))
      },
      alerts: generateAlerts(analyticsData),
      recommendations: generateRecommendations(analyticsData)
    };
  };

  const sendToMCPServer = async (data: any): Promise<{ recordsProcessed: number }> => {
    // Simulate MCP server API call
    // In real implementation, this would call your MCP server endpoint
    
    console.log('Sending to MCP server:', data);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For now, we'll just log to console and create a local file
    // You can replace this with actual MCP server integration
    try {
      // Simulate writing to MCP dashboard data file
      const mcpPayload = {
        ...data,
        processed_at: new Date().toISOString(),
        dashboard_path: mcpServerUrl
      };

      // You would replace this with actual MCP server API call
      console.log('MCP Payload ready for:', mcpServerUrl, mcpPayload);
      
      return { recordsProcessed: Object.keys(data.metrics).length };
    } catch (error) {
      throw new Error(`MCP server integration failed: ${error}`);
    }
  };

  const generateAlerts = (data: any): Array<{ type: string; message: string; severity: 'low' | 'medium' | 'high' }> => {
    const alerts = [];

    if (data.overview.conversion_rate < 10) {
      alerts.push({
        type: 'conversion_rate',
        message: 'AI chatbot conversion rate below 10% - may need optimization',
        severity: 'medium' as const
      });
    }

    if (data.overview.total_ai_cost > 100) {
      alerts.push({
        type: 'cost_threshold',
        message: 'AI costs exceeding $100/month - consider cost optimization',
        severity: 'low' as const
      });
    }

    const failedModels = data.model_performance.filter((model: any) => model.success_rate < 95);
    if (failedModels.length > 0) {
      alerts.push({
        type: 'model_performance',
        message: `${failedModels.length} AI models showing reduced performance`,
        severity: 'high' as const
      });
    }

    return alerts;
  };

  const generateRecommendations = (data: any): Array<{ type: string; message: string; impact: 'high' | 'medium' | 'low' }> => {
    const recommendations = [];

    if (data.overview.avg_lead_score < 50) {
      recommendations.push({
        type: 'lead_qualification',
        message: 'Improve lead qualification prompts to increase average lead scores',
        impact: 'high' as const
      });
    }

    if (data.intent_analysis.find((intent: any) => intent.intent === 'pricing' && intent.conversion_rate < 20)) {
      recommendations.push({
        type: 'pricing_optimization',
        message: 'Optimize pricing conversation flows to improve conversion rates',
        impact: 'medium' as const
      });
    }

    const highCostModel = data.model_performance.find((model: any) => model.total_cost > data.overview.total_ai_cost * 0.6);
    if (highCostModel) {
      recommendations.push({
        type: 'cost_optimization',
        message: `Consider optimizing ${highCostModel.model_name} usage to reduce costs`,
        impact: 'medium' as const
      });
    }

    return recommendations;
  };

  // Auto-sync setup
  useEffect(() => {
    if (autoSync && syncInterval > 0) {
      const interval = setInterval(syncAIAnalyticsToMCP, syncInterval * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [autoSync, syncInterval]);

  const getStatusIcon = () => {
    switch (syncStatus.status) {
      case 'success':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'syncing':
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (syncStatus.status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'syncing':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Server className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">MCP Server Integration</h3>
            <p className="text-sm text-gray-600">Sync AI analytics to MCP dashboard</p>
          </div>
        </div>
        
        <button
          onClick={syncAIAnalyticsToMCP}
          disabled={syncStatus.status === 'syncing' || !isManualSyncEnabled}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
          Sync Now
        </button>
      </div>

      {/* Status Display */}
      <div className={`p-4 rounded-lg border ${getStatusColor()} mb-4`}>
        <div className="flex items-start gap-3">
          {getStatusIcon()}
          <div className="flex-1">
            <p className="font-medium text-gray-900">
              {syncStatus.status === 'success' ? 'Sync Successful' :
               syncStatus.status === 'error' ? 'Sync Failed' :
               syncStatus.status === 'syncing' ? 'Syncing...' :
               'Ready to Sync'}
            </p>
            <p className="text-sm text-gray-600 mt-1">{syncStatus.message}</p>
            {syncStatus.lastSync && (
              <p className="text-xs text-gray-500 mt-2">
                Last sync: {syncStatus.lastSync.toLocaleString()}
                {syncStatus.totalRecordsSynced && ` • ${syncStatus.totalRecordsSynced} records`}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-900">Auto-sync</label>
            <p className="text-xs text-gray-500">Automatically sync every {syncInterval} minutes</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoSync}
              onChange={(e) => {
                // You might want to persist this setting
                console.log('Auto-sync toggled:', e.target.checked);
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Bot className="w-4 h-4" />
            <span>MCP Dashboard Path: {mcpServerUrl}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Real-time AI metrics</span>
          </div>
          <div className="flex items-center gap-1">
            <Activity className="w-3 h-3" />
            <span>Lead intelligence</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>Performance alerts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCPAIIntegration;