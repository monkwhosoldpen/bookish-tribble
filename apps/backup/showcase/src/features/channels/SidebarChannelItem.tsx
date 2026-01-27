import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/registry/components/ui/text';
import { Icon } from '@/registry/components/ui/icon';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SidebarChannel } from './types';
import * as Haptics from 'expo-haptics';
import { cn } from '@/registry/lib/utils';

interface SidebarChannelItemProps {
    channel: SidebarChannel;
    isSelected: boolean;
    isOpen: boolean;
    onSelect: () => void;
}

export function SidebarChannelItem({ channel, isSelected, isOpen, onSelect }: SidebarChannelItemProps) {
    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onSelect();
    };

    const getIcon = () => {
        switch (channel.type) {
            case 'main': return 'home';
            case 'social': return 'public';
            case 'broadcast': return 'podcasts';
            case 'public': return 'groups';
            case 'ai_agent': return 'smart_toy';
            default: return 'hash';
        }
    };

    return (
        <Pressable
            onPress={handlePress}
            className={cn(
                "flex-row items-center px-3 py-2.5 mx-2 rounded-xl transition-colors",
                isSelected ? "bg-primary/10" : "active:bg-muted/50"
            )}
        >
            <View className={cn(
                "w-10 h-10 rounded-xl items-center justify-center mr-3",
                isSelected ? "bg-primary text-primary-foreground" : "bg-muted/20 text-muted-foreground"
            )}>
                {/* @ts-ignore */}
                <Icon as={MaterialIcons} name={getIcon()} size={20} color={isSelected ? "white" : undefined} />
            </View>

            {isOpen && (
                <View className="flex-1 flex-row items-center justify-between">
                    <Text className={cn(
                        "text-sm font-bold",
                        isSelected ? "text-primary" : "text-foreground"
                    )}>
                        {channel.name}
                    </Text>

                    {channel.unread_count && (
                        <View className="bg-destructive px-1.5 py-0.5 rounded-full">
                            <Text className="text-[10px] font-black text-destructive-foreground">
                                {channel.unread_count}
                            </Text>
                        </View>
                    )}
                </View>
            )}

            {!isOpen && channel.unread_count && (
                <View className="absolute top-1 right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background" />
            )}
        </Pressable>
    );
}
