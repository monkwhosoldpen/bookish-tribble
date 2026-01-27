import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/registry/components/ui/text';
import { Icon } from '@/registry/components/ui/icon';
import { Image } from 'expo-image';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useChannelContext } from './ChannelContext';
import { useToast } from '@/components/ui/toast';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

export function ChannelProfileSection() {
    const { channelData, username } = useChannelContext();
    const { showSuccess } = useToast();

    const handleCopyUsername = async () => {
        if (!username) return;

        await Clipboard.setStringAsync(username);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        showSuccess('Username copied to clipboard');
    };

    const displayName = channelData?.displayname || username;
    const bio = channelData?.description || 'No description available for this transmission node.';

    return (
        <View className="bg-card rounded-[24px] border border-border overflow-hidden shadow-lg shadow-black/10 my-4">
            {/* Banner */}
            <View className="h-24 bg-primary/20 relative">
                {channelData?.bannerurl && (
                    <Image
                        source={{ uri: channelData.bannerurl }}
                        className="absolute inset-0"
                        contentFit="cover"
                    />
                )}
                <View className="absolute inset-0 bg-black/10" />
            </View>

            {/* Profile Content */}
            <View className="px-5 pb-5">
                <View className="-mt-10 self-start">
                    <Image
                        source={{ uri: channelData?.avatarurl || 'https://via.placeholder.com/160' }}
                        className="w-20 h-20 rounded-2xl border-4 border-card bg-muted shadow-md"
                        contentFit="cover"
                    />
                    <View className="absolute -bottom-1 -right-1 bg-card rounded-full p-1 shadow-sm">
                        <Icon as={MaterialIcons} name="check-circle" size={16} className="text-primary" />
                    </View>
                </View>

                <View className="mt-4">
                    <Text className="text-xl font-black text-foreground leading-tight tracking-tight">
                        {displayName}
                    </Text>
                    <Pressable
                        onPress={handleCopyUsername}
                        className="flex-row items-center gap-2 mt-1 active:opacity-60"
                        accessibilityLabel={`Copy username ${username}`}
                        accessibilityRole="button"
                    >
                        <View className="bg-primary/10 px-1.5 py-0.5 rounded">
                            <Text className="text-[10px] font-black text-primary uppercase tracking-widest">
                                {channelData?.client_type || 'OFFICIAL'}
                            </Text>
                        </View>
                        <Text className="text-xs text-muted-foreground font-bold opacity-60">@{username}</Text>
                        <Icon as={MaterialIcons} name="content-copy" size={10} className="text-muted-foreground opacity-40" />
                    </Pressable>
                </View>

                {/* Identity Details */}
                <View className="mt-6">
                    <Text className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">Identity Details</Text>
                    <View className="bg-muted/30 rounded-2xl p-4 border border-border/50">
                        <Text className="text-xs text-foreground leading-relaxed font-medium">
                            {bio}
                        </Text>
                    </View>
                </View>

                {/* Status HUD */}
                <View className="mt-4 flex-row gap-3">
                    <View className="flex-1 bg-muted/30 rounded-xl p-3 border border-border/50 items-center">
                        <Text className="text-xs font-black text-foreground">1.2K</Text>
                        <Text className="text-[9px] font-bold text-muted-foreground uppercase">Followers</Text>
                    </View>
                    <View className="flex-1 bg-muted/30 rounded-xl p-3 border border-border/50 items-center">
                        <Text className="text-xs font-black text-foreground">843</Text>
                        <Text className="text-[9px] font-bold text-muted-foreground uppercase">Following</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}
