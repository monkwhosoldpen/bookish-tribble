import React from 'react';
import { View, Pressable, ActivityIndicator } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { cn } from '@/registry/nativewind/lib/utils';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import { useNotifications } from '@/contexts/NotificationContext';
import { PreferenceRow } from './PreferenceRow';
import { PREFERENCE_KEYS } from '@/features/settings/constants';
import { Platform } from 'react-native';
import { useColorScheme } from 'nativewind';
import { COLOR_TOKENS } from '@/lib/design-tokens';

export const NotificationSectionWeb = React.memo(function NotificationSectionWeb() {
    const {
        enabled,
        isRegistering,
        pushToken: token,
        enable,
        disable,
        preferences,
        updatePreference
    } = useNotifications();
    const { colorScheme } = useColorScheme();
    const foregroundColor = colorScheme === 'dark' ? COLOR_TOKENS.dark.foreground : COLOR_TOKENS.light.foreground;

    const onToggle = async () => {
        if (enabled) {
            await disable();
        } else {
            await enable();
        }
    };

    // Only render on web platform
    if (Platform.OS !== 'web') {
        return null;
    }

    return (
        <View className="bg-card border border-border rounded-[2.5rem] px-6 py-8 mx-4 my-4 shadow-sm shadow-black/5">
            <View className="flex-row items-center gap-3 mb-6">
                <View className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 items-center justify-center">
                    <Icon as={MaterialIcons} name="public" size={20} className="text-primary" />
                </View>
                <View>
                    <Text className="text-xl font-black tracking-tighter text-foreground">Live Pulse</Text>
                    <Text className="text-[12px] text-muted-foreground font-bold uppercase tracking-[0.15em]">Global Delivery</Text>
                </View>
            </View>

            <View className={cn(
                "p-6 rounded-3xl border mb-6",
                enabled ? "bg-primary/5 border-primary/20" : "bg-card border-border"
            )}>
                <View className="flex-row items-center gap-4 mb-4">
                    <View className={cn(
                        "w-12 h-12 rounded-2xl items-center justify-center shadow-md",
                        enabled ? "bg-primary shadow-primary/20" : "bg-secondary"
                    )}>
                        <Icon
                            as={MaterialIcons}
                            name={enabled ? "link" : "link-off"}
                            size={24}
                            className={enabled ? "text-white" : "text-muted-foreground"}
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-lg font-black tracking-tight text-foreground">
                            {enabled ? 'Pulse: Synchronized' : 'Pulse: Paused'}
                        </Text>
                        <Text className="text-muted-foreground text-sm font-semibold tracking-tight">
                            Cloud-to-browser stream
                        </Text>
                    </View>
                </View>

                <Text className="text-[14px] text-muted-foreground leading-5 mb-6 font-medium">
                    Keep your components updated in real-time across all your browsers using secure cloud delivery.
                </Text>

                <Pressable
                    onPress={onToggle}
                    disabled={isRegistering}
                    className={cn(
                        "h-14 rounded-2xl flex-row items-center justify-center gap-2 px-8 self-stretch border shadow-sm",
                        enabled
                            ? "bg-secondary border-border"
                            : "bg-primary border-primary"
                    )}
                >
                    {isRegistering ? (
                        <ActivityIndicator size="small" color={enabled ? foregroundColor : "#FFFFFF"} />
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
                    <Icon as={MaterialIcons} name="settings" size={16} className="text-muted-foreground" />
                    <Text className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Notification Settings</Text>
                </View>

                <View className="gap-2">
                    <PreferenceRow
                        label="Master Sync"
                        description="Master toggle for all notifications"
                        icon={MaterialIcons}
                        value={preferences?.[PREFERENCE_KEYS.GLOBAL] ?? true}
                        onValueChange={(val) => updatePreference(PREFERENCE_KEYS.GLOBAL, val)}
                    />

                    <PreferenceRow
                        label="Followed Updates"
                        description="Activity from entities you follow"
                        icon={MaterialIcons}
                        value={preferences?.[PREFERENCE_KEYS.FOLLOWED] ?? true}
                        onValueChange={(val) => updatePreference(PREFERENCE_KEYS.FOLLOWED, val)}
                    />

                    <PreferenceRow
                        label="System Alerts"
                        description="Critical security and sync status"
                        icon={MaterialIcons}
                        value={preferences?.[PREFERENCE_KEYS.SYSTEM] ?? true}
                        onValueChange={(val) => updatePreference(PREFERENCE_KEYS.SYSTEM, val)}
                    />
                </View>
            </View>

            {token && (
                <View className="p-4 rounded-3xl bg-secondary border border-border">
                    <Text className="text-[12px] font-black uppercase tracking-widest text-muted-foreground mb-1">Sync Connection ID</Text>
                    <Text className="text-[13px] font-mono text-muted-foreground" numberOfLines={1}>
                        {token}
                    </Text>
                </View>
            )}
        </View>
    );
});
