import * as React from 'react';
import { View, Pressable, FlatList } from 'react-native';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useHomeFeed, ChatTab, ChatItem } from '@/hooks/useHomeFeed';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Icon } from '@/components/ui/Icon';
import { useColorScheme } from 'nativewind';
import { COLOR_TOKENS } from '@/lib/design-tokens';

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
    const { colorScheme } = useColorScheme();
    const mutedColor = colorScheme === 'dark' ? COLOR_TOKENS.dark.muted : COLOR_TOKENS.light.muted;
    const secondaryColor = colorScheme === 'dark' ? COLOR_TOKENS.dark.secondary : COLOR_TOKENS.light.secondary;

    const handleChatSelect = (chat: ChatItem) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
        setSelectedChat(chat);
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
                'flex-row items-center py-3 px-4',
                selectedChat?.username === chat.username
                    ? 'bg-foreground/5'
                    : 'active:bg-foreground/5'
            )}
        >
            {/* Avatar */}
            <View className="h-12 w-12 rounded-full items-center justify-center mr-3 bg-primary">
                <Text className="text-white font-bold text-lg">
                    {chat.username.charAt(0).toUpperCase()}
                </Text>
            </View>
            {/* Content */}
            <View className="flex-1 border-b border-border/15 pb-3">
                <View className="flex-row items-center justify-between">
                    <Text className="text-[16px] font-normal text-foreground">
                        {chat.username}
                    </Text>
                    <Text
                        className="text-[12px]"
                        style={{ color: chat.unreadCount ? COLOR_TOKENS.primary : mutedColor }}
                    >
                        {chat.timestamp}
                    </Text>
                </View>
                <View className="flex-row items-center justify-between mt-1">
                    <View className="flex-row items-center flex-1 mr-4">
                        <Icon as={MaterialIcons} name="done-all" size={16} color={COLOR_TOKENS.primary} style={{ marginRight: 3 }} />
                        <Text className="text-[13px] text-muted-foreground flex-1" numberOfLines={1}>
                            {chat.lastMessage}
                        </Text>
                    </View>
                    {chat.unreadCount ? (
                        <View className="min-w-[20px] h-5 rounded-full items-center justify-center px-1.5 bg-primary">
                            <Text className="text-white text-xs font-bold">
                                {chat.unreadCount}
                            </Text>
                        </View>
                    ) : null}
                </View>
            </View>
        </Pressable>
    );

    return (
        <View className="flex-1 bg-background flex-row">
            {/* Left sidebar - chat list */}
            <View className="w-[35%] min-w-[320px] max-w-[420px] border-r border-border/30 bg-background">
                {/* Sidebar header */}
                <View className="h-[60px] flex-row items-center justify-between px-4 border-b border-border/20">
                    <View className="h-10 w-10 rounded-full items-center justify-center bg-primary">
                        <Text className="text-white font-bold text-base">U</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                        <Pressable className="w-10 h-10 rounded-full items-center justify-center active:bg-foreground/5">
                            <Icon as={MaterialIcons} name="chat" size={22} className="text-muted-foreground" />
                        </Pressable>
                        <Pressable className="w-10 h-10 rounded-full items-center justify-center active:bg-foreground/5">
                            <Icon as={MaterialIcons} name="more-vert" size={22} className="text-muted-foreground" />
                        </Pressable>
                    </View>
                </View>

                {/* Search bar */}
                <View className="px-3 py-2">
                    <View className="flex-row items-center bg-foreground/5 rounded-lg px-3 py-2 gap-3">
                        <Icon as={MaterialIcons} name="search" size={20} className="text-muted-foreground" />
                        <Text className="text-[14px] text-muted-foreground">Search or start new chat</Text>
                    </View>
                </View>

                {/* Tabs */}
                <View className="flex-row px-3 pb-1 gap-2">
                    {(['following', 'invites', 'favourites'] as ChatTab[]).map((tab) => (
                        <Pressable
                            key={tab}
                            onPress={() => handleTabChange(tab)}
                            className={cn(
                                'px-3 py-1.5 rounded-full',
                                activeTab === tab
                                    ? 'bg-primary/10'
                                    : 'bg-foreground/5'
                            )}
                        >
                            <View className="flex-row items-center gap-1">
                                <Text
                                    className={cn(
                                        'text-[13px] font-medium capitalize',
                                        activeTab === tab
                                            ? 'font-bold'
                                            : 'text-muted-foreground'
                                    )}
                                    style={activeTab === tab ? { color: COLOR_TOKENS.primary } : undefined}
                                >
                                    {tab}
                                </Text>
                                {counts[tab] > 0 && (
                                    <View className="min-w-[16px] h-4 rounded-full items-center justify-center px-1 bg-primary">
                                        <Text className="text-white text-[10px] font-bold">
                                            {counts[tab] > 99 ? '99+' : counts[tab]}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </Pressable>
                    ))}
                </View>

                {/* Chat list */}
                <View className="flex-1">
                    {chats.length === 0 ? (
                        <View className="flex-1 items-center justify-center px-6">
                            <Text className="text-lg font-bold text-foreground text-center">No chats yet</Text>
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
            </View>

            {/* Right panel - chat detail / empty state */}
            <View className="flex-1 items-center justify-center bg-secondary">
                {selectedChat ? (
                    <View className="items-center w-full max-w-sm">
                        <View className="h-24 w-24 rounded-full items-center justify-center mb-6 bg-primary">
                            <Text className="text-white font-bold text-3xl">
                                {selectedChat.username.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        <Text className="text-3xl font-bold text-foreground mb-1 tracking-tight">
                            {selectedChat.username}
                        </Text>
                        <Text className="text-muted-foreground text-lg mb-8">Ready to start chatting?</Text>

                        <View className="w-full gap-3">
                            <Pressable
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => { });
                                    router.push(`/${selectedChat.username}`);
                                }}
                                className="w-full py-4 rounded-xl items-center justify-center active:scale-[0.98] bg-primary"
                            >
                                <Text className="text-white font-bold text-[16px]">Open Conversation</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
                                    router.push(`/${selectedChat.username}`);
                                }}
                                className="w-full py-4 rounded-xl bg-transparent border border-border items-center justify-center active:bg-muted/20"
                            >
                                <Text className="text-foreground font-semibold text-[16px]">View Profile</Text>
                            </Pressable>
                        </View>
                    </View>
                ) : (
                    <View className="items-center max-w-md px-12">
                        <View className="w-[320px] h-[200px] items-center justify-center mb-6">
                            <Icon as={MaterialIcons} name="lock" size={18} color={mutedColor} />
                        </View>
                        <Text className="text-[32px] font-light text-foreground/70 mb-3 text-center tracking-tight">
                            Showcase Web
                        </Text>
                        <Text className="text-muted-foreground text-center text-[14px] leading-5 mb-8">
                            Send and receive messages without keeping your phone online.{'\n'}
                            Use Showcase on up to 4 linked devices and 1 phone at the same time.
                        </Text>

                        <View className="flex-row items-center gap-1.5">
                            <Icon as={MaterialIcons} name="lock" size={12} color={mutedColor} />
                            <Text className="text-[13px] text-muted-foreground">End-to-end encrypted</Text>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}
