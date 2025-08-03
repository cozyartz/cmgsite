/**
 * Enterprise Security Configuration
 * Implements comprehensive security controls for legal protection
 */

// Security Headers Configuration
export const SECURITY_HEADERS = {
  // Prevent clickjacking attacks
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Enable XSS protection
  'X-XSS-Protection': '1; mode=block',
  
  // Strict Transport Security (HSTS)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.paypal.com https://challenges.cloudflare.com https://www.google.com https://www.gstatic.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://*.paypal.com https://api.cloudflare.com https://challenges.cloudflare.com wss://*.supabase.co",
    "frame-src 'self' https://js.paypal.com https://challenges.cloudflare.com https://www.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://www.paypal.com",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; '),
  
  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions Policy
  'Permissions-Policy': [
    'camera=(),',
    'microphone=(),',
    'geolocation=(),',
    'interest-cohort=(),',
    'payment=(self)',
    'usb=(),',
    'magnetometer=(),',
    'accelerometer=(),',
    'gyroscope=(),',
    'display-capture=()'
  ].join(' ')
} as const;

// Rate Limiting Configuration
export const RATE_LIMITS = {
  // Authentication endpoints
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
  },
  
  // API endpoints
  API: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many API requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
  },
  
  // File upload endpoints
  UPLOAD: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 uploads per hour
    message: 'Upload limit exceeded, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
  },
  
  // Password reset
  PASSWORD_RESET: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 password resets per hour
    message: 'Password reset limit exceeded, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
  }
} as const;

