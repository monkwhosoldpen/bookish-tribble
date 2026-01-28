import React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/nativewind/components/ui/text';
import { Icon } from '@/components/ui/Icon';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export function ExploreHeader() {
    return (
        <View className="h-14 flex-row items-center justify-between px-4 border-b border-border/50 bg-background/95 backdrop-blur-xl">
            <View className="flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center">
                    <Icon as={MaterialIcons} name="explore" size={16} className="text-primary" />
                </View>
                <Text className="text-lg font-black tracking-tight">Explore</Text>
            </View>
            <View className="w-8 h-8" />
        </View>
    );
}
