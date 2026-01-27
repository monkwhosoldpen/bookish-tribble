import * as React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description: string;
    action?: {
        label: string;
        onPress: () => void;
    };
    className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
    return (
        <View className={cn('flex-1 items-center justify-center p-8', className)}>
            {icon && (
                <View className="w-20 h-20 bg-muted rounded-full items-center justify-center mb-6">
                    {icon}
                </View>
            )}

            <Text className="text-2xl font-bold text-foreground text-center mb-3">
                {title}
            </Text>

            <Text className="text-muted-foreground text-center mb-8 leading-relaxed">
                {description}
            </Text>

            {action && (
                <Pressable
                    onPress={action.onPress}
                    className="bg-primary px-6 py-3 rounded-xl active:opacity-90"
                >
                    <Text className="text-primary-foreground font-semibold">
                        {action.label}
                    </Text>
                </Pressable>
            )}
        </View>
    );
}

export function EmptyChatsState({ onExplore }: { onExplore: () => void }) {
    return (
        <EmptyState
            icon={<MaterialIcons name="chat" size={32} className="text-muted-foreground" />}
            title="No conversations yet"
            description="Start exploring and following channels to see your conversations here. Your chat history will appear as you interact with the community."
            action={{
                label: 'Explore Channels',
                onPress: onExplore
            }}
        />
    );
}

export function EmptyExploreState({ onRefresh }: { onRefresh: () => void }) {
    return (
        <EmptyState
            icon={<MaterialIcons name="search" size={32} className="text-muted-foreground" />}
            title="Discover new channels"
            description="Explore trending channels, discover new content creators, and find communities that match your interests. Start your journey here!"
            action={{
                label: 'Refresh',
                onPress: onRefresh
            }}
        />
    );
}

export function EmptyFollowingState({ onExplore }: { onExplore: () => void }) {
    return (
        <EmptyState
            icon={<MaterialIcons name="people" size={32} className="text-muted-foreground" />}
            title="No followed channels"
            description="Follow channels to see their latest updates in your feed. Discover amazing content creators and stay connected with your favorite communities."
            action={{
                label: 'Explore Channels',
                onPress: onExplore
            }}
        />
    );
}

export function EmptyFavouritesState({ onExplore }: { onExplore: () => void }) {
    return (
        <EmptyState
            icon={<MaterialIcons name="people" size={32} className="text-muted-foreground" />}
            title="No favorite channels"
            description="Save your favorite channels to quickly access their content. Build your personal collection of the best channels and content creators."
            action={{
                label: 'Explore Channels',
                onPress: onExplore
            }}
        />
    );
}
