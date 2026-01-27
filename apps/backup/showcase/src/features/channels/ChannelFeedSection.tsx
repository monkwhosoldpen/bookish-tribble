import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text } from '@/registry/components/ui/text';
import { Icon } from '@/registry/components/ui/icon';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useChannelContext } from './ChannelContext';

export function ChannelFeedSection() {
    const { sidebarChannels } = useChannelContext();

    const socialSources = sidebarChannels.filter(c => c.type === 'social' || c.type === 'broadcast');
    const internalSources = sidebarChannels.filter(c => c.type === 'public' || c.type === 'ai_agent');

    return (
        <View className="flex-1 bg-card rounded-[24px] border border-border shadow-lg shadow-black/10 overflow-hidden">
            {/* HUD Header */}
            <View className="px-6 py-4 bg-muted/20 border-b border-border/50 flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                    <View className="w-8 h-8 rounded-lg bg-primary/10 items-center justify-center">
                        <Icon as={MaterialIcons} name="radio" size={18} className="text-primary" />
                    </View>
                    <View>
                        <Text className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none">Transmission Control</Text>
                        <Text className="text-xs font-bold text-foreground mt-1">Available Frequencies</Text>
                    </View>
                </View>
                <View className="flex-row items-center gap-1">
                    <View className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    <Text className="text-[10px] font-black uppercase text-success tracking-tighter">Sync Active</Text>
                </View>
            </View>

            <ScrollView className="flex-1 p-2" showsVerticalScrollIndicator={false}>
                {/* Global Sources */}
                <View className="p-3">
                    <View className="flex-row items-center gap-2 mb-3 px-2">
                        <Icon as={MaterialIcons} name="public" size={14} className="text-muted-foreground/50" />
                        <Text className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">Global Sources</Text>
                    </View>
                    <View className="gap-2">
                        {socialSources.map(source => (
                            <Pressable
                                key={source.id}
                                className="bg-muted/30 p-4 rounded-2xl border border-transparent active:border-border flex-row items-center"
                            >
                                <View className="w-10 h-10 rounded-xl bg-background items-center justify-center mr-4 border border-border/50">
                                    <Icon as={MaterialIcons} name={source.type === 'broadcast' ? 'podcasts' : 'public'} size={20} className="text-primary" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm font-bold text-foreground">{source.name}</Text>
                                    <Text className="text-[10px] text-muted-foreground mt-0.5">Live transmission active</Text>
                                </View>
                                <Icon as={MaterialIcons} name="chevron-right" size={18} className="text-muted-foreground" />
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Secure Channels */}
                <View className="p-3 border-t border-border/30">
                    <View className="flex-row items-center gap-2 mb-3 px-2">
                        <Icon as={MaterialIcons} name="security" size={14} className="text-primary/50" />
                        <Text className="text-[10px] font-black text-primary/50 uppercase tracking-widest">Internal Secure Channels</Text>
                    </View>
                    <View className="gap-2">
                        {internalSources.map(source => (
                            <Pressable
                                key={source.id}
                                className="bg-muted/30 p-4 rounded-2xl border border-transparent active:border-border flex-row items-center"
                            >
                                <View className="w-10 h-10 rounded-xl bg-background items-center justify-center mr-4 border border-border/50">
                                    <Icon as={MaterialIcons} name="hash" size={20} className="text-primary" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm font-bold text-foreground">{source.name}</Text>
                                    <Text className="text-[10px] text-muted-foreground mt-0.5">Secure tunnel active</Text>
                                </View>
                                <Icon as={MaterialIcons} name="chevron-right" size={18} className="text-muted-foreground" />
                            </Pressable>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Bottom HUD */}
            <View className="px-6 py-3 bg-muted/10 border-t border-border/50">
                <Text className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest text-center">
                    END-TO-END ENCRYPTED QUANTUM TUNNEL
                </Text>
            </View>
        </View>
    );
}
