import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Animated,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { SplashVideo } from "./SplashVideo";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

// Only prevent auto-hide once globally
let splashPrevented = false;

const preventSplashHide = () => {
  if (!splashPrevented) {
    SplashScreen.preventAutoHideAsync().catch(() => {
      /* reloading the app might trigger some race conditions, ignore them */
    });
    splashPrevented = true;
  }
};

preventSplashHide();

export function AnimatedSplashScreen({
  children,
  isAppReady: isExternalReady
}: {
  children: React.ReactNode;
  isAppReady: boolean;
}) {
  const animation = useMemo(() => new Animated.Value(1), []);
  const [isSplashVideoComplete, setSplashVideoComplete] = useState(false);
  const [isSplashAnimationComplete, setAnimationComplete] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Only fade out when BOTH the video is done AND the app (fonts/auth) is ready
    if (isExternalReady && isSplashVideoComplete) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setAnimationComplete(true);
        SplashScreen.hideAsync();
      });
    }
  }, [isExternalReady, isSplashVideoComplete, animation]);

  const retryVideo = useCallback(() => {
    setHasError(false);
    setError(null);
    setSplashVideoComplete(false);
    // In a real app, you might want to trigger a re-mount or reload here
  }, []);

  const videoElement = useMemo(() => {
    return (
      <SplashVideo
        onLoaded={() => {
          // Video is ready to play/buffer, but we don't block anything here anymore
          console.log('[SPLASH] Video starting');
        }}
        onFinish={() => {
          setSplashVideoComplete(true);
        }}
        onError={(err) => {
          setError(err);
          setHasError(true);
        }}
      />
    );
  }, []);

  // Error State Component
  const ErrorState = () => (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <View className="w-24 h-24 bg-destructive/10 rounded-full items-center justify-center mb-8">
        <MaterialIcons name="error-outline" size={48} className="text-destructive" />
      </View>
      <Text className="text-2xl font-bold text-foreground text-center mb-4">
        Startup Failed
      </Text>
      <Text className="text-muted-foreground text-center mb-8 leading-relaxed max-w-md">
        {error?.message || 'Something went wrong during app initialization'}
      </Text>
      <View className="gap-3">
        <View className="flex-row items-center justify-center bg-primary px-8 py-4 rounded-xl">
          <MaterialIcons name="refresh" size={24} className="text-primary-foreground mr-3" color="white" />
          <Text className="text-primary-foreground font-bold text-lg" onPress={retryVideo}>
            Try Again
          </Text>
        </View>
      </View>
    </View>
  );

  // Show error state if there's an error
  if (hasError) {
    return <ErrorState />;
  }

  return (
    <View className="flex-1 relative">
      {isExternalReady && children}
      {!isSplashAnimationComplete && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: '#0A0A0A', // Fixed dark background
              opacity: animation,
              zIndex: 9999, // Ensure it's on top
            },
          ]}
          className="absolute inset-0"
        >
          <View className="absolute inset-0 bg-black">
            {videoElement}
          </View>
        </Animated.View>
      )}
    </View>
  );
}
