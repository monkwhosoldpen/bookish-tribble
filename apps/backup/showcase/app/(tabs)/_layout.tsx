import { Stack } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';

export default function TabsLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // tabBarStyle: { display: 'none' }, // Hide default tab bar, use custom
      }}
    >
      <Stack.Screen name="home" options={{ title: 'Home' }} />
      <Stack.Screen name="explore" options={{ title: 'Explore' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
    </Stack>
  );
}
