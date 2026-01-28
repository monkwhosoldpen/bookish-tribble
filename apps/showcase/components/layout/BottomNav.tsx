import * as React from 'react';
import { View, Pressable } from 'react-native';
import { cn } from '@/registry/nativewind/lib/utils';
import { Text } from '@/registry/nativewind/components/ui/text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColorScheme } from 'nativewind';
import { COLOR_TOKENS } from '@/lib/design-tokens';

export type TabType = 'home' | 'explore' | 'settings';

type IconComponent = typeof MaterialIcons;

interface BottomNavProps {
    activeTab: TabType;
}

export const BottomNav = React.memo(function BottomNav({ activeTab }: BottomNavProps) {
    const insets = useSafeAreaInsets();

    const handlePress = (tab: TabType) => {
        if (tab === activeTab) return;

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });

        switch (tab) {
            case 'home':
                router.replace('/(tabs)/home');
                break;
            case 'explore':
                router.replace('/(tabs)/explore');
                break;
            case 'settings':
                router.replace('/(tabs)/settings');
                break;
            default:
                break;
        }
    };

    return (
        <View
            style={{ paddingBottom: Math.max(insets.bottom, 2) }}
            className="bg-background border-t border-border/30"
        >
            <View className="max-w-2xl mx-auto w-full h-14 flex-row justify-around items-center px-2">
                <NavIcon
                    icon={MaterialIcons}
                    label="Chats"
                    iconName="chat"
                    active={activeTab === 'home'}
                    onPress={() => handlePress('home')}
                />
                <NavIcon
                    icon={MaterialIcons}
                    label="Updates"
                    iconName="donut-large"
                    active={activeTab === 'explore'}
                    onPress={() => handlePress('explore')}
                />
                <NavIcon
                    icon={MaterialIcons}
                    label="Settings"
                    iconName="settings"
                    active={activeTab === 'settings'}
                    onPress={() => handlePress('settings')}
                />
            </View>
        </View>
    );
});

function NavIcon({ icon: Icon, label, active, onPress, iconName }: { icon: IconComponent, label: string, active: boolean, onPress: () => void, iconName: string }) {
    const { colorScheme } = useColorScheme();
    const mutedColor = colorScheme === 'dark' ? COLOR_TOKENS.dark.muted : COLOR_TOKENS.light.muted;

    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="tab"
            accessibilityLabel={label}
            accessibilityState={{ selected: active }}
            className="items-center justify-center flex-1 h-full active:opacity-80"
        >
            <View className={cn(
                "w-16 h-8 items-center justify-center rounded-full mb-0.5",
                active && "bg-primary/10"
            )}>
                <Icon
                    name={iconName as any}
                    size={22}
                    color={active ? COLOR_TOKENS.primary : mutedColor}
                />
            </View>
            <Text
                className="text-[11px] font-medium"
                style={{ color: active ? COLOR_TOKENS.primary : mutedColor }}
            >
                {label}
            </Text>
        </Pressable>
    );
}
