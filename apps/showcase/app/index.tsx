import * as React from 'react';
import { AuthHome } from '../components/AuthHome';
import { UnauthHome } from '../components/UnauthHome';
import { useAuthIsAuthenticated, useAuthLoading } from '../contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

export default function IndexPage() {
  const isAuthenticated = useAuthIsAuthenticated();
  const loading = useAuthLoading();
  const router = useRouter();

  const handleLogin = React.useCallback(() => {
    // If we had (tabs), we would navigate here. 
    // For now, the conditional rendering below will switch to AuthHome.
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
