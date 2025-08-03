/**
 * Enterprise Security Utilities
 * Comprehensive security functions for maximum legal protection
 */

import { VALIDATION_PATTERNS, ENCRYPTION_CONFIG, ERROR_CONFIG } from '../config/security';

// Input Sanitization and Validation
export class SecurityValidator {
  /**
   * Sanitize and validate email addresses
   */
  static validateEmail(email: string): { isValid: boolean; sanitized: string; error?: string } {
    if (!email || typeof email !== 'string') {
      return { isValid: false, sanitized: '', error: 'Email is required' };
    }

    // Sanitize: trim and lowercase
    const sanitized = email.trim().toLowerCase();

    // Validate length (max 254 chars per RFC 5321)
    if (sanitized.length > 254) {
      return { isValid: false, sanitized, error: 'Email address too long' };
    }

    // Validate format
    if (!VALIDATION_PATTERNS.EMAIL.test(sanitized)) {
      return { isValid: false, sanitized, error: 'Invalid email format' };
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /[<>]/,  // HTML injection
      /javascript:/i,  // JavaScript injection
      /data:/i,  // Data URLs
      /\s{2,}/,  // Multiple spaces
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(sanitized)) {
        return { isValid: false, sanitized, error: 'Email contains invalid characters' };
      }
    }

    return { isValid: true, sanitized };
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): { 
    isValid: boolean; 
    score: number; 
    requirements: Record<string, boolean>;
    error?: string;
  } {
    if (!password || typeof password !== 'string') {
      return { 
        isValid: false, 
        score: 0, 
        requirements: {},
        error: 'Password is required' 
      };
    }

    const requirements = {
      minLength: password.length >= 12,
      maxLength: password.length <= 128,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChars: /[@$!%*?&]/.test(password),
      noCommonPatterns: !this.hasCommonPatterns(password),
      noPersonalInfo: true // Would check against user info in real implementation
    };

    const score = Object.values(requirements).filter(Boolean).length;
    const isValid = score === Object.keys(requirements).length;

    return {
      isValid,
      score,
      requirements,
      error: isValid ? undefined : 'Password does not meet security requirements'
    };
  }

  /**
   * Check for common password patterns
   */
  private static hasCommonPatterns(password: string): boolean {
    const commonPatterns = [
      /^(.)\1+$/, // All same character
      /^(123|abc|qwe)/i, // Sequential patterns
      /password/i, // Contains "password"
      /admin/i, // Contains "admin"
      /^(.{1,3})\1+$/, // Repeated short patterns
    ];

    return commonPatterns.some(pattern => pattern.test(password));
  }

  /**
   * Sanitize user input to prevent XSS
   */
  static sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') return '';

    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .replace(/&/g, '&amp;')
      .trim();
  }

  /**
   * Validate domain names
   */
  static validateDomain(domain: string): { isValid: boolean; sanitized: string; error?: string } {
    if (!domain || typeof domain !== 'string') {
      return { isValid: false, sanitized: '', error: 'Domain is required' };
    }

    const sanitized = domain.trim().toLowerCase();

    if (!VALIDATION_PATTERNS.DOMAIN.test(sanitized)) {
      return { isValid: false, sanitized, error: 'Invalid domain format' };
    }

    // Check domain length (max 253 chars)
    if (sanitized.length > 253) {
      return { isValid: false, sanitized, error: 'Domain name too long' };
    }

    return { isValid: true, sanitized };
  }

  /**
   * Validate file uploads
   */
  static validateFile(file: File): { isValid: boolean; error?: string } {
    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return { isValid: false, error: 'File size exceeds 10MB limit' };
    }

    // Check file type
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain', 'text/csv'
    ];

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'File type not allowed' };
    }

    // Check file extension
    const extension = file.name.toLowerCase().split('.').pop();
    const forbiddenExtensions = ['exe', 'bat', 'cmd', 'com', 'pif', 'scr', 'vbs', 'js'];
    
    if (forbiddenExtensions.includes(extension || '')) {
      return { isValid: false, error: 'File extension not allowed' };
    }

    return { isValid: true };
  }
}

// Encryption and Security Utils
export class SecurityCrypto {
  /**
   * Generate secure random string
   */
  static generateSecureRandom(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => chars[byte % chars.length]).join('');
  }

  /**
   * Generate CSRF token
   */
  static generateCSRFToken(): string {
    return this.generateSecureRandom(32);
  }

  /**
   * Hash data using SubtleCrypto
   */
  static async hashData(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Verify data integrity
   */
  static async verifyHash(data: string, expectedHash: string): Promise<boolean> {
    const actualHash = await this.hashData(data);
    return actualHash === expectedHash;
  }
}

// Session Security Management
export class SessionSecurity {
  private static readonly SESSION_KEY = 'cmg_session_data';
  private static readonly CSRF_KEY = 'cmg_csrf_token';

