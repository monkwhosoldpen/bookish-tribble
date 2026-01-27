import '../global.css';

import { Text } from '@/registry/components/ui/text';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { FirebaseServiceWorkerRegister } from '@/components/FirebaseServiceWorkerRegister';
import { useGeistFont } from '@showcase/hooks/use-geist-font';
import { NAV_THEME } from '@showcase/lib/theme';
import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuthLoading, useAuthError } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { toOptions } from '@/lib/string';
import { initFirebaseBackgroundMessaging } from '@/lib/firebase-init';
import { OfflineNotice } from '@/components/OfflineNotice';
import { DevicesProvider } from '@/hooks/useDevicesContext';
import { AnimatedSplashScreen } from '@/components/splash/AnimatedSplashScreen';
import { MaterialIcons } from '@/registry/components/ui/icon';

// Initialize Firebase background message handler
initFirebaseBackgroundMessaging();

// Granular Error Boundary Components
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: ({ error, resetError }: { error: Error; resetError: () => void }) => React.ReactNode;
}

class SimpleErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean; error: Error | null }> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback({
        error: this.state.error,
        resetError: () => this.setState({ hasError: false, error: null })
      });
    }

    return this.props.children;
  }
}

function AuthErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <SimpleErrorBoundary
      fallback={({ error, resetError }) => (
        <View className="flex-1 items-center justify-center bg-background px-6">
          <View className="w-20 h-20 bg-destructive/10 rounded-full items-center justify-center mb-6">
            <MaterialIcons name="error-outline" size={40} className="text-destructive" />
          </View>
          <Text className="text-2xl font-bold text-foreground text-center mb-3">
            Authentication Error
          </Text>
          <Text className="text-muted-foreground text-center mb-8 leading-relaxed">
            {error?.message || 'Something went wrong with authentication. Please try again.'}
          </Text>
          <View className="flex-row items-center justify-center bg-primary px-6 py-3 rounded-xl">
            <MaterialIcons name="refresh" size={20} className="text-primary-foreground mr-2" color="white" />
            <Text className="text-primary-foreground font-bold" onPress={resetError}>
              Retry
            </Text>
          </View>
        </View>
      )}
    >
      {children}
    </SimpleErrorBoundary>
  );
}

function SplashErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <SimpleErrorBoundary
      fallback={({ error, resetError }) => (
        <View className="flex-1 items-center justify-center bg-background px-6">
          <View className="w-20 h-20 bg-destructive/10 rounded-full items-center justify-center mb-6">
            <MaterialIcons name="error-outline" size={40} className="text-destructive" />
          </View>
          <Text className="text-2xl font-bold text-foreground text-center mb-3">
            Splash Error
          </Text>
          <Text className="text-muted-foreground text-center mb-8 leading-relaxed">
            {error?.message || 'Failed to load splash screen. Please try again.'}
          </Text>
          <View className="flex-row items-center justify-center bg-primary px-6 py-3 rounded-xl">
            <MaterialIcons name="refresh" size={20} className="text-primary-foreground mr-2" color="white" />
            <Text className="text-primary-foreground font-bold" onPress={resetError}>
              Retry
            </Text>
          </View>
        </View>
      )}
    >
      {children}
    </SimpleErrorBoundary>
  );
}

function AppErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <SimpleErrorBoundary
      fallback={({ error, resetError }) => (
        <View className="flex-1 items-center justify-center bg-background px-6">
          <View className="w-20 h-20 bg-destructive/10 rounded-full items-center justify-center mb-6">
            <MaterialIcons name="error-outline" size={40} className="text-destructive" />
          </View>
          <Text className="text-2xl font-bold text-foreground text-center mb-3">
            App Error
          </Text>
          <Text className="text-muted-foreground text-center mb-8 leading-relaxed">
            {error?.message || 'Something went wrong. Please restart the app.'}
          </Text>
          <View className="flex-row items-center justify-center bg-primary px-6 py-3 rounded-xl">
            <MaterialIcons name="refresh" size={20} className="text-primary-foreground mr-2" color="white" />
            <Text className="text-primary-foreground font-bold" onPress={resetError}>
              Retry
            </Text>
          </View>
        </View>
      )}
    >
      {children}
    </SimpleErrorBoundary>
  );
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

function RootLayoutContent() {
  const [loaded, fontError] = useGeistFont();
  const authLoading = useAuthLoading();
  const authError = useAuthError();
  const { colorScheme = 'light' } = useColorScheme();

  const isReady = loaded || !!fontError;
  const isAuthHandled = !authLoading || !!authError;

  return (
    <AnimatedSplashScreen isAppReady={isReady && isAuthHandled}>
      <>
        {authError ? (
          <View className="flex-1 items-center justify-center bg-background px-6">
            <View className="w-20 h-20 bg-destructive/10 rounded-full items-center justify-center mb-6">
              <MaterialIcons name="error-outline" size={40} className="text-destructive" />
            </View>
            <Text className="text-2xl font-bold text-foreground text-center mb-3">
              Authentication Failed
            </Text>
            <Text className="text-muted-foreground text-center mb-8 leading-relaxed">
              {authError.message || 'Failed to initialize authentication. Please check your connection and try again.'}
            </Text>
            <View className="gap-3">
              <View className="flex-row items-center justify-center bg-primary px-6 py-3 rounded-xl">
                <MaterialIcons name="refresh" size={20} className="text-primary-foreground mr-2" color="white" />
                <Text className="text-primary-foreground font-bold" onPress={() => window.location.reload()}>
                  Retry
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <>
            <FirebaseServiceWorkerRegister />
            <ThemeProvider value={NAV_THEME[colorScheme || 'light']}>
              <GestureHandlerRootView
                style={{ flex: 1, backgroundColor: NAV_THEME[colorScheme || 'light']?.colors.background }}>

                <Stack
                  screenOptions={{
                    headerShown: false,
                    headerBackTitle: 'Back',
                    headerTitle(props) {
                      return (
                        <Text className="ios:font-medium android:mt-1.5 text-xl">
                          {toOptions(props.children.split('/').pop())}
                        </Text>
                      );
                    },
                  }}>
                  <Stack.Screen
                    name="index"
                    options={{
                      headerLargeTitle: true,
                      headerTitle: 'Showcase',
                      headerLargeTitleShadowVisible: false,
                      headerTransparent: true,
                    }}
                  />
                </Stack>
                <PortalHost />

              </GestureHandlerRootView>
            </ThemeProvider>
          </>
        )}

        {/* Debug Panel - Only in development */}
        {__DEV__ && (
          <View className="absolute top-20 right-4 bg-black/80 p-2 rounded">
            <Text className="text-white text-xs">Debug Mode</Text>
          </View>
        )}
      </>
    </AnimatedSplashScreen>
  );
}

export default function RootLayout() {
  return (
    <AppErrorBoundary>
      <SafeAreaProvider>
        <AuthErrorBoundary>
          <AuthProvider>
            <NotificationProvider>
              <DevicesProvider>
                <SplashErrorBoundary>
                  <RootLayoutContent />
                  <OfflineNotice />
                </SplashErrorBoundary>
              </DevicesProvider>
            </NotificationProvider>
          </AuthProvider>
        </AuthErrorBoundary>
      </SafeAreaProvider>
    </AppErrorBoundary>
  );
}
