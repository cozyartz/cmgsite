/**
 * Competitor Monitoring Service
 * Zero-cost web scraping using Cloudflare Workers
 */

export class CompetitorMonitoringService {
  constructor(env) {
    this.env = env;
    this.cache = env.KV; // Use KV for caching scraped data
  }

  /**
   * Monitor competitor website changes
   */
  async monitorCompetitor(competitorData) {
    const { domain, pages, keywords, trackingSettings } = competitorData;
    
    try {
      const results = await Promise.all([
        this.scrapeWebsiteContent(domain, pages),
        this.checkSEOMetrics(domain),
        this.monitorKeywordRankings(domain, keywords),
        this.trackSocialMedia(domain),
        this.analyzeTechnicalStack(domain)
      ]);

      const [content, seo, keywords, social, tech] = results;
      
      const competitorSnapshot = {
        domain,
        timestamp: new Date().toISOString(),
        content,
        seo,
        keywords,
        social,
        tech,
        score: this.calculateCompetitorScore(results)
      };

      // Cache the data for 6 hours
      await this.cache?.put(
        `competitor_${domain}_${Date.now()}`,
        JSON.stringify(competitorSnapshot),
        { expirationTtl: 21600 }
      );

      return competitorSnapshot;
    } catch (error) {
      console.error('Competitor monitoring error:', error);
      throw error;
    }
  }

