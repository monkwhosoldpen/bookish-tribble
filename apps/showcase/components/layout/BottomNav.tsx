import * as React from 'react';
import { View, Pressable } from 'react-native';
import { cn } from '@/registry/nativewind/lib/utils';
import { Text } from '@/registry/nativewind/components/ui/text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export type TabType = 'home' | 'settings';

type IconComponent = typeof MaterialIcons;

interface BottomNavProps {
    activeTab: TabType;
}

export const BottomNav = React.memo(function BottomNav({ activeTab }: BottomNavProps) {
    const insets = useSafeAreaInsets();

    const handlePress = (tab: TabType) => {
        if (tab === activeTab) return;

        // Add haptic feedback
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });

        switch (tab) {
            case 'home':
                router.replace('/(tabs)/home');
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
            className="bg-background/95 backdrop-blur-sm border-t border-border/20"
        >
            <View className="max-w-2xl mx-auto w-full h-14 flex-row justify-around items-center px-2">
                <NavIcon
                    icon={MaterialIcons}
                    label="Home"
                    iconName="home"
                    active={activeTab === 'home'}
                    onPress={() => handlePress('home')}
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
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="tab"
            accessibilityLabel={label}
            accessibilityState={{ selected: active }}
            className="items-center justify-center flex-1 h-full active:opacity-80 transition-all duration-200"
        >
            <View className={cn(
                "w-9 h-9 items-center justify-center transition-all duration-200 mb-0.5",
                active ? "scale-110" : "scale-100"
            )}>
                <Icon
                    name={iconName as any}
                    size={20}
                    className={cn(
                        "transition-all duration-200",
                        active ? "text-primary" : "text-muted-foreground"
                    )}
                />
            </View>
            <Text className={cn(
                "text-[10px] font-medium uppercase tracking-wide transition-all duration-200",
                active ? "text-primary font-semibold" : "text-muted-foreground/70"
            )}>
                {label}
            </Text>
        </Pressable>
    );
}
