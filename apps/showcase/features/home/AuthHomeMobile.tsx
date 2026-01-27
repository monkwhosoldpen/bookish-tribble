import * as React from 'react';
import { View, Pressable, FlatList, RefreshControl } from 'react-native';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { ChatSkeleton } from '@/components/ui/skeleton';
import { EmptyChatsState, EmptyFollowingState, EmptyFavouritesState } from '@/components/ui/empty-state';
import { SwipeableChatItem } from '@/components/ui/swipe-gestures';
import { useToast } from '@/components/ui/toast';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Icon } from '@/components/ui/Icon';
import { useHomeFeed, ChatTab, ChatItem } from '@/hooks/useHomeFeed';
import { useRouter } from 'expo-router';

export const AuthHomeMobile = function AuthHomeMobile() {
    const {
        activeTab,
        handleTabChange,
        chats,
        counts,
        loading,
        refreshing,
        onRefresh,
        handleExplore
    } = useHomeFeed();
    const router = useRouter();

    const { showError, showSuccess } = useToast();

    const handleArchiveChat = React.useCallback((username: string) => {
        showSuccess(`Archived chat with ${username}`);
    }, [showSuccess]);

    const handleDeleteChat = React.useCallback((username: string) => {
        showError(`Cannot delete chat with ${username}. Feature coming soon.`);
    }, [showError]);

    const handleChatPress = React.useCallback((username: string) => {
        router.push(`/${username}`);
    }, [router]);

    if (loading) {
        return (
            <View className="flex-1 bg-background">
                <View className="flex-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <ChatSkeleton key={i} />
                    ))}
                </View>
            </View>
        );
    }

    const renderEmptyState = () => {
        switch (activeTab) {
            case 'following':
                return <EmptyFollowingState onExplore={handleExplore} />;
            case 'favourites':
                return <EmptyFavouritesState onExplore={handleExplore} />;
            case 'invites':
                return <EmptyChatsState onExplore={handleExplore} />;
            default:
                return null;
        }
    };

    const renderChatItem = ({ item }: { item: ChatItem }) => (
        <SwipeableChatItem
            onSwipeLeft={() => handleArchiveChat(item.username)}
            onSwipeRight={() => handleDeleteChat(item.username)}
            leftAction={
                <View className="items-center justify-center">
                    <Icon as={MaterialIcons} name="archive" size={20} className="text-blue-500" />
                </View>
            }
            rightAction={
                <View className="items-center justify-center">
                    <Icon as={MaterialIcons} name="delete" size={20} className="text-red-500" />
                </View>
            }
        >
            <Pressable
                onPress={() => handleChatPress(item.username)}
                className="flex-row items-center gap-4 py-4 px-4 border-b border-border/40 active:opacity-80"
            >
                <View className="h-12 w-12 rounded-full bg-primary/10 items-center justify-center">
                    <Text className="text-primary font-bold text-lg">
                        {item.username.charAt(0).toUpperCase()}
                    </Text>
                </View>
                <View className="flex-1 gap-1">
                    <Text className="text-[15px] font-black tracking-tight text-foreground">{item.username}</Text>
                    <Text className="text-[13px] text-muted-foreground" numberOfLines={1}>
                        {item.lastMessage}
                    </Text>
                </View>
                <View className="items-end gap-1">
                    <Text className="text-xs text-muted-foreground">
                        {item.timestamp}
                    </Text>
                    {item.unreadCount && (
                        <View className="w-5 h-5 bg-primary rounded-full items-center justify-center">
                            <Text className="text-primary-foreground text-xs font-bold">
                                {item.unreadCount}
                            </Text>
                        </View>
                    )}
                </View>
            </Pressable>
        </SwipeableChatItem>
    );

    return (
        <View className="flex-1 bg-background">
            <View className="border-b border-border/60 bg-background/90 backdrop-blur-xl">
                <View className="flex-row gap-1 px-4 py-3">
                    {(['following', 'invites', 'favourites'] as ChatTab[]).map((tab) => (
                        <Pressable
                            key={tab}
                            onPress={() => handleTabChange(tab)}
                            className={cn(
                                'px-4 py-2 rounded-full',
                                activeTab === tab
                                    ? 'bg-primary/10'
                                    : 'bg-transparent'
                            )}
                        >
                            <Text
                                className={cn(
                                    'text-sm font-semibold capitalize',
                                    activeTab === tab
                                        ? 'text-primary'
                                        : 'text-muted-foreground'
                                )}
                            >
                                {tab} ({counts[tab]})
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            {chats.length === 0 ? (
                renderEmptyState()
            ) : (
                <FlatList
                    data={chats}
                    renderItem={renderChatItem}
                    keyExtractor={(item) => item.username}
                    showsVerticalScrollIndicator={false}
                    contentContainerClassName="pb-20"
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={refreshing ? undefined : 'transparent'}
                        />
                    }
                />
            )}
        </View>
    );
};
