import { useLocalSearchParams, Slot } from 'expo-router';
import { ChannelProvider } from '@/features/channels/ChannelContext';
import { Entity } from '@/features/channels/types';
import { View, Pressable } from 'react-native';
import { ChannelSidebar } from '@/features/channels/ChannelSidebar';
import * as React from 'react';
import { Text } from '@/registry/components/ui/text';
import { Icon } from '@/registry/components/ui/icon';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useChannelContext } from '@/features/channels/ChannelContext';

function ChannelHeader() {
    const { channelData, sidebarChannels, selectedIndex } = useChannelContext();
    const router = useRouter();
    const selectedChannel = sidebarChannels[selectedIndex];

    const isMain = !selectedChannel || selectedChannel.id === 'main';
    const title = isMain ? (channelData?.displayname || 'Channel') : selectedChannel.name;
    const subtitle = isMain ? 'Official Channel' : 'Secure Frequency';

    return (
        <View className="h-14 flex-row items-center px-4 border-b border-border/50 bg-background/95 backdrop-blur-xl z-50">
            <Pressable
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.back();
                }}
                className="mr-4 p-1 rounded-full active:bg-muted/50"
            >
                <Icon as={MaterialIcons} name="arrow-back" size={20} className="text-foreground" />
            </Pressable>
            <View>
                <Text className="text-base font-black tracking-tight">{title}</Text>
                <Text className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">{subtitle}</Text>
            </View>
        </View>
    );
}

function ChannelLayoutContent() {
    return (
        <View className="flex-1 bg-background">
            <ChannelHeader />
            <View className="flex-1 flex-row">
                <ChannelSidebar />
                <View className="flex-1">
                    <Slot />
                </View>
            </View>
        </View>
    );
}

export default function ChannelLayout() {
    const { username } = useLocalSearchParams();

    // Mock data for the entity
    const channelData = React.useMemo<Entity>(() => ({
        username: typeof username === 'string' ? username : 'unknown',
        displayname: typeof username === 'string' ? username.charAt(0).toUpperCase() + username.slice(1) : 'Username',
        description: 'Digital creator and tech enthusiast. Building the future of social media through decentralized transmission nodes.',
        avatarurl: 'https://via.placeholder.com/160',
        bannerurl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1000',
        client_type: 'managed',
    }), [username]);

    return (
        <ChannelProvider
            username={typeof username === 'string' ? username : 'unknown'}
            channelData={channelData}
        >
            <ChannelLayoutContent />
        </ChannelProvider>
    );
}
