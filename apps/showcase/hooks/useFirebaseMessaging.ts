import { useCallback, useEffect, useState, useMemo } from 'react';
import { Platform } from 'react-native';

// Only import Firebase on native platforms
let messaging: any = null;
if (Platform.OS !== 'web') {
    try {
        messaging = require('@react-native-firebase/messaging').default;
    } catch (e) {
        if (__DEV__) {
            console.warn('[FIREBASE] Failed to import messaging module');
        }
    }
}

interface ForegroundMessageHandler {
    (message: any): void;
}

export function useFirebaseMessaging() {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const foregroundHandlerRef = { current: null as ForegroundMessageHandler | null };

    const requestPermission = useCallback(async (): Promise<boolean> => {
        try {
            if (!messaging || Platform.OS === 'web') return false;
            const authStatus = await messaging().requestPermission();
            return (
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Permission request failed');
            return false;
        }
    }, []);

    const getToken = useCallback(async (): Promise<string | null> => {
        try {
            if (!messaging || Platform.OS === 'web') return null;
            return await messaging().getToken();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get token');
            return null;
        }
    }, []);

    const enable = useCallback(async (): Promise<string | null> => {
        setLoading(true);
        setError(null);
        try {
            if (Platform.OS === 'web') return null;
            const hasPermission = await requestPermission();
            if (!hasPermission) throw new Error('User denied notification permission');
            const fcmToken = await getToken();
            if (!fcmToken) throw new Error('Failed to retrieve FCM token');
            setToken(fcmToken);
            return fcmToken;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            return null;
        } finally {
            setLoading(false);
        }
    }, [requestPermission, getToken]);

    const setupForegroundListener = useCallback((handler: ForegroundMessageHandler) => {
        foregroundHandlerRef.current = handler;
        if (!messaging || Platform.OS === 'web') return () => { };
        return messaging().onMessage(async (remoteMessage: any) => {
            if (foregroundHandlerRef.current) foregroundHandlerRef.current(remoteMessage);
        });
    }, []);

    const setupTokenRefreshListener = useCallback(() => {
        if (!messaging || Platform.OS === 'web') return () => { };
        return messaging().onTokenRefresh((newToken: string) => {
            setToken(newToken);
        });
    }, []);

    useEffect(() => {
        const unsubscribeTokenRefresh = setupTokenRefreshListener();
        return () => unsubscribeTokenRefresh?.();
    }, [setupTokenRefreshListener]);

    return useMemo(() => ({
        token,
        loading,
        error,
        enable,
        disable: async () => setToken(null),
        requestPermission,
        getToken,
        setupForegroundListener,
        setupTokenRefreshListener,
    }), [token, loading, error, enable, requestPermission, getToken, setupForegroundListener, setupTokenRefreshListener]);
}

export function setupBackgroundMessageHandler() {
    if (!messaging || Platform.OS === 'web') return;
    try {
        messaging().setBackgroundMessageHandler(async () => {
            // Logic for background messages
        });
    } catch (e) { }
}
