import React from 'react';
import { View, Switch } from 'react-native';
import { Text } from '@/registry/nativewind/components/ui/text';
import { Icon } from '@/components/ui/Icon';
import { useColorScheme } from 'nativewind';
import { COLOR_TOKENS } from '@/lib/design-tokens';

interface PreferenceRowProps {
    label: string;
    description: string;
    icon: any;
    value: boolean;
    onValueChange: (value: boolean) => void;
}

export function PreferenceRow({
    label,
    description,
    icon: IconComp,
    value,
    onValueChange
}: PreferenceRowProps) {
    const { colorScheme } = useColorScheme();
    const borderColor = colorScheme === 'dark' ? COLOR_TOKENS.dark.border : COLOR_TOKENS.light.border;

    return (
        <View className="flex-row items-center gap-4 p-4 bg-card rounded-xl border border-border">
            <View className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 items-center justify-center">
                <Icon as={IconComp} name="notifications" size={18} className="text-primary" />
            </View>

            <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">{label}</Text>
                <Text className="text-sm text-muted-foreground mt-0.5">{description}</Text>
            </View>

            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: borderColor, true: COLOR_TOKENS.primary }}
                thumbColor={'#FFFFFF'}
                ios_backgroundColor={borderColor}
            />
        </View>
    );
}
