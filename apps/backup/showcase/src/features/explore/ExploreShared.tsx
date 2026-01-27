import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { Text } from '@/registry/components/ui/text';
import { Icon } from '@/registry/components/ui/icon';
import * as Haptics from 'expo-haptics';

import { useExploreFeed } from './useExploreFeed';
import type { ExploreScenario, ExploreTrend, ExploreStory, ExploreCreator } from './mockExploreData';

interface UseExploreLogicProps {
    scenario?: ExploreScenario;
}

interface UseExploreLogicReturn {
    data: ReturnType<typeof useExploreFeed>['data'];
    loading: ReturnType<typeof useExploreFeed>['loading'];
    error: ReturnType<typeof useExploreFeed>['error'];
    refresh: ReturnType<typeof useExploreFeed>['refresh'];
    handleRefresh: () => void;
    showEmpty: boolean;
}

export function useExploreLogic({ scenario }: UseExploreLogicProps): UseExploreLogicReturn {
    const { data, loading, error, refresh } = useExploreFeed({ scenario });

    const handleRefresh = React.useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        refresh(scenario ?? 'default');
    }, [refresh, scenario]);

    const showEmpty: boolean = Boolean(!loading && !error && data && data.trends.length === 0 && data.stories.length === 0 && data.creators.length === 0);

    return {
        data,
        loading,
        error,
        refresh,
        handleRefresh,
        showEmpty,
    };
}

interface SectionHeaderProps {
    icon: any;
    title: string;
}

export function SectionHeader({ icon: IconComp, title }: SectionHeaderProps) {
    return (
        <View className="flex-row items-center gap-3">
            <Icon as={IconComp} size={18} className="text-primary" />
            <Text className="text-[17px] font-black tracking-tight text-foreground">{title}</Text>
        </View>
    );
}

interface TitledSectionProps {
    title: string;
    children: React.ReactNode;
    icon: any;
}

export function TitledSection({ title, children, icon: IconComp }: TitledSectionProps) {
    return (
        <View className="gap-4">
            <View className="flex-row items-center gap-3">
                <Icon as={IconComp} size={20} className="text-primary" />
                <Text className="text-[20px] font-black tracking-tight text-foreground">{title}</Text>
            </View>
            <View>{children}</View>
        </View>
    );
}

interface TrendRowProps {
    trend: ExploreTrend;
    onPress?: () => void;
}

export const TrendRow = React.memo(function TrendRow({ trend, onPress }: TrendRowProps) {
    return (
        <Pressable
            className="py-4 border-b border-border/40 active:opacity-70"
            onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onPress?.();
            }}
            accessibilityLabel={`Trend: ${trend.title}`}
            accessibilityHint={`View details about ${trend.title}`}
            accessibilityRole="button"
        >
            <Text className="text-[12px] uppercase tracking-[0.2em] text-muted-foreground mb-1">{trend.category}</Text>
            <Text className="text-[18px] font-black text-foreground tracking-tight">
                {trend.title}
            </Text>
            {!!trend.subtitle && (
                <Text className="text-[13px] text-muted-foreground mt-1" numberOfLines={2}>{trend.subtitle}</Text>
            )}
            {!!trend.tweetVolume && (
                <Text className="text-[12px] text-muted-foreground mt-2">{trend.tweetVolume}</Text>
            )}
        </Pressable>
    );
});

interface TrendCardProps {
    trend: ExploreTrend;
    onPress?: () => void;
}

