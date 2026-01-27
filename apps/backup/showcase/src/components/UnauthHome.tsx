import { LoginForm } from '@/components/LoginForm';
import { View, Platform } from 'react-native';
import { Text } from '@/registry/components/ui/text';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import * as React from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { RnrIcon } from '@/components/icons/RnrIcon';

// Shared Content for Mobile and Desktop Right Panel
function AuthContent({ onLogin }: { onLogin: () => void }) {

    return (
        <View className="w-full max-w-sm md:max-w-[500px] mx-auto md:mx-0 px-8 md:px-0">
            <Animated.View
                entering={FadeInDown.delay(100).duration(800).springify()}
                className="mb-12 md:mb-16"
            >
                <RnrIcon className="w-10 h-10 md:w-14 md:h-14 text-primary mb-12" />

                <Text className="text-[42px] md:text-[64px] font-black tracking-tighter leading-[1.1] text-foreground mb-8">
                    Happening now
                </Text>

                <Text className="text-[24px] md:text-[32px] font-bold tracking-tight text-foreground/90">
                    Join Showcase today.
                </Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(400).duration(800).springify()} className="w-full max-w-[380px]">
                <LoginForm onLogin={onLogin} />
            </Animated.View>
        </View>
    );
}

function LeftPanelContent() {
    return (
        <View className="flex-1 bg-zinc-950 dark:bg-black items-center justify-center overflow-hidden relative">
            {/* Background Mesh Gradient - Subtle & Premium */}
            <View
                className="absolute w-[140%] h-[140%] bg-indigo-900/20 rounded-full blur-[100px] -top-[20%] -left-[20%]"
            />
            <View
                className="absolute w-[100%] h-[100%] bg-blue-900/10 rounded-full blur-[80px] bottom-0 right-0"
            />

            {/* Subtle Grid Pattern Overlay */}
            <View className="absolute inset-0 opacity-[0.03]"
                style={Platform.select({
                    web: {
                        backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                    } as any,
                    default: {}
                })}
            />

            {/* Giant Watermark Logo */}
            <Animated.View
                entering={FadeInDown.delay(300).duration(1000).springify()}
                className="items-center justify-center"
            >
                <RnrIcon className="w-[400px] h-[400px] text-white opacity-[0.03]" />
            </Animated.View>
        </View>
    );
}

// Right Panel Content (Login Form)
function RightPanelContent({ onLogin }: { onLogin: () => void }) {
    return (
        <View className="flex-1 items-center justify-center px-6 md:px-12 lg:px-24 py-12 md:py-20 bg-background">
            <AuthContent onLogin={onLogin} />
        </View>
    );
}

// Mobile Layout (Stacked)
function UnauthHomeMobile({ onLogin }: { onLogin: () => void }) {
    return (
        <View className="flex-1 bg-background">
            {/* Minimal Header on Mobile */}
            <View className="p-6 pb-0">
                <RnrIcon className="w-8 h-8 text-primary" />
            </View>

            <View className="flex-1 justify-center px-6">
                <View className="mb-10">
                    <Text className="text-[40px] font-black tracking-tighter leading-[1.1] text-foreground mb-4">
                        Happening now
                    </Text>
                    <Text className="text-[22px] font-bold tracking-tight text-foreground/90">
                        Join Showcase today.
                    </Text>
                </View>

                <LoginForm onLogin={onLogin} />
            </View>
        </View>
    );
}

// Desktop Layout (Side-by-side)
function UnauthHomeDesktop({ onLogin }: { onLogin: () => void }) {
    return (
        <View className="flex-1 flex-row h-screen">
            {/* Left Panel */}
            <View className="flex-[1.1] h-full">
                <LeftPanelContent />
            </View>

            {/* Right Panel */}
            <View className="flex-1 h-full shadow-2xl shadow-black/20 z-10">
                <RightPanelContent onLogin={onLogin} />
            </View>
        </View>
    );
}

export function UnauthHome({ onLogin }: { onLogin: () => void }) {
    return (
        <ScreenWrapper
            showBottomNav={false}
            showHeader={false}
            fullWidth={true}
            desktopContent={<UnauthHomeDesktop onLogin={onLogin} />}
            mobileContent={<UnauthHomeMobile onLogin={onLogin} />}
        />
    );
}
