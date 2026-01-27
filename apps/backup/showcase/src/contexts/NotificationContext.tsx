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
import { NotificationsEngineWeb } from '@/lib/notificationsWeb';
import { useAuth } from './AuthContext';
import { useFirebaseMessaging } from '@/hooks/useFirebaseMessaging';

import { supabase } from '@/lib/supabase';
import { CENTRAL_API_URL } from '@/lib/env';
import Toast from 'react-native-toast-message';
import { PREFERENCE_KEYS } from '@/features/settings/constants';

/**
 * Notification Context - Dual Platform Support
 *
 * Web Platform:
 * - Uses Firebase JS SDK with Service Worker
 * - Pure web-ui approach from monorepo/web-ui
 *
 * Native Platforms (iOS/Android):
 * - Uses Firebase Cloud Messaging (FCM) only
 * - Requires google-services.json configuration
 * - Both Expo Go and native builds use Firebase
 *
 * The token is synced with Central API in both cases
 * Backend (Novu + Central API) remains unchanged
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
  const firebaseMessaging = useFirebaseMessaging();
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
      let pushToken: string | null = null;

      if (isWeb) {
        // Web: Use Firebase JS SDK approach

        // Step 1: Request permission
        const permission = await NotificationsEngineWeb.requestPermission();
        if (permission !== 'granted') {
          setIsRegistering(false);
          return null;
        }

        // Step 2: Get FCM token
        pushToken = await NotificationsEngineWeb.getFCMToken();
        if (!pushToken) {
          if (__DEV__) { console.error('[NOTIFS] Web: Failed to get FCM token'); }
          setIsRegistering(false);
          return null;
        }

        // Step 3: Registration with backend is handled by useDevices
        setPushToken(pushToken);
        setEnabled(true);
        setIsRegistering(false);

        return { pushToken, synced: true };
      } else {
        // Native: Use Firebase Cloud Messaging only

        // Step 1: Request permission
        const hasPermission = await firebaseMessaging.requestPermission();
        if (!hasPermission) {
          setIsRegistering(false);
          return null;
        }

        // Step 2: Get FCM token
        pushToken = await firebaseMessaging.getToken();
        if (!pushToken) {
          if (__DEV__) { console.error('[NOTIFS] Native: Failed to get FCM token'); }
          setIsRegistering(false);
          return null;
        }

        // Step 3: Registration with backend is handled by useDevices
        setPushToken(pushToken);
        setEnabled(true);
        setIsRegistering(false);

        return { pushToken, synced: true };
      }
    } catch (error) {
      if (__DEV__) { console.error('[NOTIFS] Enable failed:', error); }
      setIsRegistering(false);
      return null;
    }
  }, [isRegistering, firebaseMessaging, isWeb]);

  // Disable notifications
  const disable = useCallback(async () => {
    try {
      if (isWeb) {
        // Web: Just update state
        setPushToken(null);
        setEnabled(false);
      } else {
        // Native: Disable Firebase
        await firebaseMessaging.disable();
        setPushToken(null);
        setEnabled(false);
      }
    } catch (error) {
      if (__DEV__) { console.error('[NOTIFS] Disable failed:', error); }
    }
  }, [firebaseMessaging, isWeb]);

  /**
   * Update User Preference via Central API
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
          // Continue anyway to sync the preference to the DB, but delivery will fail
        }
      } catch (e) {
        if (__DEV__) { console.error('[NOTIFS-PREFS] Error during proactive enable:', e); }
      }
    }

    // Optimistic update
    setPreferences((prev: any) => prev ? { ...prev, [key]: value } : null);

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

      if (!res.ok) throw new Error(`API Error: ${res.status}`);

      const data = await res.json();
      if (data.preferences) {
        setPreferences(data.preferences);
      }
    } catch (err) {
      if (__DEV__) { console.error('[NOTIFS-PREFS] Failed to update preference:', err); }
    }
  }, [user, enabled, pushToken, enable]);

  // Phase 0: Register service worker on web
  useEffect(() => {
    if (!isWeb) return;

    let mounted = true;
    const registerSW = async () => {
      try {
        const sw = await NotificationsEngineWeb.registerServiceWorker();
        if (mounted && sw) {
          console.log('[NOTIFS] Service worker registered');
        }
      } catch (error) {
        if (__DEV__) { console.error('[NOTIFS] Failed to register service worker:', error); }
      }
    };

    registerSW();
    return () => { mounted = false; };
  }, [isWeb]);

  // Phase 1: Setup background message handler (native only)
  useEffect(() => {
    if (isWeb) return;
    firebaseMessaging.setupBackgroundMessageHandler();
  }, [firebaseMessaging, isWeb]);

  // Phase 2: Configure for native (Firebase only)
  useEffect(() => {
    if (isWeb) return;

    let mounted = true;

    const configure = async () => {
      // Firebase setup is handled by useFirebaseMessaging hook
      if (mounted) {
        setIsInitialized(true);
      }
    };

    configure();
    return () => { mounted = false; };
  }, [isWeb]);

  // Phase 3: Initial Status Check (Token Acquisition Only)
  useEffect(() => {
    if (!user || authLoading) return;
    if (!isWeb && !isInitialized) return;

    let mounted = true;

    const checkStatus = async () => {
      console.log('[NOTIFS] Checking notification status...');
      try {
        // Check notification status
        if (isWeb) {
          if (Notification.permission === 'granted') {
            const currentToken = await NotificationsEngineWeb.getFCMToken();
            if (mounted && currentToken) {
              console.log('[NOTIFS] Web: Token retrieved:', currentToken.substring(0, 20) + '...');
              setPushToken(currentToken);
              setEnabled(true);
            }
          }
        } else {
          const currentToken = await firebaseMessaging.getToken();
          if (mounted && currentToken) {
            console.log('[NOTIFS] Native: Token retrieved:', currentToken.substring(0, 20) + '...');
            setPushToken(currentToken);
            setEnabled(true);
          }
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
  }, [user, authLoading, isWeb]);

  // Phase 4: Foreground Listener
  useEffect(() => {
    if (!user || authLoading) return;

    let mounted = true;
    let unsubscribe: (() => void) | undefined;

    const setupListener = async () => {
      try {
        if (isWeb) {
          // Web: Use Firebase JS SDK listener
          unsubscribe = await NotificationsEngineWeb.onMessage((message: any) => {
            if (mounted) {
              Toast.show({
                type: 'success',
                text1: message.notification?.title || 'New Notification',
                text2: message.notification?.body || '',
                position: 'top',
              });
            }
          });
        } else {
          // Native: Use Firebase RN listener
          unsubscribe = firebaseMessaging.setupForegroundListener((message: any) => {
            if (mounted) {
              Toast.show({
                type: 'success',
                text1: message.notification?.title || 'New Notification',
                text2: message.notification?.body || '',
                position: 'top',
              });
            }
          });
        }
      } catch (error) {
        if (__DEV__) { console.error('[NOTIFS-PHASE-4] Failed to setup foreground listener:', error); }
      }
    };

    setupListener();

    return () => {
      mounted = false;
      unsubscribe?.();
    };
  }, [user, authLoading, firebaseMessaging, isWeb]);

  // Phase 5: Fetch Preferences fallback
  useEffect(() => {
    if (!user || authLoading || preferences) return;

    const fetchPrefs = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      if (!accessToken) return;

      try {
        const res = await fetch(`${CENTRAL_API_URL}/api/central/sync/preferences`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.preferences) setPreferences(data.preferences);
        }
      } catch (e) {
        console.error('[NOTIFS] Prefs fetch failed:', e);
      }
    };

    fetchPrefs();
  }, [user, authLoading, preferences]);

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
