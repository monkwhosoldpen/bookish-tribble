/**
 * Design Tokens - The Single Source of Truth for Showcase UX/UI
 * 
 * Use these tokens instead of hardcoded values to ensure 
 * consistent spatial rhythm and architectural depth.
 */

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    layout: 20, // Standard screen padding
    section: 32, // Padding between major sections
};

export const RADIUS = {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
    xl: 32,
    full: 9999,
    card: 28,
    input: 14,
};

export const SHADOWS = {
    soft: "shadow-sm shadow-black/5",
    medium: "shadow-md shadow-black/10",
    hard: "shadow-lg shadow-black/20",
};

export const OPACITY = {
    soft: 0.05,
    medium: 0.1,
    hard: 0.2,
};

export const TRANSITIONS = {
    default: { duration: 200 },
    spring: { damping: 20, stiffness: 100 },
    stagger: 20,
};

export const COLOR_TOKENS = {
    primary: '#1D9BF0',
    destructive: '#F4212E',
    success: '#00BA7C',
    light: {
        background: '#FFFFFF',
        foreground: '#0F1419',
        secondary: '#EFF3F4',
        muted: '#536471',
        border: '#EFF3F4',
    },
    dark: {
        background: '#000000',
        foreground: '#FFFFFF',
        secondary: '#16181C',
        muted: '#71767B',
        border: '#2F3336',
    },
};
