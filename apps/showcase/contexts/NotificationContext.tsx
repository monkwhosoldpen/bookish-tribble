import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
  useMemo,
} from 'react';
import { Platform } from 'react-native';
import { useAuth } from './AuthContext';
import { useNotificationEngine } from '@/hooks/useNotificationEngine';
import { supabase } from '@/lib/supabase';
import { CENTRAL_API_URL } from '@/lib/env';
import { PREFERENCE_KEYS } from '@/features/settings/constants';
import { useHaptics } from './HapticsContext';

/**
 * Notification Context - Dual Platform Support
 *
 * Web Platform:
 * - Uses Firebase JS SDK with Service Worker
 *
 * Native Platforms (iOS/Android):
 * - Uses Firebase Cloud Messaging (FCM)
 *
 * The token is synced with Central API in both cases
 */

export interface UserPreferences {
  user_id: string;
  [PREFERENCE_KEYS.GLOBAL]: boolean;
  [PREFERENCE_KEYS.FOLLOWED]: boolean;
  [PREFERENCE_KEYS.SYSTEM]: boolean;
  [PREFERENCE_KEYS.MENTIONS]: boolean;
  created_at: string;
  updated_at: string;
}

interface NotificationState {
  enabled: boolean;
  pushToken: string | null;
  isRegistering: boolean;
  preferences: UserPreferences | null;
  enable: () => Promise<any>;
  disable: () => Promise<void>;
  updatePreference: (key: keyof UserPreferences, value: boolean) => Promise<void>;
}

const NotificationContext = createContext<NotificationState | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const engine = useNotificationEngine();
  const { success: hapticSuccess } = useHaptics();
  const [enabled, setEnabled] = useState(false);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [preferences, setPreferences] = useState<any>(null);

  // Determine if running on web or native
  const isWeb = Platform.OS === 'web';

  // Enable notifications
  const enable = useCallback(async () => {
    if (isRegistering) return null;

    setIsRegistering(true);
    try {
      const hasPermission = await engine.requestPermission();
      if (!hasPermission) {
        setIsRegistering(false);
        return null;
      }

      const token = await engine.getToken();
      if (!token) {
        if (__DEV__) { console.error('[NOTIFS] Failed to get push token'); }
        setIsRegistering(false);
        return null;
      }

      setPushToken(token);
      setEnabled(true);
      setIsRegistering(false);

      // Sync token with API
      if (isWeb) {
        try {
          await (engine as any).syncToken?.(token);
        } catch (syncError) {
          if (__DEV__) { console.warn('[NOTIFS] Token sync failed:', syncError); }
        }
      }

      return { pushToken: token, synced: true };
    } catch (error) {
      if (__DEV__) { console.error('[NOTIFS] Enable failed:', error); }
      setIsRegistering(false);
      return null;
    }
  }, [isRegistering, engine, isWeb]);

  // Disable notifications
  const disable = useCallback(async () => {
    try {
      await engine.disable();
      setPushToken(null);
      setEnabled(false);
    } catch (error) {
      if (__DEV__) { console.error('[NOTIFS] Disable failed:', error); }
    }
  }, [engine]);

  /**
   * Update User Preference - Local State Only
   */
  const updatePreference = useCallback(async (key: keyof UserPreferences, value: boolean) => {
    if (!user?.id) {
      return;
    }

    // Proactive Enablement:
    // If user is trying to turn ON a notification type but notifications are disabled or no token exists
    // we should proactively trigger the enable() flow to get browser/system permissions.
    if (value === true && (!enabled || !pushToken)) {
      console.log(`[NOTIFS-PREFS] Proactively enabling notifications because ${key} was turned on.`);
      try {
        const syncResult = await enable();
        if (!syncResult) {
          // Continue anyway to update the local state
        }
      } catch (e) {
        if (__DEV__) { console.error('[NOTIFS-PREFS] Error during proactive enable:', e); }
      }
    }

    // Update local state
    setPreferences((prev: any) => prev ? { ...prev, [key]: value } : null);

    // Sync with API
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      if (!accessToken) throw new Error('No access token');

      const res = await fetch(`${CENTRAL_API_URL}/api/central/sync/preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ [key]: value }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.preferences) setPreferences(data.preferences);
      }
    } catch (err) {
      if (__DEV__) { console.error('[NOTIFS-PREFS] Failed to update preference:', err); }
    }
  }, [user, enabled, pushToken, enable]);

  // Initial Status Check
  useEffect(() => {
    if (!user || authLoading) return;

    let mounted = true;

    const checkStatus = async () => {
      console.log('[NOTIFS] Checking notification status...');
      try {
        // Check notification status
        const currentToken = await engine.getToken();
        if (mounted && currentToken) {
          console.log('[NOTIFS] Token retrieved:', currentToken.substring(0, 20) + '...');
          setPushToken(currentToken);
          setEnabled(true);
        }

        if (mounted) {
          setIsInitialized(true);
        }
      } catch (error) {
        if (__DEV__) { console.error('[NOTIFS] Status check error:', error); }
      }
    };

    checkStatus();
    return () => { mounted = false; };
  }, [user, authLoading, engine]);

  // Initialize Engine & Listeners
  useEffect(() => {
    if (Platform.OS === 'web') {
      engine.registerServiceWorker();
    } else {
      engine.setupBackgroundMessageHandler();
    }
  }, [engine]);

  // Foreground Listener
  useEffect(() => {
    if (!user || authLoading) return;

    let unsubscribe: (() => void) | undefined;

    const setupListener = async () => {
      try {
        unsubscribe = engine.setupForegroundListener((message: any) => {
          console.log('[NOTIFS] Foreground message:', message);
          hapticSuccess();
        });
      } catch (error) {
        if (__DEV__) { console.error('[NOTIFS] Failed to setup foreground listener:', error); }
      }
    };

    setupListener();

    return () => {
      unsubscribe?.();
    };
  }, [user, authLoading, engine]);

  // Note: Removed preferences fetch - using local state only

  const value = useMemo(() => ({
    enabled,
    pushToken,
    isRegistering,
    preferences,
    enable,
    disable,
    updatePreference,
  }), [enabled, pushToken, isRegistering, preferences, enable, disable, updatePreference]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
