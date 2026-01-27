/**
 * Centralized environment configuration resolver
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
 */
const getApiUrl = () => {
    const override = process.env.EXPO_PUBLIC_CENTRAL_API_URL;
    if (override) return override;

    if (isDevelopment) {
        // Default to a common local port for the central API
        return 'http://localhost:3005';
    }

    return FALLBACK_PROD_URL;
};

export const CENTRAL_API_URL = getApiUrl();

/**
 * Firebase Project ID for Cloud Messaging
 */
export const FIREBASE_PROJECT_ID = process.env.EXPO_PUBLIC_PROJECT_ID || 'your-project-id';
