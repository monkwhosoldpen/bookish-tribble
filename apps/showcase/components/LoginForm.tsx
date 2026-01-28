import * as React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useHaptics } from '@/contexts/HapticsContext';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming, withRepeat } from 'react-native-reanimated';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { Button } from '@/registry/nativewind/components/ui/button';
import { AnimatedLabelInput } from '@/components/ui/AnimatedLabelInput';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { useToast } from '@/components/ui/toast';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
    onLogin?: () => void;
}

export const LoginForm = React.memo(function LoginForm({ onLogin }: LoginFormProps) {
    const { signIn, loading: authLoading } = useAuth();
    const { showError, showSuccess } = useToast();
    const { impact, error: hapticError, success: hapticSuccess } = useHaptics();

    // Animation Values
    const shakeTranslateX = useSharedValue(0);

    const shake = () => {
        shakeTranslateX.value = withSequence(
            withTiming(-10, { duration: 50 }),
            withRepeat(withTiming(10, { duration: 100 }), 3, true),
            withTiming(0, { duration: 50 })
        );
        hapticError();
    };

    const formAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: shakeTranslateX.value }],
        };
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            impact();
            await signIn(data.email, data.password);
            hapticSuccess();
            showSuccess('Welcome back! You are now signed in.');
            onLogin?.();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Authentication failed. Please check your credentials.';
            showError(errorMessage);
            shake();
        }
    };

    return (
        <Animated.View style={formAnimatedStyle} className="w-full">
            <View className="gap-4 mb-4">
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AnimatedLabelInput
                            label="Email"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            error={errors.email?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <AnimatedLabelInput
                            label="Password"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            secureTextEntry
                            error={errors.password?.message}
                        />
                    )}
                />
            </View>

            <Button
                onPress={handleSubmit(onSubmit)}
                disabled={authLoading}
                className={cn(
                    "h-14 rounded-full bg-primary active:scale-[0.97] border-0 shadow-lg shadow-blue-500/30 elevation-8",
                    authLoading && "opacity-80"
                )}
            >
                {authLoading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <View className="flex-row items-center gap-3">
                        <Text className="text-white font-black text-[18px] tracking-tight">Enter Showcase</Text>
                        <MaterialIcons name="arrow-forward" size={20} color="white" />
                    </View>
                )}
            </Button>
        </Animated.View>
    );
});
