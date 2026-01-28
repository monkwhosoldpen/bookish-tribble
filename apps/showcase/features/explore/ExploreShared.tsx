import * as React from 'react';
import { Platform, Pressable, View } from 'react-native';
import Animated, { FadeInDown, LinearTransition, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { Text } from '@/registry/nativewind/components/ui/text';
import { Icon } from '@/components/ui/Icon';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFeedback } from '@/hooks/useFeedback';
import { cn } from '@/registry/nativewind/lib/utils';

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
    const { impact } = useFeedback();

    const handleRefresh = React.useCallback(() => {
        impact();
        refresh(scenario ?? 'default');
    }, [refresh, scenario, impact]);

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
    action?: React.ReactNode;
}

export const SectionHeader = React.memo(function SectionHeader({ icon: IconComp, title, action }: SectionHeaderProps) {
    return (
        <View className="flex-row items-center justify-between py-2">
            <View className="flex-row items-center gap-3">
                {IconComp && <Icon as={IconComp} size={22} className="text-foreground" />}
                <Text className="text-xl font-black tracking-tight text-foreground">{title}</Text>
            </View>
            {action}
        </View>
    );
});

interface TitledSectionProps {
    title: string;
    children: React.ReactNode;
    icon: any;
}

export function TitledSection({ title, children, icon: IconComp }: TitledSectionProps) {
    return (
        <View className="gap-5">
            <SectionHeader icon={IconComp} title={title} />
            <View>{children}</View>
        </View>
    );
}

interface CreatorRowProps {
    creator: ExploreCreator;
    onPress?: () => void;
    onFollow?: () => void;
    isFollowed?: boolean;
    showFollowButton?: boolean;
}

export const CreatorRow = React.memo(function CreatorRow({ creator, onPress, onFollow, isFollowed, showFollowButton = true }: CreatorRowProps) {
    const { success, error } = useFeedback();

    return (
        <Animated.View
            entering={FadeInDown.springify()}
            layout={LinearTransition}
        >
            <Pressable
                className="flex-row items-center active:opacity-80 py-4"
                onPress={() => {
                    onPress?.();
                }}
            >
                <View className="h-12 w-12 rounded-full bg-muted overflow-hidden relative">
                    <Image
                        source={creator.avatar}
                        className="h-12 w-12"
                        contentFit="cover"
                    />
                </View>
                <View className="flex-1 ml-4">
                    <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-base font-black text-foreground" numberOfLines={1}>
                            {creator.name}
                        </Text>
                        {showFollowButton && onFollow && (
                            <Pressable
                                onPress={() => {
                                    if (isFollowed) {
                                        error('Unfollowed');
                                    } else {
                                        success('Following');
                                    }
                                    onFollow();
                                }}
                                className={cn(
                                    "px-4 py-1.5 rounded-full min-w-[80px] items-center",
                                    isFollowed ? "bg-muted border border-border" : "bg-foreground"
                                )}
                            >
                                <Text className={cn(
                                    "text-xs font-black",
                                    isFollowed ? "text-foreground" : "text-background"
                                )}>
                                    {isFollowed ? 'Following' : 'Follow'}
                                </Text>
                            </Pressable>
                        )}
                    </View>
                    <Text className="text-sm text-muted-foreground mb-1">{creator.handle}</Text>
                    <Text className="text-sm text-muted-foreground" numberOfLines={1}>{creator.reason}</Text>
                </View>
            </Pressable>
        </Animated.View>
    );
});
