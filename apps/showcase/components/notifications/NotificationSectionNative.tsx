import React from 'react';
import { View, Pressable, ActivityIndicator } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { cn } from '@/registry/nativewind/lib/utils';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import { useNotifications } from '@/contexts/NotificationContext';
import { PREFERENCE_KEYS } from '@/features/settings/constants';
import { Platform } from 'react-native';
import { useFeedback } from '@/hooks/useFeedback';
import { PreferenceRow } from './PreferenceRow';

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
    const { impact, success } = useFeedback();

    const onToggle = async () => {
        impact();
        if (enabled) {
            await disable();
        } else {
            const res = await enable();
            if (res) success('Pulse notifications linked successfully');
        }
    };

    // Only render on native platforms
    if (Platform.OS === 'web') {
        return null;
    }

    return (
        <View className="bg-background px-6 py-4">
            <View className="flex-row items-center gap-3 mb-8">
                <View className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 items-center justify-center">
                    <Icon as={MaterialIcons} name="notifications-active" size={20} className="text-primary" />
                </View>
                <View>
                    <Text className="text-xl font-black tracking-tight text-foreground">Pulse Sync</Text>
                    <Text className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Background Delivery Status</Text>
                </View>
            </View>

            <View className={cn(
                "p-6 rounded-3xl border mb-8",
                enabled ? "bg-primary/5 border-primary/20" : "bg-muted/30 border-border/50"
            )}>
                <View className="flex-row items-center gap-4 mb-5">
                    <View className={cn(
                        "w-12 h-12 rounded-2xl items-center justify-center shadow-sm",
                        enabled ? "bg-primary" : "bg-background border border-border/50"
                    )}>
                        <Icon
                            as={MaterialIcons}
                            name={enabled ? "link" : "link-off"}
                            size={24}
                            className={enabled ? "text-white" : "text-muted-foreground"}
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-lg font-bold tracking-tight text-foreground">
                            {enabled ? 'System Link Active' : 'Registry Connection Off'}
                        </Text>
                        <Text className="text-muted-foreground text-[12px] font-medium tracking-tight mt-0.5">
                            {enabled ? 'PERSISTENT // END-TO-END' : 'IDLE // STANDBY_MODE'}
                        </Text>
                    </View>
                </View>

                <Text className="text-[13px] text-muted-foreground leading-relaxed mb-6 font-medium">
                    Native pulse delivery ensures real-time updates for high-priority registry changes. Encrypted via Google FCM cluster.
                </Text>

                <Pressable
                    onPress={onToggle}
                    disabled={isRegistering}
                    accessibilityRole="button"
                    accessibilityLabel={enabled ? 'Disconnect notification pulse' : 'Establish notification pulse link'}
                    accessibilityState={{ disabled: isRegistering, checked: enabled }}
                    className={cn(
                        "h-14 rounded-2xl flex-row items-center justify-center gap-2 px-8 self-stretch border active:scale-[0.98]",
                        enabled
                            ? "bg-background border-border shadow-sm active:bg-muted/50"
                            : "bg-primary border-primary shadow-lg shadow-primary/20"
                    )}
                >
                    {isRegistering ? (
                        <ActivityIndicator size="small" color={enabled ? "black" : "white"} />
                    ) : (
                        <>
                            <Text className={cn("font-black text-sm tracking-tight", enabled ? "text-foreground" : "text-white")}>
                                {enabled ? 'DISCONNECT PULSE' : 'ESTABLISH CONNECTION'}
                            </Text>
                            <Icon
                                as={MaterialIcons}
                                name={enabled ? "close" : "bolt"}
                                size={18}
                                className={enabled ? "text-muted-foreground" : "text-white"}
                            />
                        </>
                    )}
                </Pressable>
            </View>

            {/* Preference Control Section */}
            <View className="mb-8">
                <View className="flex-row items-center gap-2 mb-4 px-2">
                    <Icon as={MaterialIcons} name="tune" size={16} className="text-muted-foreground/60" />
                    <Text className="text-[11px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">Subscription Controls</Text>
                </View>

                <View className="gap-2">
                    <PreferenceRow
                        label="Master Pulse"
                        description="Main switch for all network activity"
                        icon={MaterialIcons}
                        value={preferences?.[PREFERENCE_KEYS.GLOBAL] ?? true}
                        onValueChange={(val) => updatePreference(PREFERENCE_KEYS.GLOBAL, val)}
                    />
                    <PreferenceRow
                        label="Network Pulses"
                        description="Activity from followed registries"
                        icon={MaterialIcons}
                        value={preferences?.[PREFERENCE_KEYS.FOLLOWED] ?? true}
                        onValueChange={(val) => updatePreference(PREFERENCE_KEYS.FOLLOWED, val)}
                    />
                    <PreferenceRow
                        label="System Alerts"
                        description="Critical security and core updates"
                        icon={MaterialIcons}
                        value={preferences?.[PREFERENCE_KEYS.SYSTEM] ?? true}
                        onValueChange={(val) => updatePreference(PREFERENCE_KEYS.SYSTEM, val)}
                    />
                </View>
            </View>

            {token && (
                <View className="p-4 rounded-2xl bg-muted/20 border border-border/50">
                    <Text className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/50 mb-1.5">Active Transmission ID</Text>
                    <Text className="text-[12px] font-mono text-muted-foreground/80 leading-tight" numberOfLines={1}>
                        {token}
                    </Text>
                </View>
            )}
        </View>
    );
});
