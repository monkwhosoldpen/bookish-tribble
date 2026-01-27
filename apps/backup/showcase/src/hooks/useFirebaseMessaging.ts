import { useCallback, useEffect, useState, useMemo } from 'react';
import { Platform } from 'react-native';

// Only import Firebase on native platforms
let messaging: any = null;
if (Platform.OS !== 'web') {
  try {
    messaging = require('@react-native-firebase/messaging').default;
    if (__DEV__) { console.log('[FIREBASE] Successfully imported messaging module'); }
  } catch (e) {
    if (__DEV__) {
      console.error('[FIREBASE] Failed to import messaging module:', e);
      console.error('[FIREBASE] Error details:', e instanceof Error ? e.message : String(e));
    }
  }
}

/**
 * useFirebaseMessaging - React Native Firebase Cloud Messaging Hook
 * 
 * For React Native/Expo ONLY (native builds with google-services.json)
 * This hook handles FCM token management and registration with Central API
 * 
 * Requirements:
 * - @react-native-firebase/app installed
 * - @react-native-firebase/messaging installed
 * - google-services.json in project root
 * - app.config.ts configured with @react-native-firebase plugins
 */

interface ForegroundMessageHandler {
  (message: any): void;
}

export function useFirebaseMessaging() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const foregroundHandlerRef = { current: null as ForegroundMessageHandler | null };

  /**
   * Request notification permissions
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      // Firebase not available on web
      if (!messaging || Platform.OS === 'web') {
        if (__DEV__) { console.log('[FIREBASE] requestPermission() - Firebase not available or on web'); }
        return false;
      }

      if (__DEV__) { console.log('[FIREBASE] Requesting permission...'); }
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      console.log('[FIREBASE] Permission request result:', {
        status: authStatus,
        enabled,
        isAuthorized: authStatus === messaging.AuthorizationStatus.AUTHORIZED,
        isProvisional: authStatus === messaging.AuthorizationStatus.PROVISIONAL,
      });

      return enabled;
    } catch (err) {
      if (__DEV__) {
        console.error('[FIREBASE] Permission request failed:', err);
        console.error('[FIREBASE] Error details:', err instanceof Error ? err.stack : String(err));
      }
      setError(err instanceof Error ? err.message : 'Permission request failed');
      return false;
    }
  }, []);

  /**
   * Get FCM token from Firebase
   */
  const getToken = useCallback(async (): Promise<string | null> => {
    try {
      // Firebase not available on web
      if (!messaging || Platform.OS === 'web') {
        if (__DEV__) { console.log('[FIREBASE] getToken() called on web - no-op'); }
        return null;
      }

      if (__DEV__) { console.log('[FIREBASE] Getting FCM token...'); }
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('[FIREBASE] Token retrieved:', fcmToken.substring(0, 20) + '...');
      } else {
        console.log('[FIREBASE] getToken() returned null');
      }
      return fcmToken;
    } catch (err) {
      if (__DEV__) {
        console.error('[FIREBASE] Token retrieval error:', err);
        console.error('[FIREBASE] Error details:', err instanceof Error ? err.stack : String(err));
      }
      setError(err instanceof Error ? err.message : 'Failed to get token');
      return null;
    }
  }, []);

  /**
   * Enable notifications - request permission and get token
   */
  const enable = useCallback(async (): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      // Request permission
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        throw new Error('User denied notification permission');
      }

      // Get token
      const fcmToken = await getToken();
      if (!fcmToken) {
        throw new Error('Failed to retrieve FCM token');
      }

      setToken(fcmToken);
      return fcmToken;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      if (__DEV__) { console.error('[FIREBASE] Enable error:', errorMsg); }
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [requestPermission, getToken]);

  /**
   * Setup foreground message listener
   * Called when app is open/foreground
   */
  const setupForegroundListener = useCallback((handler: ForegroundMessageHandler) => {
    foregroundHandlerRef.current = handler;

    // Firebase not available on web
    if (!messaging || Platform.OS === 'web') {
      return () => { };
    }

    const unsubscribe = messaging().onMessage(async (remoteMessage: any) => {
      console.log('[FIREBASE] Foreground message received:', {
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
      });

      // Call the handler provided by NotificationContext
      if (foregroundHandlerRef.current) {
        foregroundHandlerRef.current(remoteMessage);
      }
    });

    return unsubscribe;
  }, []);

  /**
   * Setup background message handler
   * Called when app is closed/background
   * MUST be called outside component lifecycle
   */
  // Internal reference for the hook to us, but the actual implementation 
  // needs to be exported for index.js / init usage.
  // We'll update useFirebaseMessaging to return the standalone function or 
  // just export the standalone function separately.

  // Removed redundant background handler registration from hook. 
  // Registration is handled globally in _layout.tsx


  /**
   * Setup token refresh listener
   * Firebase auto-refreshes tokens monthly
   */
  const setupTokenRefreshListener = useCallback(() => {
    // Firebase not available on web
    if (!messaging || Platform.OS === 'web') {
      return () => { };
    }

    const unsubscribe = messaging().onTokenRefresh((newToken: string) => {
      console.log('[FIREBASE] Token refreshed:', newToken.substring(0, 20) + '...');
      setToken(newToken);
      // Note: caller should sync this new token to Central API
    });

    return unsubscribe;
  }, []);

  /**
   * Disable notifications
   */
  const disable = useCallback(async (): Promise<void> => {
    try {
      // Firebase doesn't have a "delete token" method
      // Token becomes invalid after uninstall or manual revocation
      setToken(null);
    } catch (err) {
      if (__DEV__) { console.error('[FIREBASE] Disable error:', err); }
    }
  }, []);

  // Setup token refresh on mount
  useEffect(() => {
    const unsubscribeTokenRefresh = setupTokenRefreshListener();

    return () => {
      unsubscribeTokenRefresh?.();
    };
  }, [setupTokenRefreshListener]);

  return useMemo(() => ({
    token,
    loading,
    error,
    enable,
    disable,
    requestPermission,
    getToken,
    setupForegroundListener,
    setupBackgroundMessageHandler,
    setupTokenRefreshListener,
  }), [
    token,
    loading,
    error,
    enable,
    disable,
    requestPermission,
    getToken,
    setupForegroundListener,
    setupBackgroundMessageHandler,
    setupTokenRefreshListener,
  ]);
}

/**
 * Standalone background message handler
 * Exported for use in index.js or initialization scripts
 */
export function setupBackgroundMessageHandler() {
  // Firebase not available on web
  if (!messaging || Platform.OS === 'web') {
    return;
  }

  try {
    messaging().setBackgroundMessageHandler(async (remoteMessage: any) => {
      console.log('[FIREBASE] Background message received:', {
        messageId: remoteMessage?.messageId,
        title: remoteMessage?.notification?.title,
        data: remoteMessage?.data,
      });

      // You can implement custom background logic here (e.g., syncing local storage)
      // Note: This handler runs in a separate native task
    });
  } catch (e) {
    if (__DEV__) { console.error('[FIREBASE] Failed to setup BG handler:', e); }
  }
}
