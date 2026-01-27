import React, { useState } from 'react';
import { View, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { cn } from '@/registry/lib/utils';
import { Icon } from '@/registry/components/ui/icon';
import { Text } from '@/registry/components/ui/text';
import { useNotifications } from '@/contexts/NotificationContext';
import { useFirebaseMessaging } from '@/hooks/useFirebaseMessaging';
import { Platform } from 'react-native';

export const NotificationDebugNative = React.memo(function NotificationDebugNative() {
    const {
        enabled,
        isRegistering,
        pushToken: token,
        enable
    } = useNotifications();
    
    const firebaseMessaging = useFirebaseMessaging();
    const [isExpanded, setIsExpanded] = useState(false);
    const [debugLogs, setDebugLogs] = useState<string[]>([]);

    const addLog = (message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setDebugLogs(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 10));
    };

    const runDiagnostics = async () => {
        addLog("🔍 Starting diagnostics...");
        
        // Check platform
        addLog(`📱 Platform: ${Platform.OS}`);
        
        // Check Firebase availability
        try {
            const hasFirebase = !!require('@react-native-firebase/messaging').default;
            addLog(hasFirebase ? "✅ Firebase module available" : "❌ Firebase module missing");
        } catch (e) {
            addLog(`❌ Firebase import failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
        }
        
        // Check permissions
        try {
            const hasPermission = await firebaseMessaging.requestPermission();
            addLog(hasPermission ? "✅ Permissions granted" : "❌ Permissions denied");
        } catch (e) {
            addLog(`❌ Permission check failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
        }
        
        // Check token
        try {
            const fcmToken = await firebaseMessaging.getToken();
            addLog(fcmToken ? `✅ Token: ${fcmToken.substring(0, 20)}...` : "❌ No token available");
        } catch (e) {
            addLog(`❌ Token check failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
        }
        
        addLog("🔍 Diagnostics complete");
    };

    const testNotification = async () => {
        addLog("🧪 Testing notification...");
        try {
            await enable();
            addLog("✅ Enable test completed");
        } catch (e) {
            addLog(`❌ Enable test failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
        }
    };

    return (
        <View className="bg-background px-6 py-6">
            {/* Debug Header */}
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-3">
                    <View className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 items-center justify-center">
                        <Icon as={MaterialIcons} name="bug-report" size={16} className="text-orange-500" />
                    </View>
                    <View>
                        <Text className="text-sm font-mono font-bold tracking-tighter uppercase text-orange-500">Debug // Native</Text>
                        <Text className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest">FCM // DIAGNOSTICS</Text>
                    </View>
                </View>
                
                <Pressable
                    onPress={() => setIsExpanded(!isExpanded)}
                    className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900"
                >
                    <Icon 
                        as={MaterialIcons} 
                        name={isExpanded ? "expand-less" : "expand-more"} 
                        size={16} 
                        className="text-zinc-500" 
                    />
                </Pressable>
            </View>

            {/* Status Overview */}
            <View className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mb-4">
                <View className="grid grid-cols-2 gap-4">
                    <View className="items-center">
                        <View className={cn(
                            "w-3 h-3 rounded-full mb-2",
                            enabled ? "bg-green-500" : "bg-red-500"
                        )} />
                        <Text className="text-xs font-mono text-zinc-600 dark:text-zinc-400">Status</Text>
                        <Text className="text-xs font-mono font-bold">
                            {enabled ? "ACTIVE" : "INACTIVE"}
                        </Text>
                    </View>
                    <View className="items-center">
                        <View className={cn(
                            "w-3 h-3 rounded-full mb-2",
                            token ? "bg-green-500" : "bg-yellow-500"
                        )} />
                        <Text className="text-xs font-mono text-zinc-600 dark:text-zinc-400">Token</Text>
                        <Text className="text-xs font-mono font-bold">
                            {token ? "VALID" : "NONE"}
                        </Text>
                    </View>
                </View>
            </View>

            {isExpanded && (
                <>
                    {/* Action Buttons */}
                    <View className="gap-2 mb-4">
                        <Pressable
                            onPress={runDiagnostics}
                            className="flex-row items-center gap-2 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20"
                        >
                            <Icon as={MaterialIcons} name="medical-services" size={16} className="text-orange-500" />
                            <Text className="text-sm font-mono font-bold text-orange-500">Run Diagnostics</Text>
                        </Pressable>
                        
                        <Pressable
                            onPress={testNotification}
                            disabled={isRegistering}
                            className="flex-row items-center gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20"
                        >
                            {isRegistering ? (
                                <ActivityIndicator size="small" color="#3b82f6" />
                            ) : (
                                <Icon as={MaterialIcons} name="send" size={16} className="text-blue-500" />
                            )}
                            <Text className="text-sm font-mono font-bold text-blue-500">Test Enable</Text>
                        </Pressable>
                    </View>

                    {/* Debug Logs */}
                    {debugLogs.length > 0 && (
                        <View className="p-4 rounded-xl bg-black/5 border border-zinc-200 dark:border-zinc-800">
                            <Text className="text-xs font-mono font-bold text-zinc-500 mb-2">Console Output</Text>
                            <ScrollView 
                                className="max-h-32" 
                                showsVerticalScrollIndicator={false}
                            >
                                {debugLogs.map((log, index) => (
                                    <Text key={index} className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400 mb-1">
                                        {log}
                                    </Text>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* Technical Details */}
                    <View className="mt-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                        <Text className="text-xs font-mono font-bold text-zinc-500 mb-3">Technical Details</Text>
                        
                        <View className="gap-2">
                            <View className="flex-row justify-between">
                                <Text className="text-xs font-mono text-zinc-600 dark:text-zinc-400">Platform:</Text>
                                <Text className="text-xs font-mono font-bold">{Platform.OS}</Text>
                            </View>
                            
                            <View className="flex-row justify-between">
                                <Text className="text-xs font-mono text-zinc-600 dark:text-zinc-400">Enabled:</Text>
                                <Text className="text-xs font-mono font-bold">{enabled ? "YES" : "NO"}</Text>
                            </View>
                            
                            <View className="flex-row justify-between">
                                <Text className="text-xs font-mono text-zinc-600 dark:text-zinc-400">Registering:</Text>
                                <Text className="text-xs font-mono font-bold">{isRegistering ? "YES" : "NO"}</Text>
                            </View>
                            
                            <View className="flex-row justify-between">
                                <Text className="text-xs font-mono text-zinc-600 dark:text-zinc-400">Token Length:</Text>
                                <Text className="text-xs font-mono font-bold">{token ? token.length : 0}</Text>
                            </View>
                            
                            {token && (
                                <View className="mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                                    <Text className="text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1">Token Preview:</Text>
                                    <Text className="text-[10px] font-mono text-zinc-500 break-all">
                                        {token.substring(0, 60)}...
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </>
            )}
        </View>
    );
});
