import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/registry/nativewind/components/ui/text';
import { Icon } from '@/components/ui/Icon';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFeedback } from '@/hooks/useFeedback';

interface ConstructionViewProps {
    name: string;
    onBack?: () => void;
}

export function ConstructionView({ name, onBack }: ConstructionViewProps) {
    const { impact } = useFeedback();

    const handleBack = () => {
        impact();
        onBack?.();
    };

    return (
        <View className="flex-1 items-center justify-center bg-background p-8">
            <View className="max-w-md w-full items-center">
                {/* Icon */}
                <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-6">
                    <Icon as={MaterialIcons} name="construction" size={40} className="text-primary" />
                </View>

                {/* Title */}
                <Text className="text-2xl font-bold text-foreground mb-2 text-center">
                    {name}
                </Text>

                {/* Description */}
                <Text className="text-muted-foreground text-center mb-8 leading-relaxed">
                    This channel is currently under construction. We're building something amazing for you!
                </Text>

                {/* Features List */}
                <View className="w-full space-y-3 mb-8">
                    <View className="flex-row items-center gap-3">
                        <View className="w-6 h-6 bg-success/10 rounded-full items-center justify-center">
                            <Icon as={MaterialIcons} name="check" size={12} className="text-success" />
                        </View>
                        <Text className="text-foreground text-sm">Enhanced security features</Text>
                    </View>
                    <View className="flex-row items-center gap-3">
                        <View className="w-6 h-6 bg-success/10 rounded-full items-center justify-center">
                            <Icon as={MaterialIcons} name="check" size={12} className="text-success" />
                        </View>
                        <Text className="text-foreground text-sm">Real-time collaboration</Text>
                    </View>
                    <View className="flex-row items-center gap-3">
                        <View className="w-6 h-6 bg-success/10 rounded-full items-center justify-center">
                            <Icon as={MaterialIcons} name="check" size={12} className="text-success" />
                        </View>
                        <Text className="text-foreground text-sm">Advanced analytics</Text>
                    </View>
                </View>

                {/* Back Button */}
                {onBack && (
                    <Pressable
                        onPress={handleBack}
                        className="bg-primary/10 px-6 py-3 rounded-full active:bg-primary/20 transition-colors"
                    >
                        <Text className="text-primary font-semibold">Back to Main Channel</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}
