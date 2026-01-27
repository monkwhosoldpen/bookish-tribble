import * as React from 'react';
import { useDevices } from '@/hooks/useDevicesContext';
import { sampleChats } from '@/lib/sample-data';
import * as Haptics from 'expo-haptics';
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
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await refetch?.();
        setRefreshing(false);
    }, [refetch]);

    const handleTabChange = React.useCallback((tab: ChatTab) => {
        setActiveTab(tab);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, []);

    const handleExplore = React.useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push('/explore');
    }, []);

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
            : sampleChats.slice(0, 3);

        const favouriteChats: ChatItem[] = (favouriteChannels || []).length > 0
            ? (favouriteChannels || []).map((f: any) => ({
                username: f.entity_username,
                lastMessage: 'Favorite channel',
                timestamp: 'now'
            }))
            : sampleChats.slice(3, 5);

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
