import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import { useRef, useState, useEffect } from "react";
import { StyleSheet, useWindowDimensions, View, Platform } from "react-native";
import { RnrIcon } from "@/components/icons/RnrIcon";
import Animated, { FadeIn } from "react-native-reanimated";

export function SplashVideo({ onLoaded, onFinish, onError }: {
  onLoaded: () => void;
  onFinish: () => void;
  onError?: (error: Error) => void;
}) {
  const video = useRef<Video>(null);
  const [lastStatus, setStatus] = useState<AVPlaybackStatus>({} as AVPlaybackStatus);
  const [hasError, setHasError] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  console.log('[SPLASH VIDEO] Component mounted');
  console.log('[SPLASH VIDEO] Platform:', Platform.OS);
  console.log('[SPLASH VIDEO] Is tablet:', isTablet);
  console.log('[SPLASH VIDEO] Window width:', width);

  // Auto-play when component mounts
  useEffect(() => {
    console.log('[SPLASH VIDEO] Play effect triggered, isReady:', isReady);
    if (video.current && isReady) {
      console.log('[SPLASH VIDEO] Attempting to play video');
      video.current.playAsync().then(() => {
        console.log('[SPLASH VIDEO] Video play started successfully');
      }).catch(error => {
        console.log('[SPLASH VIDEO] Video play failed:', error);
      });
    }
  }, [isReady]);

  // Fallback to local splash if video fails
  if (hasError) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Animated.View
          entering={FadeIn.duration(300)}
          className="items-center justify-center"
        >
          <View className="w-24 h-24 items-center justify-center">
            <RnrIcon className="w-20 h-20 text-primary" />
          </View>
        </Animated.View>
      </View>
    );
  }

  // Use live GitHub URL for web, local assets for native
  const videoSource = Platform.select({
    web: {
      uri: isTablet
        ? "https://raw.githubusercontent.com/EvanBacon/expo-splash-video-example/main/assets/splash-tablet.mp4"
        : "https://raw.githubusercontent.com/EvanBacon/expo-splash-video-example/main/assets/splash.mp4"
    },
    default: isTablet
      ? require('./assets/splash-tablet.mp4')
      : require('./assets/splash.mp4'),
  });

  console.log('[SPLASH VIDEO] Selected video source:', videoSource);
  console.log('[SPLASH VIDEO] Video source type:', isTablet ? 'tablet' : 'mobile');

  return (
    <Video
      ref={video}
      style={StyleSheet.absoluteFillObject}
      source={videoSource}
      shouldPlay={true}
      isLooping={false}
      resizeMode={ResizeMode.COVER}
      useNativeControls={false}
      isMuted={true}
      onReadyForDisplay={() => {
        console.log('[SPLASH VIDEO] Video ready for display');
        setIsReady(true);
        onLoaded();
      }}
      onError={(error: any) => {
        console.log('[SPLASH VIDEO] Video error:', error);
        console.log('[SPLASH VIDEO] Error details:', JSON.stringify(error, null, 2));
        setHasError(true);
        const errorObj = error instanceof Error ? error : new Error('Video failed to load');
        onError?.(errorObj);
      }}
      onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
        if (status.isLoaded) {
          if (lastStatus.isLoaded !== status.isLoaded) {
            console.log('[SPLASH VIDEO] Video loaded successfully');
            console.log('[SPLASH VIDEO] Duration:', status.durationMillis);
            console.log('[SPLASH VIDEO] Position:', status.positionMillis);
          }
          if (status.didJustFinish) {
            console.log('[SPLASH VIDEO] Video finished');
            onFinish();
          }
        } else {
          console.log('[SPLASH VIDEO] Video not loaded yet, status:', status);
        }
        setStatus(() => status);
      }}
      onLoadStart={() => {
        console.log('[SPLASH VIDEO] Load started');
      }}
      onLoad={() => {
        console.log('[SPLASH VIDEO] Load completed');
      }}
    />
  );
}
