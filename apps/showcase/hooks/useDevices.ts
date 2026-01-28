import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useFirebaseMessaging } from './useFirebaseMessaging';
import { CENTRAL_API_URL } from '@/lib/env';
import { persistentStorage } from '@/lib/storage';
import { useHaptics } from '@/contexts/HapticsContext';

export interface Device {
    id: string;
    device_type: 'web' | 'ios' | 'android';
    device_name: string | null;
    fcm_token: string;
    last_used_at: string;
}

export interface FollowedChannel {
    entity_username: string;
}

export interface FavouriteChannel {
    entity_username: string;
}

const CACHE_KEYS = {
    DEVICES: 'cached_devices',
    FOLLOWED: 'cached_followed',
    FAVOURITES: 'cached_favourites'
};

export function useDevices() {
    const { session, user } = useAuth();
    const firebaseMessaging = useFirebaseMessaging();
    const { impact, success, error: hapticError } = useHaptics();

    const [devices, setDevices] = useState<Device[]>([]);
    const [followedChannels, setFollowedChannels] = useState<FollowedChannel[]>([]);
    const [favouriteChannels, setFavouriteChannels] = useState<FavouriteChannel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentToken, setCurrentToken] = useState<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const fetchDevices = useCallback(async (silent = false) => {
        if (!session?.access_token || !user?.id) {
            return;
        }

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        if (!silent) setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${CENTRAL_API_URL}/api/central/sync/device`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    push_token: currentToken || undefined,
                    device_type: Platform.OS === 'web' ? 'web' : Platform.OS,
                    platform: Platform.OS,
                }),
                signal: controller.signal,
            });

            if (!res.ok) {
                if (res.status === 401) throw new Error('Unauthorized');
                throw new Error(`API Error: ${res.status}`);
            }

            const data = await res.json();
            const devicesList = data.devices || [];
            const followedChannelsList = data.followed_channels || [];
            const favouriteChannelsList = data.favourite_channels || [];

            setDevices(devicesList);
            setFollowedChannels(followedChannelsList);
            setFavouriteChannels(favouriteChannelsList);

            persistentStorage.set(CACHE_KEYS.DEVICES, devicesList);
            persistentStorage.set(CACHE_KEYS.FOLLOWED, followedChannelsList);
            persistentStorage.set(CACHE_KEYS.FAVOURITES, favouriteChannelsList);

            if (!silent) {
                success();
            }
        } catch (err: unknown) {
            if (err instanceof Error && err.name === 'AbortError') return;
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(errorMessage);
            if (!silent) {
                hapticError();
            }
        } finally {
            if (!controller.signal.aborted) {
                setLoading(false);
            }
        }
    }, [user?.id, session?.access_token, currentToken]);

    useEffect(() => {
        if (!user?.id) {
            setDevices([]);
            setFollowedChannels([]);
            setFavouriteChannels([]);
            return;
        }

        fetchDevices(false);

        let isPolling = true;
        const pollInterval = 60000;

        const poll = async () => {
            if (!isPolling) return;
            await fetchDevices(true);
            if (isPolling) {
                pollTimeoutRef.current = setTimeout(poll, pollInterval);
            }
        };

        pollTimeoutRef.current = setTimeout(poll, pollInterval);

        return () => {
            isPolling = false;
            if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
    }, [user?.id, fetchDevices]);

    const removeDevice = useCallback(async (fcmToken: string) => {
        if (!session?.access_token) return;

        const previousDevices = devices;
        setDevices(prev => prev.filter(d => d.fcm_token !== fcmToken));
        impact();

        try {
            const res = await fetch(`${CENTRAL_API_URL}/api/central/sync/device`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ fcm_token: fcmToken }),
            });

            if (!res.ok) throw new Error('Failed to delete device');
            persistentStorage.set(CACHE_KEYS.DEVICES, devices.filter(d => d.fcm_token !== fcmToken));
        } catch (err) {
            setDevices(previousDevices);
            hapticError();
        }
    }, [session?.access_token, devices]);

    return {
        devices,
        followedChannels,
        favouriteChannels,
        loading,
        error,
        currentToken,
        refetch: () => fetchDevices(false),
        removeDevice
    };
}
