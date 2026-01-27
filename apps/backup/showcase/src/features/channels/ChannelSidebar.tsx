import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { Text } from '@/registry/components/ui/text';
import { Icon } from '@/registry/components/ui/icon';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useChannelContext } from './ChannelContext';
import { SidebarChannelItem } from './SidebarChannelItem';
import { cn } from '@/registry/lib/utils';
import * as Haptics from 'expo-haptics';

export function ChannelSidebar() {
    const {
        sidebarChannels,
        selectedIndex,
        handleChannelSelect,
        sidebarOpen,
        toggleSidebar
    } = useChannelContext();

    const handleToggle = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        toggleSidebar();
    };

    return (
        <View className={cn(
            "h-full bg-background border-r border-border transition-all duration-300",
            sidebarOpen ? "w-64" : "w-20"
        )}>
            {/* Sidebar Header */}
            <View className="h-14 flex-row items-center px-4 border-b border-border/50">
                <Pressable
                    onPress={handleToggle}
                    className="p-1.5 rounded-full active:bg-muted/50"
                >
                    <Icon
                        as={MaterialIcons}
                        name={sidebarOpen ? "menu-open" : "menu"}
                        size={22}
                        className="text-muted-foreground"
                    />
                </Pressable>
                {sidebarOpen && (
                    <Text className="ml-3 font-black text-sm uppercase tracking-widest text-foreground">
                        Channels
                    </Text>
                )}
            </View>

            {/* Channel List */}
            <ScrollView className="flex-1 pt-4" showsVerticalScrollIndicator={false}>
                {sidebarChannels.map((channel, index) => (
                    <SidebarChannelItem
                        key={channel.id}
                        channel={channel}
                        isSelected={selectedIndex === index}
                        isOpen={sidebarOpen}
                        onSelect={() => handleChannelSelect(index)}
                    />
                ))}
            </ScrollView>
        </View>
    );
}
