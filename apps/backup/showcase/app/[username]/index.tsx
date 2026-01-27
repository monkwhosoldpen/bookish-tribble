import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/registry/components/ui/text';
import { Icon } from '@/registry/components/ui/icon';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useChannelContext } from '@/features/channels/ChannelContext';
import { MainChannelView } from '@/features/channels/MainChannelView';
import * as Haptics from 'expo-haptics';

function ChannelIndexContent() {
    const { sidebarChannels, selectedIndex, handleBackToMain } = useChannelContext();

    const selectedChannel = sidebarChannels[selectedIndex];

    // If a non-main channel is selected, show the "Syncing" view instead of the dashboard
    // This replicates the logic from the previous ChannelPageContent
    if (selectedChannel && selectedChannel.id !== 'main') {
        return (
            <View className="flex-1">

                <View className="flex-1 items-center justify-center p-10">
                    <View className="w-16 h-16 rounded-[24px] bg-primary/10 items-center justify-center mb-6">
                        <Icon as={MaterialIcons} name="construction" size={32} className="text-primary" />
                    </View>
                    <Text className="text-lg font-black text-foreground text-center">Transmission Point: {selectedChannel.name}</Text>
                    <Text className="text-sm text-muted-foreground text-center mt-2 max-w-[280px]">
                        This frequency is currently being synchronized. Secure tunnel establishes in 3... 2... 1...
                    </Text>
                    <Pressable
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            handleBackToMain();
                        }}
                        className="mt-8 px-8 py-3 bg-primary rounded-full shadow-lg shadow-primary/20"
                    >
                        <Text className="text-white font-bold">Return to Main</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1">

            {/* Dashboard Content */}
            <MainChannelView />
        </View>
    );
}

export default function ChannelIndex() {
    return <ChannelIndexContent />;
}
