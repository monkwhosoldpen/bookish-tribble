import { } from 'react-native';

export interface NotificationMessage {
    notification?: {
        title?: string;
        body?: string;
    };
    data?: Record<string, string | undefined>;
}

export interface NotificationEngine {
    requestPermission: () => Promise<boolean>;
    getToken: () => Promise<string | null>;
    disable: () => Promise<void>;
    registerServiceWorker: () => Promise<void>;
    setupBackgroundMessageHandler: () => void;
    setupForegroundListener: (callback: (message: NotificationMessage) => void) => (() => void) | undefined;
}

// Platform-specific implementations will be in .web.ts and .native.ts files
export const useNotificationEngine = (): NotificationEngine => {
    throw new Error('useNotificationEngine must be implemented for this platform');
};
