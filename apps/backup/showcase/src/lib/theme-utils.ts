import { useColorScheme } from 'react-native';
import { useCallback } from 'react';

/**
 * Hook for consistent dark mode handling across the app
 */
export function useDarkMode() {
  const colorScheme = useColorScheme();
  
  const isDark = colorScheme === 'dark';
  const isLight = colorScheme === 'light';
  
  return {
    isDark,
    isLight,
    colorScheme,
  };
}

/**
 * Theme-aware color utilities
 */
export const themeColors = {
  // Background colors
  background: {
    light: '#ffffff',
    dark: '#000000',
  },
  surface: {
    light: '#f8f9fa',
    dark: '#1a1a1a',
  },
  card: {
    light: '#ffffff',
    dark: '#1f1f1f',
  },
  
  // Text colors
  text: {
    primary: {
      light: '#000000',
      dark: '#ffffff',
    },
    secondary: {
      light: '#666666',
      dark: '#999999',
    },
    tertiary: {
      light: '#999999',
      dark: '#666666',
    },
  },
  
  // Border colors
  border: {
    light: '#e5e5e5',
    dark: '#333333',
  },
  
  // Status colors
  success: {
    light: '#10b981',
    dark: '#34d399',
  },
  warning: {
    light: '#f59e0b',
    dark: '#fbbf24',
  },
  error: {
    light: '#ef4444',
    dark: '#f87171',
  },
  
  // Overlay colors
  overlay: {
    light: 'rgba(0, 0, 0, 0.5)',
    dark: 'rgba(0, 0, 0, 0.7)',
  },
};

/**
 * Get theme-aware color
 */
export function getThemeColor(colorPath: string, isDark: boolean): string {
  const keys = colorPath.split('.');
  let color: any = themeColors;
  
  for (const key of keys) {
    color = color?.[key];
  }
  
  return color || (isDark ? '#000000' : '#ffffff');
}

/**
 * Theme-aware class names for Tailwind
 */
export const themeClasses = {
  background: (isDark: boolean) => isDark ? 'bg-black' : 'bg-white',
  surface: (isDark: boolean) => isDark ? 'bg-gray-900' : 'bg-gray-50',
  card: (isDark: boolean) => isDark ? 'bg-gray-800' : 'bg-white',
  
  text: {
    primary: (isDark: boolean) => isDark ? 'text-white' : 'text-black',
    secondary: (isDark: boolean) => isDark ? 'text-gray-300' : 'text-gray-600',
    tertiary: (isDark: boolean) => isDark ? 'text-gray-400' : 'text-gray-500',
  },
  
  border: (isDark: boolean) => isDark ? 'border-gray-700' : 'border-gray-200',
  
  // Status colors with dark variants
  success: (isDark: boolean) => isDark ? 'text-green-400' : 'text-green-600',
  warning: (isDark: boolean) => isDark ? 'text-yellow-400' : 'text-yellow-600',
  error: (isDark: boolean) => isDark ? 'text-red-400' : 'text-red-600',
};

/**
 * Hook for theme-aware styling
 */
export function useTheme() {
  const { isDark } = useDarkMode();
  
  const getThemeClass = useCallback((colorPath: string) => {
    const keys = colorPath.split('.');
    let themeClass: any = themeClasses;
    
    for (const key of keys) {
      themeClass = themeClass?.[key];
    }
    
    return typeof themeClass === 'function' ? themeClass(isDark) : '';
  }, [isDark]);
  
  const getThemeColor = useCallback((colorPath: string) => {
    const keys = colorPath.split('.');
    let color: any = themeColors;
    
    for (const key of keys) {
      color = color?.[key];
    }
    
    return color || (isDark ? '#000000' : '#ffffff');
  }, [isDark]);
  
  return {
    isDark,
    getThemeClass,
    getThemeColor,
    themeClasses: {
      background: themeClasses.background(isDark),
      surface: themeClasses.surface(isDark),
      card: themeClasses.card(isDark),
      text: {
        primary: themeClasses.text.primary(isDark),
        secondary: themeClasses.text.secondary(isDark),
        tertiary: themeClasses.text.tertiary(isDark),
      },
      border: themeClasses.border(isDark),
      success: themeClasses.success(isDark),
      warning: themeClasses.warning(isDark),
      error: themeClasses.error(isDark),
    },
  };
}

/**
 * Dark mode optimization utilities
 */
export const darkModeUtils = {
  /**
   * Check if a color is light or dark
   */
  isLightColor: (color: string): boolean => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 128;
  },
  
  /**
   * Generate adaptive text color based on background
   */
  getAdaptiveTextColor: (backgroundColor: string): string => {
    return darkModeUtils.isLightColor(backgroundColor) ? '#000000' : '#ffffff';
  },
  
  /**
   * Create theme-aware shadow
   */
  getThemeShadow: (isDark: boolean) => {
    return isDark
      ? 'shadow-lg shadow-black/20'
      : 'shadow-lg shadow-gray-900/10';
  },
  
  /**
   * Create theme-aware gradient
   */
  getThemeGradient: (isDark: boolean) => {
    return isDark
      ? ['from-gray-900', 'to-black']
      : ['from-white', 'to-gray-50'];
  },
};
