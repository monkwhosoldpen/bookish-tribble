// public/firebase-messaging-sw.js

/**
 * Service Worker for web notifications
 * Basic implementation without Firebase dependencies
 */

console.log('[FCM-SW] Service Worker loaded');

/**
 * Lifecycle Logs
 */
self.addEventListener('install', (event) => {
    console.log('[FCM-SW] Service Worker installing...');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('[FCM-SW] Service Worker activated and claiming clients...');
    event.waitUntil(clients.claim());
});

/**
 * Handle push messages
 */
self.addEventListener('push', (event) => {
    console.log('[FCM-SW] 🚨 PUSH MESSAGE RECEIVED 🚨');
    
    let payload;
    try {
        payload = event.data.json();
    } catch (e) {
        payload = {
            notification: {
                title: 'Notification',
                body: event.data.text(),
            }
        };
    }

    const title = payload.notification?.title || payload.data?.title || 'System Notification';
    const body = payload.notification?.body || payload.data?.body || 'New message received.';
    const icon = payload.data?.icon || '/icon.png';
    const badge = payload.data?.badge || '/badge.png';
    const url = payload.data?.url || '/';

    // User requested static badge count of 5 for PWA consistency
    const badgeCount = 5;

    // 1. Show the notification
    const notificationPromise = self.registration.showNotification(title, {
        body,
        icon,
        badge,
        data: { url },
        tag: 'web-ui-notification', // Deduplication
        requireInteraction: false,
        silent: false
    });

    // 2. Update App Badge (if supported)
    if ('setAppBadge' in navigator) {
        notificationPromise.then(() => {
            return navigator.setAppBadge(badgeCount);
        }).catch(err => {
            console.error('[FCM-SW] Failed to set badge:', err);
        });
    }

    event.waitUntil(notificationPromise);
});

/**
 * Notification Click Handler
 */
self.addEventListener('notificationclick', (event) => {
    console.log('[FCM-SW] Notification clicked');
    event.notification.close();
    
    const urlToOpen = event.notification.data?.url || '/';

    if ('clearAppBadge' in navigator) {
        navigator.clearAppBadge().catch(console.error);
    }

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                for (const client of clientList) {
                    if (client.url.includes(urlToOpen) && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});

/**
 * PWA Fetch Handler
 * Implements basic asset caching for "Offline Mode"
 */
const CACHE_NAME = 'showcase-assets-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.png',
    '/icon.png',
];

self.addEventListener('install', (event) => {
    console.log('[FCM-SW] Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
    // Only cache GET requests
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).then((response) => {
                // Check if we should cache this response
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                // Cache the newly fetched resource
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return response;
            }).catch(() => {
                // Return offline fallback if network fails
                return caches.match('/');
            });
        })
    );
});
