import React from 'react';
import { View, Pressable, ActivityIndicator } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { cn } from '@/registry/lib/utils';
import { Icon } from '@/registry/components/ui/icon';
import { Text } from '@/registry/components/ui/text';
import { useNotifications } from '@/contexts/NotificationContext';
import { PreferenceRow } from '@/components/notifications/PreferenceRow';
import { PREFERENCE_KEYS } from '@/features/settings/constants';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
    interpolate,
    FadeInDown
} from 'react-native-reanimated';

export const NotificationSectionWeb = React.memo(function NotificationSectionWeb() {
    const pulseValue = useSharedValue(0);

    React.useEffect(() => {
        pulseValue.value = withRepeat(
            withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const {
        enabled,
        isRegistering,
        pushToken: token,
        enable,
        disable,
        preferences,
        updatePreference
    } = useNotifications();

    const onToggle = async () => {
        if (enabled) {
            await disable();
        } else {
            await enable();
        }
    };

    return (
        <View className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900/50 rounded-[2.5rem] px-6 py-8 mx-4 my-4 shadow-sm shadow-black/5">
            <View className="flex-row items-center gap-3 mb-6">
                <View className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 items-center justify-center">
                    <Icon as={MaterialIcons} name="public" size={20} className="text-primary" />
                </View>
                <View>
                    <Text className="text-xl font-black tracking-tighter">Live Pulse</Text>
                    <Text className="text-[12px] text-zinc-400 font-bold uppercase tracking-[0.15em]">Global Delivery</Text>
                </View>
            </View>

            <View className={cn(
                "p-6 rounded-3xl border mb-6",
                enabled ? "bg-primary/5 border-primary/20" : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
            )}>
                <View className="flex-row items-center gap-4 mb-4">
                    <Animated.View
                        entering={FadeInDown.duration(800)}
                        style={useAnimatedStyle(() => ({
                            opacity: interpolate(pulseValue.value, [0, 1], [0.4, 1]),
                            transform: [{ scale: interpolate(pulseValue.value, [0, 1], [0.9, 1.1]) }]
                        }))}
                        className={cn(
                            "w-12 h-12 rounded-2xl items-center justify-center shadow-md",
                            enabled ? "bg-primary shadow-primary/20" : "bg-zinc-100 dark:bg-zinc-900"
                        )}>
                        <Icon as={enabled ? MaterialIcons : MaterialIcons} size={24} className={enabled ? "text-white" : "text-zinc-500"} />
                    </Animated.View>
                    <View className="flex-1">
                        <Text className="text-lg font-black tracking-tight">
                            {enabled ? 'Pulse: Synchronized' : 'Pulse: Paused'}
                        </Text>
                        <Text className="text-zinc-500 text-sm font-semibold tracking-tight">
                            Cloud-to-browser stream
                        </Text>
                    </View>
                </View>

                <Text className="text-[14px] text-zinc-600 dark:text-zinc-400 leading-5 mb-6 font-medium">
                    Keep your components updated in real-time across all your browsers using secure cloud delivery.
                </Text>

                <Pressable
                    onPress={onToggle}
                    disabled={isRegistering}
                    className={cn(
                        "h-14 rounded-2xl flex-row items-center justify-center gap-2 px-8 self-stretch border shadow-sm",
                        enabled
                            ? "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                            : "bg-primary border-primary"
                    )}
                >
                    {isRegistering ? (
                        <ActivityIndicator size="small" color={enabled ? "black" : "white"} />
                    ) : (
                        <>
                            <Text className={cn("font-black text-base", enabled ? "text-foreground" : "text-white")}>
                                {enabled ? 'Stop Syncing' : 'Activate Cloud Sync'}
                            </Text>
                            {!isRegistering && (
                                <Icon as={MaterialIcons} name="arrow-up-right" size={18} className={enabled ? "text-muted-foreground" : "text-white"} />
                            )}
                        </>
                    )}
                </Pressable>
            </View>

            {/* Preference Control Section */}
            <View className="mb-6">
                <View className="flex-row items-center gap-2 mb-4 px-2">
                    <Icon as={MaterialIcons} name="settings" size={16} className="text-zinc-400" />
                    <Text className="text-xs font-bold uppercase tracking-widest text-zinc-400">Notification Settings</Text>
                </View>

                <View className="gap-2">
                    <PreferenceRow
                        label="Master Sync"
                        description="Master toggle for all notifications"
                        icon={MaterialIcons}
                        value={preferences?.global_notifications ?? true}
                        onValueChange={(val) => updatePreference(PREFERENCE_KEYS.GLOBAL, val)}
                    />

                    <PreferenceRow
                        label="Followed Updates"
                        description="Activity from entities you follow"
                        icon={MaterialIcons}
                        value={preferences?.push_followed_enabled ?? true}
                        onValueChange={(val) => updatePreference(PREFERENCE_KEYS.FOLLOWED, val)}
                    />
                    <PreferenceRow
                        label="System Alerts"
                        description="Critical security and sync status"
                        icon={MaterialIcons}
                        value={preferences?.push_system_enabled ?? true}
                        onValueChange={(val) => updatePreference(PREFERENCE_KEYS.SYSTEM, val)}
                    />
                </View>
            </View>

            {token && (
                <View className="p-4 rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <Text className="text-[12px] font-black uppercase tracking-widest text-zinc-500 mb-1">Sync Connection ID</Text>
                    <Text className="text-[13px] font-mono text-zinc-600 dark:text-zinc-400" numberOfLines={1}>
                        {token}
                    </Text>
                </View>
            )}
        </View>
    );
});
