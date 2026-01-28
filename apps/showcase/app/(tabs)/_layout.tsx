import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { NAV_THEME } from '@showcase/lib/theme';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: NAV_THEME[colorScheme ?? 'light'].colors.background,
        },
      }}
    >
      <Stack.Screen name="home" options={{ title: 'Home' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
    </Stack>
  );
}
