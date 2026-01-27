'use client';

import { useEffect } from 'react';

/**
 * Service Worker Registration
 * Only runs in web browser environments
 */
export function FirebaseServiceWorkerRegister() {
  useEffect(() => {
    // Only register on web platform
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    const registerServiceWorker = async () => {
      try {
        await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/',
        });
        } catch (error) {
        if (__DEV__) { console.error('[Firebase SW] Service Worker registration failed:', error); }
}
    };

    // Register on mount
    registerServiceWorker();

    // Unregister on unmount (optional, usually you want to keep it)
    return () => {
      // Optionally unregister when component unmounts
      // navigator.serviceWorker.getRegistrations().then(registrations => {
      //   registrations.forEach(reg => reg.unregister());
      // });
    };
  }, []);

  return null; // This component doesn't render anything
}
