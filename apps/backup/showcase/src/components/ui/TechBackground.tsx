import * as React from 'react';
import Svg, { Defs, Pattern, Rect, Path } from 'react-native-svg';
import { View, useColorScheme } from 'react-native';

export function TechBackground({ className }: { className?: string }) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const strokeColor = isDark ? "#ffffff" : "#000000";
    const opacity = isDark ? 0.05 : 0.03;

    return (
        <View className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            <Svg height="100%" width="100%">
                <Defs>
                    <Pattern
                        id="grid-pattern"
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse"
                    >
                        <Path
                            d="M 40 0 L 0 0 0 40"
                            fill="none"
                            stroke={strokeColor}
                            strokeWidth="1"
                            strokeOpacity={opacity}
                        />
                    </Pattern>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#grid-pattern)" />
            </Svg>

            {/* Ambient Ray */}
            <View className="absolute -top-[20%] -right-[20%] w-[100%] h-[100%] bg-primary/10 blur-[120px] rounded-full opacity-30" />
        </View>
    );
}

export function CircuitBoardPattern({ className }: { className?: string }) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const strokeColor = isDark ? "#ffffff" : "#000000";

    return (
        <View className={`absolute inset-0 overflow-hidden w-full h-full ${className}`}>
            <Svg height="100%" width="100%" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
                <Defs>
                    <Pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <Rect x="2" y="2" width="2" height="2" fill={strokeColor} fillOpacity={isDark ? "0.1" : "0.05"} />
                    </Pattern>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#dots)" />

                {/* Accent Lines */}
                <Path
                    d="M 0 100 L 50 100 L 70 80 L 150 80 L 180 110 L 400 110"
                    stroke={strokeColor}
                    strokeWidth="1"
                    strokeOpacity={isDark ? "0.15" : "0.1"}
                    fill="none"
                />
                <Path
                    d="M 0 120 L 40 120 L 60 140 L 200 140 L 220 120 L 400 120"
                    stroke={strokeColor}
                    strokeWidth="1"
                    strokeOpacity={isDark ? "0.1" : "0.05"}
                    fill="none"
                />
            </Svg>
        </View>
    )
}