export const TrendCard = React.memo(function TrendCard({ trend, onPress }: TrendCardProps) {
    return (
        <Pressable
            className="rounded-3xl border border-border/60 bg-background/70 px-6 py-5 active:opacity-80"
            onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onPress?.();
            }}
            accessibilityLabel={`Trend: ${trend.title}`}
            accessibilityHint={`View details about ${trend.title}`}
            accessibilityRole="button"
        >
            <Text className="text-xs uppercase tracking-[0.22em] text-muted-foreground mb-2">{trend.category}</Text>
            <Text className="text-[21px] font-black text-foreground tracking-tight" numberOfLines={2}>{trend.title}</Text>
            {!!trend.subtitle && (
                <Text className="text-[13px] text-muted-foreground mt-2" numberOfLines={2}>{trend.subtitle}</Text>
            )}
            {!!trend.tweetVolume && (
                <Text className="text-[12px] text-muted-foreground/80 mt-4">{trend.tweetVolume}</Text>
            )}
        </Pressable>
    );
});

interface StoryCardProps {
    story: ExploreStory;
    onPress?: () => void;
}

export const StoryCard = React.memo(function StoryCard({ story, onPress }: StoryCardProps) {
    return (
        <Pressable
            className="flex-row gap-4 py-4 active:opacity-80"
            onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onPress?.();
            }}
            accessibilityLabel={`Story: ${story.headline}`}
            accessibilityHint={`Read ${story.headline}`}
            accessibilityRole="button"
        >
            <View className="flex-1 gap-2">
                <Text className="text-[16px] font-black text-foreground tracking-tight" numberOfLines={2}>
                    {story.headline}
                </Text>
                <Text className="text-[13px] text-muted-foreground" numberOfLines={2}>
                    {story.summary}
                </Text>
                <Text className="text-[12px] text-muted-foreground/80">{story.timestamp}</Text>
            </View>
            <View className="h-20 w-20 rounded-2xl bg-muted overflow-hidden">
                <Image
                    source={story.image}
                    className="h-20 w-20"
                    contentFit="cover"
                    transition={200}
                />
            </View>
        </Pressable>
    );
});

interface StoryHeroProps {
    story: ExploreStory;
    onPress?: () => void;
}

export const StoryHero = React.memo(function StoryHero({ story, onPress }: StoryHeroProps) {
    return (
        <Pressable
            className="overflow-hidden rounded-[2.5rem] border border-border/70 bg-background active:opacity-90"
            onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onPress?.();
            }}
            accessibilityLabel={`Featured story: ${story.headline}`}
            accessibilityHint={`Read featured story ${story.headline}`}
            accessibilityRole="button"
        >
            <View className="w-full h-48 bg-muted overflow-hidden relative">
                <Image
                    source={story.image}
                    className="w-full h-48"
                    contentFit="cover"
                    transition={200}
                />
            </View>
            <View className="p-6 gap-3">
                <Text className="text-sm uppercase tracking-[0.3em] text-primary">Top story</Text>
                <Text className="text-[24px] font-black tracking-tight text-foreground" numberOfLines={2}>{story.headline}</Text>
                <Text className="text-[14px] text-muted-foreground" numberOfLines={3}>{story.summary}</Text>
                <Text className="text-[12px] text-muted-foreground/70">{story.timestamp}</Text>
            </View>
        </Pressable>
    );
});

interface StoryItemProps {
    story: ExploreStory;
    onPress?: () => void;
}

export const StoryItem = React.memo(function StoryItem({ story, onPress }: StoryItemProps) {
    return (
        <Pressable
            className="flex-row gap-4 py-4 border-b border-border/40 active:opacity-80"
            onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onPress?.();
            }}
            accessibilityLabel={`Story: ${story.headline}`}
            accessibilityHint={`Read ${story.headline}`}
            accessibilityRole="button"
        >
            <View className="flex-1 gap-2">
                <Text className="text-[17px] font-black text-foreground tracking-tight" numberOfLines={2}>{story.headline}</Text>
                <Text className="text-[13px] text-muted-foreground" numberOfLines={2}>{story.summary}</Text>
                <Text className="text-[12px] text-muted-foreground/80">{story.timestamp}</Text>
            </View>
            <View className="h-20 w-20 rounded-2xl bg-muted overflow-hidden">
                <Image
                    source={story.image}
                    className="h-20 w-20"
                    contentFit="cover"
                    transition={200}
                />
            </View>
        </Pressable>
    );
});

