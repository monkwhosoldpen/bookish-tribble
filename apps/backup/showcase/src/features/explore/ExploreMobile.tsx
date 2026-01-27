import * as React from 'react';
import { ScrollView, View, TextInput, Pressable, RefreshControl } from 'react-native';
import { Text } from '@/registry/components/ui/text';
import { Icon } from '@/registry/components/ui/icon';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useExploreLogic, SectionHeader, TrendRow, StoryCard, CreatorRow, TopicChips } from './ExploreShared';
import { EmptyState, ErrorState, TrendSkeleton, StorySkeleton, CreatorSkeleton } from './ExploreState';
import type { ExploreScenario } from './mockExploreData';

export function ExploreMobile({ scenario }: { scenario?: ExploreScenario }) {
    const { data, loading, error, handleRefresh, showEmpty } = useExploreLogic({ scenario });
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await handleRefresh();
        setRefreshing(false);
    }, [handleRefresh]);

    return (
        <View className="flex-1 bg-background">
            <ScrollView
                className="flex-1"
                contentContainerClassName="flex-grow"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={refreshing ? undefined : 'transparent'}
                    />
                }
            >
                <View className="w-full px-4 pt-6 pb-12">
                    <View className="w-full max-w-lg mx-auto gap-8">
                        <View>
                            <View className="relative">
                                <TextInput
                                    placeholder="Search Showcase"
                                    placeholderTextColor="hsl(215.4 16.3% 46.9%)"
                                    className="h-12 rounded-full bg-muted/20 border border-border/50 pl-12 pr-4 text-[15px] text-foreground"
                                />
                                <View className="absolute left-4 top-3">
                                    <Icon as={MaterialIcons} name="search" size={18} className="text-muted-foreground" />
                                </View>
                            </View>
                        </View>

                        {loading && (
                            <View className="gap-10">
                                <View className="gap-4">
                                    <SectionHeader icon={MaterialIcons} title="Trends for you" />
                                    <TrendSkeleton />
                                    <TrendSkeleton />
                                    <TrendSkeleton />
                                </View>
                                <View className="gap-4">
                                    <SectionHeader icon={MaterialIcons} title="Stories for you" />
                                    <StorySkeleton />
                                    <StorySkeleton />
                                </View>
                                <View className="gap-4">
                                    <SectionHeader icon={MaterialIcons} title="Who to follow" />
                                    <CreatorSkeleton />
                                    <CreatorSkeleton />
                                </View>
                            </View>
                        )}

                        {error && (
                            <ErrorState
                                title="We couldn’t load Explore"
                                description="Something went wrong loading your feed. Please try again."
                                action={(
                                    <Pressable
                                        onPress={handleRefresh}
                                        className="flex-row items-center gap-2 px-5 py-2.5 rounded-full bg-primary"
                                    >
                                        <Icon as={MaterialIcons} name="refresh" size={16} className="text-primary-foreground" />
                                        <Text className="text-primary-foreground font-semibold tracking-tight">Retry</Text>
                                    </Pressable>
                                )}
                                icon={<Icon as={MaterialIcons} name="local-fire-department" size={32} className="text-destructive" />}
                            />
                        )}

                        {showEmpty && (
                            <EmptyState
                                title="Keep exploring"
                                description="Follow more topics to fill this space with breaking stories and trends tailored for you."
                                action={(
                                    <Pressable
                                        onPress={handleRefresh}
                                        className="flex-row items-center gap-2 px-5 py-2.5 rounded-full border border-border/80"
                                    >
                                        <Icon as={MaterialIcons} name="refresh" size={16} className="text-foreground" />
                                        <Text className="text-foreground font-semibold tracking-tight">Refresh feed</Text>
                                    </Pressable>
                                )}
                                icon={<Icon as={MaterialIcons} name="trending-up" size={32} className="text-primary" />}
                            />
                        )}

                        {!loading && !error && data && !showEmpty && (
                            <View className="gap-10">
                                <View className="gap-4">
                                    <SectionHeader icon={MaterialIcons} title="Trends for you" />
                                    <TopicChips topics={data.topics} />
                                    <View>
                                        {data.trends.map((trend) => (
                                            <TrendRow key={trend.id} trend={trend} />
                                        ))}
                                    </View>
                                </View>

                                <View className="gap-4">
                                    <SectionHeader icon={MaterialIcons} title="Stories for you" />
                                    {data.stories.map((story) => (
                                        <StoryCard key={story.id} story={story} />
                                    ))}
                                </View>

                                <View className="gap-4">
                                    <SectionHeader icon={MaterialIcons} title="Who to follow" />
                                    {data.creators.map((creator) => (
                                        <CreatorRow key={creator.id} creator={creator} />
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
