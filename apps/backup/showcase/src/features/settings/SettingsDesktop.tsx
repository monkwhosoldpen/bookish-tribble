import * as React from 'react';
import { View, ScrollView, Pressable, ActivityIndicator, Switch } from 'react-native';
import { Text } from '@/registry/components/ui/text';
import { cn } from '@/registry/lib/utils';
import { useColorScheme } from 'nativewind';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';
import { PWAInstallSection } from '@/components/PWAInstallSection';
import { useNotifications } from '@/hooks/useNotifications';
import { PREFERENCE_KEYS } from '@/features/settings/constants';
import { NotificationDebugNative } from '@/components/notifications/NotificationDebugNative';
import { Platform } from 'react-native';

type IconComponent = typeof MaterialIcons;

export function SettingsDesktop({ onSignOut }: { onSignOut: () => Promise<void> }) {
    const { colorScheme, setColorScheme } = useColorScheme();
    const [isSigningOut, setIsSigningOut] = React.useState(false);
    const { preferences, updatePreference } = useNotifications();

    
    const handleSignOut = async () => {
        setIsSigningOut(true);
        try {
            await onSignOut();
        } finally {
            setIsSigningOut(false);
        }
    };

    const handleNotificationToggle = (value: boolean) => {
        Haptics.selectionAsync();
        updatePreference(PREFERENCE_KEYS.GLOBAL, value);
    };

    return (
        <View className="flex-1 bg-background">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerClassName="flex-grow items-center"
            >
                <View className="w-full max-w-4xl px-10 py-16 lg:px-20 lg:py-24">

                    {/* Desktop Grid Layout */}
                    <View className="flex-row flex-wrap gap-4">
                        <View className="w-full lg:w-[48%]">
                            <SettingsSwitchRow
                                icon={MaterialIcons}
                                label="Notifications"
                                description={preferences?.[PREFERENCE_KEYS.GLOBAL] ? "Push notifications enabled" : "Push notifications disabled"}
                                value={preferences?.[PREFERENCE_KEYS.GLOBAL] ?? false}
                                onValueChange={handleNotificationToggle}
                            />
                        </View>
                        
                        {/* Native-only Debug Panel */}
                        {Platform.OS !== 'web' && (
                            <View className="w-full lg:w-[48%]">
                                <View className="rounded-3xl border border-orange-500/20 bg-orange-50/40 dark:bg-orange-950/15 p-4">
                                    <NotificationDebugNative />
                                </View>
                            </View>
                        )}
                        <View className="w-full lg:w-[48%]">
                            <SettingsSwitchRow
                                icon={MaterialIcons}
                                label="Display theme"
                                description={colorScheme === 'dark' ? 'Dark mode active' : 'Light mode active'}
                                value={colorScheme === 'dark'}
                                onValueChange={(value: boolean) => setColorScheme(value ? 'dark' : 'light')}
                            />
                        </View>
                        <View className="w-full lg:w-[48%]">
                            <SettingsRow
                                icon={MaterialIcons}
                                label="Log out"
                                description="Terminate session"
                                onPress={handleSignOut}
                                isLoading={isSigningOut}
                                isDestructive
                            />
                        </View>
                    </View>

                    <View className="my-8 w-full max-w-sm">
                        <PWAInstallSection />
                    </View>

                </View>
                <View className="h-48" />
            </ScrollView>
        </View>
    );
}

function SettingsRow({
    icon: IconComp,
    label,
    description,
    onPress,
    isDestructive,
    isLoading
}: {
    icon: IconComponent;
    label: string;
    description: string;
    onPress?: () => void;
    isDestructive?: boolean;
    isLoading?: boolean;
}) {
    return (
        <Pressable
            onPress={onPress}
            disabled={isLoading}
            className={cn(
                "flex-row items-center gap-4 py-5 px-5 rounded-[2.5rem] border transition-colors",
                isDestructive
                    ? "border-red-100 dark:border-red-950/30 bg-red-50/30 dark:bg-red-950/10"
                    : "border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/40",
                "active:bg-zinc-100 dark:active:bg-zinc-800"
            )}
        >
            <View className={cn(
                "w-12 h-12 rounded-2xl items-center justify-center",
                isDestructive ? "bg-red-500/10" : "bg-white dark:bg-zinc-800 shadow-sm"
            )}>
                {isLoading ? (
                    <ActivityIndicator size="small" color={isDestructive ? "#ef4444" : undefined} />
                ) : (
                    <IconComp size={22} className={cn(isDestructive ? "text-red-500" : "text-primary")} />
                )}
            </View>
            <View className="flex-1">
                <Text className={cn("text-[17px] font-black tracking-tight", isDestructive && "text-red-500")}>{label}</Text>
                <View className="flex-row items-center gap-1.5">
                    <Text className="text-[13px] text-zinc-500 font-medium" numberOfLines={1}>{description}</Text>
                </View>
            </View>
            <MaterialIcons name="chevron-right" size={18} className={cn(isDestructive ? "text-red-300" : "text-zinc-300 dark:text-zinc-700")} />
        </Pressable>
    )
}

function SettingsSwitchRow({
    icon: IconComp,
    label,
    description,
    value,
    onValueChange
}: {
    icon: IconComponent;
    label: string;
    description: string;
    value: boolean;
    onValueChange: (val: boolean) => void;
}) {
    return (
        <View className={cn(
            "flex-row items-center gap-4 py-5 px-5 rounded-[2.5rem] border transition-colors border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/40"
        )}>
            <View className="w-12 h-12 rounded-2xl items-center justify-center bg-white dark:bg-zinc-800 shadow-sm">
                <IconComp size={22} className="text-primary" />
            </View>
            <View className="flex-1">
                <Text className="text-[17px] font-black tracking-tight">{label}</Text>
                <View className="flex-row items-center gap-1.5">
                    <Text className="text-[13px] text-zinc-500 font-medium" numberOfLines={1}>{description}</Text>
                </View>
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: 'hsl(214.3 31.8% 91.4%)', true: 'hsl(221.2 83.2% 53.3%)' }}
                thumbColor={'hsl(0 0% 100%)'}
                ios_backgroundColor="hsl(214.3 31.8% 91.4%)"
            />
        </View>
    )
}
