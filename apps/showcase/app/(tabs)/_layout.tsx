import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { COLOR_TOKENS } from '@/lib/design-tokens';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colorScheme === 'dark' ? COLOR_TOKENS.dark.background : COLOR_TOKENS.light.background,
        },
      }}
    >
      <Stack.Screen name="home" options={{ title: 'Home' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
    </Stack>
  );
}
