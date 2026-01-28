import * as React from 'react';
import { useDevices } from './useDevicesContext';
import { sampleChats } from '../lib/sample-data';
import { useHaptics } from '@/contexts/HapticsContext';
import { router } from 'expo-router';

export type ChatTab = 'following' | 'invites' | 'favourites';

export interface ChatItem {
    username: string;
    lastMessage?: string;
    timestamp?: string;
    unreadCount?: number;
}

export function useHomeFeed() {
    const { followedChannels, favouriteChannels, loading: devicesLoading, refetch } = useDevices();
    const { impact } = useHaptics();
    const [activeTab, setActiveTab] = React.useState<ChatTab>('following');
    const [refreshing, setRefreshing] = React.useState(false);
    const [isInitializing, setIsInitializing] = React.useState(true);

    // Only consider it initialized once devices have loaded at least once
    React.useEffect(() => {
        if (!devicesLoading && isInitializing) {
            setIsInitializing(false);
        }
    }, [devicesLoading, isInitializing]);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        impact();
        await refetch?.();
        setRefreshing(false);
    }, [refetch, impact]);

    const handleTabChange = React.useCallback((tab: ChatTab) => {
        setActiveTab(tab);
        impact();
    }, [impact]);

    const handleExplore = React.useCallback(() => {
        impact('medium' as any);
        router.push('/explore');
    }, [impact]);

    const counts = React.useMemo(() => ({
        following: (followedChannels || []).length || (isInitializing ? 0 : sampleChats.slice(0, 3).length),
        favourites: (favouriteChannels || []).length || (isInitializing ? 0 : sampleChats.slice(3, 5).length),
        invites: 0
    }), [followedChannels, favouriteChannels, isInitializing]);

    const chats = React.useMemo(() => {
        if (isInitializing) return [];

        const followingChats: ChatItem[] = (followedChannels || []).length > 0
            ? (followedChannels || []).map((f: any) => ({
                username: f.entity_username,
                lastMessage: 'Start a conversation',
                timestamp: 'now'
            }))
            : sampleChats.slice(0, 3).map(c => ({
                username: c.username,
                lastMessage: c.lastMessage,
                timestamp: c.timestamp,
                unreadCount: c.unreadCount
            }));

        const favouriteChats: ChatItem[] = (favouriteChannels || []).length > 0
            ? (favouriteChannels || []).map((f: any) => ({
                username: f.entity_username,
                lastMessage: 'Favorite channel',
                timestamp: 'now'
            }))
            : sampleChats.slice(3, 5).map(c => ({
                username: c.username,
                lastMessage: c.lastMessage,
                timestamp: c.timestamp,
                unreadCount: c.unreadCount
            }));

        const invites: ChatItem[] = [];

        switch (activeTab) {
            case 'following':
                return followingChats;
            case 'favourites':
                return favouriteChats;
            case 'invites':
                return invites;
            default:
                return [];
        }
    }, [followedChannels, favouriteChannels, activeTab, isInitializing]);

    return {
        activeTab,
        handleTabChange,
        chats,
        counts,
        loading: devicesLoading,
        refreshing,
        isInitializing,
        onRefresh,
        handleExplore,
    };
}
