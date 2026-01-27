import React from 'react';
import { View, ActivityIndicator, Switch } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Text } from '@/registry/components/ui/text';
import { useNotifications } from '@/hooks/useNotifications';
import { PREFERENCE_KEYS } from '@/features/settings/constants';

export function NotificationSettingsNative() {
    const { preferences, updatePreference } = useNotifications();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleNotificationToggle = async (value: boolean) => {
        setIsLoading(true);
        try {
            await updatePreference(PREFERENCE_KEYS.GLOBAL, value);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="w-full space-y-4">
            {/* Main Native Toggle - Distinct styling */}
            <View className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-1">
                <View className="bg-background dark:bg-zinc-900 rounded-xl p-4">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3">
                            <View className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 items-center justify-center">
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <MaterialIcons size={20} className="text-white" name="notifications-active" />
                                )}
                            </View>
                            <View>
                                <Text className="text-lg font-bold text-foreground">Push Notifications</Text>
                                <Text className="text-sm text-muted-foreground">
                                    {preferences?.[PREFERENCE_KEYS.GLOBAL] ? "Enabled" : "Disabled"}
                                </Text>
                            </View>
                        </View>
                        
                        <Switch
                            value={preferences?.[PREFERENCE_KEYS.GLOBAL] ?? false}
                            onValueChange={handleNotificationToggle}
                            trackColor={{ false: '#e5e7eb', true: '#8b5cf6' }}
                            thumbColor={preferences?.[PREFERENCE_KEYS.GLOBAL] ? '#ffffff' : '#f3f4f6'}
                            ios_backgroundColor="#e5e7eb"
                            disabled={isLoading}
                        />
                    </View>
                </View>
            </View>

            {/* Native-specific preferences with card styling */}
            <View className="space-y-3">
                <View className="bg-card dark:bg-zinc-800 rounded-xl p-4 border border-border">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3">
                            <View className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 items-center justify-center">
                                <MaterialIcons size={16} className="text-green-600 dark:text-green-400" name="follow-the-signs" />
                            </View>
                            <View>
                                <Text className="text-base font-semibold text-foreground">Followed Activity</Text>
                                <Text className="text-xs text-muted-foreground">Updates from followed channels</Text>
                            </View>
                        </View>
                        <Switch
                            value={preferences?.[PREFERENCE_KEYS.FOLLOWED] ?? true}
                            onValueChange={(val) => updatePreference(PREFERENCE_KEYS.FOLLOWED, val)}
                            trackColor={{ false: '#e5e7eb', true: '#10b981' }}
                            thumbColor={preferences?.[PREFERENCE_KEYS.FOLLOWED] ? '#ffffff' : '#f3f4f6'}
                            ios_backgroundColor="#e5e7eb"
                        />
                    </View>
                </View>

                <View className="bg-card dark:bg-zinc-800 rounded-xl p-4 border border-border">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3">
                            <View className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 items-center justify-center">
                                <MaterialIcons size={16} className="text-orange-600 dark:text-orange-400" name="warning" />
                            </View>
                            <View>
                                <Text className="text-base font-semibold text-foreground">System Alerts</Text>
                                <Text className="text-xs text-muted-foreground">Critical updates and security</Text>
                            </View>
                        </View>
                        <Switch
                            value={preferences?.[PREFERENCE_KEYS.SYSTEM] ?? true}
                            onValueChange={(val) => updatePreference(PREFERENCE_KEYS.SYSTEM, val)}
                            trackColor={{ false: '#e5e7eb', true: '#f97316' }}
                            thumbColor={preferences?.[PREFERENCE_KEYS.SYSTEM] ? '#ffffff' : '#f3f4f6'}
                            ios_backgroundColor="#e5e7eb"
                        />
                    </View>
                </View>

                <View className="bg-card dark:bg-zinc-800 rounded-xl p-4 border border-border">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3">
                            <View className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 items-center justify-center">
                                <MaterialIcons size={16} className="text-blue-600 dark:text-blue-400" name="alternate-email" />
                            </View>
                            <View>
                                <Text className="text-base font-semibold text-foreground">Mentions</Text>
                                <Text className="text-xs text-muted-foreground">When someone mentions you</Text>
                            </View>
                        </View>
                        <Switch
                            value={preferences?.[PREFERENCE_KEYS.MENTIONS] ?? true}
                            onValueChange={(val) => updatePreference(PREFERENCE_KEYS.MENTIONS, val)}
                            trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                            thumbColor={preferences?.[PREFERENCE_KEYS.MENTIONS] ? '#ffffff' : '#f3f4f6'}
                            ios_backgroundColor="#e5e7eb"
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}
