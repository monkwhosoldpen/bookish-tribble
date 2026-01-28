import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { BottomNav } from '@/components/layout/BottomNav';
import { ExploreHeader } from '@/features/explore/ExploreHeader';
import { useExploreLogic } from '@/features/explore/ExploreShared';
import { useWhoToFollow } from '@/hooks/useWhoToFollow';
import { useFeedback } from '@/hooks/useFeedback';
import { ExploreSkeleton } from '@/components/ui/skeleton';
import { EmptyExploreState } from '@/components/ui/empty-state';
import { Text } from '@/registry/nativewind/components/ui/text';
import { TitledSection } from '@/features/explore/ExploreShared';
import { CreatorRow } from '@/features/explore/ExploreShared';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function ExplorePage() {
    const { data, loading, error, handleRefresh, showEmpty } = useExploreLogic({});
    const { data: followData, loading: followLoading } = useWhoToFollow();
    const { impact } = useFeedback();

    const onRefresh = React.useCallback(async () => {
        impact();
        handleRefresh();
    }, [handleRefresh, impact]);

    if (loading) {
        return (
            <ScreenWrapper
                header={<ExploreHeader />}
                bottomNav={<BottomNav activeTab="explore" />}
                mobileContent={<ExploreSkeleton />}
                desktopContent={<ExploreSkeleton />}
                fullWidth={false}
            />
        );
    }

    if (error) {
        return (
            <ScreenWrapper
                header={<ExploreHeader />}
                bottomNav={<BottomNav activeTab="explore" />}
                mobileContent={
                    <View className="flex-1 items-center justify-center p-8">
                        <Text className="text-destructive text-center">Failed to load explore content</Text>
                    </View>
                }
                desktopContent={
                    <View className="flex-1 items-center justify-center p-8">
                        <Text className="text-destructive text-center">Failed to load explore content</Text>
                    </View>
                }
                fullWidth={false}
            />
        );
    }

    if (showEmpty) {
        return (
            <ScreenWrapper
                header={<ExploreHeader />}
                bottomNav={<BottomNav activeTab="explore" />}
                mobileContent={
                    <EmptyExploreState onRefresh={onRefresh} />
                }
                desktopContent={
                    <EmptyExploreState onRefresh={onRefresh} />
                }
                fullWidth={false}
            />
        );
    }

    return (
        <ScreenWrapper
            header={<ExploreHeader />}
            bottomNav={<BottomNav activeTab="explore" />}
            mobileContent={
                <ScrollView 
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerClassName="p-4"
                >
                    <View className="gap-6">
                        {/* Who to Follow Section */}
                        <TitledSection 
                            title="Who to Follow" 
                            icon={MaterialIcons}
                        >
                            <View className="gap-4">
                                {followData.slice(0, 5).map((creator) => (
                                    <CreatorRow
                                        key={creator.id}
                                        creator={{
                                            id: creator.id,
                                            name: creator.displayname || creator.username,
                                            handle: `@${creator.username}`,
                                            avatar: { uri: creator.avatarurl || 'https://via.placeholder.com/150' },
                                            reason: creator.bio || 'Follow to see more content'
                                        }}
                                        onPress={() => {
                                            // Navigate to profile
                                            console.log('Navigate to profile:', creator.username);
                                        }}
                                        onFollow={() => {
                                            // Handle follow logic
                                            console.log('Follow:', creator.username);
                                        }}
                                        isFollowed={false}
                                        showFollowButton={true}
                                    />
                                ))}
                            </View>
                        </TitledSection>
                    </View>
                </ScrollView>
            }
            desktopContent={
                <ScrollView 
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerClassName="p-8"
                >
                    <View className="gap-8 max-w-4xl mx-auto">
                        {/* Who to Follow Section */}
                        <TitledSection 
                            title="Who to Follow" 
                            icon={MaterialIcons}
                        >
                            <View className="gap-4">
                                {followData.map((creator) => (
                                    <CreatorRow
                                        key={creator.id}
                                        creator={{
                                            id: creator.id,
                                            name: creator.displayname || creator.username,
                                            handle: `@${creator.username}`,
                                            avatar: { uri: creator.avatarurl || 'https://via.placeholder.com/150' },
                                            reason: creator.bio || 'Follow to see more content'
                                        }}
                                        onPress={() => {
                                            // Navigate to profile
                                            console.log('Navigate to profile:', creator.username);
                                        }}
                                        onFollow={() => {
                                            // Handle follow logic
                                            console.log('Follow:', creator.username);
                                        }}
                                        isFollowed={false}
                                        showFollowButton={true}
                                    />
                                ))}
                            </View>
                        </TitledSection>
                    </View>
                </ScrollView>
            }
            fullWidth={false}
        />
    );
}
