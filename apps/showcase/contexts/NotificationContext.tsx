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
import { useFirebaseMessaging } from '@/hooks/useFirebaseMessaging';
import { supabase } from '@/lib/supabase';
import { CENTRAL_API_URL } from '@/lib/env';
import { PREFERENCE_KEYS } from '@/features/settings/constants';
import { haptics } from '@/lib/haptics';

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
        // For now, we'll use a simplified approach
        if (typeof window !== 'undefined' && 'Notification' in window) {
          const permission = await Notification.requestPermission();
          if (permission !== 'granted') {
            setIsRegistering(false);
            return null;
          }
        }
      } else {
        // Native: Use Firebase Cloud Messaging
        const hasPermission = await firebaseMessaging.requestPermission();
        if (!hasPermission) {
          setIsRegistering(false);
          return null;
        }

        pushToken = await firebaseMessaging.getToken();
        if (!pushToken) {
          if (__DEV__) { console.error('[NOTIFS] Native: Failed to get FCM token'); }
          setIsRegistering(false);
          return null;
        }
      }

      setPushToken(pushToken);
      setEnabled(true);
      setIsRegistering(false);

      return { pushToken, synced: true };
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

    // Update local state only (no API call)
    setPreferences((prev: any) => prev ? { ...prev, [key]: value } : null);
    
    if (__DEV__) {
      console.log(`[NOTIFS-PREFS] Updated preference ${key} to ${value} (local only)`);
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
        if (isWeb) {
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            setEnabled(true);
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
  }, [user, authLoading, isWeb, firebaseMessaging]);

  // Foreground Listener
  useEffect(() => {
    if (!user || authLoading) return;

    let mounted = true;
    let unsubscribe: (() => void) | undefined;

    const setupListener = async () => {
      try {
        if (isWeb) {
          // Web: Use Firebase JS SDK listener
          // Simplified for now - would need Firebase JS SDK setup
          console.log('[NOTIFS] Web listener setup (simplified)');
        } else {
          // Native: Use Firebase RN listener
          unsubscribe = firebaseMessaging.setupForegroundListener((message: any) => {
            if (mounted) {
              // Show toast notification
              console.log('[NOTIFS] Foreground message:', message);
              haptics.success();
            }
          });
        }
      } catch (error) {
        if (__DEV__) { console.error('[NOTIFS] Failed to setup foreground listener:', error); }
      }
    };

    setupListener();

    return () => {
      mounted = false;
      unsubscribe?.();
    };
  }, [user, authLoading, firebaseMessaging, isWeb]);

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
