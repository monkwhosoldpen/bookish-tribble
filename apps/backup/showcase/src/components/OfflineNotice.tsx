import React, { useEffect, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useIsOnline } from '@/hooks/useIsOnline';

export function OfflineNotice() {
    const isOnline = useIsOnline();
    const insets = useSafeAreaInsets();
    const [heightAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        if (!isOnline) {
            Animated.timing(heightAnim, {
                toValue: 40 + insets.top,
                duration: 300,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(heightAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    }, [isOnline, insets.top]);

    if (isOnline) {
        // We keep it mounted but hidden to allow animation out? 
        // Or just return null if we don't care about "slide up" animation
        // Simple version:
        return null;
    }

    return (
        <View className="absolute top-0 left-0 right-0 z-[100] bg-destructive items-center justify-end pb-2"
            style={{ height: 40 + insets.top, paddingTop: insets.top }}>
            <View className="flex-row items-center gap-2">
                <MaterialIcons name="wifi-off" size={16} color="white" />
                <Text className="text-white font-bold text-xs">No Internet Connection</Text>
            </View>
        </View>
    );
}
