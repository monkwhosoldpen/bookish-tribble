import React from 'react';
import { View } from 'react-native';
import { MainChannelView } from './MainChannelView';
import { ChannelSidebar } from './ChannelSidebar';
import { useWindowDimensions } from 'react-native';

export function ChannelPageContent() {
    const { width } = useWindowDimensions();
    const isDesktop = width >= 1024;

    if (isDesktop) {
        return (
            <View className="flex-1 flex-row">
                <ChannelSidebar />
                <MainChannelView />
            </View>
        );
    }

    return <MainChannelView />;
}
