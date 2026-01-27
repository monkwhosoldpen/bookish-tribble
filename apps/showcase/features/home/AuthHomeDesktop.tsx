import * as React from 'react';
import { View, Pressable, FlatList } from 'react-native';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useHomeFeed, ChatTab, ChatItem } from '@/hooks/useHomeFeed';

export const AuthHomeDesktop = function AuthHomeDesktop() {
    const {
        activeTab,
        handleTabChange,
        chats,
        counts,
        loading,
        handleExplore
    } = useHomeFeed();

    const [selectedChat, setSelectedChat] = React.useState<ChatItem | null>(null);

    const handleChatSelect = (chat: ChatItem) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
        setSelectedChat(chat);
        // Navigate to username route when chat is selected
        router.push(`/${chat.username}`);
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-background">
                <Text className="text-muted-foreground">Loading chats...</Text>
            </View>
        );
    }

    const renderChatItem = ({ item: chat }: { item: ChatItem }) => (
        <Pressable
            key={chat.username}
            onPress={() => handleChatSelect(chat)}
            className={cn(
                'flex-row items-center gap-4 px-4 py-4 border-b border-border/40',
                selectedChat?.username === chat.username
                    ? 'bg-muted/40'
                    : 'active:bg-muted/30'
            )}
        >
            <View className="h-12 w-12 rounded-full bg-primary/10 items-center justify-center">
                <Text className="text-primary font-bold text-lg">
                    {chat.username.charAt(0).toUpperCase()}
                </Text>
            </View>
            <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">
                    @{chat.username}
                </Text>
                <Text className="text-sm text-muted-foreground" numberOfLines={1}>
                    {chat.lastMessage}
                </Text>
            </View>
            <Text className="text-xs text-muted-foreground">{chat.timestamp}</Text>
        </Pressable>
    );

    return (
        <View className="flex-1 bg-background flex-row">
            <View className="w-[40%] border-r border-border/60 bg-background">
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
                    <View className="flex-1 items-center justify-center py-16 px-6">
                        <Text className="text-lg font-black text-foreground text-center">No chats yet</Text>
                        <Text className="text-sm text-muted-foreground text-center mt-2">
                            Follow channels to start conversations
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={chats}
                        renderItem={renderChatItem}
                        keyExtractor={(item) => item.username}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>

            <View className="flex-1 items-center justify-center bg-muted/10">
                {selectedChat ? (
                    <View className="items-center w-full max-w-sm">
                        <View className="h-24 w-24 rounded-full bg-primary/10 items-center justify-center mb-6">
                            <Text className="text-primary font-black text-3xl">
                                {selectedChat.username.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        <Text className="text-3xl font-black text-foreground mb-1 tracking-tighter">
                            @{selectedChat.username}
                        </Text>
                        <Text className="text-muted-foreground text-lg mb-8">Ready to start chatting?</Text>

                        <View className="w-full gap-3">
                            <Pressable
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => { });
                                    router.push(`/${selectedChat.username}`);
                                }}
                                className="w-full py-4 rounded-2xl bg-primary items-center justify-center active:scale-[0.98] transition-transform"
                            >
                                <Text className="text-primary-foreground font-bold text-[16px]">Open Conversation</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
                                    router.push(`/${selectedChat.username}`);
                                }}
                                className="w-full py-4 rounded-2xl bg-transparent border border-border items-center justify-center active:bg-muted/20"
                            >
                                <Text className="text-foreground font-semibold text-[16px]">View Profile</Text>
                            </Pressable>
                        </View>
                    </View>
                ) : (
                    <View className="items-center max-w-md px-12">
                        <View className="w-20 h-20 rounded-3xl bg-primary/5 items-center justify-center mb-8 rotate-12">
                            <View className="w-16 h-16 rounded-2xl bg-primary/10 items-center justify-center -rotate-12">
                                <Text className="text-primary text-3xl">💬</Text>
                            </View>
                        </View>
                        <Text className="text-3xl font-black text-foreground mb-3 tracking-tighter text-center">Your conversations</Text>
                        <Text className="text-muted-foreground text-center text-lg leading-relaxed mb-10">
                            Select a chat from the sidebar to reach out to your friends and community.
                        </Text>

                        <Pressable
                            onPress={handleExplore}
                            className="bg-primary/10 px-8 py-4 rounded-full active:scale-95 transition-all"
                        >
                            <Text className="text-primary font-bold">Discover new channels</Text>
                        </Pressable>
                    </View>
                )}
            </View>
        </View>
    );
}
