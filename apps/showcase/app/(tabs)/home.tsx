import * as React from 'react';
import { View } from 'react-native';
import { AuthHome } from '@/components/AuthHome';
import { UnauthHome } from '@/components/UnauthHome';
import { useAuthIsAuthenticated, useAuthLoading } from '@/contexts/AuthContext';
import { ActivityIndicator } from 'react-native';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { ShowcaseHeader } from '@/components/layout/ShowcaseHeader';
import { BottomNav } from '@/components/layout/BottomNav';

export default function HomePage() {
  const isAuthenticated = useAuthIsAuthenticated();
  const loading = useAuthLoading();

  const handleLogin = React.useCallback(() => {
    // Navigation handled by conditional rendering
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScreenWrapper
      header={<ShowcaseHeader />}
      bottomNav={<BottomNav activeTab="home" />}
      mobileContent={
        isAuthenticated ? 
          <AuthHome /> : 
          <UnauthHome onLogin={handleLogin} />
      }
      desktopContent={
        isAuthenticated ? 
          <AuthHome /> : 
          <UnauthHome onLogin={handleLogin} />
      }
      fullWidth={false}
    />
  );
}