interface CreatorRowProps {
    creator: ExploreCreator;
    onPress?: () => void;
    onFollow?: () => void;
}

export const CreatorRow = React.memo(function CreatorRow({ creator, onPress, onFollow }: CreatorRowProps) {
    return (
        <Pressable
            className="flex-row items-center gap-4 py-4 active:opacity-80"
            onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onPress?.();
            }}
            accessibilityLabel={`Creator: ${creator.name}`}
            accessibilityHint={`View ${creator.name}'s profile`}
            accessibilityRole="button"
        >
            <View className="h-12 w-12 rounded-full bg-muted overflow-hidden relative">
                <Image
                    source={creator.avatar}
                    className="h-12 w-12"
                    contentFit="cover"
                    transition={200}
                />
            </View>
            <View className="flex-1 gap-1">
                <Text className="text-[15px] font-black tracking-tight text-foreground">{creator.name}</Text>
                <Text className="text-[13px] text-muted-foreground">{creator.handle}</Text>
                <Text className="text-[12px] text-muted-foreground/80" numberOfLines={1}>{creator.reason}</Text>
            </View>
            <Pressable
                className="px-4 py-2 rounded-full border border-primary/60 bg-primary/10 active:scale-95"
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    onFollow?.();
                }}
                accessibilityLabel={`Follow ${creator.name}`}
                accessibilityHint={`Follow ${creator.name} on Showcase`}
                accessibilityRole="button"
            >
                <Text className="text-[12px] font-semibold text-primary tracking-wide">Follow</Text>
            </Pressable>
        </Pressable>
    );
});

interface CreatorCardProps {
    creator: ExploreCreator;
    onPress?: () => void;
    onFollow?: () => void;
}

export const CreatorCard = React.memo(function CreatorCard({ creator, onPress, onFollow }: CreatorCardProps) {
    return (
        <Pressable
            className="flex-row items-center gap-4 px-5 py-4 border border-border/60 rounded-[2.5rem] bg-background/80 active:opacity-80"
            onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onPress?.();
            }}
            accessibilityLabel={`Creator: ${creator.name}`}
            accessibilityHint={`View ${creator.name}'s profile`}
            accessibilityRole="button"
        >
            <View className="h-14 w-14 rounded-full bg-muted overflow-hidden relative">
                <Image
                    source={creator.avatar}
                    className="h-14 w-14"
                    contentFit="cover"
                    transition={200}
                />
            </View>
            <View className="flex-1 gap-1.5">
                <Text className="text-[16px] font-black tracking-tight text-foreground">{creator.name}</Text>
                <Text className="text-[13px] text-muted-foreground">{creator.handle}</Text>
                <Text className="text-[12px] text-muted-foreground/80" numberOfLines={1}>{creator.reason}</Text>
            </View>
            <Pressable
                className="px-5 py-2 rounded-full border border-primary/70 bg-primary/10 active:scale-95"
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    onFollow?.();
                }}
                accessibilityLabel={`Follow ${creator.name}`}
                accessibilityHint={`Follow ${creator.name} on Showcase`}
                accessibilityRole="button"
            >
                <Text className="text-[12px] font-semibold text-primary tracking-wide">Follow</Text>
            </Pressable>
        </Pressable>
    );
});

interface TopicChipsProps {
    topics: { id: string; label: string }[];
}

export function TopicChips({ topics }: TopicChipsProps) {
    if (!topics?.length) return null;

    return (
        <View className="flex-row gap-2">
            {topics.map((topic) => (
                <View
                    key={topic.id}
                    className="px-4 py-2 rounded-full border border-border/70 bg-background/80"
                >
                    <Text className="text-[13px] font-semibold text-muted-foreground">{topic.label}</Text>
                </View>
            ))}
        </View>
    );
}
