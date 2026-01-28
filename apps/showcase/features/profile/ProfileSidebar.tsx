import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { Text } from '@/registry/nativewind/components/ui/text';
import { Icon } from '@/components/ui/Icon';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useProfileContext } from './ProfileContext';
import { cn } from '@/registry/nativewind/lib/utils';
import { useFeedback } from '@/hooks/useFeedback';

export function ProfileSidebar() {
    const {
        sidebarChannels,
        selectedIndex,
        handleChannelSelect,
        sidebarOpen,
        toggleSidebar
    } = useProfileContext();

    const { impact } = useFeedback();

    const handleToggle = () => {
        impact();
        toggleSidebar();
    };

    return (
        <View className={cn(
            "h-full bg-background border-r border-border transition-all duration-300",
            sidebarOpen ? "w-64" : "w-20"
        )}>
            {/* Sidebar Header */}
            <View className="h-14 flex-row items-center justify-between px-4 border-b border-border/50">
                {sidebarOpen && (
                    <Text className="text-sm font-semibold text-foreground">Channels</Text>
                )}
                <Pressable
                    onPress={handleToggle}
                    className="p-2 rounded-full active:bg-muted/50"
                >
                    <Icon 
                        as={MaterialIcons} 
                        name={sidebarOpen ? "menu-open" : "menu"} 
                        size={20} 
                        className="text-foreground" 
                    />
                </Pressable>
            </View>

            {/* Channel List */}
            <ScrollView 
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerClassName="p-2"
            >
                {sidebarChannels.map((channel, index) => (
                    <SidebarChannelItem
                        key={channel.id}
                        channel={channel}
                        isSelected={index === selectedIndex}
                        isCollapsed={!sidebarOpen}
                        onPress={() => handleChannelSelect(index)}
                    />
                ))}
            </ScrollView>
        </View>
    );
}

interface SidebarChannelItemProps {
    channel: {
        id: string;
        name: string;
        type: string;
        icon?: string;
        avatarurl?: string;
        unread_count?: number;
    };
    isSelected: boolean;
    isCollapsed: boolean;
    onPress: () => void;
}

function SidebarChannelItem({ 
    channel, 
    isSelected, 
    isCollapsed, 
    onPress 
}: SidebarChannelItemProps) {
    const { impact } = useFeedback();

    const handlePress = () => {
        impact();
        onPress();
    };

    return (
        <Pressable
            onPress={handlePress}
            className={cn(
                "flex-row items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors",
                isSelected 
                    ? "bg-primary/10 border border-primary/20" 
                    : "hover:bg-muted/50 active:bg-muted/70"
            )}
        >
            {/* Channel Icon */}
            <View className={cn(
                "w-8 h-8 rounded-lg items-center justify-center",
                isSelected ? "bg-primary/20" : "bg-muted/50"
            )}>
                <Icon 
                    as={MaterialIcons} 
                    name={getChannelIcon(channel.type)} 
                    size={16} 
                    className={isSelected ? "text-primary" : "text-muted-foreground"} 
                />
            </View>

            {/* Channel Name (shown when expanded) */}
            {!isCollapsed && (
                <View className="flex-1">
                    <Text className={cn(
                        "text-sm font-medium",
                        isSelected ? "text-primary" : "text-foreground"
                    )}>
                        {channel.name}
                    </Text>
                </View>
            )}

            {/* Unread Count Badge */}
            {!isCollapsed && channel.unread_count && channel.unread_count > 0 && (
                <View className="bg-destructive rounded-full px-2 py-0.5 min-w-[20px] items-center justify-center">
                    <Text className="text-xs text-destructive-foreground font-semibold">
                        {channel.unread_count > 99 ? "99+" : channel.unread_count}
                    </Text>
                </View>
            )}
        </Pressable>
    );
}

function getChannelIcon(type: string): string {
    switch (type) {
        case 'main':
            return 'home';
        case 'social':
            return 'people';
        case 'child':
            return 'account-tree';
        case 'ai_agent':
            return 'smart-toy';
        case 'public':
            return 'public';
        case 'broadcast':
            return 'campaign';
        default:
            return 'tag';
    }
}
