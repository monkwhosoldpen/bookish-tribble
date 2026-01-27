/**
 * Web-specific Firebase Cloud Messaging implementation
 * Uses Firebase JS SDK with Service Worker for browser notifications
 * 
 * This is the pure web-ui approach from monorepo/web-ui
 */

import { supabase } from './supabase';
import { FIREBASE_CONFIG } from './firebase-config';
import { CENTRAL_API_URL } from './env';

export interface NotificationMessage {
  notification?: {
    title?: string;
    body?: string;
  };
  data?: Record<string, string | undefined>;
}

export const NotificationsEngineWeb = {
  /**
   * Request browser notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    const permission = await Notification.requestPermission();
    return permission;
  },

  /**
   * Get FCM Token from Firebase Messaging
   */
  async getFCMToken(): Promise<string | null> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return null;
    }

    try {
      const { initializeApp, getApp, getApps } = await import('firebase/app');
      const { getMessaging, getToken: firebaseGetToken } = await import('firebase/messaging');

      const app = getApps().length > 0 ? getApp() : initializeApp(FIREBASE_CONFIG);
      const messaging = getMessaging(app);

      const token = await firebaseGetToken(messaging, { vapidKey: FIREBASE_CONFIG.vapidKey });

      if (!token) {
        if (__DEV__) { console.log('[NOTIFS-FCM-WEB] getToken() returned null'); }
      }

      return token || null;
    } catch (error) {
      const err = error as Error;
      if (__DEV__) { console.error('[NOTIFS-FCM-WEB] ERROR in getFCMToken:', err.message); }
      if (err.message?.includes('401')) {
        if (__DEV__) { console.error('[NOTIFS-FCM-WEB] AUTHENTICATION ERROR: FCM rejected the credentials. Verify API Key and Project ID.'); }
      }
      return null;
    }
  },

  /**
   * Sync FCM token with Central API
   */
  async syncToken(pushToken: string): Promise<Record<string, unknown> | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      if (!accessToken) {
        return null;
      }

      const res = await fetch(`${CENTRAL_API_URL}/api/central/sync/device`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          push_token: pushToken,
          device_type: 'web',
          platform: 'web'
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        if (__DEV__) { console.error(`[NOTIFS-SYNC-WEB] API Error (HTTP ${res.status}):`, errorText); }
        return null;
      }

      const data = await res.json();
      if (__DEV__) {
        console.log('[NOTIFS-SYNC-WEB] Sync successful. Backend response:', {
          hasPreferences: !!data.preferences,
          keys: Object.keys(data)
        });
      }

      return data;
    } catch (error) {
      if (__DEV__) { console.error('[NOTIFS-SYNC-WEB] CRITICAL ERROR during sync:', error); }
      return null;
    }
  },

  /**
   * Setup foreground message listener for web
   */
  async onMessage(callback: (message: NotificationMessage) => void): Promise<(() => void) | undefined> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return undefined;
    }

    try {
      const { initializeApp, getApp, getApps } = await import('firebase/app');
      const { getMessaging, onMessage } = await import('firebase/messaging');

      const app = getApps().length > 0 ? getApp() : initializeApp(FIREBASE_CONFIG);
      const messaging = getMessaging(app);

      // Setup foreground message handler
      const unsubscribe = onMessage(messaging, (payload) => {
        callback({
          notification: {
            title: payload.notification?.title,
            body: payload.notification?.body,
          },
          data: payload.data as Record<string, string | undefined>,
        });
      });

      return unsubscribe;
    } catch (error) {
      if (__DEV__) { console.error('[NOTIFS-LISTEN-WEB] Failed to setup listener:', error); }
      return undefined;
    }
  },

  /**
   * Register service worker for background notifications
   */
  async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/'
      });
      return registration;
    } catch (error) {
      if (__DEV__) { console.error('[SW-REGISTER-WEB] Failed to register service worker:', error); }
      return null;
    }
  },
};
