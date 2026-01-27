export type ChannelType = 'main' | 'social' | 'child' | 'ai_agent' | 'public' | 'broadcast';

export interface TranslationMap {
    [locale: string]: {
        [key: string]: string;
    };
}

export interface Entity {
    id?: string;
    username: string;
    displayname?: string;
    description?: string;
    avatarurl?: string;
    bannerurl?: string;
    cover_url?: string;
    display_url?: string;
    client_type?: 'public' | 'standard' | 'advanced' | 'managed';
    translations?: TranslationMap;
}

export interface SourceConfig {
    id: string;
    name: string;
    type: ChannelType;
    displayName?: string;
    latestMessage?: string;
    unread_count?: number;
}

export interface SidebarChannel {
    id: string;
    name: string;
    type: ChannelType;
    icon?: string;
    avatarurl?: string;
    unread_count?: number;
}
