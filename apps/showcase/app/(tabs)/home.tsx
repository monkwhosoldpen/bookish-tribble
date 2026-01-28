import * as React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthHome } from '@/components/AuthHome';
import { UnauthHome } from '@/components/UnauthHome';
import { useAuthIsAuthenticated, useAuthLoading } from '@/contexts/AuthContext';

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

  return isAuthenticated ? <AuthHome /> : <UnauthHome onLogin={handleLogin} />;
}
