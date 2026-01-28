import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import * as Haptics from 'expo-haptics';
import { persistentStorage } from '@/lib/storage';

interface HapticsState {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  selection: () => Promise<void>;
  impact: (style?: Haptics.ImpactFeedbackStyle) => Promise<void>;
  notification: (type: Haptics.NotificationFeedbackType) => Promise<void>;
  success: () => Promise<void>;
  error: () => Promise<void>;
  warning: () => Promise<void>;
}

const HapticsContext = createContext<HapticsState | undefined>(undefined);

const HAPTICS_ENABLED_KEY = 'haptics_enabled';

export function HapticsProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabledState] = useState<boolean>(() => {
    // Load saved preference from storage
    try {
      const saved = persistentStorage.get(HAPTICS_ENABLED_KEY);
      return saved !== null ? Boolean(saved) : true; // Default to enabled
    } catch {
      return true; // Default to enabled if storage fails
    }
  });

  const setEnabled = useCallback((newEnabled: boolean) => {
    setEnabledState(newEnabled);
    try {
      persistentStorage.set(HAPTICS_ENABLED_KEY, newEnabled);
    } catch {
      // Silently fail if storage doesn't work
    }
  }, []);

  const selection = useCallback(async () => {
    if (!enabled) return;
    try {
      await Haptics.selectionAsync();
    } catch {
      // Silently fail if haptics not available
    }
  }, [enabled]);

  const impact = useCallback(async (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
    if (!enabled) return;
    try {
      await Haptics.impactAsync(style);
    } catch {
      // Silently fail if haptics not available
    }
  }, [enabled]);

  const notification = useCallback(async (type: Haptics.NotificationFeedbackType) => {
    if (!enabled) return;
    try {
      await Haptics.notificationAsync(type);
    } catch {
      // Silently fail if haptics not available
    }
  }, [enabled]);

  const success = useCallback(async () => {
    await notification(Haptics.NotificationFeedbackType.Success);
  }, [notification]);

  const error = useCallback(async () => {
    await notification(Haptics.NotificationFeedbackType.Error);
  }, [notification]);

  const warning = useCallback(async () => {
    await notification(Haptics.NotificationFeedbackType.Warning);
  }, [notification]);

  const value = useMemo(() => ({
    enabled,
    setEnabled,
    selection,
    impact,
    notification,
    success,
    error,
    warning,
  }), [enabled, setEnabled, selection, impact, notification, success, error, warning]);

  return (
    <HapticsContext.Provider value={value}>
      {children}
    </HapticsContext.Provider>
  );
}

export function useHaptics() {
  const context = useContext(HapticsContext);
  if (context === undefined) {
    throw new Error('useHaptics must be used within a HapticsProvider');
  }
  return context;
}

