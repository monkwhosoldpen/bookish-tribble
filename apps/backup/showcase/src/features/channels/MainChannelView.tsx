import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { ChannelProfileSection } from './ChannelProfileSection';
import { ChannelFeedSection } from './ChannelFeedSection';
import { cn } from '@/registry/lib/utils';

export function MainChannelView() {
    const { width } = useWindowDimensions();
    const isDesktop = width >= 768;

    return (
        <View className="flex-1 bg-background p-4">
            <View className={cn(
                "flex-1 gap-4",
                isDesktop ? "flex-row" : "flex-col"
            )}>
                {/* Profile Card - 40% on Desktop */}
                <View className={cn(
                    "h-full",
                    isDesktop ? "w-[40%]" : "h-[450]"
                )}>
                    <ChannelProfileSection />
                </View>

                {/* Feed Section - 60% on Desktop */}
                <View className="flex-1 h-full">
                    <ChannelFeedSection />
                </View>
            </View>
        </View>
    );
}
