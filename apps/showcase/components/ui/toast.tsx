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
        <View className="bg-background border border-success/20 rounded-lg p-4 mx-4 mb-4 shadow-lg">
            <View className="flex-row items-start gap-3">
                <View className="w-5 h-5 bg-success/10 rounded-full items-center justify-center mt-0.5">
                    <Text className="text-success font-bold text-xs">✓</Text>
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

interface ToastItem {
    id: string;
    type: 'error' | 'success';
    message: string;
    action?: {
        label: string;
        onPress: () => void;
    };
}

interface ToastContextValue {
    toasts: ToastItem[];
    showError: (message: string, action?: { label: string; onPress: () => void }) => void;
    showSuccess: (message: string) => void;
    dismissToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<ToastItem[]>([]);
    const timeoutRefs = React.useRef<Map<string, NodeJS.Timeout>>(new Map());

    const showToast = React.useCallback((
        type: 'error' | 'success',
        message: string,
        action?: { label: string; onPress: () => void }
    ) => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, type, message, action }]);

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

    React.useEffect(() => {
        return () => {
            timeoutRefs.current.forEach(timeoutId => clearTimeout(timeoutId));
            timeoutRefs.current.clear();
        };
    }, []);

    const value = React.useMemo(() => ({
        toasts,
        showError,
        showSuccess,
        dismissToast,
    }), [toasts, showError, showSuccess, dismissToast]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </ToastContext.Provider>
    );
}

function ToastContainer({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: string) => void }) {
    if (toasts.length === 0) return null;

    return (
        <View className="absolute bottom-0 left-0 right-0 z-50" pointerEvents="box-none">
            {toasts.map(toast => (
                toast.type === 'error' ? (
                    <ErrorToast
                        key={toast.id}
                        message={toast.message}
                        onDismiss={() => onDismiss(toast.id)}
                        action={toast.action}
                    />
                ) : (
                    <SuccessToast
                        key={toast.id}
                        message={toast.message}
                        onDismiss={() => onDismiss(toast.id)}
                    />
                )
            ))}
        </View>
    );
}

export function useToast() {
    const context = React.useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
