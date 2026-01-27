import * as React from 'react';
import { ScrollView, View, TextInput, Pressable, RefreshControl } from 'react-native';
import { Text } from '@/registry/components/ui/text';
import { Icon } from '@/registry/components/ui/icon';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useExploreLogic, TitledSection, TrendCard, StoryHero, StoryItem, CreatorCard } from './ExploreShared';
import { EmptyState, ErrorState, TrendSkeleton, StorySkeleton, CreatorSkeleton } from './ExploreState';
import type { ExploreScenario } from './mockExploreData';

export function ExploreDesktop({ scenario }: { scenario?: ExploreScenario }) {
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
                contentContainerClassName="flex-grow items-center"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={refreshing ? undefined : 'transparent'}
                    />
                }
            >
                <View className="w-full max-w-6xl px-8 py-10">
                    <View className="flex-row justify-between items-center mb-10">
                        <Text className="text-[26px] font-black tracking-tight">Explore</Text>
                        <View className="relative w-[320px]">
                            <TextInput
                                placeholder="Search Showcase"
                                placeholderTextColor="hsl(215.4 16.3% 46.9%)"
                                className="h-[46px] rounded-full bg-muted/10 border border-border/50 pl-12 pr-4 text-[15px] text-foreground"
                            />
                            <View className="absolute left-4 top-[11px]">
                                <Icon as={MaterialIcons} name="search" size={18} className="text-muted-foreground" />
                            </View>
                        </View>
                    </View>

                    {loading && (
                        <View className="flex-row gap-6">
                            <View className="flex-1 gap-6">
                                <TitledSection icon={MaterialIcons} title="Trends for you">
                                    <TrendSkeleton />
                                    <TrendSkeleton />
                                    <TrendSkeleton />
                                </TitledSection>
                                <TitledSection icon={MaterialIcons} title="Who to follow">
                                    <CreatorSkeleton />
                                    <CreatorSkeleton />
                                </TitledSection>
                            </View>
                            <View className="w-[320px] gap-6">
                                <TitledSection icon={MaterialIcons} title="Stories for you">
                                    <StorySkeleton />
                                    <StorySkeleton />
                                </TitledSection>
                            </View>
                        </View>
                    )}

                    {error && (
                        <ErrorState
                            title="Explore is taking a break"
                            description="We hit a snag loading the latest conversations. Try refreshing to give it another go."
                            action={(
                                <Pressable
                                    onPress={handleRefresh}
                                    className="flex-row items-center gap-2 px-5 py-2.5 rounded-full bg-primary"
                                >
                                    <Icon as={MaterialIcons} name="refresh" size={16} className="text-primary-foreground" />
                                    <Text className="text-primary-foreground font-semibold tracking-tight">Retry</Text>
                                </Pressable>
                            )}
                            icon={<Icon as={MaterialIcons} name="local-fire-department" size={36} className="text-destructive" />}
                        />
                    )}

                    {showEmpty && (
                        <EmptyState
                            title="Start following conversations"
                            description="Once you pick a few topics, we’ll fill this space with stories, trends, and creators you’ll love."
                            action={(
                                <Pressable
                                    onPress={handleRefresh}
                                    className="flex-row items-center gap-2 px-5 py-2.5 rounded-full border border-border/80"
                                >
                                    <Icon as={MaterialIcons} name="refresh" size={16} className="text-foreground" />
                                    <Text className="text-foreground font-semibold tracking-tight">Refresh feed</Text>
                                </Pressable>
                            )}
                            icon={<Icon as={MaterialIcons} name="trending-up" size={36} className="text-primary" />}
                        />
                    )}

                    {!loading && !error && data && !showEmpty && (
                        <View className="flex-row gap-6">
                            <View className="flex-1 gap-6">
                                <TitledSection icon={MaterialIcons} title="Trends for you">
                                    <View className="grid gap-4">
                                        {data.trends.map((trend) => (
                                            <TrendCard key={trend.id} trend={trend} />
                                        ))}
                                    </View>
                                </TitledSection>

                                <TitledSection icon={MaterialIcons} title="Who to follow">
                                    <View className="gap-4">
                                        {data.creators.map((creator) => (
                                            <CreatorCard key={creator.id} creator={creator} />
                                        ))}
                                    </View>
                                </TitledSection>
                            </View>

                            <View className="w-[320px] gap-6">
                                {data.stories.length > 0 && (
                                    <View className="gap-6">
                                        <TitledSection icon={MaterialIcons} title="Stories for you">
                                            {data.stories[0] && <StoryHero story={data.stories[0]} />}
                                            {data.stories.slice(1).map((story) => (
                                                <StoryItem key={story.id} story={story} />
                                            ))}
                                        </TitledSection>
                                    </View>
                                )}
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
