import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import { useAuth } from './useAuth';
import { useFirebaseMessaging } from './useFirebaseMessaging';
import { CENTRAL_API_URL } from '@/lib/env';
import { persistentStorage } from '@/lib/storage';
import * as Haptics from 'expo-haptics';

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
  const { user, session } = useAuth();
  const { token: currentToken } = useFirebaseMessaging();

  // Initialize from cache for Zero-Latency UX
  const [devices, setDevices] = useState<Device[]>(() =>
    persistentStorage.get<Device[]>(CACHE_KEYS.DEVICES) || []
  );
  const [followedChannels, setFollowedChannels] = useState<FollowedChannel[]>(() =>
    persistentStorage.get<FollowedChannel[]>(CACHE_KEYS.FOLLOWED) || []
  );
  const [favouriteChannels, setFavouriteChannels] = useState<FavouriteChannel[]>(() =>
    persistentStorage.get<FavouriteChannel[]>(CACHE_KEYS.FAVOURITES) || []
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      // Deduplication: Only sync token if it has changed or not yet synced
      // (Caching logic is handled by Central API, but we provide the token here as the source of truth)
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

      // Update State
      setDevices(devicesList);
      setFollowedChannels(followedChannelsList);
      setFavouriteChannels(favouriteChannelsList);

      // Update Cache
      persistentStorage.set(CACHE_KEYS.DEVICES, devicesList);
      persistentStorage.set(CACHE_KEYS.FOLLOWED, followedChannelsList);
      persistentStorage.set(CACHE_KEYS.FAVOURITES, favouriteChannelsList);

      if (!silent) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;

      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      if (__DEV__) { console.error('[DEVICES] Sync error:', err); }

      setError(errorMessage);
      if (!silent) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [user?.id, session?.access_token]);

  // Handle Polling and Initial Fetch
  useEffect(() => {
    if (!user?.id) {
      // Clear state if user logs out
      setDevices([]);
      setFollowedChannels([]);
      setFavouriteChannels([]);
      return;
    }

    // Trigger initial fetch
    fetchDevices(devices.length > 0); // Be silent if we have cached data

    let isPolling = true;
    const pollInterval = 60000; // 1 minute is enough with background notifications sync

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

    // Optimistic update
    const previousDevices = devices;
    setDevices(prev => prev.filter(d => d.fcm_token !== fcmToken));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

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

      // Update cache after successful delete
      persistentStorage.set(CACHE_KEYS.DEVICES, devices.filter(d => d.fcm_token !== fcmToken));
    } catch (err) {
      if (__DEV__) { console.error('[DEVICES] Remove error:', err); }
      // Revert internal state on error
      setDevices(previousDevices);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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