  /**
   * Scrape website content and structure
   */
  async scrapeWebsiteContent(domain, pages = ['/', '/about', '/services', '/pricing']) {
    const contentData = {
      pages: [],
      totalPages: 0,
      averageLoadTime: 0,
      technologies: [],
      contentChanges: []
    };

    for (const page of pages) {
      try {
        const url = `https://${domain}${page}`;
        const startTime = Date.now();
        
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; SEO-Monitor/1.0)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          }
        });

        const loadTime = Date.now() - startTime;
        const html = await response.text();
        
        const pageData = {
          url,
          statusCode: response.status,
          loadTime,
          content: this.extractPageContent(html),
          meta: this.extractMetaTags(html),
          headings: this.extractHeadings(html),
          links: this.extractLinks(html, domain),
          images: this.extractImages(html),
          lastModified: response.headers.get('last-modified'),
          contentLength: html.length
        };

        contentData.pages.push(pageData);
        contentData.totalPages++;
        contentData.averageLoadTime += loadTime;

        // Check for technology indicators
        const techs = this.detectTechnologies(html, response.headers);
        contentData.technologies.push(...techs);

      } catch (error) {
        console.error(`Error scraping ${domain}${page}:`, error);
        contentData.pages.push({
          url: `https://${domain}${page}`,
          error: error.message,
          statusCode: 0
        });
      }
    }

    contentData.averageLoadTime = contentData.averageLoadTime / contentData.totalPages;
    contentData.technologies = [...new Set(contentData.technologies)];

    return contentData;
  }

  /**
   * Check SEO metrics using free tools
   */
  async checkSEOMetrics(domain) {
    try {
      const url = `https://${domain}`;
      const response = await fetch(url);
      const html = await response.text();

      return {
        title: this.extractTitle(html),
        metaDescription: this.extractMetaDescription(html),
        h1Tags: this.extractH1Tags(html),
        imageAltTags: this.checkImageAltTags(html),
        internalLinks: this.countInternalLinks(html, domain),
        externalLinks: this.countExternalLinks(html, domain),
        canonicalUrl: this.extractCanonical(html),
        metaRobots: this.extractMetaRobots(html),
        structuredData: this.extractStructuredData(html),
        openGraph: this.extractOpenGraph(html),
        twitterCards: this.extractTwitterCards(html),
        pageSpeed: await this.getPageSpeedMetrics(url),
        mobileFriendly: this.checkMobileFriendly(html),
        httpsEnabled: url.startsWith('https://'),
        sslInfo: this.getSSLInfo(response.headers)
      };
    } catch (error) {
      console.error('SEO metrics error:', error);
      return { error: error.message };
    }
  }

  /**
   * Monitor keyword rankings (simulated - in production would use SERP APIs)
   */
  async monitorKeywordRankings(domain, keywords) {
    const rankingData = {
      keywords: [],
      averagePosition: 0,
      improvementCount: 0,
      declineCount: 0,
      totalKeywords: keywords.length
    };

    for (const keyword of keywords) {
      try {
        // Simulate SERP checking - in production, use SERP APIs or scraping
        const position = await this.checkKeywordPosition(domain, keyword);
        const previousPosition = await this.getPreviousPosition(domain, keyword);
        
        const change = previousPosition ? position - previousPosition : 0;
        
        rankingData.keywords.push({
          keyword,
          position,
          previousPosition,
          change,
          trend: change > 0 ? 'down' : change < 0 ? 'up' : 'stable',
          searchVolume: await this.getSearchVolume(keyword), // Simulated
          difficulty: await this.getKeywordDifficulty(keyword) // Simulated
        });

        if (change > 0) rankingData.declineCount++;
        if (change < 0) rankingData.improvementCount++;
        rankingData.averagePosition += position;

      } catch (error) {
        console.error(`Keyword ranking error for ${keyword}:`, error);
      }
    }

    rankingData.averagePosition = rankingData.averagePosition / keywords.length;
    return rankingData;
  }

  /**
   * Track social media presence
   */
  async trackSocialMedia(domain) {
    const socialData = {
      platforms: [],
      totalFollowers: 0,
      engagement: {
        total: 0,
        rate: 0
      },
      recentActivity: []
    };

    const platforms = ['twitter', 'linkedin', 'facebook', 'instagram', 'youtube'];
    
    for (const platform of platforms) {
      try {
        const handle = await this.findSocialHandle(domain, platform);
        if (handle) {
          const metrics = await this.getSocialMetrics(platform, handle);
          socialData.platforms.push({
            platform,
            handle,
            ...metrics
          });
          socialData.totalFollowers += metrics.followers || 0;
        }
      } catch (error) {
        console.error(`Social tracking error for ${platform}:`, error);
      }
    }

    return socialData;
  }

  /**
   * Analyze technology stack
   */
  async analyzeTechnicalStack(domain) {
    try {
      const url = `https://${domain}`;
      const response = await fetch(url);
      const html = await response.text();
      const headers = response.headers;

      return {
        server: headers.get('server'),
        cms: this.detectCMS(html),
        framework: this.detectFramework(html),
        analytics: this.detectAnalytics(html),
        cdnProvider: this.detectCDN(headers),
        technologies: this.detectTechnologies(html, headers),
        security: {
          hsts: headers.get('strict-transport-security') ? true : false,
          contentSecurityPolicy: headers.get('content-security-policy') ? true : false,
          xFrameOptions: headers.get('x-frame-options') ? true : false
        },
        performance: {
          compression: headers.get('content-encoding'),
          caching: headers.get('cache-control'),
          etag: headers.get('etag') ? true : false
        }
      };
    } catch (error) {
      console.error('Technical analysis error:', error);
      return { error: error.message };
    }
  }

  // Helper methods for content extraction
  extractPageContent(html) {
    // Remove scripts and styles
    const cleanHtml = html.replace(/<script[^>]*>.*?<\/script>/gs, '')
                         .replace(/<style[^>]*>.*?<\/style>/gs, '');
    
    // Extract text content
    const textContent = cleanHtml.replace(/<[^>]*>/g, ' ')
                                .replace(/\s+/g, ' ')
                                .trim();
    
    return {
      wordCount: textContent.split(' ').length,
      characterCount: textContent.length,
      snippet: textContent.slice(0, 200) + '...',
      readingTime: Math.ceil(textContent.split(' ').length / 200) // Assume 200 WPM
    };
  }

  extractMetaTags(html) {
    const metaTags = {};
    const metaRegex = /<meta\s+([^>]+)>/gi;
    let match;

    while ((match = metaRegex.exec(html)) !== null) {
      const attrs = this.parseAttributes(match[1]);
      if (attrs.name) {
        metaTags[attrs.name] = attrs.content;
      } else if (attrs.property) {
        metaTags[attrs.property] = attrs.content;
      }
    }

    return metaTags;
  }

  extractHeadings(html) {
    const headings = { h1: [], h2: [], h3: [], h4: [], h5: [], h6: [] };
    
    for (let i = 1; i <= 6; i++) {
      const regex = new RegExp(`<h${i}[^>]*>(.*?)<\/h${i}>`, 'gi');
      let match;
      while ((match = regex.exec(html)) !== null) {
        headings[`h${i}`].push(match[1].replace(/<[^>]*>/g, '').trim());
      }
    }

    return headings;
  }

  extractLinks(html, domain) {
    const links = { internal: [], external: [] };
    const linkRegex = /<a\s+[^>]*href\s*=\s*["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
    let match;

    while ((match = linkRegex.exec(html)) !== null) {
      const href = match[1];
      const text = match[2].replace(/<[^>]*>/g, '').trim();
      
      const link = { url: href, text };
      
      if (href.includes(domain) || href.startsWith('/')) {
        links.internal.push(link);
      } else if (href.startsWith('http')) {
        links.external.push(link);
      }
    }

    return links;
  }

  extractImages(html) {
    const images = [];
    const imgRegex = /<img\s+([^>]+)>/gi;
    let match;

    while ((match = imgRegex.exec(html)) !== null) {
      const attrs = this.parseAttributes(match[1]);
      images.push({
        src: attrs.src,
        alt: attrs.alt || '',
        title: attrs.title || '',
        hasAlt: !!attrs.alt
      });
    }

    return {
      total: images.length,
      withAlt: images.filter(img => img.hasAlt).length,
      withoutAlt: images.filter(img => !img.hasAlt).length,
      images: images.slice(0, 10) // First 10 images
    };
  }

  detectTechnologies(html, headers) {
    const technologies = [];
    
    // Check common technology signatures
    const techSignatures = {
      'WordPress': /wp-content|wordpress/i,
      'React': /react|_react/i,
      'Next.js': /__next|next\.js/i,
      'Vue.js': /vue\.js|__vue/i,
      'Angular': /ng-|angular/i,
      'jQuery': /jquery/i,
      'Bootstrap': /bootstrap/i,
      'Tailwind': /tailwind/i,
      'Google Analytics': /google-analytics|gtag/i,
      'Google Tag Manager': /googletagmanager/i,
      'Shopify': /shopify|cdn\.shopify/i,
      'Cloudflare': /cloudflare/i
    };

    for (const [tech, pattern] of Object.entries(techSignatures)) {
      if (pattern.test(html) || pattern.test(headers.get('server') || '')) {
        technologies.push(tech);
      }
    }

    // Check server headers
    const server = headers.get('server');
    if (server) {
      if (server.includes('nginx')) technologies.push('Nginx');
      if (server.includes('apache')) technologies.push('Apache');
      if (server.includes('cloudflare')) technologies.push('Cloudflare');
    }

    return technologies;
  }

  // Simulated methods for keyword ranking (would use real SERP APIs in production)
  async checkKeywordPosition(domain, keyword) {
    // Simulate keyword position checking
    return Math.floor(Math.random() * 50) + 1;
  }

  async getPreviousPosition(domain, keyword) {
    // Get from cache or database
    const cacheKey = `ranking_${domain}_${keyword}`;
    const cached = await this.cache?.get(cacheKey);
    return cached ? parseInt(cached) : null;
  }

  async getSearchVolume(keyword) {
    // Simulate search volume data
    return Math.floor(Math.random() * 10000) + 100;
  }

  async getKeywordDifficulty(keyword) {
    // Simulate keyword difficulty
    return Math.floor(Math.random() * 100) + 1;
  }

  // Social media monitoring methods
  async findSocialHandle(domain, platform) {
    // Simulate finding social handles from website
    const handles = {
      twitter: '@' + domain.replace('.com', ''),
      linkedin: domain.replace('.com', ''),
      facebook: domain.replace('.com', ''),
      instagram: '@' + domain.replace('.com', ''),
      youtube: domain.replace('.com', '')
    };
    return handles[platform];
  }

  async getSocialMetrics(platform, handle) {
    // Simulate social metrics (would use real APIs in production)
    return {
      followers: Math.floor(Math.random() * 50000) + 1000,
      following: Math.floor(Math.random() * 5000) + 100,
      posts: Math.floor(Math.random() * 1000) + 50,
      engagement: Math.floor(Math.random() * 10) + 1,
      lastPost: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  // Technology detection methods
  detectCMS(html) {
    const cmsSignatures = {
      'WordPress': /wp-content|wordpress/i,
      'Shopify': /shopify/i,
      'Wix': /wix\.com/i,
      'Squarespace': /squarespace/i,
      'Webflow': /webflow/i,
      'Drupal': /drupal/i,
      'Joomla': /joomla/i
    };

    for (const [cms, pattern] of Object.entries(cmsSignatures)) {
      if (pattern.test(html)) return cms;
    }
    return 'Unknown';
  }

  detectFramework(html) {
    const frameworks = {
      'React': /react|_react/i,
      'Vue.js': /vue\.js|__vue/i,
      'Angular': /ng-|angular/i,
      'Next.js': /__next/i,
      'Nuxt.js': /__nuxt/i,
      'Svelte': /svelte/i
    };

    for (const [framework, pattern] of Object.entries(frameworks)) {
      if (pattern.test(html)) return framework;
    }
    return 'Unknown';
  }

  detectAnalytics(html) {
    const analytics = [];
    if (/google-analytics|gtag/.test(html)) analytics.push('Google Analytics');
    if (/googletagmanager/.test(html)) analytics.push('Google Tag Manager');
    if (/hotjar/.test(html)) analytics.push('Hotjar');
    if (/mixpanel/.test(html)) analytics.push('Mixpanel');
    return analytics;
  }

  detectCDN(headers) {
    const server = headers.get('server') || '';
    const cfRay = headers.get('cf-ray');
    
    if (cfRay || server.includes('cloudflare')) return 'Cloudflare';
    if (headers.get('x-amz-cf-id')) return 'Amazon CloudFront';
    if (headers.get('x-fastly-request-id')) return 'Fastly';
    return 'Unknown';
  }

  // Page speed metrics using Core Web Vitals simulation
  async getPageSpeedMetrics(url) {
    try {
      const startTime = Date.now();
      const response = await fetch(url);
      const loadTime = Date.now() - startTime;
      
      return {
        loadTime,
        score: this.calculatePageSpeedScore(loadTime),
        metrics: {
          firstContentfulPaint: loadTime * 0.3,
          largestContentfulPaint: loadTime * 0.8,
          cumulativeLayoutShift: Math.random() * 0.1,
          firstInputDelay: Math.random() * 100
        }
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  calculatePageSpeedScore(loadTime) {
    if (loadTime < 1000) return 90 + Math.random() * 10;
    if (loadTime < 2000) return 70 + Math.random() * 20;
    if (loadTime < 3000) return 50 + Math.random() * 20;
    return 20 + Math.random() * 30;
  }

  // Competitor scoring algorithm
  calculateCompetitorScore(results) {
    const [content, seo, keywords, social, tech] = results;
    
    let score = 0;
    let maxScore = 0;

    // Content score (0-25 points)
    if (content.averageLoadTime < 2000) score += 10;
    if (content.totalPages > 10) score += 5;
    if (content.technologies.length > 5) score += 10;
    maxScore += 25;

    // SEO score (0-30 points)
    if (seo.title) score += 5;
    if (seo.metaDescription) score += 5;
    if (seo.h1Tags?.length > 0) score += 5;
    if (seo.imageAltTags?.percentage > 80) score += 5;
    if (seo.pageSpeed?.score > 80) score += 10;
    maxScore += 30;

    // Keywords score (0-25 points)
    if (keywords.averagePosition < 20) score += 15;
    if (keywords.improvementCount > keywords.declineCount) score += 10;
    maxScore += 25;

    // Social score (0-20 points)
    if (social.totalFollowers > 1000) score += 10;
    if (social.platforms.length > 3) score += 10;
    maxScore += 20;

    return Math.round((score / maxScore) * 100);
  }

  // Utility methods
  parseAttributes(attrString) {
    const attrs = {};
    const regex = /(\w+)\s*=\s*["']([^"']*)["']/g;
    let match;
    
    while ((match = regex.exec(attrString)) !== null) {
      attrs[match[1].toLowerCase()] = match[2];
    }
    
    return attrs;
  }

  extractTitle(html) {
    const match = html.match(/<title[^>]*>(.*?)<\/title>/i);
    return match ? match[1].trim() : '';
  }

  extractMetaDescription(html) {
    const match = html.match(/<meta\s+name\s*=\s*["']description["']\s+content\s*=\s*["']([^"']*)["']/i);
    return match ? match[1] : '';
  }

  extractH1Tags(html) {
    const matches = html.match(/<h1[^>]*>(.*?)<\/h1>/gi);
    return matches ? matches.map(h1 => h1.replace(/<[^>]*>/g, '').trim()) : [];
  }

  checkImageAltTags(html) {
    const images = html.match(/<img[^>]*>/gi) || [];
    const withAlt = images.filter(img => /alt\s*=\s*["'][^"']+["']/i.test(img)).length;
    return {
      total: images.length,
      withAlt,
      withoutAlt: images.length - withAlt,
      percentage: images.length > 0 ? Math.round((withAlt / images.length) * 100) : 0
    };
  }

  countInternalLinks(html, domain) {
    const matches = html.match(/<a[^>]*href\s*=\s*["']([^"']*)["'][^>]*>/gi) || [];
    return matches.filter(link => 
      link.includes(domain) || /href\s*=\s*["']\/[^\/]/.test(link)
    ).length;
  }

  countExternalLinks(html, domain) {
    const matches = html.match(/<a[^>]*href\s*=\s*["']https?:\/\/([^"']*)["'][^>]*>/gi) || [];
    return matches.filter(link => !link.includes(domain)).length;
  }

  extractCanonical(html) {
    const match = html.match(/<link\s+rel\s*=\s*["']canonical["']\s+href\s*=\s*["']([^"']*)["']/i);
    return match ? match[1] : null;
  }

  extractMetaRobots(html) {
    const match = html.match(/<meta\s+name\s*=\s*["']robots["']\s+content\s*=\s*["']([^"']*)["']/i);
    return match ? match[1] : null;
  }

  extractStructuredData(html) {
    const matches = html.match(/<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gi);
    return matches ? matches.length : 0;
  }

  extractOpenGraph(html) {
    const ogTags = {};
    const matches = html.match(/<meta\s+property\s*=\s*["']og:[^"']*["']\s+content\s*=\s*["']([^"']*)["'][^>]*>/gi) || [];
    return matches.length;
  }

  extractTwitterCards(html) {
    const matches = html.match(/<meta\s+name\s*=\s*["']twitter:[^"']*["'][^>]*>/gi) || [];
    return matches.length;
  }

  checkMobileFriendly(html) {
    return /viewport|mobile-web-app/.test(html);
  }

  getSSLInfo(headers) {
    return {
      hsts: !!headers.get('strict-transport-security'),
      securityHeaders: {
        csp: !!headers.get('content-security-policy'),
        xFrameOptions: !!headers.get('x-frame-options'),
        xContentTypeOptions: !!headers.get('x-content-type-options')
      }
    };
  }
}

export default CompetitorMonitoringService;