// Input Validation Patterns
export const VALIDATION_PATTERNS = {
  // Email validation (RFC 5322 compliant)
  EMAIL: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  
  // Password strength (min 12 chars, uppercase, lowercase, number, special)
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,128}$/,
  
  // Phone number (international format)
  PHONE: /^\+[1-9]\d{1,14}$/,
  
  // Domain name validation
  DOMAIN: /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
  
  // UUID validation
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  
  // API key format
  API_KEY: /^[a-zA-Z0-9_-]{32,}$/,
  
  // URL validation
  URL: /^https?:\/\/(?:[-\w.])+(?:\:[0-9]+)?(?:\/(?:[\w\/_.])*(?:\?(?:[\w&=%.])*)?(?:\#(?:[\w.])*)?)?$/,
  
  // Credit card number (basic format check)
  CREDIT_CARD: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3[0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$/
} as const;

// File Upload Security
export const FILE_UPLOAD_CONFIG = {
  // Maximum file size (10MB)
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  
  // Allowed file types
  ALLOWED_TYPES: [
    // Images
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    // Documents
    'application/pdf', 'text/plain', 'text/csv',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ],
  
  // Forbidden file extensions
  FORBIDDEN_EXTENSIONS: [
    '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.jar',
    '.php', '.asp', '.aspx', '.jsp', '.pl', '.py', '.rb', '.sh', '.ps1'
  ],
  
  // Virus scanning configuration
  VIRUS_SCAN: {
    enabled: true,
    quarantineOnDetection: true,
    notifyAdmin: true
  }
} as const;

// Encryption Configuration
export const ENCRYPTION_CONFIG = {
  // AES encryption settings
  AES: {
    algorithm: 'aes-256-gcm',
    keyLength: 32,
    ivLength: 12,
    tagLength: 16
  },
  
  // Password hashing
  HASH: {
    algorithm: 'argon2id',
    memoryCost: 65536, // 64 MB
    timeCost: 3,
    parallelism: 4,
    hashLength: 32
  },
  
  // JWT configuration
  JWT: {
    algorithm: 'HS256',
    expiresIn: '15m',
    refreshExpiresIn: '7d',
    issuer: 'cozyartzmedia.com',
    audience: 'cmg-client-portal'
  }
} as const;

// Session Security
export const SESSION_CONFIG = {
  // Session timeout (15 minutes)
  TIMEOUT: 15 * 60 * 1000,
  
  // Maximum concurrent sessions per user
  MAX_CONCURRENT_SESSIONS: 3,
  
  // Session cookie configuration
  COOKIE: {
    name: 'cmg_session',
    httpOnly: true,
    secure: true,
    sameSite: 'strict' as const,
    maxAge: 15 * 60 * 1000,
    domain: undefined, // Will be set dynamically
    path: '/'
  },
  
  // Session data encryption
  ENCRYPTION: {
    enabled: true,
    algorithm: 'aes-256-gcm',
    keyRotationInterval: 24 * 60 * 60 * 1000 // 24 hours
  }
} as const;

// API Security Configuration
export const API_SECURITY = {
  // CORS configuration
  CORS: {
    origin: [
      'https://cozyartzmedia.com',
      'https://www.cozyartzmedia.com',
      'https://staging.cmgsite.pages.dev'
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 
      'Authorization', 'X-CSRF-Token', 'X-Requested-With'
    ],
    exposedHeaders: ['X-Total-Count', 'X-Rate-Limit-Remaining']
  },
  
  // Request validation
  VALIDATION: {
    parameterPollution: false,
    bodyParser: {
      limit: '10mb',
      strict: true,
      type: 'application/json'
    }
  },
  
  // API versioning
  VERSIONING: {
    enabled: true,
    defaultVersion: 'v1',
    headerName: 'API-Version',
    deprecationWarning: true
  }
} as const;

// Monitoring and Logging
export const MONITORING_CONFIG = {
  // Log levels
  LOG_LEVELS: {
    TRACE: 0,
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    FATAL: 5
  },
  
  // Security events to log
  SECURITY_EVENTS: [
    'authentication.success',
    'authentication.failure',
    'authorization.denied',
    'password.reset.request',
    'password.reset.success',
    'account.locked',
    'suspicious.activity',
    'admin.access',
    'data.export',
    'data.deletion',
    'configuration.change'
  ],
  
  // Log retention (90 days)
  LOG_RETENTION_DAYS: 90,
  
  // Real-time alerting
  ALERTS: {
    enabled: true,
    channels: ['email', 'webhook'],
    thresholds: {
      failedLogins: 5,
      serverErrors: 10,
      responseTime: 5000
    }
  }
} as const;

// Compliance Configuration
export const COMPLIANCE_CONFIG = {
  // GDPR settings
  GDPR: {
    enabled: true,
    dataRetentionDays: 2555, // 7 years
    consentRequired: true,
    rightToForgotten: true,
    dataPortability: true,
    autoDeleteAfterRetention: true
  },
  
  // CCPA settings
  CCPA: {
    enabled: true,
    optOutEnabled: true,
    dataDisclosure: true,
    thirdPartySharing: false
  },
  
  // PCI DSS settings
  PCI_DSS: {
    tokenizePaymentData: true,
    encryptInTransit: true,
    encryptAtRest: true,
    accessLogging: true,
    regularTesting: true
  },
  
  // SOX compliance
  SOX: {
    auditTrails: true,
    dataIntegrity: true,
    accessControls: true,
    changeManagement: true
  }
} as const;

// Error Handling
export const ERROR_CONFIG = {
  // Error levels
  LEVELS: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
  },
  
  // Error reporting
  REPORTING: {
    enabled: true,
    includeStackTrace: false, // Never expose stack traces to users
    logErrors: true,
    notifyAdmins: true
  },
  
  // Generic error messages (never expose internal details)
  MESSAGES: {
    GENERIC: 'An error occurred while processing your request. Please try again.',
    VALIDATION: 'The provided data is invalid. Please check your input.',
    AUTHENTICATION: 'Invalid credentials. Please try again.',
    AUTHORIZATION: 'You do not have permission to access this resource.',
    RATE_LIMIT: 'Too many requests. Please wait before trying again.',
    MAINTENANCE: 'The service is temporarily unavailable. Please try again later.'
  }
} as const;

// Security Testing Configuration
export const SECURITY_TESTING = {
  // Automated security scans
  AUTOMATED_SCANS: {
    enabled: true,
    frequency: 'daily',
    types: ['vulnerability', 'dependency', 'secrets', 'license']
  },
  
  // Penetration testing
  PENETRATION_TESTING: {
    frequency: 'quarterly',
    scope: ['web-app', 'api', 'infrastructure'],
    reports: true
  },
  
  // Code security analysis
  CODE_ANALYSIS: {
    staticAnalysis: true,
    dynamicAnalysis: true,
    dependencies: true,
    secrets: true
  }
} as const;

export default {
  SECURITY_HEADERS,
  RATE_LIMITS,
  VALIDATION_PATTERNS,
  FILE_UPLOAD_CONFIG,
  ENCRYPTION_CONFIG,
  SESSION_CONFIG,
  API_SECURITY,
  MONITORING_CONFIG,
  COMPLIANCE_CONFIG,
  ERROR_CONFIG,
  SECURITY_TESTING
} as const;
