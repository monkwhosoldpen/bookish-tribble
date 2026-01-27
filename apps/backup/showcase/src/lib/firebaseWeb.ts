/**
 * Web-specific Firebase Cloud Messaging setup
 * For web browser environments ONLY
 * 
 * This runs in service worker and handles:
 * - FCM token retrieval using browser APIs
 * - Background notification handling
 * - Notification click/close events
 */

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Initialize Firebase (must be called in service worker)
export function initializeFirebaseMessaging(config: any) {
  const app = initializeApp(config);
  const messaging = getMessaging(app);
  return messaging;
}

/**
 * Get FCM token for web browser
 * Requires user notification permission
 */
export async function getFCMToken(vapidKey: string) {
  try {
    const messaging = getMessaging();
    const token = await getToken(messaging, { vapidKey });
    if (__DEV__) { console.log('[FIREBASE-WEB] Token retrieved:', token.substring(0, 20) + '...'); }
    return token;
  } catch (error) {
    if (__DEV__) { console.error('[FIREBASE-WEB] Failed to get token:', error); }
    throw error;
  }
}

/**
 * Setup foreground message handler for web
 * Called when user has tab open
 */
export function setupWebForegroundListener(callback: (message: any) => void) {
  try {
    const messaging = getMessaging();
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('[FIREBASE-WEB] Foreground message received:', {
        title: payload.notification?.title,
        body: payload.notification?.body,
      });
      callback(payload);
    });
    return unsubscribe;
  } catch (error) {
    if (__DEV__) { console.error('[FIREBASE-WEB] Setup foreground listener error:', error); }
throw error;
  }
}

/**
 * Service Worker message handler registration
 * Handles background notifications when tab is closed
 * Place this in your service worker file
 */
export const serviceWorkerCode = `
// This code should be in your public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

// Initialize Firebase in service worker
firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || 'Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/notification-icon.png',
    badge: '/notification-badge.png',
    tag: payload.messageId,
    data: payload.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Open app or focus existing window
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
`;
