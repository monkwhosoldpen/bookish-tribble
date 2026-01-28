import { LoginForm } from '@/components/LoginForm';
import { View, ScrollView } from 'react-native';
import { Text } from '@/registry/nativewind/components/ui/text';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import * as React from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

// Twitter/X Logo component
function XLogo({ size = 24, color = 'currentColor', className }: { size?: number; color?: string; className?: string }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" className={className}>
            <Path
                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                fill={color}
            />
        </Svg>
    );
}

// Shared Content for Mobile and Desktop Right Panel
function AuthContent({ onLogin }: { onLogin: () => void }) {
    return (
        <View className="w-full max-w-sm md:max-w-[500px] mx-auto md:mx-0 px-8 md:px-0">
            <Animated.View
                entering={FadeInDown.delay(100).duration(800).springify()}
                className="mb-8 md:mb-10"
            >
                <XLogo size={32} color="#1D9BF0" />

                <Text className="text-[42px] md:text-[64px] font-black tracking-tighter leading-[1.1] text-foreground mt-10 mb-3">
                    Happening now
                </Text>

                <Text className="text-[20px] md:text-[31px] font-bold tracking-tight text-foreground/90">
                    Join today.
                </Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(400).duration(800).springify()} className="w-full max-w-[300px]">
                <LoginForm onLogin={onLogin} />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(600).duration(800).springify()} className="mt-8 max-w-[300px]">
                <Text className="text-[12px] text-muted-foreground leading-4">
                    By signing up, you agree to the{' '}
                    <Text className="text-[12px] text-[#1D9BF0]">Terms of Service</Text> and{' '}
                    <Text className="text-[12px] text-[#1D9BF0]">Privacy Policy</Text>, including{' '}
                    <Text className="text-[12px] text-[#1D9BF0]">Cookie Use</Text>.
                </Text>
            </Animated.View>
        </View>
    );
}

function LeftPanelContent() {
    return (
        <View className="flex-1 bg-black items-center justify-center overflow-hidden relative">
            {/* Giant X Logo */}
            <Animated.View
                entering={FadeInDown.delay(300).duration(1000).springify()}
                className="items-center justify-center"
            >
                <XLogo size={360} color="rgba(255,255,255,0.08)" />
            </Animated.View>
        </View>
    );
}

// Right Panel Content (Login Form)
function RightPanelContent({ onLogin }: { onLogin: () => void }) {
    return (
        <View className="flex-1 justify-center px-6 md:px-12 lg:px-24 py-12 md:py-20 bg-background">
            <AuthContent onLogin={onLogin} />
        </View>
    );
}

// Mobile Layout (Stacked - two full screens)
function UnauthHomeMobile({ onLogin }: { onLogin: () => void }) {
    return (
        <ScrollView className="flex-1 bg-background" bounces={false} pagingEnabled>
            {/* First screen - full height black section with large X logo */}
            <View className="h-screen bg-black items-center justify-center">
                <XLogo size={240} color="rgba(255,255,255,0.08)" />
            </View>

            {/* Second screen - full height login section */}
            <View className="h-screen bg-background justify-center px-8">
                <XLogo size={28} color="#1D9BF0" />

                <View className="mt-10 mb-8">
                    <Text className="text-[28px] font-black tracking-tighter leading-[1.15] text-foreground mb-2">
                        Happening now
                    </Text>
                    <Text className="text-[17px] font-bold tracking-tight text-foreground/90 mt-1">
                        Join today.
                    </Text>
                </View>

                <View className="w-full max-w-[300px]">
                    <LoginForm onLogin={onLogin} />
                </View>

                <View className="mt-8 max-w-[300px]">
                    <Text className="text-[12px] text-muted-foreground leading-4">
                        By signing up, you agree to the{' '}
                        <Text className="text-[12px] text-[#1D9BF0]">Terms of Service</Text> and{' '}
                        <Text className="text-[12px] text-[#1D9BF0]">Privacy Policy</Text>, including{' '}
                        <Text className="text-[12px] text-[#1D9BF0]">Cookie Use</Text>.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

// Desktop Layout (Side-by-side)
function UnauthHomeDesktop({ onLogin }: { onLogin: () => void }) {
    return (
        <View className="flex-1 flex-row h-screen">
            {/* Left Panel - large X logo on black */}
            <View className="flex-[1.1] h-full">
                <LeftPanelContent />
            </View>

            {/* Right Panel - form */}
            <View className="flex-1 h-full">
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
