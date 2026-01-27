import * as React from 'react';
import { View, Animated } from 'react-native';
import { cn } from '@/registry/lib/utils';

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
  animated?: boolean;
}

export function Skeleton({ className, children, animated = true, ...props }: SkeletonProps) {
  const opacityValue = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    if (!animated) return;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    
    animation.start();
    
    return () => animation.stop();
  }, [animated, opacityValue]);

  if (animated) {
    return (
      <Animated.View
        className={cn(
          'bg-muted rounded-md',
          className
        )}
        style={{
          opacity: opacityValue,
        }}
        {...props}
      >
        {children}
      </Animated.View>
    );
  }

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

export function ChatSkeleton({ animated = true }: { animated?: boolean }) {
  return (
    <View className="flex-row items-center gap-3 p-4">
      <Skeleton className="w-12 h-12 rounded-full" animated={animated} />
      <View className="flex-1 gap-2">
        <Skeleton className="h-4 w-24" animated={animated} />
        <Skeleton className="h-3 w-32" animated={animated} />
      </View>
      <Skeleton className="h-3 w-12" animated={animated} />
    </View>
  );
}

export function ExploreSkeleton({ animated = true }: { animated?: boolean }) {
  return (
    <View className="p-4 gap-4">
      <View className="flex-row gap-3">
        <Skeleton className="w-20 h-20 rounded-lg" animated={animated} />
        <View className="flex-1 gap-2">
          <Skeleton className="h-5 w-32" animated={animated} />
          <Skeleton className="h-4 w-48" animated={animated} />
          <Skeleton className="h-3 w-24" animated={animated} />
        </View>
      </View>
      <View className="flex-row gap-3">
        <Skeleton className="w-20 h-20 rounded-lg" animated={animated} />
        <View className="flex-1 gap-2">
          <Skeleton className="h-5 w-32" animated={animated} />
          <Skeleton className="h-4 w-48" animated={animated} />
          <Skeleton className="h-3 w-24" animated={animated} />
        </View>
      </View>
    </View>
  );
}

// Transition component for smooth loading to content
export function SkeletonTransition({ 
  loading, 
  children, 
  skeleton 
}: { 
  loading: boolean; 
  children: React.ReactNode; 
  skeleton: React.ReactNode; 
}) {
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const contentFadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (loading) {
      // Fade out content, show skeleton
      Animated.parallel([
        Animated.timing(contentFadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Fade in content, hide skeleton
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(contentFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading, fadeAnim, contentFadeAnim]);

  return (
    <View className="flex-1">
      <Animated.View
        style={{
          opacity: fadeAnim,
          position: loading ? 'relative' : 'absolute',
          zIndex: loading ? 1 : 0,
        }}
        className="w-full"
      >
        {skeleton}
      </Animated.View>
      
      <Animated.View
        style={{
          opacity: contentFadeAnim,
          position: !loading ? 'relative' : 'absolute',
          zIndex: !loading ? 1 : 0,
        }}
        className="w-full"
      >
        {children}
      </Animated.View>
    </View>
  );
}
