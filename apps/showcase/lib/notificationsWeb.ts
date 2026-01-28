/**
 * Web-specific Firebase Cloud Messaging implementation
 * Uses Firebase JS SDK with Service Worker for browser notifications
 */

import { supabase } from './supabase';
import { CENTRAL_API_URL } from './env';

export interface NotificationMessage {
  notification?: {
    title?: string;
    body?: string;
  };
  data?: Record<string, string | undefined>;
}

// Firebase config - should be moved to environment variables
const FIREBASE_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
  vapidKey: process.env.EXPO_PUBLIC_FIREBASE_VAPID_KEY || '',
};

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
      // Dynamic imports for Firebase JS SDK
      const { initializeApp, getApp, getApps } = await import('firebase/app');
      const { getMessaging, getToken: firebaseGetToken } = await import('firebase/messaging');

      const app = getApps().length > 0 ? getApp() : initializeApp(FIREBASE_CONFIG);
      const messaging = getMessaging(app);

      const token = await firebaseGetToken(messaging, { 
        vapidKey: FIREBASE_CONFIG.vapidKey 
      });

      if (!token && __DEV__) {
        console.log('[NOTIFS-FCM-WEB] getToken() returned null');
      }

      return token || null;
    } catch (error) {
      const err = error as Error;
      if (__DEV__) {
        console.error('[NOTIFS-FCM-WEB] ERROR in getFCMToken:', err.message);
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
        if (__DEV__) {
          console.error(`[NOTIFS-SYNC-WEB] API Error (HTTP ${res.status})`);
        }
        return null;
      }

      const data = await res.json();
      if (__DEV__) {
        console.log('[NOTIFS-SYNC-WEB] Sync successful');
      }

      return data;
    } catch (error) {
      if (__DEV__) {
        console.error('[NOTIFS-SYNC-WEB] CRITICAL ERROR during sync:', error);
      }
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
      if (__DEV__) {
        console.error('[NOTIFS-LISTEN-WEB] Failed to setup listener:', error);
      }
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
      const registration = await navigator.serviceWorker.register(`/firebase-messaging-sw.js?v=${Date.now()}`, {
        scope: '/',
        type: 'classic',
      });
      return registration;
    } catch (error) {
      if (__DEV__) {
        console.error('[SW-REGISTER-WEB] Failed to register service worker:', error);
      }
      return null;
    }
  },
};
