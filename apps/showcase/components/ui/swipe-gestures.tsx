import * as React from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { Animated, View } from 'react-native';

export interface SwipeGestureProps {
    children: React.ReactNode;
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
    threshold?: number;
    enabled?: boolean;
}

export function SwipeGesture({
    children,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    enabled = true,
}: SwipeGestureProps) {
    const translateX = React.useRef(new Animated.Value(0)).current;
    const translateY = React.useRef(new Animated.Value(0)).current;

    const onGestureEvent = Animated.event(
        [
            {
                nativeEvent: {
                    translationX: translateX,
                    translationY: translateY,
                },
            },
        ],
        { useNativeDriver: false }
    );

    const onHandlerStateChange = (event: any) => {
        const { translationX, translationY, state } = event.nativeEvent;

        if (state === 5) { // State.END
            // Reset animations
            Animated.spring(translateX, {
                toValue: 0,
                useNativeDriver: false,
            }).start();

            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: false,
            }).start();

            // Check swipe thresholds
            if (Math.abs(translationX) > Math.abs(translationY)) {
                // Horizontal swipe
                if (translationX > threshold && onSwipeRight) {
                    onSwipeRight();
                } else if (translationX < -threshold && onSwipeLeft) {
                    onSwipeLeft();
                }
            } else {
                // Vertical swipe
                if (translationY > threshold && onSwipeDown) {
                    onSwipeDown();
                } else if (translationY < -threshold && onSwipeUp) {
                    onSwipeUp();
                }
            }
        }
    };

    if (!enabled) {
        return <>{children}</>;
    }

    return (
        <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
        >
            <Animated.View
                style={{
                    transform: [
                        { translateX },
                        { translateY },
                    ],
                }}
            >
                {children}
            </Animated.View>
        </PanGestureHandler>
    );
}

// Hook for swipe navigation between tabs
export function useSwipeNavigation(
    tabs: string[],
    currentTab: string,
    onTabChange: (tab: string) => void
) {
    const currentIndex = tabs.indexOf(currentTab);

    const handleSwipeLeft = React.useCallback(() => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < tabs.length && tabs[nextIndex]) {
            onTabChange(tabs[nextIndex]);
        }
    }, [currentIndex, tabs, onTabChange]);

    const handleSwipeRight = React.useCallback(() => {
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0 && tabs[prevIndex]) {
            onTabChange(tabs[prevIndex]);
        }
    }, [currentIndex, tabs, onTabChange]);

    return {
        onSwipeLeft: handleSwipeLeft,
        onSwipeRight: handleSwipeRight,
        canSwipeLeft: currentIndex < tabs.length - 1,
        canSwipeRight: currentIndex > 0,
    };
}

// Component for swipeable chat items
export function SwipeableChatItem({
    children,
    onSwipeLeft,
    onSwipeRight,
    leftAction,
    rightAction,
}: {
    children: React.ReactNode;
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    leftAction?: React.ReactNode;
    rightAction?: React.ReactNode;
}) {
    const translateX = React.useRef(new Animated.Value(0)).current;

    const onGestureEvent = Animated.event(
        [{ nativeEvent: { translationX: translateX } }],
        { useNativeDriver: false }
    );

    const onHandlerStateChange = (event: any) => {
        const { translationX, velocityX, state } = event.nativeEvent;

        if (state === 5) { // State.END
            const shouldSwipeLeft = translationX < -100 || velocityX < -500;
            const shouldSwipeRight = translationX > 100 || velocityX > 500;

            if (shouldSwipeLeft && onSwipeLeft) {
                Animated.spring(translateX, {
                    toValue: -80,
                    useNativeDriver: false,
                }).start();
                (onSwipeLeft)();
            } else if (shouldSwipeRight && onSwipeRight) {
                Animated.spring(translateX, {
                    toValue: 80,
                    useNativeDriver: false,
                }).start();
                (onSwipeRight)();
            } else {
                // Snap back
                Animated.spring(translateX, {
                    toValue: 0,
                    useNativeDriver: false,
                }).start();
            }
        }
    };

    return (
        <View className="relative">
            {/* Left Action Background */}
            {leftAction && (
                <Animated.View
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 80,
                        opacity: translateX.interpolate({
                            inputRange: [-80, 0],
                            outputRange: [1, 0],
                            extrapolate: 'clamp',
                        }),
                        transform: [
                            {
                                translateX: translateX.interpolate({
                                    inputRange: [-80, 0],
                                    outputRange: [0, 80],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    }}
                    className="bg-primary items-center justify-center"
                >
                    {leftAction}
                </Animated.View>
            )}

            {/* Right Action Background */}
            {rightAction && (
                <Animated.View
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: 80,
                        opacity: translateX.interpolate({
                            inputRange: [0, 80],
                            outputRange: [0, 1],
                            extrapolate: 'clamp',
                        }),
                        transform: [
                            {
                                translateX: translateX.interpolate({
                                    inputRange: [0, 80],
                                    outputRange: [0, -80],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    }}
                    className="bg-destructive items-center justify-center"
                >
                    {rightAction}
                </Animated.View>
            )}

            {/* Content */}
            <PanGestureHandler
                onGestureEvent={onGestureEvent}
                onHandlerStateChange={onHandlerStateChange}
            >
                <Animated.View
                    style={{
                        transform: [{ translateX }],
                    }}
                >
                    {children}
                </Animated.View>
            </PanGestureHandler>
        </View>
    );
}
