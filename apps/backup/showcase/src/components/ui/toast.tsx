import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface ErrorToastProps {
  message: string;
  onDismiss: () => void;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export function ErrorToast({ message, onDismiss, action }: ErrorToastProps) {
  return (
    <View className="bg-background border border-destructive rounded-lg p-4 mx-4 mb-4 shadow-lg">
      <View className="flex-row items-start gap-3">
        <MaterialIcons name="warning" className="text-destructive mt-0.5" size={20} />
        <View className="flex-1 gap-1">
          <Text className="text-destructive font-semibold text-sm">
            Error
          </Text>
          <Text className="text-destructive/80 text-sm leading-relaxed">
            {message}
          </Text>
          {action && (
            <Pressable
              onPress={action.onPress}
              className="mt-2 bg-destructive/10 px-3 py-1.5 rounded self-start active:opacity-80"
            >
              <Text className="text-destructive font-semibold text-xs">
                {action.label}
              </Text>
            </Pressable>
          )}
        </View>
        <Pressable
          onPress={onDismiss}
          className="p-1 active:opacity-70 rounded"
        >
          <MaterialIcons name="close" className="text-muted-foreground/60" size={16} />
        </Pressable>
      </View>
    </View>
  );
}

interface SuccessToastProps {
  message: string;
  onDismiss: () => void;
}

export function SuccessToast({ message, onDismiss }: SuccessToastProps) {
  return (
    <View className="bg-background border border-green-500/20 rounded-lg p-4 mx-4 mb-4 shadow-lg">
      <View className="flex-row items-start gap-3">
        <View className="w-5 h-5 bg-green-500/10 rounded-full items-center justify-center mt-0.5">
          <Text className="text-green-600 dark:text-green-400 font-bold text-xs">✓</Text>
        </View>
        <View className="flex-1">
          <Text className="text-foreground font-medium text-sm leading-relaxed">
            {message}
          </Text>
        </View>
        <Pressable
          onPress={onDismiss}
          className="p-1 active:opacity-70 rounded"
        >
          <MaterialIcons name="close" className="text-muted-foreground/60" size={16} />
        </Pressable>
      </View>
    </View>
  );
}

export function useToast() {
  const [toasts, setToasts] = React.useState<Array<{
    id: string;
    type: 'error' | 'success';
    message: string;
    action?: {
      label: string;
      onPress: () => void;
    };
  }>>([]);

  const timeoutRefs = React.useRef<Map<string, NodeJS.Timeout>>(new Map());

  const showToast = React.useCallback((
    type: 'error' | 'success',
    message: string,
    action?: {
      label: string;
      onPress: () => void;
    }
  ) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message, action }]);
    
    // Auto-dismiss after 5 seconds with cleanup
    const timeoutId = setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
      timeoutRefs.current.delete(id);
    }, 5000);
    
    timeoutRefs.current.set(id, timeoutId);
  }, []);

  const dismissToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
    const timeoutId = timeoutRefs.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutRefs.current.delete(id);
    }
  }, []);

  const showError = React.useCallback((message: string, action?: { label: string; onPress: () => void }) => {
    showToast('error', message, action);
  }, [showToast]);

  const showSuccess = React.useCallback((message: string) => {
    showToast('success', message);
  }, [showToast]);

  // Cleanup all timeouts on unmount
  React.useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(timeoutId => clearTimeout(timeoutId));
      timeoutRefs.current.clear();
    };
  }, []);

  return {
    toasts,
    showError,
    showSuccess,
    dismissToast,
  };
}
