import { Platform } from 'react-native';

// Only import MMKV on native platforms to prevent web crashes
const storage = Platform.OS !== 'web'
    ? new (require('react-native-mmkv').MMKV)({ id: 'showcase-app-storage' })
    : {
        set: (key: string, value: string) => typeof localStorage !== 'undefined' ? localStorage.setItem(key, value) : null,
        getString: (key: string) => typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null,
        delete: (key: string) => typeof localStorage !== 'undefined' ? localStorage.removeItem(key) : null,
    };

/**
 * Helper to store and retrieve JSON objects/arrays
 */
export const persistentStorage = {
    set: (key: string, value: any) => {
        storage.set(key, JSON.stringify(value));
    },
    get: <T>(key: string): T | null => {
        const value = storage.getString(key);
        try {
            return value ? JSON.parse(value) : null;
        } catch (e) {
            return null;
        }
    },
    clear: (key: string) => {
        storage.delete(key);
    }
};
