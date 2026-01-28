import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/registry/nativewind/components/ui/text';
import { Icon } from '@/components/ui/Icon';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useProfileContext } from './ProfileContext';
import { ProfileSidebar } from './ProfileSidebar';
import { useFeedback } from '@/hooks/useFeedback';

function ProfileHeader() {
    const { profileData, sidebarChannels, selectedIndex } = useProfileContext();
    const router = useRouter();
    const selectedChannel = sidebarChannels[selectedIndex];

    const isMain = !selectedChannel || selectedChannel.id === 'main';
    const title = isMain ? (profileData?.displayname || 'Profile') : selectedChannel.name;
    const subtitle = isMain ? 'Main Channel' : 'Secure Frequency';

    return (
        <View className="h-14 flex-row items-center px-4 border-b border-border/50 bg-background/95 backdrop-blur-xl z-50">
            <Pressable
                onPress={() => {
                    router.back();
                }}
                className="mr-4 p-1 rounded-full active:bg-muted/50"
            >
                <Icon as={MaterialIcons} name="arrow-back" size={20} className="text-foreground" />
            </Pressable>
            <View>
                <Text className="text-base font-black tracking-tight">{title}</Text>
                <Text className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">{subtitle}</Text>
            </View>
        </View>
    );
}

export function ProfileLayout({ children }: { children: React.ReactNode }) {
    return (
        <View className="flex-1 bg-background">
            <ProfileHeader />
            <View className="flex-1 flex-row">
                <ProfileSidebar />
                <View className="flex-1">
                    {children}
                </View>
            </View>
        </View>
    );
}
