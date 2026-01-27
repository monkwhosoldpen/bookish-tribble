import * as React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets, EdgeInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { NAV_THEME } from '@showcase/lib/theme';

interface ScreenContextValue {
    isMobile: boolean;
    width: number;
    height: number;
    insets: EdgeInsets;
    theme: {
        colors: typeof NAV_THEME['light']['colors'];
        isDark: boolean;
    };
}

const ScreenContext = React.createContext<ScreenContextValue | null>(null);

export function useScreen() {
    const context = React.useContext(ScreenContext);
    if (!context) {
        throw new Error('useScreen must be used within a ScreenWrapper');
    }
    return context;
}

interface ScreenWrapperProps {
    mobileContent: React.ReactNode;
    desktopContent: React.ReactNode;
    header?: React.ReactNode;
    bottomNav?: React.ReactNode;
    /**
     * If true, the bottom nav will be rendered on mobile.
     * Defaults to true for authenticated screens.
     */
    showBottomNav?: boolean;
    /**
     * If true, the header will be rendered.
     * Defaults to true.
     */
    showHeader?: boolean;
    /**
     * If true, the content will not be constrained to max-w-2xl.
     */
    fullWidth?: boolean;
    className?: string;
}

export function ScreenWrapper({
    mobileContent,
    desktopContent,
    header,
    bottomNav,
    showBottomNav = true,
    showHeader = true,
    fullWidth = false,
    className
}: ScreenWrapperProps) {
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const { colorScheme } = useColorScheme();

    // Standard breakpoint for tablet/desktop split
    const isMobile = width < 768;

    const contextValue: ScreenContextValue = React.useMemo(() => ({
        isMobile,
        width,
        height,
        insets,
        theme: {
            colors: NAV_THEME[colorScheme ?? 'light'].colors,
            isDark: colorScheme === 'dark',
        }
    }), [width, height, isMobile, insets, colorScheme]);

    return (
        <ScreenContext.Provider value={contextValue}>
            <View className={`flex-1 bg-background dark:bg-background ${className}`}>
                {/* Header Layer - part of flow now */}
                {showHeader && header && (
                    <View className="z-50 shrink-0">
                        {header}
                    </View>
                )}

                {/* Main Content Layer */}
                <View className="flex-1 w-full flex-row justify-center overflow-hidden">
                    {/* Constrained Container logic */}
                    <View className={`flex-1 w-full relative ${fullWidth ? '' : 'max-w-2xl border-x border-zinc-100 dark:border-zinc-800'}`}>
                        {isMobile ? mobileContent : desktopContent}
                    </View>
                </View>

                {/* Bottom Navigation Layer - part of flow now */}
                {showBottomNav && bottomNav && (
                    <View className="z-50 shrink-0">
                        {bottomNav}
                    </View>
                )}
            </View>
        </ScreenContext.Provider>
    );
}
