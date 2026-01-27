import * as React from 'react';
import { View } from 'react-native';
import { cn } from '@/registry/lib/utils';

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export function Skeleton({ className, children, ...props }: SkeletonProps) {
  return (
    <View
      className={cn(
        'bg-muted animate-pulse rounded-md',
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}

export function ChatSkeleton() {
  return (
    <View className="flex-row items-center gap-3 p-4">
      <Skeleton className="w-12 h-12 rounded-full" />
      <View className="flex-1 gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
      </View>
      <Skeleton className="h-3 w-12" />
    </View>
  );
}

export function ExploreSkeleton() {
  return (
    <View className="p-4 gap-4">
      <View className="flex-row gap-3">
        <Skeleton className="w-20 h-20 rounded-lg" />
        <View className="flex-1 gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-24" />
        </View>
      </View>
      <View className="flex-row gap-3">
        <Skeleton className="w-20 h-20 rounded-lg" />
        <View className="flex-1 gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-24" />
        </View>
      </View>
    </View>
  );
}

export function SettingsSkeleton() {
  return (
    <View className="p-4 gap-4">
      <Skeleton className="h-6 w-32" />
      <View className="gap-3">
        <View className="flex-row items-center justify-between p-3 bg-card rounded-lg">
          <View className="gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </View>
          <Skeleton className="w-8 h-8 rounded" />
        </View>
        <View className="flex-row items-center justify-between p-3 bg-card rounded-lg">
          <View className="gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </View>
          <Skeleton className="w-8 h-8 rounded" />
        </View>
      </View>
    </View>
  );
}
