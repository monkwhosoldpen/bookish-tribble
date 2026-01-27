import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/components/ui/text';
import { cn } from '@/registry/lib/utils';

interface StateViewProps {
    title: string;
    description: string;
    action?: React.ReactNode;
    icon?: React.ReactNode;
}

export function EmptyState({ title, description, action, icon }: StateViewProps) {
    return (
        <View className="items-center justify-center py-16 px-6 gap-4">
            {icon}
            <Text className="text-2xl font-black tracking-tight text-foreground text-center">{title}</Text>
            <Text className="text-sm text-muted-foreground text-center leading-relaxed">
                {description}
            </Text>
            {action}
        </View>
    );
}

export function ErrorState({ title, description, action, icon }: StateViewProps) {
    return (
        <View className="items-center justify-center py-16 px-6 gap-4">
            {icon}
            <Text className="text-2xl font-black tracking-tight text-destructive text-center">{title}</Text>
            <Text className="text-sm text-muted-foreground text-center leading-relaxed">
                {description}
            </Text>
            {action}
        </View>
    );
}

interface SkeletonListProps {
    count?: number;
    className?: string;
}

export function TrendSkeleton({ className }: { className?: string }) {
    return (
        <View className={cn("py-4", className)}>
            <View className="h-3 w-32 bg-muted/50 rounded-full mb-3" />
            <View className="flex-row items-center justify-between">
                <View className="gap-2">
                    <View className="h-4 w-48 bg-muted/60 rounded-full" />
                    <View className="h-3 w-24 bg-muted/40 rounded-full" />
                </View>
                <View className="h-8 w-8 rounded-full bg-muted/30" />
            </View>
        </View>
    );
}

export function StorySkeleton({ className }: { className?: string }) {
    return (
        <View className={cn("flex-row gap-4 py-4", className)}>
            <View className="flex-1 gap-2">
                <View className="h-4 w-3/4 bg-muted/60 rounded-full" />
                <View className="h-3 w-full bg-muted/40 rounded-full" />
                <View className="h-3 w-2/3 bg-muted/40 rounded-full" />
                <View className="h-3 w-20 bg-muted/30 rounded-full" />
            </View>
            <View className="h-20 w-20 rounded-2xl bg-muted/40" />
        </View>
    );
}

export function CreatorSkeleton({ className }: { className?: string }) {
    return (
        <View className={cn("flex-row items-center gap-4 py-4", className)}>
            <View className="h-12 w-12 rounded-full bg-muted/40" />
            <View className="flex-1 gap-2">
                <View className="h-4 w-32 bg-muted/60 rounded-full" />
                <View className="h-3 w-40 bg-muted/40 rounded-full" />
            </View>
            <View className="h-8 w-20 rounded-full bg-muted/30" />
        </View>
    );
}

export function SkeletonSection({ count = 3, className }: SkeletonListProps) {
    return (
        <View className={className}>
            {Array.from({ length: count }).map((_, idx) => (
                <TrendSkeleton key={idx} />
            ))}
        </View>
    );
}
