import { Platform } from 'react-native';

/**
 * Initializes Firebase background message handler if available.
 * 
 * This is a platform-aware initialization:
 * - On Native (Android/iOS): Attempts to require and setup background messaging.
 * - On Web/Expo Go: Gracefully ignores if the module is missing.
 */
export function initFirebaseBackgroundMessaging() {
    if (Platform.OS === 'web') {
        return;
    }

    try {
        // Safely import the Firebase messaging module
        const firebaseMessagingModule = (() => {
            try {
                return require('@/hooks/useFirebaseMessaging');
            } catch {
                return null;
            }
        })();

        if (firebaseMessagingModule?.setupBackgroundMessageHandler) {
            firebaseMessagingModule.setupBackgroundMessageHandler();
        }
    } catch (error) {
        // Expected behavior in Expo Go or if @react-native-firebase/messaging is not available
        if (__DEV__) {
            console.log('[FIREBASE-INIT] Firebase messaging not available:', error instanceof Error ? error.message : String(error));
        }
    }
}
