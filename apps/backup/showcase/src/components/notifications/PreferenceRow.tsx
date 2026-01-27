import React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/components/ui/text';
import { Switch } from '@/registry/components/ui/switch';
import { Icon } from '@/registry/components/ui/icon';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export interface PreferenceRowProps {
    label: string;
    description: string;
    icon: any;
    value: boolean;
    onValueChange: (val: boolean) => void;
}

export function PreferenceRow({
    label,
    description,
    value,
    onValueChange
}: PreferenceRowProps) {
    return (
        <View className="flex-row items-center justify-between p-6 rounded-none bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
            <View className="flex-row items-center flex-1 gap-4">
                <View className="w-12 h-12 rounded-none bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 items-center justify-center">
                    <Icon as={MaterialIcons} name="settings" size={20} className="text-primary" />
                </View>
                <View className="flex-1">
                    <Text className="text-[14px] font-mono font-bold tracking-tighter uppercase">{label}</Text>
                    <Text className="text-[12px] text-zinc-500 font-mono tracking-widest uppercase mt-0.5" numberOfLines={1}>{description}</Text>
                </View>
            </View>
            <Switch
                checked={value}
                onCheckedChange={onValueChange}
            />
        </View>
    );
}
