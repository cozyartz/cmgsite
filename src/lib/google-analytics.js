/**
 * Google Analytics 4 and Search Console Integration Service
 * Zero-cost implementation using free Google APIs
 */

export class GoogleAnalyticsService {
  constructor(credentials) {
    this.credentials = credentials;
    this.baseUrl = 'https://analyticsdata.googleapis.com/v1beta';
    this.searchConsoleUrl = 'https://searchconsole.googleapis.com/v1';
  }

  async getAccessToken() {
    // Use service account credentials for server-to-server auth
    const jwtToken = await this.createJWT();
    
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwtToken
      })
    });

    const data = await response.json();
    return data.access_token;
  }

  async createJWT() {
    // Simplified JWT creation for service account
    const header = {
      alg: 'RS256',
      typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: this.credentials.client_email,
      scope: 'https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    };

    // In a real implementation, you'd use a proper JWT library
    // For now, we'll use a simplified approach with the Web Crypto API
    return await this.signJWT(header, payload, this.credentials.private_key);
  }

  async signJWT(header, payload, privateKey) {
    // Simplified JWT signing - in production, use a proper JWT library
    const headerEncoded = btoa(JSON.stringify(header));
    const payloadEncoded = btoa(JSON.stringify(payload));
    const data = `${headerEncoded}.${payloadEncoded}`;
    
    // This is a placeholder - real implementation would use proper crypto signing
    return `${data}.signature`;
  }

  /**
   * Get real-time analytics data from GA4
   */
  async getRealtimeData(propertyId) {
    const token = await this.getAccessToken();
    
    const response = await fetch(`${this.baseUrl}/properties/${propertyId}:runRealtimeReport`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        metrics: [
          { name: 'activeUsers' },
          { name: 'screenPageViews' },
          { name: 'conversions' }
        ],
        dimensions: [
          { name: 'country' },
          { name: 'deviceCategory' },
          { name: 'trafficSource' }
        ]
      })
    });

    return await response.json();
  }

  /**
   * Get traffic data for the last 30 days
   */
  async getTrafficData(propertyId, startDate = '30daysAgo', endDate = 'today') {
    const token = await this.getAccessToken();
    
    const response = await fetch(`${this.baseUrl}/properties/${propertyId}:runReport`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: 'sessions' },
          { name: 'totalUsers' },
          { name: 'pageviews' },
          { name: 'bounceRate' },
          { name: 'sessionDuration' },
          { name: 'conversions' }
        ],
        dimensions: [
          { name: 'date' },
          { name: 'sourceMedium' },
          { name: 'country' }
        ]
      })
    });

    return await response.json();
  }

  /**
   * Get conversion data and goals
   */
  async getConversionData(propertyId) {
    const token = await this.getAccessToken();
    
    const response = await fetch(`${this.baseUrl}/properties/${propertyId}:runReport`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        metrics: [
          { name: 'conversions' },
          { name: 'totalRevenue' },
          { name: 'purchaseRevenue' },
          { name: 'ecommercePurchases' }
        ],
        dimensions: [
          { name: 'eventName' },
          { name: 'sourceMedium' }
        ]
      })
    });

    return await response.json();
  }

  /**
   * Get Search Console data for keyword rankings
   */
  async getSearchConsoleData(siteUrl, startDate = '2024-06-01', endDate = '2024-07-16') {
    const token = await this.getAccessToken();
    
    const response = await fetch(`${this.searchConsoleUrl}/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ['query', 'page', 'country', 'device'],
        metrics: ['clicks', 'impressions', 'ctr', 'position'],
        rowLimit: 1000,
        startRow: 0
      })
    });

    return await response.json();
  }

  /**
   * Get page performance data from Search Console
   */
  async getPagePerformance(siteUrl) {
    const token = await this.getAccessToken();
    
    const response = await fetch(`${this.searchConsoleUrl}/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        startDate: '2024-06-01',
        endDate: '2024-07-16',
        dimensions: ['page'],
        metrics: ['clicks', 'impressions', 'ctr', 'position'],
        rowLimit: 100
      })
    });

    return await response.json();
  }

  /**
   * Get indexed pages from Search Console
   */
  async getIndexedPages(siteUrl) {
    const token = await this.getAccessToken();
    
    const response = await fetch(`${this.searchConsoleUrl}/sites/${encodeURIComponent(siteUrl)}/sitemaps`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return await response.json();
  }

  /**
   * Format analytics data for dashboard display
   */
  formatTrafficData(rawData) {
    if (!rawData.rows) return null;

    const formatted = {
      totalSessions: 0,
      totalUsers: 0,
      totalPageviews: 0,
      averageBounceRate: 0,
      averageSessionDuration: 0,
      dailyData: [],
      topSources: [],
      topCountries: []
    };

    // Process daily data
    const dailyMap = new Map();
    rawData.rows.forEach(row => {
      const date = row.dimensionValues[0].value;
      const sessions = parseInt(row.metricValues[0].value);
      const users = parseInt(row.metricValues[1].value);
      const pageviews = parseInt(row.metricValues[2].value);

      if (!dailyMap.has(date)) {
        dailyMap.set(date, { date, sessions: 0, users: 0, pageviews: 0 });
      }
      
      const day = dailyMap.get(date);
      day.sessions += sessions;
      day.users += users;
      day.pageviews += pageviews;

      formatted.totalSessions += sessions;
      formatted.totalUsers += users;
      formatted.totalPageviews += pageviews;
    });

    formatted.dailyData = Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    return formatted;
  }

  /**
   * Format Search Console data for dashboard
   */
  formatSearchConsoleData(rawData) {
    if (!rawData.rows) return null;

    const formatted = {
      totalClicks: 0,
      totalImpressions: 0,
      averageCTR: 0,
      averagePosition: 0,
      topQueries: [],
      topPages: [],
      positionDistribution: {
        '1-3': 0,
        '4-10': 0,
        '11-20': 0,
        '21+': 0
      }
    };

    rawData.rows.forEach(row => {
      const query = row.keys[0];
      const clicks = parseInt(row.clicks || 0);
      const impressions = parseInt(row.impressions || 0);
      const ctr = parseFloat(row.ctr || 0);
      const position = parseFloat(row.position || 0);

      formatted.totalClicks += clicks;
      formatted.totalImpressions += impressions;

      // Track position distribution
      if (position <= 3) formatted.positionDistribution['1-3']++;
      else if (position <= 10) formatted.positionDistribution['4-10']++;
      else if (position <= 20) formatted.positionDistribution['11-20']++;
      else formatted.positionDistribution['21+']++;

      // Add to top queries
      formatted.topQueries.push({
        query,
        clicks,
        impressions,
        ctr: (ctr * 100).toFixed(2),
        position: position.toFixed(1)
      });
    });

    // Calculate averages
    if (rawData.rows.length > 0) {
      formatted.averageCTR = (formatted.totalClicks / formatted.totalImpressions * 100).toFixed(2);
      formatted.averagePosition = (rawData.rows.reduce((sum, row) => sum + parseFloat(row.position || 0), 0) / rawData.rows.length).toFixed(1);
    }

    // Sort and limit top queries
    formatted.topQueries.sort((a, b) => b.clicks - a.clicks).splice(50);

    return formatted;
  }
}

/**
 * Helper function to calculate growth percentage
 */
export function calculateGrowth(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous * 100).toFixed(1);
}

/**
 * Helper function to format large numbers
 */
export function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Date helper functions
 */
export function getDateRange(days) {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  
  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0]
  };
}

export default GoogleAnalyticsService;