  /**
   * Create secure session
   */
  static createSession(userId: string, userData: any): void {
    const sessionData = {
      userId,
      userData,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      csrfToken: SecurityCrypto.generateCSRFToken(),
      sessionId: SecurityCrypto.generateSecureRandom()
    };

    // Store session data (in production, this would be server-side)
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
    sessionStorage.setItem(this.CSRF_KEY, sessionData.csrfToken);
  }

  /**
   * Validate session
   */
  static validateSession(): { isValid: boolean; session?: any; error?: string } {
    try {
      const sessionData = sessionStorage.getItem(this.SESSION_KEY);
      if (!sessionData) {
        return { isValid: false, error: 'No session found' };
      }

      const session = JSON.parse(sessionData);
      const now = Date.now();
      
      // Check session timeout (15 minutes)
      if (now - session.lastActivity > 15 * 60 * 1000) {
        this.destroySession();
        return { isValid: false, error: 'Session expired' };
      }

      // Update last activity
      session.lastActivity = now;
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));

      return { isValid: true, session };
    } catch (error) {
      return { isValid: false, error: 'Invalid session data' };
    }
  }

  /**
   * Destroy session
   */
  static destroySession(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
    sessionStorage.removeItem(this.CSRF_KEY);
  }

  /**
   * Get CSRF token
   */
  static getCSRFToken(): string | null {
    return sessionStorage.getItem(this.CSRF_KEY);
  }
}

// Security Headers Manager
export class SecurityHeaders {
  /**
   * Get security headers for requests
   */
  static getSecurityHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-CSRF-Token': SessionSecurity.getCSRFToken() || ''
    };
  }

  /**
   * Validate response headers
   */
  static validateResponseHeaders(response: Response): boolean {
    const requiredHeaders = [
      'x-content-type-options',
      'x-frame-options',
      'strict-transport-security'
    ];

    return requiredHeaders.every(header => response.headers.has(header));
  }
}

// Rate Limiting Client-Side Tracker
export class RateLimiter {
  private static attempts: Map<string, number[]> = new Map();

  /**
   * Check if action is rate limited
   */
  static isRateLimited(action: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(action) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < windowMs);
    
    // Check if rate limited
    if (validAttempts.length >= maxAttempts) {
      return true;
    }

    // Record this attempt
    validAttempts.push(now);
    this.attempts.set(action, validAttempts);
    
    return false;
  }

  /**
   * Reset rate limit for action
   */
  static resetRateLimit(action: string): void {
    this.attempts.delete(action);
  }
}

// Error Handler with Security Focus
export class SecurityErrorHandler {
  /**
   * Handle errors securely (never expose sensitive data)
   */
  static handleError(error: any, context?: string): string {
    // Log error for internal use (in production, send to logging service)
    console.error(`Security Error [${context}]:`, error);

    // Return generic error message to user
    if (error?.message?.includes('rate limit')) {
      return ERROR_CONFIG.MESSAGES.RATE_LIMIT;
    }

    if (error?.message?.includes('validation')) {
      return ERROR_CONFIG.MESSAGES.VALIDATION;
    }

    if (error?.message?.includes('auth')) {
      return ERROR_CONFIG.MESSAGES.AUTHENTICATION;
    }

    return ERROR_CONFIG.MESSAGES.GENERIC;
  }

  /**
   * Log security event
   */
  static logSecurityEvent(event: string, details: any): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details: this.sanitizeLogData(details),
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: SessionSecurity.validateSession().session?.sessionId
    };

    console.warn('Security Event:', logEntry);
    
    // In production, send to security monitoring service
    // securityMonitoring.logEvent(logEntry);
  }

  /**
   * Sanitize data for logging (remove sensitive info)
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
      } else if (typeof sanitized[key] === 'object') {
        sanitized[key] = this.sanitizeLogData(sanitized[key]);
      }
    }

    return sanitized;
  }
}

// Content Security Policy Helper
export class CSPHelper {
  /**
   * Generate nonce for inline scripts/styles
   */
  static generateNonce(): string {
    return SecurityCrypto.generateSecureRandom(16);
  }

  /**
   * Check if URL is allowed by CSP
   */
  static isAllowedSource(url: string, type: 'script' | 'style' | 'img' | 'connect'): boolean {
    const allowedSources = {
      script: [
        'https://js.paypal.com',
        'https://challenges.cloudflare.com',
        'https://www.google.com'
      ],
      style: [
        'https://fonts.googleapis.com'
      ],
      img: [
        'https:',
        'data:'
      ],
      connect: [
        'https://*.supabase.co',
        'https://*.paypal.com',
        'https://api.cloudflare.com'
      ]
    };

    const sources = allowedSources[type] || [];
    return sources.some(source => url.startsWith(source));
  }
}

export {
  SecurityValidator,
  SecurityCrypto,
  SessionSecurity,
  SecurityHeaders,
  RateLimiter,
  SecurityErrorHandler,
  CSPHelper
};
