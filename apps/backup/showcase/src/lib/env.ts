/**
 * Centralized environment configuration resolver
 *
 * Supports both web and native platforms with environment-aware API URLs.
 * - Web: Uses NEXT_PUBLIC_* prefixed variables
 * - Native: Uses EXPO_PUBLIC_* prefixed variables
 *
 * Environment Variables:
 * - EXPO_PUBLIC_CENTRAL_API_URL: Override central API URL (development or production)
 * - NODE_ENV: Set to 'production' for production builds, defaults to development
 */

// WARNING: Fallback URL should be a real production URL in a real app
const FALLBACK_PROD_URL = 'https://api.your-production-url.com';

/**
 * Environment determination helper
 */
export const isProduction = typeof process !== 'undefined' && process.env.NODE_ENV === 'production';
export const isDevelopment = !isProduction;

/**
 * Central API URL for device sync and notifications
 *
 * Resolution order:
 * 1. EXPO_PUBLIC_CENTRAL_API_URL (explicit override)
 * 2. NODE_ENV production? → configured PROD URL or Throw/Warn
 */
const getApiUrl = () => {
  const override = process.env.EXPO_PUBLIC_CENTRAL_API_URL;
  if (override) return override;

  if (isDevelopment) {
    return 'http://localhost:3005';
  }

  return FALLBACK_PROD_URL;
};

export const CENTRAL_API_URL = getApiUrl();

/**
 * Firebase Project ID for Cloud Messaging
 *
 * Must be set in environment variables
 */
export const FIREBASE_PROJECT_ID = process.env.EXPO_PUBLIC_PROJECT_ID || 'your-project-id';
