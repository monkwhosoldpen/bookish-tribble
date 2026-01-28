import { useCallback } from 'react';
import { useFirebaseMessaging } from './useFirebaseMessaging';
import type { NotificationEngine, NotificationMessage } from './useNotificationEngine';

export const useNotificationEngine = (): NotificationEngine => {
    const firebaseMessaging = useFirebaseMessaging();

    const requestPermission = useCallback(async () => {
        return await firebaseMessaging.requestPermission();
    }, [firebaseMessaging]);

    const getToken = useCallback(async () => {
        return await firebaseMessaging.getToken();
    }, [firebaseMessaging]);

    const disable = useCallback(async () => {
        await firebaseMessaging.disable();
    }, [firebaseMessaging]);

    const registerServiceWorker = useCallback(async () => {
        // Native: No service worker
    }, []);

    const setupBackgroundMessageHandler = useCallback(() => {
        // Native: Background messages handled by Firebase automatically
        // No additional setup needed for now
    }, []);

    const setupForegroundListener = useCallback((callback: (message: NotificationMessage) => void) => {
        return firebaseMessaging.setupForegroundListener(callback);
    }, [firebaseMessaging]);

    return {
        requestPermission,
        getToken,
        disable,
        registerServiceWorker,
        setupBackgroundMessageHandler,
        setupForegroundListener,
    };
};
