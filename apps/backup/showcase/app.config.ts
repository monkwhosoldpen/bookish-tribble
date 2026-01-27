import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const { NAME, SLUG } = getConfig();

  return {
    ...config,
    name: NAME,
    slug: SLUG,
    version: '0.0.3',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    userInterfaceStyle: 'automatic',
    // @ts-ignore: New Arch flag
    newArchEnabled: true,
    runtimeVersion: {
      policy: 'appVersion',
    },
    updates: {
      url: 'https://u.expo.dev/143698d9-060c-400e-89d2-ca0cdb9fd2f3',
    },
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#0A0A0A',
    },
    assetBundlePatterns: ['**/*'],
    web: {
      bundler: 'metro',
      sourceMaps: true,
      output: 'static',
      favicon: './assets/images/favicon.png',
      themeColor: '#0A0A0A',
    },
    ios: {
      scheme: SLUG,
      supportsTablet: true,
      bundleIdentifier: 'com.reactnativereusables.app',
      associatedDomains: ['applinks:reactnativereusables.com'],
      googleServicesFile: './GoogleService-Info.plist',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      scheme: `${SLUG}android`,
      // @ts-ignore: Edge to Edge flag
      edgeToEdgeEnabled: true,
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#0A0A0A',
      },
      package: 'com.monkwhosoldpen.mobileui',
      googleServicesFile: './google-services.json',
      intentFilters: [
        {
          action: 'VIEW',
          autoVerify: true,
          data: [
            {
              scheme: 'https',
              host: 'reactnativereusables.com',
              pathPrefix: '/showcase/links',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
    },
    plugins: [
      'expo-router',
      [
        'expo-font',
        {
          fonts: [
            '../../node_modules/@expo-google-fonts/geist/900Black/Geist_900Black.ttf',
            '../../node_modules/@expo-google-fonts/geist/800ExtraBold/Geist_800ExtraBold.ttf',
            '../../node_modules/@expo-google-fonts/geist/700Bold/Geist_700Bold.ttf',
            '../../node_modules/@expo-google-fonts/geist/600SemiBold/Geist_600SemiBold.ttf',
            '../../node_modules/@expo-google-fonts/geist/500Medium/Geist_500Medium.ttf',
            '../../node_modules/@expo-google-fonts/geist/400Regular/Geist_400Regular.ttf',
            '../../node_modules/@expo-google-fonts/geist/300Light/Geist_300Light.ttf',
            '../../node_modules/@expo-google-fonts/geist/200ExtraLight/Geist_200ExtraLight.ttf',
            '../../node_modules/@expo-google-fonts/geist/100Thin/Geist_100Thin.ttf',
          ],
        },
      ],
      '@react-native-firebase/app',
      '@react-native-firebase/messaging',
      'expo-secure-store',
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: '143698d9-060c-400e-89d2-ca0cdb9fd2f3',
      },
    },
  };
};

function getConfig() {
  const IS_DEV = process.env.ENV === 'development';

  const NAME = IS_DEV ? 'Dev React Native Reusables' : 'React Native Reusables';
  const SLUG = IS_DEV ? 'devreactnativereusablesshowcase' : 'reactnativereusablesshowcase';

  return { NAME, SLUG };
}
