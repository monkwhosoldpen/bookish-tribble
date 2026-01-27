import * as React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';

import { ExploreMobile, ExploreDesktop } from '@/features/explore';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { BottomNav } from '@/components/layout/BottomNav';
import { useAuth } from '@/hooks/useAuth';
import type { TabType } from '@/components/layout/BottomNav';

export default function ExplorePage() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-background dark:bg-background">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!isAuthenticated) {
        return <Redirect href="/" />;
    }

    return (
        <ScreenWrapper
            showHeader={false}
            bottomNav={<BottomNav activeTab={"explore" as TabType} />}
            mobileContent={<ExploreMobile />}
            desktopContent={<ExploreDesktop />}
            fullWidth
        />
    );
}
