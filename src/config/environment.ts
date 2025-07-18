/**
 * Environment Configuration System
 * Centralized configuration management for different deployment environments
 */

export interface EnvironmentConfig {
  // Environment metadata
  name: string;
  isDevelopment: boolean;
  isProduction: boolean;
  
  // API configuration
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
  };
  
  // Frontend URLs
  frontend: {
    baseUrl: string;
    authCallbackUrl: string;
    clientPortalUrl: string;
    superAdminUrl: string;
    adminUrl: string;
  };
  
  // OAuth configuration
  oauth: {
    github: {
      enabled: boolean;
      redirectUri: string;
    };
    google: {
      enabled: boolean;
      redirectUri: string;
    };
  };
  
  // Feature flags
  features: {
    debugMode: boolean;
    analytics: boolean;
    maintenance: boolean;
  };
  
  // Logging configuration
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    enableConsole: boolean;
  };
}

// Development environment configuration
const developmentConfig: EnvironmentConfig = {
  name: 'development',
  isDevelopment: true,
  isProduction: false,
  
  api: {
    baseUrl: 'http://localhost:8787',
    timeout: 10000,
    retryAttempts: 2,
  },
  
  frontend: {
    baseUrl: 'http://localhost:5173',
    authCallbackUrl: 'http://localhost:5173/auth',
    clientPortalUrl: 'http://localhost:5173/client-portal',
    superAdminUrl: 'http://localhost:5173/superadmin',
    adminUrl: 'http://localhost:5173/admin',
  },
  
  oauth: {
    github: {
      enabled: true,
      redirectUri: 'http://localhost:8787/api/auth/github/callback',
    },
    google: {
      enabled: true,
      redirectUri: 'http://localhost:8787/api/auth/google/callback',
    },
  },
  
  features: {
    debugMode: true,
    analytics: false,
    maintenance: false,
  },
  
  logging: {
    level: 'debug',
    enableConsole: true,
  },
};

// Production environment configuration
const productionConfig: EnvironmentConfig = {
  name: 'production',
  isDevelopment: false,
  isProduction: true,
  
  api: {
    baseUrl: 'https://cmgsite-client-portal.cozyartz-media-group.workers.dev',
    timeout: 15000,
    retryAttempts: 3,
  },
  
  frontend: {
    baseUrl: import.meta.env.VITE_FRONTEND_URL || 'https://cozyartzmedia.com',
    authCallbackUrl: `${import.meta.env.VITE_FRONTEND_URL || 'https://cozyartzmedia.com'}/auth`,
    clientPortalUrl: `${import.meta.env.VITE_FRONTEND_URL || 'https://cozyartzmedia.com'}/client-portal`,
    superAdminUrl: `${import.meta.env.VITE_FRONTEND_URL || 'https://cozyartzmedia.com'}/superadmin`,
    adminUrl: `${import.meta.env.VITE_FRONTEND_URL || 'https://cozyartzmedia.com'}/admin`,
  },
  
  oauth: {
    github: {
      enabled: true,
      redirectUri: 'https://cmgsite-client-portal.cozyartz-media-group.workers.dev/api/auth/github/callback',
    },
    google: {
      enabled: true,
      redirectUri: 'https://cmgsite-client-portal.cozyartz-media-group.workers.dev/api/auth/google/callback',
    },
  },
  
  features: {
    debugMode: false,
    analytics: true,
    maintenance: false,
  },
  
  logging: {
    level: 'warn',
    enableConsole: false,
  },
};

// Staging environment configuration (for testing deployments)
const stagingConfig: EnvironmentConfig = {
  ...productionConfig,
  name: 'staging',
  isProduction: false,
  
  frontend: {
    baseUrl: import.meta.env.VITE_FRONTEND_URL || 'https://staging.cmgsite.pages.dev',
    authCallbackUrl: `${import.meta.env.VITE_FRONTEND_URL || 'https://staging.cmgsite.pages.dev'}/auth`,
    clientPortalUrl: `${import.meta.env.VITE_FRONTEND_URL || 'https://staging.cmgsite.pages.dev'}/client-portal`,
    superAdminUrl: `${import.meta.env.VITE_FRONTEND_URL || 'https://staging.cmgsite.pages.dev'}/superadmin`,
    adminUrl: `${import.meta.env.VITE_FRONTEND_URL || 'https://staging.cmgsite.pages.dev'}/admin`,
  },
  
  features: {
    debugMode: true,
    analytics: false,
    maintenance: false,
  },
  
  logging: {
    level: 'info',
    enableConsole: true,
  },
};

