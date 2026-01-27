import * as React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { Text } from '@/registry/nativewind/components/ui/text';
import { Icon } from '@/components/ui/Icon';
import { Image } from 'expo-image';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useProfileContext } from '@/features/profile/ProfileContext';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { cn } from '@/registry/nativewind/lib/utils';

export function ProfileSection() {
    const { profileData, username } = useProfileContext();

    const handleCopyUsername = async () => {
        if (!username) return;

        await Clipboard.setStringAsync(username);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // You could add a toast here if needed
    };

    const displayName = profileData?.displayname || username;
    const bio = profileData?.description || 'No description available for this transmission node.';

    return (
        <ScrollView 
            className="flex-1" 
            showsVerticalScrollIndicator={false}
            contentContainerClassName="pb-6"
        >
            <View className="max-w-2xl mx-auto w-full px-6 py-6">
                
                {/* Profile Card */}
                <View className="bg-card rounded-[24px] border border-border overflow-hidden shadow-lg shadow-black/10">
                    {/* Banner */}
                    <View className="h-32 bg-primary/20 relative">
                        {profileData?.bannerurl && (
                            <Image
                                source={{ uri: profileData.bannerurl }}
                                className="absolute inset-0"
                                contentFit="cover"
                            />
                        )}
                        <View className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </View>

                    {/* Profile Content */}
                    <View className="px-6 pb-6">
                        <View className="-mt-12 self-start">
                            <Image
                                source={{ uri: profileData?.avatarurl || 'https://via.placeholder.com/160' }}
                                className="w-24 h-24 rounded-2xl border-4 border-card bg-muted shadow-md"
                                contentFit="cover"
                            />
                            <View className="absolute -bottom-1 -right-1 bg-card rounded-full p-1.5 shadow-sm">
                                <Icon as={MaterialIcons} name="verified" size={18} className="text-primary" />
                            </View>
                        </View>

                        <View className="mt-4">
                            <Text className="text-2xl font-black text-foreground leading-tight tracking-tight">
                                {displayName}
                            </Text>
                            <Pressable
                                onPress={handleCopyUsername}
                                className="flex-row items-center gap-2 mt-2 active:opacity-60"
                                accessibilityLabel={`Copy username ${username}`}
                                accessibilityRole="button"
                            >
                                <View className="bg-primary/10 px-2 py-1 rounded">
                                    <Text className="text-[10px] font-black text-primary uppercase tracking-widest">
                                        {profileData?.client_type || 'OFFICIAL'}
                                    </Text>
                                </View>
                                <Text className="text-sm text-muted-foreground font-bold opacity-60">@{username}</Text>
                                <Icon as={MaterialIcons} name="content-copy" size={12} className="text-muted-foreground opacity-40" />
                            </Pressable>
                        </View>

                        {/* Bio */}
                        <View className="mt-6">
                            <Text className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">Identity Details</Text>
                            <View className="bg-muted/30 rounded-2xl p-4 border border-border/50">
                                <Text className="text-sm text-foreground leading-relaxed font-medium">
                                    {bio}
                                </Text>
                            </View>
                        </View>

                        {/* Stats */}
                        <View className="mt-6 flex-row gap-3">
                            <View className="flex-1 bg-muted/30 rounded-xl p-4 border border-border/50 items-center">
                                <Text className="text-lg font-black text-foreground">1.2K</Text>
                                <Text className="text-[10px] font-bold text-muted-foreground uppercase">Followers</Text>
                            </View>
                            <View className="flex-1 bg-muted/30 rounded-xl p-4 border border-border/50 items-center">
                                <Text className="text-lg font-black text-foreground">843</Text>
                                <Text className="text-[10px] font-bold text-muted-foreground uppercase">Following</Text>
                            </View>
                            <View className="flex-1 bg-muted/30 rounded-xl p-4 border border-border/50 items-center">
                                <Text className="text-lg font-black text-foreground">42</Text>
                                <Text className="text-[10px] font-bold text-muted-foreground uppercase">Posts</Text>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View className="mt-6 flex-row gap-3">
                            <Pressable className="flex-1 bg-primary rounded-xl p-4 items-center shadow-lg shadow-primary/20">
                                <Text className="text-white font-bold">Follow</Text>
                            </Pressable>
                            <Pressable className="flex-1 bg-muted/80 rounded-xl p-4 items-center border border-border/50">
                                <Text className="text-foreground font-bold">Message</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>

                {/* Additional Sections */}
                <View className="mt-6 space-y-4">
                    <ProfileCard
                        icon="timeline"
                        title="Activity"
                        subtitle="Recent transmissions and updates"
                        onPress={() => {}}
                    />
                    <ProfileCard
                        icon="photo-library"
                        title="Media"
                        subtitle="Photos and videos shared"
                        onPress={() => {}}
                    />
                    <ProfileCard
                        icon="link"
                        title="Links"
                        subtitle="External connections and resources"
                        onPress={() => {}}
                    />
                </View>

                {/* Extra spacing */}
                <View className="h-32" />
            </View>
        </ScrollView>
    );
}

function ProfileCard({
    icon,
    title,
    subtitle,
    onPress,
}: {
    icon: string;
    title: string;
    subtitle: string;
    onPress: () => void;
}) {
    return (
        <Pressable
            onPress={onPress}
            className="bg-card rounded-2xl border border-border p-4 active:opacity-80 transition-opacity"
        >
            <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 rounded-xl bg-primary/10 items-center justify-center">
                    <Icon as={MaterialIcons} name={icon as any} size={20} className="text-primary" />
                </View>
                <View className="flex-1">
                    <Text className="text-base font-semibold text-foreground">{title}</Text>
                    <Text className="text-sm text-muted-foreground mt-0.5">{subtitle}</Text>
                </View>
                <Icon as={MaterialIcons} name="chevron-right" size={18} className="text-muted-foreground/60" />
            </View>
        </Pressable>
    );
}
