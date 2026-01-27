import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colorScheme === 'dark' ? '#09090b' : '#ffffff',
        },
      }}
    >
      <Stack.Screen name="home" options={{ title: 'Home' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
    </Stack>
  );
}
