import React from 'react';
import { View, Pressable, ActivityIndicator } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { cn } from '@/registry/lib/utils';
import { Icon } from '@/registry/components/ui/icon';
import { Text } from '@/registry/components/ui/text';
import { useNotifications } from '@/contexts/NotificationContext';
import { PreferenceRow } from '@/components/notifications/PreferenceRow';
import { PREFERENCE_KEYS } from '@/features/settings/constants';

export const NotificationSectionNative = React.memo(function NotificationSectionNative() {
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
        <View className="bg-background px-6 py-6">
            <View className="flex-row items-center gap-3 mb-6">
                <View className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 items-center justify-center">
                    <Icon as={MaterialIcons} name="security" size={20} className="text-primary" />
                </View>
                <View>
                    <Text className="text-xl font-mono font-bold tracking-tighter uppercase">Native // Pulse</Text>
                    <Text className="text-[12px] text-zinc-400 font-mono font-bold uppercase tracking-widest">PRIVATE_STREAM // ENCRYPTED</Text>
                </View>
            </View>

            <View className={cn(
                "p-6 rounded-none border mb-6",
                enabled ? "bg-primary/10 border-primary/20" : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
            )}>
                <View className="flex-row items-center gap-4 mb-4">
                    <View className={cn(
                        "w-12 h-12 rounded-2xl items-center justify-center shadow-sm",
                        enabled ? "bg-primary" : "bg-zinc-100 dark:bg-zinc-900"
                    )}>
                        <Icon as={enabled ? MaterialIcons : MaterialIcons} size={24} className={enabled ? "text-white" : "text-zinc-500"} />
                    </View>
                    <View className="flex-1">
                        <Text className="text-lg font-black tracking-tight uppercase">
                            {enabled ? 'Pulse // Link: Active' : 'Pulse // Link: Inactive'}
                        </Text>
                        <Text className="text-zinc-500 text-[12px] font-mono font-bold tracking-widest uppercase mt-0.5">
                            PROTOCOL: FCM // STATUS: PERSISTENT
                        </Text>
                    </View>
                </View>

                <Text className="text-[13px] text-zinc-600 dark:text-zinc-400 font-mono tracking-tighter mb-6">
                    [SYSTEM_INFO]: Native background delivery ensures 100% uptime for high-priority registry updates. Protocol: Google FCM.
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
                            <Text className={cn("font-mono font-bold text-base tracking-widest uppercase", enabled ? "text-foreground" : "text-white")}>
                                {enabled ? 'EXECUTE // DISCONNECT' : 'EXECUTE // LINK PULSE'}
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
                    <Text className="text-[12px] font-mono font-bold uppercase tracking-widest text-zinc-400">Settings // Controls</Text>
                </View>

                <View className="gap-2">
                    <PreferenceRow
                        label="PROTOCOL // MASTER"
                        description="Global toggle for all pulse streams"
                        icon={MaterialIcons}
                        value={preferences?.global_notifications ?? true}
                        onValueChange={(val) => updatePreference(PREFERENCE_KEYS.GLOBAL, val)}
                    />
                    <PreferenceRow
                        label="NETWORK // TRACKING"
                        description="Activity from followed entities"
                        icon={MaterialIcons}
                        value={preferences?.push_followed_enabled ?? true}
                        onValueChange={(val) => updatePreference(PREFERENCE_KEYS.FOLLOWED, val)}
                    />
                    <PreferenceRow
                        label="KERNEL // ALERTS"
                        description="Critical security and sync status"
                        icon={MaterialIcons}
                        value={preferences?.push_system_enabled ?? true}
                        onValueChange={(val) => updatePreference(PREFERENCE_KEYS.SYSTEM, val)}
                    />
                </View>
            </View>

            {token && (
                <View className="p-4 rounded-none bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <Text className="text-[12px] font-mono font-bold uppercase tracking-widest text-zinc-500 mb-1">Link // Connection_ID</Text>
                    <Text className="text-[12px] font-mono text-zinc-600 dark:text-zinc-400" numberOfLines={1}>
                        {token}
                    </Text>
                </View>
            )}
        </View>
    );
});
