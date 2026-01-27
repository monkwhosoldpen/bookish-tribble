import * as React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/registry/components/ui/text';
import { cn } from '@/registry/lib/utils';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  type?: 'network' | 'server' | 'general';
  className?: string;
}

export function ErrorState({ 
  title = 'Something went wrong', 
  message, 
  onRetry, 
  onDismiss,
  type = 'general',
  className 
}: ErrorStateProps) {
  const getIcon = () => {
    switch (type) {
      case 'network':
        return <MaterialIcons name="wifi-off" size={32} className="text-muted-foreground" />;
      case 'server':
        return <MaterialIcons name="error" size={32} className="text-muted-foreground" />;
      default:
        return <MaterialIcons name="warning" size={32} className="text-muted-foreground" />;
    }
  };

  const getActionLabel = () => {
    if (onRetry) {
      return type === 'network' ? 'Check Connection' : 'Try Again';
    }
    return null;
  };

  return (
    <View className={cn('flex-1 items-center justify-center p-8', className)}>
      <View className="w-20 h-20 bg-destructive/10 rounded-full items-center justify-center mb-6">
        {getIcon()}
      </View>
      
      <Text className="text-2xl font-bold text-foreground text-center mb-3">
        {title}
      </Text>
      
      <Text className="text-muted-foreground text-center mb-8 leading-relaxed">
        {message}
      </Text>
      
      <View className="gap-3">
        {onRetry && (
          <Pressable
            onPress={onRetry}
            className="bg-primary px-6 py-3 rounded-xl active:scale-[0.98] active:opacity-90 flex-row items-center gap-2"
          >
            <MaterialIcons name="refresh" size={16} className="text-primary-foreground" />
            <Text className="text-primary-foreground font-semibold">
              {getActionLabel()}
            </Text>
          </Pressable>
        )}
        
        {onDismiss && (
          <Pressable
            onPress={onDismiss}
            className="px-6 py-3 rounded-xl active:opacity-70"
          >
            <Text className="text-muted-foreground font-medium">
              Dismiss
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

// Specific error state components for common scenarios
export function NetworkErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="No internet connection"
      message="Please check your internet connection and try again. We'll automatically reconnect when you're back online."
      onRetry={onRetry}
      type="network"
    />
  );
}

export function ServerErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Server temporarily unavailable"
      message="Our servers are experiencing some issues. Please try again in a few moments. We're working on fixing this as quickly as possible."
      onRetry={onRetry}
      type="server"
    />
  );
}

export function GeneralErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Something went wrong"
      message="An unexpected error occurred. Please try again. If the problem persists, contact our support team."
      onRetry={onRetry}
      type="general"
    />
  );
}
