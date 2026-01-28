import * as React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/registry/nativewind/components/ui/text';
import { Icon } from '@/components/ui/Icon';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useHaptics } from '@/contexts/HapticsContext';
import { useProfileContext } from '@/features/profile/ProfileContext';

export function ProfileHeader() {
    const { profileData, sidebarChannels, selectedIndex } = useProfileContext();
    const router = useRouter();
    const { impact } = useHaptics();
    const selectedChannel = sidebarChannels[selectedIndex];

    const isMain = !selectedChannel || selectedChannel.id === 'main';
    const title = isMain ? (profileData?.displayname || 'Profile') : selectedChannel.name;
    const subtitle = isMain ? 'Official Channel' : 'Secure Frequency';

    return (
        <View className="bg-background/80 border-b border-border z-50 backdrop-blur-xl">
            <View className="max-w-2xl mx-auto w-full h-14 flex-row items-center justify-between px-6">
                <View className="flex-row items-center gap-3">
                    <Pressable
                        onPress={() => {
                            impact();
                            router.back();
                        }}
                        className="active:opacity-60 transition-opacity"
                    >
                        <View className="w-8 h-8 rounded-lg items-center justify-center">
                            <Icon as={MaterialIcons} name="arrow-back" size={20} className="text-foreground" />
                        </View>
                    </Pressable>
                    <View>
                        <Text className="text-xl font-black tracking-tighter text-foreground">{title}</Text>
                        <Text className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">{subtitle}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}
