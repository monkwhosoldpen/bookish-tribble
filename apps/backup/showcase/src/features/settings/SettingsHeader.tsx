import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/components/ui/text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Icon } from '@/registry/components/ui/icon';
import { router } from 'expo-router';
import { Pressable } from 'react-native';

export function SettingsHeader() {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={{ paddingTop: insets.top }}
            className="bg-background/90 border-b border-zinc-100 dark:border-zinc-800 z-50 backdrop-blur-xl"
        >
            <View className="max-w-2xl mx-auto w-full h-12 flex-row items-center px-4 gap-8">
                <Pressable onPress={() => router.replace('/')} className="active:opacity-60">
                    <Icon as={MaterialIcons} name="arrow-back" size={20} className="text-foreground" />
                </Pressable>
                <View>
                    <Text className="text-[19px] font-black tracking-tight leading-none">Settings</Text>
                    <Text className="text-[13px] text-zinc-500 font-normal mt-0.5">@admin</Text>
                </View>
            </View>
        </View>
    );
}
