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
                    <Icon as={MaterialIcons} name="archive" size={20} className="text-white" />
                </View>
            }
            rightAction={
                <View className="items-center justify-center">
                    <Icon as={MaterialIcons} name="delete" size={20} className="text-white" />
                </View>
            }
        >
            <Pressable
                onPress={() => handleChatPress(item.username)}
                className="flex-row items-center py-3 px-4 active:bg-foreground/5"
            >
                {/* Avatar */}
                <View className="h-12 w-12 rounded-full items-center justify-center mr-3" style={{ backgroundColor: '#25D366' }}>
                    <Text className="text-white font-bold text-lg">
                        {item.username.charAt(0).toUpperCase()}
                    </Text>
                </View>
                {/* Content */}
                <View className="flex-1 border-b border-border/15 pb-3">
                    <View className="flex-row items-center justify-between">
                        <Text className="text-[16.5px] font-normal text-foreground">{item.username}</Text>
                        <Text
                            className="text-[12px]"
                            style={{ color: item.unreadCount ? '#25D366' : '#8696A0' }}
                        >
                            {item.timestamp}
                        </Text>
                    </View>
                    <View className="flex-row items-center justify-between mt-1">
                        <View className="flex-row items-center flex-1 mr-4">
                            <Icon as={MaterialIcons} name="done-all" size={16} color="#53BDEB" style={{ marginRight: 3 }} />
                            <Text className="text-[14px] text-muted-foreground flex-1" numberOfLines={1}>
                                {item.lastMessage}
                            </Text>
                        </View>
                        {item.unreadCount ? (
                            <View className="min-w-[20px] h-5 rounded-full items-center justify-center px-1.5" style={{ backgroundColor: '#25D366' }}>
                                <Text className="text-white text-xs font-bold">
                                    {item.unreadCount}
                                </Text>
                            </View>
                        ) : null}
                    </View>
                </View>
            </Pressable>
        </SwipeableChatItem>
    );

    return (
        <View className="flex-1 bg-background">
            {/* WhatsApp-style top tabs on teal bar */}
            <View style={{ backgroundColor: '#075E54' }}>
                <View className="flex-row">
                    {(['following', 'invites', 'favourites'] as ChatTab[]).map((tab) => (
                        <Pressable
                            key={tab}
                            onPress={() => handleTabChange(tab)}
                            className="flex-1 items-center py-3 relative"
                        >
                            <View className="flex-row items-center gap-1">
                                <Text
                                    className={cn(
                                        'text-[13px] font-bold uppercase tracking-wide',
                                        activeTab === tab ? 'text-white' : 'text-white/60'
                                    )}
                                >
                                    {tab}
                                </Text>
                                {counts[tab] > 0 && (
                                    <View className="min-w-[16px] h-4 rounded-full items-center justify-center px-1" style={{ backgroundColor: '#25D366' }}>
                                        <Text className="text-white text-[10px] font-bold">
                                            {counts[tab] > 99 ? '99+' : counts[tab]}
                                        </Text>
                                    </View>
                                )}
                            </View>
                            {activeTab === tab && (
                                <View className="absolute bottom-0 left-4 right-4 h-[3px] rounded-full" style={{ backgroundColor: '#25D366' }} />
                            )}
                        </Pressable>
                    ))}
                </View>
            </View>

            <View className="flex-1">
                {chats.length === 0 ? (
                    <View className="flex-1 items-center justify-center px-6">
                        {renderEmptyState()}
                    </View>
                ) : (
                    <FlatList
                        data={chats}
                        renderItem={renderChatItem}
                        keyExtractor={(item) => item.username}
                        showsVerticalScrollIndicator={false}
                        contentContainerClassName="pb-24"
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor={refreshing ? undefined : 'transparent'}
                                colors={['#25D366']}
                            />
                        }
                    />
                )}
            </View>

            {/* WhatsApp FAB */}
            <Pressable
                onPress={handleExplore}
                className="absolute bottom-6 right-4 w-[56px] h-[56px] rounded-2xl items-center justify-center active:scale-95"
                style={{ backgroundColor: '#25D366' }}
            >
                <Icon as={MaterialIcons} name="chat" size={24} className="text-white" />
            </Pressable>
        </View>
    );
};
