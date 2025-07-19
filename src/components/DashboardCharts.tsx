import React from 'react';
import { BarChart3, LineChart, PieChart, TrendingUp, Activity } from 'lucide-react';

interface ChartData {
  [key: string]: unknown;
}

interface ChartProps {
  data?: ChartData[];
  title: string;
  type: 'line' | 'bar' | 'pie' | 'area';
  color?: string;
  height?: number;
  loading?: boolean;
}

export const SimpleChart: React.FC<ChartProps> = ({ 
  data, 
  title, 
  type, 
  color = 'blue', 
  height = 200,
  loading = false 
}) => {
  const getChartIcon = () => {
    switch (type) {
      case 'line':
        return <LineChart className="w-6 h-6" />;
      case 'bar':
        return <BarChart3 className="w-6 h-6" />;
      case 'pie':
        return <PieChart className="w-6 h-6" />;
      default:
        return <Activity className="w-6 h-6" />;
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'blue':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'purple':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'yellow':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="animate-pulse w-6 h-6 bg-gray-300 rounded"></div>
        </div>
        <div className="animate-pulse space-y-3" style={{ height }}>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className={`p-2 rounded-lg ${getColorClasses(color)}`}>
          {getChartIcon()}
        </div>
      </div>
      
      <div className="text-center py-8" style={{ height }}>
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${getColorClasses(color)}`}>
          {getChartIcon()}
        </div>
        <p className="text-gray-500 mb-2">Chart visualization</p>
        <p className="text-sm text-gray-400">
          {data && data.length > 0 ? `${data.length} data points` : 'No data available'}
        </p>
      </div>
    </div>
  );
};

interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon: Icon,
  title,
  value,
  change,
  trend = 'neutral',
  color = 'blue'
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return 'bg-green-100 text-green-600';
      case 'blue':
        return 'bg-blue-100 text-blue-600';
      case 'purple':
        return 'bg-purple-100 text-purple-600';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-600';
      case 'red':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {change && (
            <div className={`text-sm flex items-center ${getTrendColor()}`}>
              {trend === 'up' && <TrendingUp className="w-4 h-4 mr-1" />}
              {trend === 'down' && <TrendingUp className="w-4 h-4 mr-1 rotate-180" />}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${getColorClasses()}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  color?: string;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  value,
  max,
  color = 'blue',
  showPercentage = true
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const getBarColor = () => {
    switch (color) {
      case 'green':
        return 'bg-green-500';
      case 'blue':
        return 'bg-blue-500';
      case 'purple':
        return 'bg-purple-500';
      case 'yellow':
        return 'bg-yellow-500';
      case 'red':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {showPercentage && (
          <span className="text-sm text-gray-500">{percentage.toFixed(1)}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${getBarColor()}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{value.toLocaleString()}</span>
        <span>{max.toLocaleString()}</span>
      </div>
    </div>
  );
};

interface StatusIndicatorProps {
  status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  label: string;
  description?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  description
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'unhealthy':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'healthy':
        return 'text-green-600';
      case 'degraded':
        return 'text-yellow-600';
      case 'unhealthy':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="flex items-center space-x-3 py-2">
      <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900">{label}</span>
          <span className={`text-sm font-medium capitalize ${getStatusText()}`}>
            {status}
          </span>
        </div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
};

export default SimpleChart;