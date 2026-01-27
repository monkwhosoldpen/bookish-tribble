import * as React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/registry/components/ui/text';
import { Icon } from '@/registry/components/ui/icon';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export function ShowcaseHeader() {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={{ paddingTop: insets.top }}
            className="bg-background/80 border-b border-border z-50 backdrop-blur-xl"
        >
            <View className="max-w-2xl mx-auto w-full h-14 flex-row items-center justify-between px-6">
                <View className="flex-row items-center gap-2">
                    <View className="w-8 h-8 rounded-lg bg-primary items-center justify-center">
                        <Icon as={MaterialIcons} name="dashboard" size={18} className="text-primary-foreground" />
                    </View>
                    <Text className="text-xl font-black tracking-tighter text-foreground">SHOWCASE</Text>
                </View>
            </View>
        </View>
    );
}

