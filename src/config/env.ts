// Environment variable validation and configuration

// Required environment variables
const requiredEnvVars = {
  VITE_SUPABASE_URL: 'Supabase project URL',
  VITE_SUPABASE_ANON_KEY: 'Supabase anonymous key',
} as const;

// Optional environment variables with defaults
const optionalEnvVars = {
  VITE_SITE_URL: 'https://cozyartzmedia.com',
  VITE_CALLBACK_URL: 'https://cozyartzmedia.com/auth/callback',
  VITE_TURNSTILE_SITE_KEY: '',
  VITE_ENVIRONMENT: 'production',
} as const;

// Validate required environment variables (non-blocking)
function validateRequiredEnvVars(): void {
  const missing: string[] = [];
  
  for (const [key, description] of Object.entries(requiredEnvVars)) {
    if (!import.meta.env[key]) {
      missing.push(`${key} (${description})`);
    }
  }
  
  if (missing.length > 0) {
    console.warn(
      `⚠️ Missing required environment variables (app will continue with limited functionality):\n${missing.map(v => `  - ${v}`).join('\n')}\n\n` +
      `Please check your .env file and ensure all required variables are set for full functionality.`
    );
  }
}

// Get environment variable with validation (non-blocking)
function getEnvVar(key: string, required = false): string {
  const value = import.meta.env[key];
  
  if (required && !value) {
    console.warn(`⚠️ Missing required environment variable: ${key} (using fallback)`);
    // Return a safe fallback
    if (key === 'VITE_SUPABASE_URL') return 'https://placeholder.supabase.co';
    if (key === 'VITE_SUPABASE_ANON_KEY') return 'placeholder-key';
    return '';
  }
  
  return value || '';
}

// Get environment variable with default fallback
function getEnvVarWithDefault<T extends keyof typeof optionalEnvVars>(
  key: T
): string {
  return import.meta.env[key] || optionalEnvVars[key];
}

// Validate all environment variables on import
validateRequiredEnvVars();

// Export validated environment configuration
export const env = {
  // Required variables (validated)
  supabaseUrl: getEnvVar('VITE_SUPABASE_URL', true),
  supabaseAnonKey: getEnvVar('VITE_SUPABASE_ANON_KEY', true),
  
  // Optional variables with defaults
  siteUrl: getEnvVarWithDefault('VITE_SITE_URL'),
  callbackUrl: getEnvVarWithDefault('VITE_CALLBACK_URL'),
  turnstileSiteKey: getEnvVarWithDefault('VITE_TURNSTILE_SITE_KEY'),
  environment: getEnvVarWithDefault('VITE_ENVIRONMENT'),
  
  // Computed values
  isDevelopment: getEnvVarWithDefault('VITE_ENVIRONMENT') === 'development',
  isProduction: getEnvVarWithDefault('VITE_ENVIRONMENT') === 'production',
  isStaging: getEnvVarWithDefault('VITE_ENVIRONMENT') === 'staging',
} as const;

// Type for environment configuration
export type EnvConfig = typeof env;

// Security: Validate environment URLs (non-blocking)
function validateUrls() {
  const urls = [env.siteUrl, env.callbackUrl, env.supabaseUrl].filter(Boolean);
  
  for (const url of urls) {
    try {
      const parsed = new URL(url);
      if (!['https:', 'http:'].includes(parsed.protocol)) {
        console.warn(`⚠️ Invalid URL protocol: ${url} (continuing with limited functionality)`);
        continue;
      }
      if (env.isProduction && parsed.protocol !== 'https:') {
        console.warn(`⚠️ Non-HTTPS URL in production: ${url}`);
      }
    } catch (error) {
      console.warn(`⚠️ Invalid URL format: ${url} (continuing with limited functionality)`);
    }
  }
}

// Validate URLs on initialization (non-blocking)
try {
  validateUrls();
} catch (error) {
  console.warn('⚠️ URL validation failed:', error);
}

// Development helper - show config in development only
if (env.isDevelopment) {
  console.log('🔧 Environment Configuration:', {
    environment: env.environment,
    siteUrl: env.siteUrl,
    callbackUrl: env.callbackUrl,
    supabaseUrl: env.supabaseUrl?.split('@')[1] || 'masked', // Mask the project reference
    hasTurnstile: !!env.turnstileSiteKey,
  });
} else if (env.isProduction) {
  // Production logging - minimal
  console.log('🚀 Production environment initialized');
}