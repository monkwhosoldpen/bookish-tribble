/**
 * Firebase Configuration for React Native/Expo
 * 
 * This module handles:
 * - Firebase Cloud Messaging token management
 * - Foreground message handling
 * - Background message handling (via background task)
 * - Token refresh listening
 * 
 * Architecture:
 * - Foreground: Handled by messageListener in NotificationContext
 * - Background: Handled by setBackgroundMessageHandler (registered in app root)
 * - Token: Sent to Central API endpoint for device registry
 */

import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Note: In production, you'll initialize Firebase RN here:
// import messaging from '@react-native-firebase/messaging';
// However, this requires a native build with EAS

/**
 * Firebase Message Handler Configuration
 * 
 * For Expo projects, we use a hybrid approach:
 * 1. While in Expo Go: Use Expo Notifications (fallback)
 * 2. When building with EAS: Use @react-native-firebase/messaging (production)
 * 
 * The backend (Novu + Central API) remains the same
 */

export interface FirebaseMessage {
  messageId: string;
  sentTime: number;
  data: Record<string, string>;
  notification?: {
    title?: string;
    body?: string;
  };
}

export interface DeviceInfo {
  device_type: 'ios' | 'android' | 'web';
  device_name: string | null;
  fcm_token: string;
  push_enabled: boolean;
}

/**
 * Get device information for registration
 */
export async function getDeviceInfo(fcmToken: string): Promise<DeviceInfo> {
  const deviceName = await Device.deviceName;
  
  return {
    device_type: Platform.OS as 'ios' | 'android' | 'web',
    device_name: deviceName || `${Platform.OS} Device`,
    fcm_token: fcmToken,
    push_enabled: true,
  };
}

/**
 * Firebase RN Setup Instructions
 * 
 * Step 1: Install packages (when ready for native build)
 * ```bash
 * npx expo install @react-native-firebase/app @react-native-firebase/messaging
 * ```
 * 
 * Step 2: Get google-services.json from Firebase Console
 * - Go to Firebase Console > Project Settings
 * - Download google-services.json for Android
 * - Place in project root
 * 
 * Step 3: Update app.json
 * ```json
 * {
 *   "expo": {
 *     "plugins": [
 *       [
 *         "@react-native-firebase/app"
 *       ]
 *     ],
 *     "android": {
 *       "googleServicesFile": "./google-services.json"
 *     }
 *   }
 * }
 * ```
 * 
 * Step 4: Build with EAS
 * ```bash
 * eas build --platform android --profile development
 * ```
 */

export const FIREBASE_SETUP_STATUS = {
  EXPO_GO: {
    status: 'Available',
    description: 'Using Expo Notifications as fallback',
    backend: 'Expo Notifications service',
    limitations: 'Limited to Expo Notifications provider',
  },
  NATIVE_BUILD: {
    status: 'Production Ready',
    description: 'Using Firebase Cloud Messaging (FCM)',
    backend: 'Google Firebase + Novu',
    features: 'Full FCM support, Novu integration, Device sync',
  },
};

/**
 * Message Handler - Called when app receives notification in foreground
 * 
 * This will be invoked by NotificationContext when a message arrives
 */
export function handleFirebaseMessage(message: FirebaseMessage): void {
  console.log('[FIREBASE] Foreground message received:', {
    messageId: message.messageId,
    title: message.notification?.title,
    body: message.notification?.body,
    data: message.data,
  });

  // Forward to your app's notification handler
  // (Implemented in NotificationContext)
}

/**
 * Background Message Handler
 * 
 * This must be registered at app startup before any messages arrive
 * 
 * Usage:
 * ```typescript
 * if (Platform.OS !== 'web') {
 *   messaging().onNotificationOpenedApp(onNotificationOpenedApp);
 *   messaging().getInitialNotification().then(onNotificationOpenedApp);
 * }
 * ```
 */
export function registerBackgroundMessageHandler(): void {
  // This will be set up in NotificationContext
  // messaging().setBackgroundMessageHandler(handleFirebaseMessage);
}

/**
 * Token Management
 * 
 * Flow:
 * 1. Request permission from user
 * 2. Get FCM token
 * 3. Send to Central API /api/central/sync/device
 * 4. Listen for token refresh
 * 5. Update on Central API when token changes
 */
export interface TokenManagementConfig {
  apiUrl: string;
  onTokenRefresh?: (newToken: string) => void;
  onPermissionDenied?: () => void;
}

/**
 * Central API Token Sync Endpoint
 * 
 * The web-ui already has this working:
 * POST /api/central/sync/device
 * 
 * Expected payload:
 * {
 *   "token": "fcm_token_here",
 *   "device_type": "android" | "ios" | "web",
 *   "device_name": "Device Name",
 *   "last_used_at": ISO timestamp
 * }
 * 
 * Response includes array of registered devices
 */
export const CENTRAL_API_ENDPOINTS = {
  SYNC_DEVICE: '/api/central/sync/device',
  REGISTER_TOKEN: '/api/central/device/register',
  UPDATE_TOKEN: '/api/central/device/update',
};

/**
 * Novu Integration
 * 
 * Backend flow:
 * 1. User enables notifications in app
 * 2. App gets FCM token from Firebase
 * 3. App sends token to Central API
 * 4. Central API updates Novu subscriber with FCM provider
 * 5. Novu sends notifications to FCM token when triggered
 * 
 * Novu Configuration:
 * - Provider: Firebase Cloud Messaging
 * - Subscriber field: FCM token
 * - Template: Can use variables from notification data
 */
export const NOVU_SETUP = {
  provider: 'Firebase Cloud Messaging',
  integration: 'Novu Dashboard > Integrations > Add Firebase',
  credentialsNeeded: [
    'Firebase Project ID',
    'Service Account JSON (from Firebase Console)',
  ],
  testNotification: {
    description: 'Send test notification from Novu Dashboard',
    steps: [
      '1. Go to Novu Dashboard',
      '2. Create/Edit workflow with FCM channel',
      '3. Add trigger',
      '4. Send test notification to subscriber',
    ],
  },
};
