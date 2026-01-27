import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Use env variables where possible, fallback for showcase demo only
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://ivmqzthpqocpfplcjgfd.supabase.co';
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY || 'sb_publishable_yPWUR0b2UWBbxD6XsRryZg_aoyQLteE';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  }

// Custom storage for React Native using expo-secure-store on native, localStorage on web
const storage = {
  getItem: async (key: string) => {
    try {
      if (Platform.OS === 'web') {
        return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      }
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      // Fail silently or log to analytics service
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, value);
        }
        return;
      }
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      // Fail silently
    }
  },
  removeItem: async (key: string) => {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(key);
        }
        return;
      }
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      // Fail silently
    }
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: storage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
