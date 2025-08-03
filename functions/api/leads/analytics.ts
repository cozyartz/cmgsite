/**
 * Lead Analytics API Endpoint
 * Provides analytics and insights on lead generation performance
 */

interface Env {
  BREAKCOLD_API_KEY?: string;
  JWT_SECRET?: string;
}

interface LeadAnalytics {
  totalLeads: number;
  leadsThisMonth: number;
  leadsThisWeek: number;
  conversionRate: number;
  averageLeadScore: number;
  topSources: Array<{ source: string; count: number; percentage: number }>;
  topInterests: Array<{ interest: string; count: number; percentage: number }>;
  leadsByStatus: Array<{ status: string; count: number; percentage: number }>;
  monthlyTrend: Array<{ month: string; leads: number; qualified: number }>;
  qualificationMetrics: {
    totalQualified: number;
    qualificationRate: number;
    averageTimeToQualify: number;
  };
}

// Mock data for demonstration - in production, this would query Breakcold API
const generateMockAnalytics = (): LeadAnalytics => {
  return {
    totalLeads: 147,
    leadsThisMonth: 23,
    leadsThisWeek: 8,
    conversionRate: 32.5,
    averageLeadScore: 65.2,
    topSources: [
      { source: 'Website Chatbot', count: 45, percentage: 30.6 },
      { source: 'Contact Form', count: 32, percentage: 21.8 },
      { source: 'Social Media', count: 28, percentage: 19.0 },
      { source: 'Referral', count: 25, percentage: 17.0 },
      { source: 'Email Campaign', count: 17, percentage: 11.6 }
    ],
    topInterests: [
      { interest: 'Web Design', count: 52, percentage: 35.4 },
      { interest: 'SEO Services', count: 38, percentage: 25.9 },
      { interest: 'AI Integration', count: 28, percentage: 19.0 },
      { interest: 'Digital Marketing', count: 19, percentage: 12.9 },
      { interest: 'E-commerce', count: 10, percentage: 6.8 }
    ],
    leadsByStatus: [
      { status: 'New', count: 15, percentage: 10.2 },
      { status: 'Contacted', count: 42, percentage: 28.6 },
      { status: 'Qualified', count: 48, percentage: 32.7 },
      { status: 'Proposal Sent', count: 25, percentage: 17.0 },
      { status: 'Closed Won', count: 12, percentage: 8.2 },
      { status: 'Closed Lost', count: 5, percentage: 3.4 }
    ],
    monthlyTrend: [
      { month: 'Jul 2024', leads: 18, qualified: 12 },
      { month: 'Aug 2024', leads: 22, qualified: 16 },
      { month: 'Sep 2024', leads: 19, qualified: 13 },
      { month: 'Oct 2024', leads: 25, qualified: 18 },
      { month: 'Nov 2024', leads: 28, qualified: 21 },
      { month: 'Dec 2024', leads: 32, qualified: 24 },
      { month: 'Jan 2025', leads: 23, qualified: 15 }
    ],
    qualificationMetrics: {
      totalQualified: 119,
      qualificationRate: 81.0,
      averageTimeToQualify: 2.3
    }
  };
};

// In production, this would fetch real data from Breakcold API
const fetchLeadAnalytics = async (apiKey: string, timeframe: string = '30d'): Promise<LeadAnalytics> => {
  try {
    // This is where you'd make actual API calls to Breakcold
    // const response = await fetch(`https://api.breakcold.com/v3/leads?timeframe=${timeframe}`, {
    //   headers: {
    //     'Authorization': `Bearer ${apiKey}`,
    //     'Content-Type': 'application/json'
    //   }
    // });
    
    // For now, return mock data
    return generateMockAnalytics();
  } catch (error) {
    console.error('Failed to fetch lead analytics:', error);
    throw new Error('Unable to fetch analytics data');
  }
};

// Verify JWT token (simplified)
const verifyToken = async (token: string, secret: string): Promise<any> => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
    
    const payload = JSON.parse(atob(parts[1]));
    
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      throw new Error('Token expired');
    }
    
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    // Verify API key is configured
    const apiKey = env.BREAKCOLD_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Breakcold API key not configured'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Authentication required'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.slice(7);
    const jwtSecret = env.JWT_SECRET;
    
    if (jwtSecret) {
      try {
        await verifyToken(token, jwtSecret);
      } catch (error) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid authentication token'
        }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Parse query parameters
    const url = new URL(request.url);
    const timeframe = url.searchParams.get('timeframe') || '30d';
    const format = url.searchParams.get('format') || 'json';

    console.log('Fetching lead analytics:', { timeframe, format });

    // Fetch analytics data
    const analytics = await fetchLeadAnalytics(apiKey, timeframe);

    // Return CSV format if requested
    if (format === 'csv') {
      const csvData = [
        'Metric,Value',
        `Total Leads,${analytics.totalLeads}`,
        `Leads This Month,${analytics.leadsThisMonth}`,
        `Leads This Week,${analytics.leadsThisWeek}`,
        `Conversion Rate,${analytics.conversionRate}%`,
        `Average Lead Score,${analytics.averageLeadScore}`,
        `Total Qualified,${analytics.qualificationMetrics.totalQualified}`,
        `Qualification Rate,${analytics.qualificationMetrics.qualificationRate}%`,
        '',
        'Top Sources',
        'Source,Count,Percentage',
        ...analytics.topSources.map(s => `${s.source},${s.count},${s.percentage}%`),
        '',
        'Top Interests',
        'Interest,Count,Percentage',
        ...analytics.topInterests.map(i => `${i.interest},${i.count},${i.percentage}%`)
      ].join('\n');

      return new Response(csvData, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="lead-analytics-${timeframe}.csv"`
        }
      });
    }

    // Return JSON response
    return new Response(JSON.stringify({
      success: true,
      data: analytics,
      timeframe,
      generatedAt: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Analytics fetch error:', error);

    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch analytics',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Handle OPTIONS requests for CORS
export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
};