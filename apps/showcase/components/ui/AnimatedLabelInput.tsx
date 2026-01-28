import React, { useState, useEffect } from 'react';
import { View, TextInput, TextInputProps, NativeSyntheticEvent } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolate,
    Extrapolation,
    interpolateColor,
    FadeInUp
} from 'react-native-reanimated';
import { cn } from '@/registry/nativewind/lib/utils';
import { Text } from '@/registry/nativewind/components/ui/text';
import { TRANSITIONS } from '@/lib/design-tokens';

interface AnimatedLabelInputProps extends Omit<TextInputProps, 'onFocus' | 'onBlur'> {
    label: string;
    error?: string;
    icon?: React.ReactNode;
    className?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    onFocus?: (e: NativeSyntheticEvent<TextInput>) => void;
    onBlur?: (e: NativeSyntheticEvent<TextInput>) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    autoCorrect?: boolean;
    editable?: boolean;
}

export const AnimatedLabelInput = ({
    label,
    error,
    icon,
    className,
    value,
    onChangeText,
    onFocus,
    onBlur,
    ...props
}: AnimatedLabelInputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = !!(value && value.length > 0);

    // Animation Values
    const focusAnim = useSharedValue(0);

    useEffect(() => {
        focusAnim.value = withTiming(isFocused || hasValue ? 1 : 0, TRANSITIONS.default);
    }, [isFocused, hasValue, focusAnim]);

    const handleFocus = (e: NativeSyntheticEvent<TextInput>) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e: NativeSyntheticEvent<TextInput>) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    const labelStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: interpolate(focusAnim.value, [0, 1], [0, -18], Extrapolation.CLAMP) },
                { scale: interpolate(focusAnim.value, [0, 1], [1, 0.72], Extrapolation.CLAMP) },
            ],
            opacity: interpolate(focusAnim.value, [0, 1], [0.65, 1], Extrapolation.CLAMP),
        } as any;
    });

    const borderStyle = useAnimatedStyle(() => {
        return {
            borderColor: interpolateColor(
                focusAnim.value,
                [0, 1],
                ['#CFD9DE', '#1D9BF0']
            ),
            backgroundColor: 'transparent',
            borderWidth: interpolate(focusAnim.value, [0, 1], [1, 2]),
        };
    });

    return (
        <View className="gap-1.5">
            <Animated.View
                className="h-[56px] border relative overflow-visible bg-background shadow-none"
                style={[
                    borderStyle as any,
                    { borderRadius: 4 }
                ]}
            >
                <Animated.View style={[labelStyle as any, { position: 'absolute', left: 14, top: 18, zIndex: 0, pointerEvents: 'none' }]}>
                    <Text className={cn("text-[13px] font-normal tracking-tight", !isFocused && "text-muted-foreground/90")} style={isFocused ? { color: '#1D9BF0' } : undefined}>
                        {label}
                    </Text>
                </Animated.View>

                <TextInput
                    {...props}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={handleFocus as any}
                    onBlur={handleBlur as any}
                    className={cn(
                        "text-[16px] h-full text-foreground px-[14px] font-normal pt-[20px] pb-0.5",
                        className
                    )}
                    placeholder=""
                    placeholderTextColor="transparent"
                />

                {icon && (
                    <View className="absolute right-4 top-[18px] opacity-40">
                        {icon}
                    </View>
                )}
            </Animated.View>

            {error && (
                <Animated.View
                    entering={FadeInUp.duration(300)}
                    className="ml-1"
                >
                    <Text className="text-destructive text-[12px] font-semibold">
                        {error}
                    </Text>
                </Animated.View>
            )}
        </View>
    );
};