/**
 * Get the current environment configuration
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  // First check environment variables
  let environment = import.meta.env.VITE_ENVIRONMENT || import.meta.env.NODE_ENV;
  
  // If no environment variable is set, detect from hostname
  if (!environment && typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    if (hostname === 'cozyartzmedia.com' || hostname === 'www.cozyartzmedia.com') {
      environment = 'production';
    } else if (hostname.includes('staging') || hostname.includes('.pages.dev')) {
      environment = 'staging';
    } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
      environment = 'development';
    } else {
      // Default to production for any other domain
      environment = 'production';
    }
  }
  
  // Force production for production builds
  if (import.meta.env.PROD) {
    environment = 'production';
  }
  
  // Final fallback to production (safer default)
  environment = environment || 'production';
  
  console.log(`[Environment] Detected environment: ${environment} (hostname: ${typeof window !== 'undefined' ? window.location.hostname : 'server'})`);
  
  switch (environment) {
    case 'production':
      return productionConfig;
    case 'staging':
      return stagingConfig;
    case 'development':
    default:
      return developmentConfig;
  }
}

/**
 * Validate environment configuration
 */
export function validateEnvironmentConfig(config: EnvironmentConfig): string[] {
  const errors: string[] = [];
  
  // Validate required URLs
  if (!config.api.baseUrl) {
    errors.push('API base URL is required');
  }
  
  if (!config.frontend.baseUrl) {
    errors.push('Frontend base URL is required');
  }
  
  // Validate URL formats
  try {
    new URL(config.api.baseUrl);
  } catch {
    errors.push('API base URL must be a valid URL');
  }
  
  try {
    new URL(config.frontend.baseUrl);
  } catch {
    errors.push('Frontend base URL must be a valid URL');
  }
  
  // Validate timeout values
  if (config.api.timeout <= 0) {
    errors.push('API timeout must be greater than 0');
  }
  
  if (config.api.retryAttempts < 0) {
    errors.push('API retry attempts must be non-negative');
  }
  
  return errors;
}

/**
 * Get a specific configuration value with type safety
 */
export function getConfigValue<T extends keyof EnvironmentConfig>(
  key: T
): EnvironmentConfig[T] {
  return getEnvironmentConfig()[key];
}

/**
 * Check if we're in a specific environment
 */
export function isEnvironment(env: 'development' | 'staging' | 'production'): boolean {
  return getEnvironmentConfig().name === env;
}

/**
 * Get environment-specific logger
 */
export function createLogger(context?: string) {
  const config = getEnvironmentConfig();
  
  const logLevels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };
  
  const currentLevel = logLevels[config.logging.level];
  const prefix = context ? `[${context}]` : '[App]';
  
  return {
    debug: (message: any, ...args: any[]) => {
      if (config.logging.enableConsole && currentLevel <= logLevels.debug) {
        console.log(`${prefix} DEBUG:`, message, ...args);
      }
    },
    info: (message: any, ...args: any[]) => {
      if (config.logging.enableConsole && currentLevel <= logLevels.info) {
        console.info(`${prefix} INFO:`, message, ...args);
      }
    },
    warn: (message: any, ...args: any[]) => {
      if (config.logging.enableConsole && currentLevel <= logLevels.warn) {
        console.warn(`${prefix} WARN:`, message, ...args);
      }
    },
    error: (message: any, ...args: any[]) => {
      if (config.logging.enableConsole && currentLevel <= logLevels.error) {
        console.error(`${prefix} ERROR:`, message, ...args);
      }
    },
  };
}

// Export the current configuration as default
export const config = getEnvironmentConfig();

// Validate configuration on import
const configErrors = validateEnvironmentConfig(config);
if (configErrors.length > 0) {
  console.error('Environment configuration errors:', configErrors);
  throw new Error(`Invalid environment configuration: ${configErrors.join(', ')}`);
}