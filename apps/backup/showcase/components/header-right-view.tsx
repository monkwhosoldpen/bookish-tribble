import { Button } from '@/registry/components/ui/button';
import { Text } from '@/registry/components/ui/text';
import { ThemeToggle } from '@showcase/components/theme-toggle';
import { useAuth } from '@/hooks/useAuth';
import * as Updates from 'expo-updates';
import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export function HeaderRightView() {
  const { isUpdateAvailable, isUpdatePending, isDownloading } = Updates.useUpdates();
  const { user, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  async function onReload() {
    try {
      if (!isUpdatePending) {
        await Updates.fetchUpdateAsync();
      }
      await Updates.reloadAsync();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsSigningOut(false);
    }
  }

  if (isUpdateAvailable) {
    return (
      <Button
        size="sm"
        className="h-7 rounded-full bg-transparent active:bg-transparent"
        onPress={onReload}
        disabled={isDownloading}>
        {isDownloading ? (
          <ActivityIndicator color="white" size="small" className="scale-75" />
        ) : (
          <Text className="text-sky-600 dark:text-sky-500">Update</Text>
        )}
      </Button>
    );
  }

  return (
    <View className="flex-row items-center gap-2">
      {/* Sign Out Button - shown only when user is logged in */}
      {user && (
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-full"
          onPress={handleSignOut}
          disabled={isSigningOut}>
          {isSigningOut ? (
            <ActivityIndicator size="small" />
          ) : (
            <MaterialIcons name="logout" size={18} className="text-muted-foreground" />
          )}
        </Button>
      )}

      {/* Theme Toggle */}
      <ThemeToggle />
    </View>
  );
}
