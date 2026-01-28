import * as React from 'react';
import { View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/registry/nativewind/components/ui/text';
import { Icon } from '@/components/ui/Icon';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export function ShowcaseHeader() {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={{ paddingTop: insets.top, backgroundColor: '#075E54' }}
            className="z-50"
        >
            <View className="h-[56px] flex-row items-center justify-between px-4">
                <Text className="text-[20px] font-bold text-white tracking-tight">
                    Showcase
                </Text>
                <View className="flex-row items-center gap-1">
                    <Pressable className="w-10 h-10 rounded-full items-center justify-center active:bg-white/10">
                        <Icon as={MaterialIcons} name="camera-alt" size={22} className="text-white" />
                    </Pressable>
                    <Pressable className="w-10 h-10 rounded-full items-center justify-center active:bg-white/10">
                        <Icon as={MaterialIcons} name="search" size={22} className="text-white" />
                    </Pressable>
                    <Pressable className="w-10 h-10 rounded-full items-center justify-center active:bg-white/10">
                        <Icon as={MaterialIcons} name="more-vert" size={22} className="text-white" />
                    </Pressable>
                </View>
            </View>
        </View>
    );
}
