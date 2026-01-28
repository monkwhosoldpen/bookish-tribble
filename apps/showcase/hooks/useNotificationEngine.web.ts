import { useCallback } from 'react';
import { NotificationsEngineWeb } from '@/lib/notificationsWeb';
import type { NotificationEngine, NotificationMessage } from './useNotificationEngine';

export const useNotificationEngine = (): NotificationEngine => {
    const requestPermission = useCallback(async () => {
        const permission = await NotificationsEngineWeb.requestPermission();
        return permission === 'granted';
    }, []);

    const getToken = useCallback(async () => {
        return await NotificationsEngineWeb.getFCMToken();
    }, []);

    const disable = useCallback(async () => {
        // Web: No specific disable needed beyond state update
        return;
    }, []);

    const registerServiceWorker = useCallback(async () => {
        await NotificationsEngineWeb.registerServiceWorker();
    }, []);

    const setupBackgroundMessageHandler = useCallback(() => {
        // Web: Handled by Service Worker
    }, []);

    const setupForegroundListener = useCallback((callback: (message: NotificationMessage) => void) => {
        const unsubscribePromise = NotificationsEngineWeb.onMessage(callback);

        let unsubscribed = false;
        let unsubscribeFn: (() => void) | undefined;

        unsubscribePromise.then(unsub => {
            if (unsubscribed) {
                // Cleanup was called before the promise resolved — unsubscribe immediately
                unsub();
            } else {
                unsubscribeFn = unsub;
            }
        });

        return () => {
            unsubscribed = true;
            unsubscribeFn?.();
        };
    }, []);

    return {
        requestPermission,
        getToken,
        disable,
        registerServiceWorker,
        setupBackgroundMessageHandler,
        setupForegroundListener,
    };
};
