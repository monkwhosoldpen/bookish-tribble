export const PREFERENCE_KEYS = {
    GLOBAL: 'global_notifications',
    FOLLOWED: 'push_followed_enabled',
    SYSTEM: 'push_system_enabled',
    MENTIONS: 'push_mentions_enabled',
} as const;

export type PreferenceKey = typeof PREFERENCE_KEYS[keyof typeof PREFERENCE_KEYS];
