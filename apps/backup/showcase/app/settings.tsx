import * as React from 'react';
import { SettingsMobile } from '@/features/settings/SettingsMobile';
import { SettingsDesktop } from '@/features/settings/SettingsDesktop';
import { SettingsHeader } from '@/features/settings/SettingsHeader';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { BottomNav } from '@/components/layout/BottomNav';
import { useAuth } from '@/hooks/useAuth';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';

export default function SettingsPage() {
    const { isAuthenticated, loading, signOut } = useAuth();

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

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Sign out failed:', error);
        }
    };

    return (
        <ScreenWrapper
            header={<SettingsHeader />}
            bottomNav={<BottomNav activeTab="settings" />}
            mobileContent={<SettingsMobile onSignOut={handleSignOut} />}
            desktopContent={<SettingsDesktop onSignOut={handleSignOut} />}
            fullWidth
        />
    );
}
