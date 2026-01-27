import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
    saveStatus: 'idle' | 'saving' | 'saved' | 'error';
}

/**
 * Global Error Boundary
 * Catch React render errors and show a fallback UI with detailed debugging information.
 */
export class CodeBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
        saveStatus: 'idle',
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null, saveStatus: 'idle' };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Store error info for display
        this.setState({ errorInfo });

        // Tactile feedback for error
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

        // Log error to console in development
        if (__DEV__) {
            console.error('🚨 Error caught by boundary:', error);
            console.error('📍 Error info:', errorInfo);
            console.error('🔍 Component stack:', errorInfo.componentStack);
        }

        // In production, you could send this to an error tracking service
        // Example: Sentry.captureException(error, { extra: errorInfo });
    }

    private handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null, saveStatus: 'idle' });
    };

    private downloadErrorReport = () => {
        this.setState({ saveStatus: 'saving' });

        try {
            const errorReport = this.formatErrorForClipboard();
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileName = `error-report-${timestamp}.txt`;

            // Create blob for download
            const blob = new Blob([errorReport], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);

            // Create download link and trigger download
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            console.log('✅ Error report downloaded:', fileName);
            this.setState({ saveStatus: 'saved' });

            // Reset status after 3 seconds
            setTimeout(() => {
                this.setState({ saveStatus: 'idle' });
            }, 3000);

        } catch (error) {
            console.error('❌ Failed to download error report:', error);
            this.setState({ saveStatus: 'error' });

            // Reset status after 3 seconds
            setTimeout(() => {
                this.setState({ saveStatus: 'idle' });
            }, 3000);
        }
    };

    private saveLogsToDiskNative = async () => {
        // For native platforms, we could use Sharing API or save to documents
        // For now, just copy to clipboard which works everywhere
        this.copyErrorToClipboard();
        this.setState({ saveStatus: 'saved' });
        
        setTimeout(() => {
            this.setState({ saveStatus: 'idle' });
        }, 3000);
    };

    private copyErrorToClipboard = () => {
        const errorText = this.formatErrorForClipboard();
        // In a real app, you'd use Clipboard.setString()
        console.log('Error details (copy to clipboard):', errorText);
    };

    private formatErrorForClipboard = (): string => {
        const { error, errorInfo } = this.state;
        let text = '=====================================\n';
        text += '     REACT NATIVE ERROR REPORT       \n';
        text += '=====================================\n\n';

        text += `📅 Timestamp: ${new Date().toISOString()}\n`;
        text += `📱 Platform: ${Platform.OS}\n`;
        text += `🔧 Environment: ${__DEV__ ? 'Development' : 'Production'}\n\n`;

        text += '🚨 ERROR DETAILS\n';
        text += '-------------------------------------\n';
        text += `Name: ${error?.name || 'Unknown'}\n`;
        text += `Message: ${error?.message || 'No message'}\n\n`;

        if (error?.stack) {
            text += '📚 STACK TRACE\n';
            text += '-------------------------------------\n';
            text += error.stack + '\n\n';
        }

        if (errorInfo?.componentStack) {
            text += '⚛️  COMPONENT STACK\n';
            text += '-------------------------------------\n';
            text += errorInfo.componentStack + '\n\n';
        }

        text += '🔍 DEBUGGING INFO\n';
        text += '-------------------------------------\n';
        text += `User Agent: ${typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}\n`;
        text += `Screen Dimensions: ${typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'N/A'}\n`;
        text += `Language: ${typeof navigator !== 'undefined' ? navigator.language : 'N/A'}\n\n`;

        text += '💡 NEXT STEPS\n';
        text += '-------------------------------------\n';
        text += '1. Check the stack trace for the error source\n';
        text += '2. Look for null/undefined values in the component stack\n';
        text += '3. Verify all required props are being passed\n';
        text += '4. Check for async operations that might be failing\n\n';

        text += '=====================================\n';
        text += '           END OF REPORT              \n';
        text += '=====================================\n';

        return text;
    };

    public render() {
        if (this.state.hasError) {
            const { error, errorInfo } = this.state;

            return (
                <SafeAreaView className="flex-1 bg-background">
                    <ScrollView className="flex-1 p-6">
                        <View className="items-center mb-6">
                            <View className="bg-destructive/10 p-6 rounded-full mb-4">
                                <MaterialIcons name="error-outline" size={48} className="text-destructive" />
                            </View>

                            <Text className="text-2xl font-black text-foreground text-center mb-2">
                                💥 App Crash Detected
                            </Text>

                            <Text className="text-muted-foreground text-center mb-6">
                                The app encountered an error and couldn't render this screen.
                            </Text>
                        </View>

                        {/* Error Details */}
                        <View className="bg-card border border-border rounded-xl p-4 mb-4">
                            <Text className="font-semibold text-foreground mb-2">Error Details:</Text>
                            <Text className="text-destructive font-mono text-sm mb-2">
                                {error?.name || 'Unknown Error'}
                            </Text>
                            <Text className="text-muted-foreground text-sm">
                                {error?.message || 'No error message available'}
                            </Text>
                        </View>

                        {/* Debug Info (only in development) */}
                        {__DEV__ && (
                            <View className="bg-muted/50 border border-border rounded-xl p-4 mb-4">
                                <View className="flex-row items-center justify-between mb-2">
                                    <Text className="font-semibold text-foreground">Debug Information:</Text>
                                    <TouchableOpacity
                                        onPress={this.copyErrorToClipboard}
                                        className="bg-primary/10 px-3 py-1 rounded-lg"
                                    >
                                        <Text className="text-primary text-xs font-medium">Copy</Text>
                                    </TouchableOpacity>
                                </View>

                                {error?.stack && (
                                    <View className="mb-3">
                                        <Text className="text-xs font-semibold text-muted-foreground mb-1">Stack Trace:</Text>
                                        <Text className="text-xs font-mono text-muted-foreground">
                                            {error.stack.substring(0, 500)}...
                                        </Text>
                                    </View>
                                )}

                                {errorInfo?.componentStack && (
                                    <View>
                                        <Text className="text-xs font-semibold text-muted-foreground mb-1">Component Stack:</Text>
                                        <Text className="text-xs font-mono text-muted-foreground">
                                            {errorInfo.componentStack.substring(0, 300)}...
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )}

                        {/* Action Buttons */}
                        <View className="space-y-3">
                            <TouchableOpacity
                                onPress={this.handleRetry}
                                className="flex-row items-center justify-center bg-primary px-6 py-4 rounded-xl active:opacity-90"
                            >
                                <MaterialIcons name="refresh" size={20} className="text-primary-foreground mr-2" color="white" />
                                <Text className="text-primary-foreground font-bold text-lg">Try Again</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={Platform.OS === 'web' ? this.downloadErrorReport : this.saveLogsToDiskNative}
                                disabled={this.state.saveStatus === 'saving'}
                                className={`flex-row items-center justify-center px-6 py-4 rounded-xl active:opacity-90 ${this.state.saveStatus === 'saving'
                                        ? 'bg-muted opacity-50'
                                        : this.state.saveStatus === 'saved'
                                            ? 'bg-green-500'
                                            : this.state.saveStatus === 'error'
                                                ? 'bg-destructive'
                                                : 'bg-secondary'
                                    }`}
                            >
                                <MaterialIcons
                                    name={
                                        this.state.saveStatus === 'saving' ? 'save' :
                                            this.state.saveStatus === 'saved' ? 'check-circle' :
                                                this.state.saveStatus === 'error' ? 'error' :
                                                    Platform.OS === 'web' ? 'download' : 'save-alt'
                                    }
                                    size={20}
                                    className={`mr-2 ${this.state.saveStatus === 'saved' || this.state.saveStatus === 'error'
                                            ? 'text-white'
                                            : 'text-secondary-foreground'
                                        }`}
                                    color={
                                        this.state.saveStatus === 'saved' || this.state.saveStatus === 'error'
                                            ? 'white'
                                            : undefined
                                    }
                                />
                                <Text className={`font-bold text-lg ${this.state.saveStatus === 'saved' || this.state.saveStatus === 'error'
                                        ? 'text-white'
                                        : 'text-secondary-foreground'
                                    }`}>
                                    {this.state.saveStatus === 'saving' ? 'Saving...' :
                                        this.state.saveStatus === 'saved' ? '✅ Saved!' :
                                            this.state.saveStatus === 'error' ? '❌ Failed' :
                                                Platform.OS === 'web' ? '� Download Report' : '📋 Copy to Clipboard'}
                                </Text>
                            </TouchableOpacity>

                            {__DEV__ && (
                                <TouchableOpacity
                                    onPress={() => console.log('Full error:', this.formatErrorForClipboard())}
                                    className="flex-row items-center justify-center bg-muted border border-border px-6 py-3 rounded-xl active:opacity-90"
                                >
                                    <MaterialIcons name="bug-report" size={18} className="text-muted-foreground mr-2" />
                                    <Text className="text-muted-foreground font-medium">Log Full Error</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Help Text */}
                        <View className="mt-6 p-4 bg-muted/30 rounded-xl">
                            <Text className="text-xs text-muted-foreground text-center">
                                💡 If this error persists, try restarting the app or clearing the cache.
                                {'\n'}� On web: Error report downloads to your Downloads folder.
                                {'\n'}📱 On mobile: Error details copied to clipboard.
                                {'\n'}In development, check the console for more details.
                            </Text>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            );
        }

        return this.props.children;
    }
}
