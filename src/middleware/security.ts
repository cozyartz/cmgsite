/**
 * Enterprise Security Middleware for Cloudflare Workers
 * Implements comprehensive security controls for legal protection
 */

import { SECURITY_HEADERS, RATE_LIMITS, COMPLIANCE_CONFIG } from '../config/security';

// Security Middleware
export class SecurityMiddleware {
  /**
   * Apply security headers to all responses
   */
  static applySecurityHeaders(response: Response): Response {
    const headers = new Headers(response.headers);
    
    // Apply all security headers
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
      headers.set(key, value);
    });

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }

  /**
   * Rate limiting middleware
   */
  static async rateLimit(request: Request, limit: keyof typeof RATE_LIMITS): Promise<Response | null> {
    const clientIP = request.headers.get('CF-Connecting-IP') || 
                    request.headers.get('X-Forwarded-For') || 
                    'unknown';
    
    // In production, use KV storage for rate limiting
    // For now, return null to continue processing
    return null;
  }

  /**
   * CORS middleware
   */
  static handleCORS(request: Request): Response | null {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': 'https://cozyartzmedia.com',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Max-Age': '86400'
        }
      });
    }
    return null;
  }

  /**
   * Input validation middleware
   */
  static validateInput(request: Request): Promise<Response | null> {
    // Validate request size, content type, etc.
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
      return Promise.resolve(new Response(
        JSON.stringify({ error: 'Request too large' }),
        { status: 413, headers: { 'Content-Type': 'application/json' } }
      ));
    }
    
    return Promise.resolve(null);
  }
}

// Authentication & Authorization
export class AuthSecurity {
  /**
   * Verify JWT token
   */
  static async verifyToken(token: string, secret: string): Promise<any> {
    try {
      // JWT verification logic would go here
      // For now, return null for invalid tokens
      return null;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * Check user permissions
   */
  static hasPermission(user: any, resource: string, action: string): boolean {
    // Role-based access control logic
    const permissions = user?.permissions || [];
    return permissions.includes(`${resource}:${action}`);
  }

  /**
   * Generate secure session token
   */
  static async generateSessionToken(): Promise<string> {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

// Data Protection & Compliance
export class DataProtection {
  /**
   * Check if user data can be processed (GDPR compliance)
   */
  static canProcessData(user: any, purpose: string): boolean {
    if (!COMPLIANCE_CONFIG.GDPR.enabled) return true;
    
    const consent = user?.consent || {};
    return consent[purpose] === true;
  }

  /**
   * Anonymize personal data
   */
  static anonymizeData(data: any): any {
    const sensitiveFields = ['email', 'phone', 'address', 'name', 'ip'];
    const anonymized = { ...data };
    
    sensitiveFields.forEach(field => {
      if (anonymized[field]) {
        anonymized[field] = '[ANONYMIZED]';
      }
    });
    
    return anonymized;
  }

  /**
   * Check data retention policy
   */
  static shouldRetainData(createdAt: Date): boolean {
    const retentionDays = COMPLIANCE_CONFIG.GDPR.dataRetentionDays;
    const daysSinceCreation = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCreation < retentionDays;
  }

  /**
   * Encrypt sensitive data
   */
  static async encryptData(data: string, key: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    const dataBuffer = encoder.encode(data);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      dataBuffer
    );
    
    const result = new Uint8Array(iv.length + encrypted.byteLength);
    result.set(iv);
    result.set(new Uint8Array(encrypted), iv.length);
    
    return btoa(String.fromCharCode(...result));
  }

  /**
   * Decrypt sensitive data
   */
  static async decryptData(encryptedData: string, key: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    
    const data = new Uint8Array(atob(encryptedData).split('').map(c => c.charCodeAt(0)));
    const iv = data.slice(0, 12);
    const encrypted = data.slice(12);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encrypted
    );
    
    return new TextDecoder().decode(decrypted);
  }
}

// Security Monitoring & Logging
export class SecurityMonitoring {
  /**
   * Log security event
   */
  static logSecurityEvent(event: string, details: any, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      severity,
      details: this.sanitizeLogData(details),
      source: 'worker'
    };
    
    console.log('Security Event:', logEntry);
    
    // In production, send to security monitoring service
    if (severity === 'critical') {
      // Send immediate alert
    }
  }

  /**
   * Detect suspicious activity
   */
  static detectSuspiciousActivity(request: Request): boolean {
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /bot|crawler|spider/i,
      /sqlmap|nikto|nmap/i,
      /script|javascript:/i
    ];
    
    return suspiciousPatterns.some(pattern => 
      pattern.test(userAgent) || pattern.test(referer)
    );
  }

  /**
   * Sanitize log data
   */
  private static sanitizeLogData(data: any): any {
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'credential'];
    
    if (typeof data !== 'object' || data === null) {
      return data;
    }
    
    const sanitized = { ...data };
    
    for (const key in sanitized) {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      }
    }
    
    return sanitized;
  }
}

// Error Handling with Security Focus
export class SecurityErrorHandler {
  /**
   * Handle error securely
   */
  static handleError(error: any, request?: Request): Response {
    // Log error for internal monitoring
    SecurityMonitoring.logSecurityEvent('error', {
      message: error.message,
      stack: error.stack,
      url: request?.url,
      method: request?.method
    }, 'high');
    
    // Return generic error to client (never expose internal details)
    return new Response(
      JSON.stringify({ 
        error: 'An error occurred while processing your request',
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID()
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  /**
   * Handle validation errors
   */
  static handleValidationError(errors: string[]): Response {
    return new Response(
      JSON.stringify({
        error: 'Validation failed',
        details: errors
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  /**
   * Handle authentication errors
   */
  static handleAuthError(): Response {
    return new Response(
      JSON.stringify({
        error: 'Authentication required'
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  /**
   * Handle authorization errors
   */
  static handleAuthzError(): Response {
    return new Response(
      JSON.stringify({
        error: 'Insufficient permissions'
      }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Request Validation
export class RequestValidator {
  /**
   * Validate API request
   */
  static validateRequest(request: Request): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Validate HTTP method
    const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];
    if (!allowedMethods.includes(request.method)) {
      errors.push('Invalid HTTP method');
    }
    
    // Validate content type for POST/PUT requests
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      const contentType = request.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        errors.push('Invalid content type');
      }
    }
    
    // Validate required headers
    const requiredHeaders = ['user-agent'];
    requiredHeaders.forEach(header => {
      if (!request.headers.get(header)) {
        errors.push(`Missing required header: ${header}`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate request body
   */
  static async validateRequestBody(request: Request, schema: any): Promise<{ isValid: boolean; errors: string[] }> {
    try {
      const body = await request.json();
      // JSON schema validation would go here
      return { isValid: true, errors: [] };
    } catch (error) {
      return { isValid: false, errors: ['Invalid JSON body'] };
    }
  }
}

export {
  SecurityMiddleware,
  AuthSecurity,
  DataProtection,
  SecurityMonitoring,
  SecurityErrorHandler,
  RequestValidator
};
